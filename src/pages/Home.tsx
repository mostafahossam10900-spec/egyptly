import { DestinationArt, HeroArt } from '../components/Art'
import { ButtonLink, ErrorState, LoadingState } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import { useReference } from '../lib/useReference'

export function HomePage() {
  const { t, pick, formatNumber } = useI18n()
  const { session } = useAuth()
  const { state, retry } = useReference()

  const steps = [
    { n: 1, title: t('home.step1'), body: t('home.step1Body'), tag: t('home.available'), live: true },
    { n: 2, title: t('home.step2'), body: t('home.step2Body'), tag: t('home.phase2'), live: false },
    { n: 3, title: t('home.step3'), body: t('home.step3Body'), tag: t('home.phase3'), live: false },
  ]

  return (
    <div className="flex flex-col gap-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t('app.tagline')}</p>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl">{t('home.title')}</h1>
          <p className="max-w-xl text-lg text-muted">{t('home.lead')}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={session ? '/trips/new' : '/signup'} className="px-7 py-3 text-base">
              {t('home.cta')}
            </ButtonLink>
            {session && (
              <ButtonLink to="/dashboard" variant="outline">
                {t('home.ctaDashboard')}
              </ButtonLink>
            )}
          </div>
          <ol className="mt-4 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col gap-1">
                <span className="font-display text-3xl text-gold-deep">{s.n}</span>
                <span className="font-semibold">{s.title}</span>
                <span className="text-sm text-muted">{s.body}</span>
                <span className={`mt-1 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.live ? 'bg-ok-soft text-ok' : 'bg-gold-soft'}`}>
                  {s.tag}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-[2rem] shadow-xl">
          <HeroArt label={t('home.heroAlt')} />
        </div>
      </section>

      <section aria-labelledby="dest-title" className="flex flex-col gap-4">
        <h2 id="dest-title" className="text-4xl">
          {t('home.destinationsTitle')}
        </h2>
        <p className="max-w-2xl text-muted">{t('home.destinationsLead')}</p>
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'error' && <ErrorState onRetry={retry} />}
        {state.status === 'ready' && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {state.data.governorates.map((g) => {
              const dests = state.data.destinations.filter((d) => d.governorate_slug === g.slug)
              const count = dests.reduce((n, d) => n + (state.data.landmarksByDestination.get(d.slug)?.length ?? 0), 0)
              return (
                <li key={g.slug} className="overflow-hidden rounded-2xl border border-line bg-card">
                  <DestinationArt governorate={g.slug} className="h-24 w-full" />
                  <div className="p-3">
                    <p className="font-display text-xl font-semibold">{pick(g)}</p>
                    <p className="text-xs text-muted">{dests.map((d) => pick(d)).join(' · ')}</p>
                    <p className="mt-1 text-xs text-muted">{t('wiz.dest.landmarkCount', { count: formatNumber(count) })}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
