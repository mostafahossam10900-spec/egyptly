import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { execSync } from 'node:child_process'

export interface LocalEnv {
  url: string
  anonKey: string
  serviceKey: string
  mailpitUrl: string
}

let cached: LocalEnv | null = null

/** Reads keys of the LOCAL Supabase stack (`supabase status`). Never point these tests at production. */
export function localEnv(): LocalEnv {
  if (cached) return cached
  const out = execSync('npx supabase status -o env', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  const vars = Object.fromEntries(
    out.split(/\r?\n/).map((l) => /^([A-Z_]+)="?(.*?)"?$/.exec(l)).filter(Boolean).map((m) => [m![1], m![2]]),
  )
  const url = vars.API_URL
  if (!url || !/^http:\/\/(127\.0\.0\.1|localhost)/.test(url)) throw new Error(`Refusing to run against non-local API_URL ${url}`)
  cached = {
    url,
    anonKey: vars.ANON_KEY ?? vars.PUBLISHABLE_KEY,
    serviceKey: vars.SERVICE_ROLE_KEY ?? vars.SECRET_KEY,
    mailpitUrl: vars.MAILPIT_URL ?? vars.INBUCKET_URL ?? 'http://127.0.0.1:54324',
  }
  return cached
}

export function anonClient(): SupabaseClient {
  const e = localEnv()
  return createClient(e.url, e.anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function adminClient(): SupabaseClient {
  const e = localEnv()
  return createClient(e.url, e.serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** Creates a confirmed test tourist and returns a client signed in as them. */
export async function signedInTourist(label: string): Promise<{ client: SupabaseClient; userId: string; email: string }> {
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.test`
  const password = 'TestPass123'
  const { data, error } = await adminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: label, last_name: 'Test', role: 'admin' },
  })
  if (error) throw error
  const client = anonClient()
  const { error: signInErr } = await client.auth.signInWithPassword({ email, password })
  if (signInErr) throw signInErr
  return { client, userId: data.user.id, email }
}
