
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    if (process.env.TELEGRAM_FILE_STORAGE !== "true") {
        return NextResponse.json({ error: "Feature disabled" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get("file_id")

    if (!fileId) {
        return NextResponse.json({ error: "Missing file_id" }, { status: 400 })
    }

    const token = process.env.TELEGRAM_BOT_TOKEN

    if (!token) {
        return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    try {
        // 1. Get File Path from Telegram
        // https://core.telegram.org/bots/api#getfile
        const response = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`)
        const data = await response.json()

        if (!data.ok) {
            return NextResponse.json({
                error: "Telegram API Error",
                telegram_response: data
            }, { status: 400 })
        }

        const filePath = data.result.file_path

        // 2. Construct Download URL
        // Warning: This URL contains the bot token. It should be treated as sensitive.
        // It is generally safer to proxy the download through your own backend (like /api/telegram/file),
        // but this endpoint provides the direct Telegram URL as requested.
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`

        return NextResponse.json({
            ok: true,
            file_id: fileId,
            file_path: filePath,
            download_url: downloadUrl,
            telegram_result: data.result
        })

    } catch (error: any) {
        console.error("[GetFilePath] Error:", error)
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 })
    }
}
