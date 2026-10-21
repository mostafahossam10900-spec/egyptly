import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from './supabase'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  role: 'tourist' | 'guide' | 'admin'
  preferred_locale: string
}

interface AuthValue {
  /** null while the initial session is being restored. */
  ready: boolean
  session: Session | null
  profile: Profile | null
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!supabase)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setProfile(null)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, preferred_locale')
      .eq('id', userId)
      .maybeSingle()
    setProfile((data as Profile | null) ?? null)
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await loadProfile(data.session?.user.id)
      if (active) setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      // Defer DB calls out of the auth callback (recommended by supabase-js to avoid deadlocks).
      setTimeout(() => void loadProfile(s?.user.id), 0)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const value = useMemo<AuthValue>(
    () => ({
      ready,
      session,
      profile,
      refreshProfile: () => loadProfile(session?.user.id),
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
        setSession(null)
        setProfile(null)
      },
    }),
    [ready, session, profile, loadProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const v = useContext(AuthContext)
  if (!v) throw new Error('useAuth must be used inside AuthProvider')
  return v
}

/** Maps Supabase auth errors to i18n keys. */
// eslint-disable-next-line react-refresh/only-export-components
export function authErrorKey(err: { code?: string; status?: number; message?: string } | null | undefined) {
  if (!err) return 'auth.genericError' as const
  const code = err.code ?? ''
  if (code === 'invalid_credentials') return 'auth.invalidCredentials' as const
  if (code === 'email_not_confirmed') return 'auth.notConfirmed' as const
  if (code === 'weak_password') return 'auth.weakPassword' as const
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || err.status === 429) {
    return 'auth.rateLimited' as const
  }
  if (code === 'email_address_invalid') return 'field.emailInvalid' as const
  if (/sending|smtp|mail/i.test(err.message ?? '')) return 'auth.sendFailed' as const
  return 'auth.genericError' as const
}
