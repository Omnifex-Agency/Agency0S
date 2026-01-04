"use server"

import { telegramSendMessage } from "@/lib/telegram/telegram"

export async function notify(message: string) {
    try {
        await telegramSendMessage(message)
        return { success: true }
    } catch (error) {
        // Log failure server-side (safe, no token in generic error usually, but relying on utility logic)
        console.error("Notification failed:", error)
        // Return error state to client if they care, but usually ignored in fire-and-forget
        return { success: false, error: "Failed to deliver notification." }
    }
}
