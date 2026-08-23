import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { gameModeTypeDTO, gameModeTypeResponse } from "@/interface/responseDB";
export async function GET(request: NextRequest) {
    const gameModeId = request.nextUrl.searchParams.get("gameModeId");
    const locale = request.nextUrl.searchParams.get("locale") || "en";

    if (!gameModeId) {
        return NextResponse.json(
            { error: "gameModeId is required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('game_mode_type')
        .select(`
            game_mode_type_id,
            parameter!inner (
              value,
              data_type,
              label_${locale}
            )
        `)
        .eq('game_mode_id', gameModeId);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    const mappedGameTypes: gameModeTypeDTO[] =
        (data as unknown as gameModeTypeResponse[]).map((item) => {
            return {
                game_mode_type_id: item.game_mode_type_id,
                label: item.parameter.label_en ?? item.parameter.label_es,
                value: item.parameter.value,
                data_type: item.parameter.data_type
            };
        });
    return NextResponse.json(mappedGameTypes);
}
