import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@/lib/server"
import { gameModeDTO, gameModeResponse } from "@/interface/responseDB";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const locale = request.nextUrl.searchParams.get("locale") || "en";
    const { data, error } = await supabase
        .from("game_mode")
        .select(`
            game_mode_id,
            title_${locale},
            value,
            image:image_id (
                path
            )
        `);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    /**
     * For some reason, TypeScript is treating image:image_id(path) 
     * as an array, which is incorrect, so `unknown` is used to avoid the typing error.
     */
    const mappedGameModes: gameModeDTO[] =
        (data as unknown as gameModeResponse[]).map((item) => {
            const { data: imageData } = supabase.storage
                .from("gamesMode")
                .getPublicUrl(item.image.path);
            return {
                game_mode_id: item.game_mode_id,
                title: item.title_en ?? item.title_es,
                value: item.value,
                image: imageData.publicUrl,
            };
        });


    return NextResponse.json(mappedGameModes);
}

