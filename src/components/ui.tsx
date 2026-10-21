import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { useI18n } from '../lib/i18n'

type Variant = 'gold' | 'navy' | 'outline' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  gold: 'btn-gold shadow-sm',
  navy: 'bg-navy text-sand hover:bg-ink',
  outline: 'border border-line bg-card text-ink hover:border-gold',
  ghost: 'text-ink hover:bg-accent',
  danger: 'border border-danger/30 bg-card text-danger hover:bg-danger-soft',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 min-h-11'

export function Button({
  variant = 'gold', className = '', busy, children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={busy || rest.disabled} aria-busy={busy || undefined} {...rest}>
      {busy && <Spinner small />}
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'gold', className = '', ...rest }: LinkProps & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...rest} />
}

export function Spinner({ small }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${small ? 'size-4' : 'size-6'}`}
    />
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[0_8px_30px_-18px_rgba(31,42,68,0.35)] sm:p-7 ${className}`}>{children}</div>
}

export function Alert({
  tone = 'info', title, children, role,
}: { tone?: 'info' | 'error' | 'success' | 'warning'; title?: ReactNode; children?: ReactNode; role?: 'alert' | 'status' }) {
  const tones = {
    info: 'border-navy/15 bg-info-soft',
    error: 'border-danger/30 bg-danger-soft text-danger',
    success: 'border-ok/30 bg-ok-soft text-ok',
    warning: 'border-gold/50 bg-accent',
  }
  return (
    <div role={role ?? (tone === 'error' ? 'alert' : 'status')} className={`rounded-2xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
    </div>
  )
}

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n()
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-16 text-muted">
      <Spinner />
      <span>{label ?? t('state.loading')}</span>
    </div>
  )
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  const { t } = useI18n()
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-14 text-center">
      <p className="font-display text-2xl">{message ?? t('state.error')}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {t('state.retry')}
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-14 text-center">
      <svg aria-hidden="true" viewBox="0 0 64 40" className="w-24 text-gold">
        <path d="M4 36 L24 8 L44 36 Z" fill="currentColor" opacity=".5" />
        <path d="M30 36 L44 16 L60 36 Z" fill="currentColor" />
      </svg>
      <h2 className="text-3xl">{title}</h2>
      <p className="text-muted">{body}</p>
      {action}
    </div>
  )
}

/** Uppercase, letter-spaced label + control + hint + error, wired with aria attributes. */
export function Field({
  label, hint, error, optional, children,
}: {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode
}) {
  const { t } = useI18n()
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow">
        {label}
        {optional && <span className="ms-1 normal-case tracking-normal">({t('field.optional')})</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const inputBase =
  'w-full rounded-xl border bg-card px-4 py-2.5 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 min-h-11'

export function Input({ invalid, className = '', ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={`${inputBase} ${invalid ? 'border-danger' : 'border-line'} ${className}`} {...rest} />
}

export function Select({ invalid, className = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return <select aria-invalid={invalid || undefined} className={`${inputBase} ${invalid ? 'border-danger' : 'border-line'} ${className}`} {...rest} />
}

/** Pill toggle used for multi/single selection (role checkbox/radio semantics via native inputs). */
export function Chip({
  checked, onChange, label, type = 'checkbox', name, description, testId,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  type?: 'checkbox' | 'radio'
  name?: string
  description?: string
  testId?: string
}) {
  return (
    <label
      data-testid={testId}
      className={`relative inline-flex min-h-11 cursor-pointer select-none flex-col justify-center rounded-full border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-gold/60 ${
        checked ? 'border-gold-deep/40 bg-gold-soft font-semibold text-ink' : 'border-line bg-card text-ink hover:border-gold'
      } ${description ? 'rounded-2xl' : ''}`}
    >
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(type === 'radio' ? true : e.target.checked)}
      />
      <span className="flex items-center gap-1.5">
        {checked && (
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {label}
      </span>
      {description && <span className="text-xs font-normal text-muted">{description}</span>}
    </label>
  )
}

export function Fieldset({ legend, error, children, hint }: { legend: string; error?: string; hint?: string; children: ReactNode }) {
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="eyebrow mb-2">{legend}</legend>
      {hint && <p className="-mt-1 mb-1 text-xs text-muted">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function PageTitle({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-2">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
      {lead && <p className="max-w-2xl text-muted">{lead}</p>}
    </header>
  )
}
