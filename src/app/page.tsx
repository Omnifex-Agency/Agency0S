import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  try {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/login')
    }

    // Check role to decide where to send them
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (member && (member.role === 'admin' || member.role === 'owner')) {
      redirect('/app')
    } else {
      redirect('/client')
    }
  } catch (e) {
    // If Supabase is misconfigured (e.g. invalid URL), redirect to login
    // This allows the app to at least render the login page (which might handle errors client-side)
    console.error("Supabase connection failed:", e)
    redirect('/login')
  }
}
