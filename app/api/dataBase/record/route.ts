import { createClient } from "@/lib/server"; // Ajusta la ruta a tu cliente servidor
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    const gameModeTypeId = request.nextUrl.searchParams.get("gameModeType");
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
        value_en,
        parameter:parameter_id (
          value
        )
      )
    `)
        .eq("user_id", user.id)
        .eq("game_mode_type_id", gameModeTypeId);

    if (error) {
        console.error("Error fetching user records:", error.message);
        throw error;
    }
    console.log(data)
    return data;
}



export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Obtener usuario autenticado
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

    // Obtener datos enviados por el frontend
    const body = await request.json();

    const {
        rounds,
        gameModeTypeId,
        properties,
    } = body;

    // Validaciones
    if (
        typeof rounds !== "number" ||
        typeof gameModeTypeId !== "number"
    ) {
        return NextResponse.json(
            { error: "rounds y gameModeTypeId son requeridos" },
            { status: 400 }
        );
    }

    if (!properties || typeof properties !== "object") {
        return NextResponse.json(
            { error: "properties es requerido" },
            { status: 400 }
        );
    }

    // Crear record + record_properties
    const { data, error } = await supabase.rpc("create_record", {
        p_user_id: user.id,
        p_rounds: rounds,
        p_game_mode_type_id: gameModeTypeId,
        p_properties: properties,
    });

    if (error) {
        console.error("Error creating record:", error);

        return NextResponse.json(
            { error: error.message },
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

