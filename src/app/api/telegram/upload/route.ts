import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { Database } from "@/types/database"

export async function POST(req: Request) {
    // Check feature flag or if tokens are present
    if (process.env.TELEGRAM_FILE_STORAGE === "false") {
        return NextResponse.json({ error: "Feature explicitly disabled" }, { status: 403 })
    }
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        return NextResponse.json({ error: "Telegram Bot Token missing" }, { status: 500 })
    }

    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // Allow TEST-MODE bypass of auth? No, user implied connection to "connected".
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const contentType = req.headers.get("content-type") || ""
        let fileBlob: Blob | null = null
        let fileName = ""
        let mimeType = ""
        let fileSize = 0
        let workspaceId = ""
        let entityType = ""
        let entityId = ""

        // Strategy 1: Multipart Form Data
        if (contentType.includes("multipart/form-data")) {
            let formData;
            try {
                formData = await req.formData()
            } catch (e: any) {
                console.error("[TelegramUpload] FormData Parse Error:", e)
                return NextResponse.json({
                    error: "Invalid Request Body",
                    details: "Failed to parse multipart form data. " + e.message
                }, { status: 400 })
            }

            const fileEntry = formData.get("file")
            workspaceId = formData.get("workspaceId") as string
            entityType = formData.get("entityType") as string
            entityId = formData.get("entityId") as string

            if (!fileEntry || typeof fileEntry === "string") {
                return NextResponse.json({ error: "Invalid file" }, { status: 400 })
            }
            const file = fileEntry as File
            fileBlob = file
            fileName = file.name
            mimeType = file.type
            fileSize = file.size
        }
        // Strategy 2: Raw Body (Fallback for large files/video)
        else {
            workspaceId = req.headers.get("x-workspace-id") || ""
            entityType = req.headers.get("x-entity-type") || ""
            entityId = req.headers.get("x-entity-id") || ""
            const encodedName = req.headers.get("x-file-name") || "unknown"
            fileName = decodeURIComponent(encodedName)
            mimeType = contentType

            try {
                const buffer = await req.arrayBuffer()
                fileBlob = new Blob([buffer], { type: mimeType })
                fileSize = buffer.byteLength
            } catch (e: any) {
                return NextResponse.json({ error: "Failed to read raw body", details: e.message }, { status: 400 })
            }
        }

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 })
        }
        if (!fileBlob) {
            return NextResponse.json({ error: "No file content" }, { status: 400 })
        }

        const token = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        if (!token || !chatId) {
            return NextResponse.json({ error: "Env vars missing" }, { status: 500 })
        }

        // Validate File Size (Tg Bot API limit is 50MB)
        if (fileSize > 50 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (>50MB)" }, { status: 413 })
        }

        const isImage = mimeType.startsWith("image/")
        const method = isImage ? "sendPhoto" : "sendDocument"
        const paramName = isImage ? "photo" : "document"

        const tgFormData = new FormData()
        tgFormData.append("chat_id", chatId)
        tgFormData.append(paramName, fileBlob, fileName) // Append blob with filename
        tgFormData.append("disable_notification", "true")

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: "POST",
            body: tgFormData,
        })

        if (!tgRes.ok) {
            const errText = await tgRes.text()
            console.error("[TelegramUpload] Telegram API Error:", errText)
            return NextResponse.json({ error: `Telegram Error: ${errText}` }, { status: 502 })
        }

        const tgData = await tgRes.json()
        const result = tgData.result

        let fileId = ""
        if (isImage && result.photo) {
            const photos = result.photo
            fileId = photos[photos.length - 1].file_id
        } else if (result.document) {
            fileId = result.document.file_id
        } else if (result.video) {
            fileId = result.video.file_id
        } else if (result.audio) {
            fileId = result.audio.file_id
        } else {
            // Try to find any file_id (sticker, voice, video_note)
            // Generic fallback
            fileId = "UNKNOWN_TYPE"
            if (result.video_note) fileId = result.video_note.file_id
            if (result.voice) fileId = result.voice.file_id
            if (result.sticker) fileId = result.sticker.file_id
        }

        const messageId = result.message_id

        if (workspaceId === "TEST-MODE") {
            return NextResponse.json({
                id: "temp-" + Date.now(),
                workspace_id: "TEST-MODE",
                file_name: fileName,
                mime_type: mimeType,
                size_bytes: fileSize,
                storage_provider: "telegram",
                telegram_file_id: fileId,
                telegram_message_id: messageId,
                created_at: new Date().toISOString()
            })
        }

        const insertPayload: Database['public']['Tables']['attachments']['Insert'] = {
            workspace_id: workspaceId,
            uploaded_by: user.id,
            file_name: fileName,
            file_extension: fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : undefined,
            mime_type: mimeType,
            size_bytes: fileSize,
            storage_provider: "telegram",
            telegram_file_id: fileId,
            telegram_message_id: messageId,
            target_id: entityType === "target" ? entityId : undefined,
            client_id: entityType === "client" ? entityId : undefined,
            task_id: entityType === "task" ? entityId : undefined,
            project_id: entityType === "project" ? entityId : undefined,
            research_doc_id: entityType === "research" ? entityId : undefined,
        }

        const { data: attachment, error: dbError } = await supabase
            .from("attachments")
            .insert(insertPayload)
            .select()
            .single()

        if (dbError) {
            console.error("DB Error:", dbError)
            return NextResponse.json({ error: "DB Insert Failed", details: dbError }, { status: 500 })
        }

        return NextResponse.json(attachment)

    } catch (error: any) {
        console.error("[TelegramUpload] Exception:", error)
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
