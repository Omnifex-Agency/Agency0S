"use server"

import { cookies } from "next/headers"

const WORKSPACE_COOKIE_NAME = "agency_os_workspace_id"

export async function setWorkspaceCookie(workspaceId: string) {
    const cookieStore = await cookies()
    cookieStore.set(WORKSPACE_COOKIE_NAME, workspaceId, {
        path: "/",
        httpOnly: false, // Allow client-side read for fast hydration
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })
}

export async function getWorkspaceCookie() {
    const cookieStore = await cookies()
    return cookieStore.get(WORKSPACE_COOKIE_NAME)?.value
}

export async function deleteWorkspaceCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(WORKSPACE_COOKIE_NAME)
}
