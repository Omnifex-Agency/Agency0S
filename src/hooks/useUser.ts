"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface UserProfile {
    user: User | null
    email: string | null
    fullName: string | null
    avatarUrl: string | null
    role: 'admin' | 'client' | null
    loading: boolean
}

export function useUser() {
    const [profile, setProfile] = useState<UserProfile>({
        user: null,
        email: null,
        fullName: null,
        avatarUrl: null,
        role: null,
        loading: true,
    })

    useEffect(() => {
        const supabase = createClient()

        const fetchUserProfile = async (user: User | null) => {
            if (!user) {
                setProfile({
                    user: null,
                    email: null,
                    fullName: null,
                    avatarUrl: null,
                    role: null,
                    loading: false,
                })
                return
            }

            // Fetch role from workspace_members
            const { data: member } = await supabase
                .from('workspace_members')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle()

            const role = (member && (member.role === 'admin' || member.role === 'owner')) ? 'admin' : 'client'

            setProfile({
                user,
                email: user.email || null,
                fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
                avatarUrl: user.user_metadata?.avatar_url || null,
                role: role,
                loading: false,
            })
        }

        // Get initial user
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            await fetchUserProfile(user)
        }

        init()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const user = session?.user || null
            await fetchUserProfile(user)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return profile
}
