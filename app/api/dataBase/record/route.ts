import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@/lib/server"
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("game_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)

}