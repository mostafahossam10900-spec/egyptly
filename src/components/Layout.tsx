import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../lib/auth'
import { LOCALES, useI18n } from '../lib/i18n'
import { backendConfigured } from '../lib/supabase'

function Wordmark() {
  return (
    <Link to="/" className="font-display text-2xl font-semibold text-ink" aria-label="Egyptly">
      Egypt<span className="text-gold-deep">ly</span>
    </Link>
  )
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('nav.language')}>
      {LOCALES.filter((l) => l.complete).map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          onClick={() => setLocale(l.code as 'en' | 'ar')}
          aria-pressed={locale === l.code}
          className={`min-h-9 rounded-full px-3 text-sm transition ${
            locale === l.code ? 'bg-navy text-sand' : 'text-ink hover:bg-accent'
          }`}
        >
          {l.label}
        </button>
      ))}
      <details className="relative">
        <summary className="min-h-9 cursor-pointer list-none rounded-full px-2 py-1.5 text-sm text-muted hover:bg-accent" aria-label={t('nav.languageComing')}>
          +6
        </summary>
        <div className="absolute end-0 z-30 mt-2 w-56 rounded-2xl border border-line bg-card p-3 text-sm shadow-lg">
          <p className="eyebrow mb-2">{t('nav.languageComing')}</p>
          <ul className="flex flex-col gap-1">
            {LOCALES.filter((l) => !l.complete).map((l) => (
              <li key={l.code} lang={l.code} className="flex items-center justify-between text-muted">
                <span>{l.label}</span>
                <span aria-hidden="true" className="text-xs">—</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}

export function Layout() {
  const { t } = useI18n()
  const { session, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setOpen(false), [location.pathname])

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center gap-2 rounded-full px-4 text-sm transition ${isActive ? 'bg-accent font-semibold' : 'hover:bg-accent'}`

  const links = (
    <>
      {session && (
        <>
          <NavLink to="/dashboard" className={navItem}>
            {t('nav.myTrips')}
          </NavLink>
          <NavLink to="/trips/new" className={navItem}>
            {t('nav.newTrip')}
          </NavLink>
        </>
      )}
      <NavLink to="/guides" className={navItem}>
        {t('nav.guides')}
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.65rem] font-semibold">{t('nav.soon')}</span>
      </NavLink>
      <NavLink to="/ai" className={navItem}>
        {t('nav.ai')}
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.65rem] font-semibold">{t('nav.soon')}</span>
      </NavLink>
    </>
  )

  const authButtons = session ? (
    <button
      type="button"
      onClick={async () => {
        await signOut()
        navigate('/login', { state: { flash: 'auth.loggedOut' } })
      }}
      className="min-h-11 rounded-full border border-line px-4 text-sm hover:border-gold"
    >
      {t('nav.logout')}
      {profile && <span className="sr-only"> ({profile.first_name})</span>}
    </button>
  ) : (
    <>
      <Link to="/login" className="flex min-h-11 items-center rounded-full px-4 text-sm hover:bg-accent">
        {t('nav.login')}
      </Link>
      <Link to="/signup" className="btn-gold flex min-h-11 items-center rounded-full px-5 text-sm font-semibold">
        {t('nav.signup')}
      </Link>
    </>
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sand">
        {t('app.skipToContent')}
      </a>
      {!backendConfigured && (
        <div role="status" className="bg-navy px-4 py-2 text-center text-sm text-sand" data-testid="demo-banner">
          {t('demo.banner')}
        </div>
      )}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-sand/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Wordmark />
          <nav aria-label={t('nav.mainLabel')} className="hidden items-center gap-1 lg:flex">
            {links}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {authButtons}
          </div>
          <button
            type="button"
            className="flex min-h-11 items-center rounded-full border border-line px-4 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t('nav.closeMenu') : t('nav.menu')}
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="border-t border-line bg-sand px-4 pb-4 lg:hidden">
            <nav aria-label={t('nav.mainLabel')} className="flex flex-col gap-1 pt-3">
              {links}
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <LanguageSwitcher />
              {authButtons}
            </div>
          </div>
        )}
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted sm:px-6">
          <p>{t('app.prototypeNotice')}</p>
          <p>{t('footer.sources')}</p>
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  )
}
