import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
)
