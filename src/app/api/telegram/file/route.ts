import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    if (process.env.TELEGRAM_FILE_STORAGE !== "true") {
        return NextResponse.json({ error: "Feature disabled" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const attachmentId = searchParams.get("id")
    const directTgId = searchParams.get("tg_id")

    if (!attachmentId && !directTgId) {
        return NextResponse.json({ error: "Missing file ID" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let tgFileId = ""
    let fileName = "download.bin"
    let mimeType = "application/octet-stream"

    if (attachmentId) {
        const { data: attachment, error } = await supabase
            .from("attachments")
            .select("*")
            .eq("id", attachmentId)
            .single()

        if (error || !attachment) {
            return NextResponse.json({ error: "Attachment not found or access denied" }, { status: 404 })
        }

        if (attachment.storage_provider !== "telegram") {
            return NextResponse.json({ error: "Not a Telegram file" }, { status: 400 })
        }
        tgFileId = attachment.telegram_file_id || ""
        fileName = attachment.file_name
        mimeType = attachment.mime_type || mimeType
    } else if (directTgId) {
        // Direct Test Mode access
        tgFileId = directTgId
        fileName = searchParams.get("filename") || "test-file"
        mimeType = searchParams.get("mime_type") || "application/octet-stream"
    }

    const token = process.env.TELEGRAM_BOT_TOKEN

    // 2. Get File Path from Telegram
    try {
        const pathRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${tgFileId}`)
        if (!pathRes.ok) throw new Error("Telegram API Error")

        const pathData = await pathRes.json()
        if (!pathData.ok) throw new Error("Telegram result not OK")

        const filePath = pathData.result.file_path

        // Default to detected extension if filename is generic "test-file" or "download.bin"
        if ((!fileName || fileName === "test-file" || fileName === "download.bin") && filePath.includes('.')) {
            const ext = filePath.split('.').pop()
            if (ext) {
                // Determine base name
                const base = fileName === "download.bin" ? "download" : "file"
                fileName = `${base}.${ext}`

                // Refine mime type based on extension if still generic
                if (mimeType === "application/octet-stream") {
                    if (ext === "pdf") mimeType = "application/pdf"
                    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg"
                    if (ext === "png") mimeType = "image/png"
                    if (ext === "webp") mimeType = "image/webp"
                }
            }
        }

        // 3. Proxy download
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`
        const fileRes = await fetch(downloadUrl)

        if (!fileRes.ok) throw new Error("Failed to fetch file stream")

        return new NextResponse(fileRes.body, {
            status: 200,
            headers: {
                "Content-Type": mimeType,
                "Content-Disposition": `attachment; filename="${fileName}"`,
            }
        })

    } catch (e) {
        console.error("Download Error:", e)
        return NextResponse.json({ error: "Download failed" }, { status: 502 })
    }
}
