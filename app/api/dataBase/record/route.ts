import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";
import { RecordTableRow, RecordTableColumn } from "@/interface/responseDB";
import { checkRateLimit, getClientIp, sanitizeObject } from "@/lib/security";

const RATE_LIMIT_WINDOW_MS = 60_000;

export async function GET(request: NextRequest) {
    const clientIp = getClientIp(request.headers);
    if (!checkRateLimit("record:read", 60, RATE_LIMIT_WINDOW_MS, clientIp)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const gameModeTypeId = request.nextUrl.searchParams.get("gameModeType");
    const locale = request.nextUrl.searchParams.get("locale");

    if (!gameModeTypeId || Number.isNaN(Number(gameModeTypeId))) {
        return NextResponse.json(
            { error: "gameModeType es requerido" },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: "Usuario no autenticado" },
            { status: 401 }
        );
    }
    const { data, error } = await supabase
        .from("record")
        .select(`
        record_id,
        rounds,
        created_at,
        record_properties (
            value_es,
            value_en,
            parameter:parameter_id (
                value,
                label_es,
                label_en
            )
        )
    `)
        .eq("user_id", user.id)
        .eq("game_mode_type_id", gameModeTypeId);

    if (error) {
        console.error("Error fetching user records");
        return NextResponse.json(
            { error: "No se pudieron obtener los registros" },
            { status: 500 }
        );
    }

    const records: RecordTableRow[] = (data ?? []).map((record) => {

        const properties: Record<string, string> = {};

        record.record_properties.forEach((property) => {
            const parameter = Array.isArray(property.parameter)
                ? property.parameter[0]
                : property.parameter;

            if (!parameter) return;

            const value =
                locale === "es"
                    ? property.value_es
                    : property.value_en;

            properties[parameter.value] = value;
        });

        return {
            record_id: record.record_id,
            rounds: record.rounds,
            created_at: record.created_at,
            properties,
        };
    });
    const columns: RecordTableColumn[] = [];

    (data ?? []).forEach((record) => {
        record.record_properties.forEach((property) => {
            const parameter = Array.isArray(property.parameter)
                ? property.parameter[0]
                : property.parameter;

            if (!parameter) return;

            const key = parameter.value;

            const label =
                locale === "es"
                    ? parameter.label_es
                    : parameter.label_en;

            if (!columns.some(column => column.key === key)) {
                columns.push({
                    key,
                    label,
                });
            }
        });
    });

    return NextResponse.json({
        columns,
        records,
    });


}



export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request.headers);
    if (!checkRateLimit("record:create", 20, RATE_LIMIT_WINDOW_MS, clientIp)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: "Usuario no autenticado" },
            { status: 401 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "JSON inválido" },
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json(
            { error: "Payload inválido" },
            { status: 400 }
        );
    }

    const { rounds, gameModeTypeId, properties } = body as Record<string, unknown>;

    if (!Number.isInteger(rounds) || Number(rounds) < 1 || Number(rounds) > 15) {
        return NextResponse.json(
            { error: "rounds debe ser un entero entre 1 y 15" },
            { status: 400 }
        );
    }

    if (!Number.isInteger(gameModeTypeId) || Number(gameModeTypeId) <= 0) {
        return NextResponse.json(
            { error: "gameModeTypeId debe ser un entero positivo" },
            { status: 400 }
        );
    }

    if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
        return NextResponse.json(
            { error: "properties es requerido" },
            { status: 400 }
        );
    }

    const sanitizedProperties: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(properties as Record<string, unknown>)) {
        const sanitized = sanitizeObject(value);

        if (sanitized !== undefined) {
            sanitizedProperties[key] = sanitized;
        }
    }

    if (Object.keys(sanitizedProperties).length === 0) {
        return NextResponse.json(
            { error: "properties no contiene valores válidos" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase.rpc("create_record", {
        p_user_id: user.id,
        p_rounds: Number(rounds),
        p_game_mode_type_id: Number(gameModeTypeId),
        p_properties: sanitizedProperties,
    });

    if (error) {
        console.error("Error creating record");

        return NextResponse.json(
            { error: "No se pudo crear el registro" },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            recordId: data,
        },
        { status: 201 }
    );
}

