import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Alert, Button, Card, Chip, Field, Input, LoadingState } from '../components/ui'
import { authErrorKey, useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import type { MessageKey } from '../lib/i18n/en'
import { backendConfigured, requireSupabase, siteUrl } from '../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordOk = (p: string) => p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p)

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-6 text-4xl">{title}</h1>
      <Card>{children}</Card>
    </div>
  )
}

function DemoAuthNotice() {
  const { t } = useI18n()
  return <Alert tone="warning">{t('demo.authDisabled')}</Alert>
}

export function Flash() {
  const { t } = useI18n()
  const location = useLocation()
  const key = (location.state as { flash?: MessageKey } | null)?.flash
  if (!key) return null
  return (
    <div className="mb-4">
      <Alert tone="success">{t(key)}</Alert>
    </div>
  )
}

export function SignUpPage() {
  const { t, locale } = useI18n()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<'tourist' | 'guide'>('tourist')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, MessageKey>>>({})
  const [formError, setFormError] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/dashboard" replace />

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    const fn = form.firstName.trim()
    const ln = form.lastName.trim()
    if (!fn) errs.firstName = 'field.required'
    else if (fn.length > 80) errs.firstName = 'field.nameInvalid'
    if (!ln) errs.lastName = 'field.required'
    else if (ln.length > 80) errs.lastName = 'field.nameInvalid'
    if (!form.email.trim()) errs.email = 'field.required'
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = 'field.emailInvalid'
    if (!form.password) errs.password = 'field.required'
    else if (!passwordOk(form.password)) errs.password = 'auth.weakPassword'
    setErrors(errs)
    setFormError(null)
    if (Object.keys(errs).length) return
    setBusy(true)
    const email = form.email.trim().toLowerCase()
    const { data, error } = await requireSupabase().auth.signUp({
      email,
      password: form.password,
      options: {
        data: { first_name: fn, last_name: ln, locale },
        emailRedirectTo: `${siteUrl()}/auth/confirm`,
      },
    })
    setBusy(false)
    if (error) {
      const key = authErrorKey(error)
      if (key === 'auth.weakPassword') setErrors({ password: key })
      else setFormError(key)
      return
    }
    // With email confirmation on, an already-registered email returns a user with no identities
    // (Supabase hides account existence). Tell the user without confirming it either way.
    const maybeExisting = (data.user?.identities?.length ?? 0) === 0
    navigate('/check-email', { state: { email, maybeExisting } })
  }

  return (
    <AuthShell title={t('auth.signupTitle')}>
      <fieldset className="mb-6">
        <legend className="eyebrow mb-3">{t('auth.roleQuestion')}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Chip type="radio" name="role" checked={role === 'tourist'} onChange={() => setRole('tourist')} label={t('auth.roleTourist')} description={t('auth.roleTouristBody')} testId="role-tourist" />
          <Chip type="radio" name="role" checked={role === 'guide'} onChange={() => setRole('guide')} label={t('auth.roleGuide')} description={t('auth.roleGuideBody')} testId="role-guide" />
        </div>
      </fieldset>

      {role === 'guide' ? (
        <Alert tone="info" title={t('auth.guideComingTitle')}>
          {t('auth.guideComingBody')}
        </Alert>
      ) : !backendConfigured ? (
        <DemoAuthNotice />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-4">
          {formError && <Alert tone="error">{t(formError)}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('auth.firstName')} error={errors.firstName && t(errors.firstName)}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="given-name" value={form.firstName} onChange={set('firstName')} required />
              )}
            </Field>
            <Field label={t('auth.lastName')} error={errors.lastName && t(errors.lastName)}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="family-name" value={form.lastName} onChange={set('lastName')} required />
              )}
            </Field>
          </div>
          <Field label={t('auth.email')} error={errors.email && t(errors.email)}>
            {({ id, describedBy, invalid }) => (
              <Input id={id} type="email" dir="ltr" aria-describedby={describedBy} invalid={invalid} autoComplete="email" value={form.email} onChange={set('email')} required />
            )}
          </Field>
          <Field label={t('auth.password')} hint={t('auth.passwordHint')} error={errors.password && t(errors.password)}>
            {({ id, describedBy, invalid }) => (
              <Input id={id} type="password" dir="ltr" aria-describedby={describedBy} invalid={invalid} autoComplete="new-password" value={form.password} onChange={set('password')} required />
            )}
          </Field>
          <Button type="submit" busy={busy}>
            {t('auth.signupSubmit')}
          </Button>
          <p className="text-center text-sm text-muted">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-ink underline">
              {t('nav.login')}
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

function ResendForm({ initialEmail = '' }: { initialEmail?: string }) {
  const { t } = useI18n()
  const [email, setEmail] = useState(initialEmail)
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle')
  const [error, setError] = useState<MessageKey | null>(null)

  async function resend(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError('field.emailInvalid')
      return
    }
    setError(null)
    setState('busy')
    const { error: err } = await requireSupabase().auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${siteUrl()}/auth/confirm` },
    })
    if (err) {
      setError(authErrorKey(err))
      setState('idle')
      return
    }
    setState('sent')
  }

  return (
    <form noValidate onSubmit={resend} className="flex flex-col gap-3">
      <Field label={t('auth.email')} error={error ? t(error) : undefined}>
        {({ id, describedBy, invalid }) => (
          <Input id={id} type="email" dir="ltr" aria-describedby={describedBy} invalid={invalid} value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </Field>
      {state === 'sent' && <Alert tone="success">{t('auth.resent')}</Alert>}
      <Button type="submit" variant="outline" busy={state === 'busy'}>
        {t('auth.resend')}
      </Button>
    </form>
  )
}

export function CheckEmailPage() {
  const { t } = useI18n()
  const location = useLocation()
  const st = (location.state as { email?: string; maybeExisting?: boolean } | null) ?? {}
  return (
    <AuthShell title={t('auth.checkEmailTitle')}>
      <div className="flex flex-col gap-4">
        <p>{t('auth.checkEmailBody', { email: st.email ?? '' })}</p>
        {st.maybeExisting && <Alert tone="info">{t('auth.checkEmailMaybeExisting')}</Alert>}
        <ResendForm initialEmail={st.email} />
        <Link to="/login" className="text-center text-sm font-semibold underline">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </AuthShell>
  )
}

export function LoginPage() {
  const { t } = useI18n()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={safeNext} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim()) || !password) {
      setError(!EMAIL_RE.test(email.trim()) ? 'field.emailInvalid' : 'field.required')
      return
    }
    setBusy(true)
    setError(null)
    const { error: err } = await requireSupabase().auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setBusy(false)
    if (err) {
      setError(authErrorKey(err))
      return
    }
    navigate(safeNext, { replace: true })
  }

  return (
    <AuthShell title={t('auth.loginTitle')}>
      <Flash />
      {params.get('required') && (
        <div className="mb-4">
          <Alert tone="info">{t('auth.loginRequired')}</Alert>
        </div>
      )}
      {!backendConfigured ? (
        <DemoAuthNotice />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-4">
          {error && <Alert tone="error">{t(error)}</Alert>}
          {error === 'auth.notConfirmed' && <ResendForm initialEmail={email} />}
          <Field label={t('auth.email')}>
            {({ id, describedBy }) => (
              <Input id={id} type="email" dir="ltr" aria-describedby={describedBy} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            )}
          </Field>
          <Field label={t('auth.password')}>
            {({ id, describedBy }) => (
              <Input id={id} type="password" dir="ltr" aria-describedby={describedBy} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            )}
          </Field>
          <Button type="submit" busy={busy}>
            {t('auth.loginSubmit')}
          </Button>
          <div className="flex flex-col items-center gap-2 text-sm text-muted">
            <Link to="/forgot-password" className="font-semibold text-ink underline">
              {t('auth.forgot')}
            </Link>
            <p>
              {t('auth.noAccount')}{' '}
              <Link to="/signup" className="font-semibold text-ink underline">
                {t('nav.signup')}
              </Link>
            </p>
          </div>
        </form>
      )}
    </AuthShell>
  )
}

/** Landing page for email links. Nothing is verified until the user presses the button. */
export function ConfirmPage() {
  const { t, setLocale } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const tokenHash = params.get('token_hash')
  const type = params.get('type') === 'recovery' ? 'recovery' : 'email'
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'invalid'>(tokenHash ? 'idle' : 'invalid')

  useEffect(() => {
    if (params.get('lang') === 'ar') setLocale('ar')
  }, [params, setLocale])

  async function confirm() {
    if (!tokenHash) return
    setState('busy')
    const { error } = await requireSupabase().auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) {
      setState('invalid')
      return
    }
    if (type === 'recovery') navigate('/reset-password', { replace: true })
    else setState('done')
  }

  if (!backendConfigured) return <AuthShell title={t('auth.confirmTitle')}><DemoAuthNotice /></AuthShell>

  if (state === 'done') {
    return (
      <AuthShell title={t('auth.confirmedTitle')}>
        <div className="flex flex-col gap-4">
          <Alert tone="success">{t('auth.confirmedBody')}</Alert>
          <Button onClick={() => navigate('/dashboard', { replace: true })}>{t('home.ctaDashboard')}</Button>
        </div>
      </AuthShell>
    )
  }

  if (state === 'invalid') {
    return (
      <AuthShell title={t('auth.linkInvalidTitle')}>
        {type === 'recovery' ? (
          <div className="flex flex-col gap-4">
            <p>{t('auth.resetLinkInvalidBody')}</p>
            <Link to="/forgot-password" className="font-semibold underline">
              {t('auth.forgotSubmit')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>{t('auth.linkInvalidBody')}</p>
            <ResendForm />
          </div>
        )}
      </AuthShell>
    )
  }

  return (
    <AuthShell title={type === 'recovery' ? t('auth.resetTitle') : t('auth.confirmTitle')}>
      <div className="flex flex-col gap-4">
        <p>{type === 'recovery' ? t('auth.forgotBody') : t('auth.confirmBody')}</p>
        <Button onClick={confirm} busy={state === 'busy'}>
          {type === 'recovery' ? t('auth.resetSubmit') : t('auth.confirmButton')}
        </Button>
      </div>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle')
  const [error, setError] = useState<MessageKey | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError('field.emailInvalid')
      return
    }
    setError(null)
    setState('busy')
    const { error: err } = await requireSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${siteUrl()}/auth/confirm`,
    })
    if (err) {
      setError(authErrorKey(err))
      setState('idle')
      return
    }
    setState('sent')
  }

  return (
    <AuthShell title={t('auth.forgotTitle')}>
      {!backendConfigured ? (
        <DemoAuthNotice />
      ) : state === 'sent' ? (
        <div className="flex flex-col gap-4">
          <Alert tone="success">{t('auth.forgotSent', { email: email.trim() })}</Alert>
          <Link to="/login" className="font-semibold underline">
            {t('auth.backToLogin')}
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-4">
          <p className="text-muted">{t('auth.forgotBody')}</p>
          <Field label={t('auth.email')} error={error ? t(error) : undefined}>
            {({ id, describedBy, invalid }) => (
              <Input id={id} type="email" dir="ltr" aria-describedby={describedBy} invalid={invalid} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
          </Field>
          <Button type="submit" busy={state === 'busy'}>
            {t('auth.forgotSubmit')}
          </Button>
          <Link to="/login" className="text-center text-sm font-semibold underline">
            {t('auth.backToLogin')}
          </Link>
        </form>
      )}
    </AuthShell>
  )
}

export function ResetPasswordPage() {
  const { t } = useI18n()
  const { ready, session } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)

  if (!ready) return <LoadingState />
  if (!session) {
    return (
      <AuthShell title={t('auth.resetTitle')}>
        <div className="flex flex-col gap-4">
          <Alert tone="error">{t('auth.sessionMissing')}</Alert>
          <Link to="/forgot-password" className="font-semibold underline">
            {t('auth.forgotSubmit')}
          </Link>
        </div>
      </AuthShell>
    )
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!passwordOk(password)) return setError('auth.weakPassword')
    if (password !== confirm) return setError('auth.passwordMismatch')
    setBusy(true)
    const { error: err } = await requireSupabase().auth.updateUser({ password })
    setBusy(false)
    if (err) return setError(authErrorKey(err))
    navigate('/dashboard', { replace: true, state: { flash: 'auth.resetDone' } })
  }

  return (
    <AuthShell title={t('auth.resetTitle')}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        {error && <Alert tone="error">{t(error)}</Alert>}
        <Field label={t('auth.newPassword')} hint={t('auth.passwordHint')}>
          {({ id, describedBy }) => (
            <Input id={id} type="password" dir="ltr" aria-describedby={describedBy} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          )}
        </Field>
        <Field label={t('auth.confirmPassword')}>
          {({ id, describedBy }) => (
            <Input id={id} type="password" dir="ltr" aria-describedby={describedBy} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          )}
        </Field>
        <Button type="submit" busy={busy}>
          {t('auth.resetSubmit')}
        </Button>
      </form>
    </AuthShell>
  )
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, session } = useAuth()
  const location = useLocation()
  if (!ready) return <LoadingState />
  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?required=1&next=${next}`} replace />
  }
  return <>{children}</>
}
