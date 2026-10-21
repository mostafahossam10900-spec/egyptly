import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TripSummary } from '../components/TripSummary'
import { Alert, Button, ButtonLink, Card, EmptyState, ErrorState, LoadingState, PageTitle } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import type { TripDraft } from '../lib/trip/types'
import { deleteTrip, getTrip, listTrips } from '../lib/trips-api'
import { useReference } from '../lib/useReference'
import { Flash } from './auth'
import { NotFoundPage } from './misc'

export function DashboardPage() {
  const { t, pick, formatDate } = useI18n()
  const { profile } = useAuth()
  const { state: refState, retry: refRetry } = useReference()
  const [state, setState] = useState<{ status: 'loading' } | { status: 'error' } | { status: 'ready'; trips: TripDraft[] }>({ status: 'loading' })
  const [message, setMessage] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(() => {
    setState({ status: 'loading' })
    listTrips()
      .then((trips) => setState({ status: 'ready', trips }))
      .catch(() => setState({ status: 'error' }))
  }, [])

  useEffect(load, [load])

  async function remove(id: string) {
    if (!window.confirm(t('dash.deleteConfirm'))) return
    setDeleting(id)
    try {
      await deleteTrip(id)
      setMessage(t('dash.deleted'))
      setState((s) => (s.status === 'ready' ? { status: 'ready', trips: s.trips.filter((x) => x.id !== id) } : s))
    } catch {
      setMessage(t('state.saveFailed'))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <Flash />
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageTitle eyebrow={profile ? t('dash.hello', { name: profile.first_name }) : undefined} title={t('dash.title')} lead={t('dash.lead')} />
        <ButtonLink to="/trips/new" className="mb-6 shrink-0">
          {t('dash.new')}
        </ButtonLink>
      </div>
      {message && (
        <div className="mb-4">
          <Alert tone="info">{message}</Alert>
        </div>
      )}
      {(state.status === 'loading' || refState.status === 'loading') && <LoadingState />}
      {(state.status === 'error' || refState.status === 'error') && (
        <ErrorState
          onRetry={() => {
            load()
            refRetry()
          }}
        />
      )}
      {state.status === 'ready' && refState.status === 'ready' && (
        state.trips.length === 0 ? (
          <EmptyState title={t('dash.emptyTitle')} body={t('dash.emptyBody')} action={<ButtonLink to="/trips/new">{t('dash.new')}</ButtonLink>} />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2" data-testid="trip-list">
            {state.trips.map((trip) => {
              const names = trip.destinations.map((d) => {
                const dest = refState.data.destinationBySlug.get(d)
                return dest ? pick(dest) : d
              })
              const submitted = trip.status === 'submitted'
              return (
                <li key={trip.id}>
                  <Card className="flex h-full flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-2xl leading-tight">{names.length ? names.join(' · ') : t('dash.untitled')}</h2>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${submitted ? 'bg-ok-soft text-ok' : 'bg-gold-soft'}`}>
                        {submitted ? t('dash.statusSubmitted') : t('dash.statusDraft')}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      {trip.arrivalDate && trip.departureDate
                        ? t('wiz.review.dates', { arrival: formatDate(trip.arrivalDate), departure: formatDate(trip.departureDate) })
                        : !submitted && t('dash.step', { step: trip.currentStep })}
                      {trip.travelers && ` · ${t('dash.travelers', { count: trip.travelers })}`}
                    </p>
                    <p className="text-xs text-muted">{trip.updatedAt && t('dash.updated', { date: formatDate(trip.updatedAt) })}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <ButtonLink to={`/trips/${trip.id}/edit`} variant={submitted ? 'outline' : 'gold'}>
                        {submitted ? t('dash.edit') : t('dash.continue')}
                      </ButtonLink>
                      {submitted && (
                        <ButtonLink to={`/trips/${trip.id}`} variant="outline">
                          {t('dash.view')}
                        </ButtonLink>
                      )}
                      <Button variant="danger" onClick={() => remove(trip.id)} busy={deleting === trip.id}>
                        {t('dash.delete')}
                      </Button>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        )
      )}
    </div>
  )
}

export function TripSummaryPage() {
  const { t } = useI18n()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { state: refState, retry: refRetry } = useReference()
  const [state, setState] = useState<{ status: 'loading' } | { status: 'error' } | { status: 'missing' } | { status: 'ready'; trip: TripDraft }>({ status: 'loading' })

  const load = useCallback(() => {
    setState({ status: 'loading' })
    getTrip(id)
      .then((trip) => setState(trip ? { status: 'ready', trip } : { status: 'missing' }))
      .catch(() => setState({ status: 'error' }))
  }, [id])
  useEffect(load, [load])

  if (state.status === 'loading' || refState.status === 'loading') return <LoadingState />
  if (state.status === 'error' || refState.status === 'error') return <ErrorState onRetry={() => { load(); refRetry() }} />
  if (state.status === 'missing') return <NotFoundPage message={t('state.tripNotFound')} />

  return (
    <div className="mx-auto max-w-3xl">
      <Flash />
      <PageTitle eyebrow={t('dash.statusSubmitted')} title={t('wiz.review.title')} lead={t('wiz.review.lead')} />
      <Card>
        <TripSummary trip={state.trip} refData={refState.data} onEdit={(s) => navigate(`/trips/${id}/edit?step=${s}`)} />
      </Card>
      <div className="mt-4">
        <Alert tone="info">{t('wiz.review.next')}</Alert>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink to={`/trips/${id}/edit`}>{t('dash.edit')}</ButtonLink>
        <ButtonLink to="/dashboard" variant="outline">
          {t('coming.back')}
        </ButtonLink>
      </div>
    </div>
  )
}
