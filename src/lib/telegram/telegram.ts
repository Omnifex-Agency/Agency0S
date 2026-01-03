import "server-only"

const TELEGRAM_API_BASE = "https://api.telegram.org/bot"

export async function telegramSendMessage(
    text: string,
    opts?: { parseMode?: "HTML" | "MarkdownV2"; disablePreview?: boolean }
) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token) {
        console.error("TELEGRAM_BOT_TOKEN is not set in environment variables.")
        // We throw generic error to user to avoid leaking details, but log specifically on server
        throw new Error("Telegram configuration missing (Token).")
    }

    if (!chatId) {
        console.error("TELEGRAM_CHAT_ID is not set in environment variables.")
        throw new Error("Telegram configuration missing (Chat ID).")
    }

    const url = `${TELEGRAM_API_BASE}${token}/sendMessage`

    try {
        const body = {
            chat_id: chatId,
            text: text,
            parse_mode: opts?.parseMode || "HTML",
            disable_web_page_preview: opts?.disablePreview ?? false,
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("Telegram API Error:", errorData)
            throw new Error(`Failed to send Telegram message: ${response.statusText}`)
        }

        return await response.json()
    } catch (error: any) {
        // Log the full error on server
        console.error("Telegram Send Exception:", error)
        // Re-throw a safe error
        throw new Error("Failed to send notification.")
    }
}
