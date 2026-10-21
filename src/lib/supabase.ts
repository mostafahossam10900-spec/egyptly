import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
// Publishable/anon key only. Never put the service-role key in VITE_* variables (they ship to the browser).
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when a backend is configured. Otherwise the app runs in clearly labelled demo mode. */
export const backendConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = backendConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('backend_not_configured')
  return supabase
}

/** Public URL the email links should return to. */
export function siteUrl(): string {
  return (import.meta.env.VITE_SITE_URL as string | undefined) ?? window.location.origin
}
