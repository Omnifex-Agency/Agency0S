import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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
}
