import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { DestinationArt } from '../components/Art'
import { TripSummary } from '../components/TripSummary'
import { Alert, Button, Card, Chip, ErrorState, Field, Fieldset, Input, LoadingState, Select } from '../components/ui'
import { useI18n } from '../lib/i18n'
import type { MessageKey } from '../lib/i18n/en'
import { computeDuration, todayIso } from '../lib/trip/duration'
import { rankLandmarks, type RankedLandmark } from '../lib/trip/ranking'
import { reconcileLandmarks } from '../lib/trip/reconcile'
import {
  BUDGET_BASES, BUDGET_CATEGORIES, COMPANIONS, CURRENCIES, TRIP_TYPES, WIZARD_STEPS,
  type BudgetCategory, type TripDraft, type WizardStep,
} from '../lib/trip/types'
import { budgetSplit, validateAll, validateStep, type FieldErrors } from '../lib/trip/validation'
import { createTrip, getTrip, saveTrip } from '../lib/trips-api'
import { useReference, type ReferenceIndex } from '../lib/useReference'
import { NotFoundPage } from './misc'

/** Creates an empty draft row, then opens it in the editor. */
export function NewTripPage() {
  const navigate = useNavigate()
  const started = useRef(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (started.current) return
    started.current = true
    createTrip()
      .then((id) => navigate(`/trips/${id}/edit?step=1`, { replace: true }))
      .catch(() => setFailed(true))
  }, [navigate, attempt])

  if (failed) {
    return (
      <ErrorState
        onRetry={() => {
          started.current = false
          setFailed(false)
          setAttempt((a) => a + 1)
        }}
      />
    )
  }
  return <LoadingState />
}

interface RemovalNotice {
  destinations: string[]
  landmarks: string[]
}

const snapshot = (t: TripDraft) => JSON.stringify({ ...t, currentStep: 0, updatedAt: '', createdAt: '', submittedAt: '' })

export function WizardPage() {
  const { id = '' } = useParams()
  const { state: refState, retry: refRetry } = useReference()
  const [state, setState] = useState<{ status: 'loading' } | { status: 'error' } | { status: 'missing' } | { status: 'ready'; trip: TripDraft }>({ status: 'loading' })

  const load = useCallback(() => {
    setState({ status: 'loading' })
    getTrip(id)
      .then((trip) => setState(trip ? { status: 'ready', trip } : { status: 'missing' }))
      .catch(() => setState({ status: 'error' }))
  }, [id])
  useEffect(load, [load])

  const { t } = useI18n()
  if (state.status === 'loading' || refState.status === 'loading') return <LoadingState />
  if (state.status === 'error' || refState.status === 'error') return <ErrorState onRetry={() => { load(); refRetry() }} />
  if (state.status === 'missing') return <NotFoundPage message={t('state.tripNotFound')} />
  return <WizardEditor key={state.trip.id} initial={state.trip} refData={refState.data} />
}

function WizardEditor({ initial, refData }: { initial: TripDraft; refData: ReferenceIndex }) {
  const { t, pick, formatList } = useI18n()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState<TripDraft>(initial)
  const [saved, setSaved] = useState(() => snapshot(initial))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const [notice, setNotice] = useState<RemovalNotice | null>(null)
  const [backToDraft, setBackToDraft] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const requested = Number(params.get('step'))
  const maxReachable = (draft.status === 'submitted' ? 7 : draft.currentStep) as WizardStep
  const step = (WIZARD_STEPS.includes(requested as WizardStep) && requested <= maxReachable ? requested : maxReachable) as WizardStep
  const dirty = snapshot(draft) !== saved

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (patch: Partial<TripDraft>) => setDraft((d) => ({ ...d, ...patch }))

  async function persist(next: TripDraft, submitting = false): Promise<boolean> {
    let toSave = next
    if (!submitting && next.status === 'submitted' && snapshot(next) !== saved) {
      // Editing a saved request returns it to draft until the tourist saves it again on review.
      toSave = { ...next, status: 'draft' }
      setBackToDraft(true)
    }
    setSaveState('saving')
    try {
      const dropped = await saveTrip(toSave)
      if (dropped.length) {
        // Server reconciliation should match the client; surface it if it ever differs.
        setNotice((n) => ({ destinations: n?.destinations ?? [], landmarks: [...(n?.landmarks ?? []), ...dropped] }))
        toSave = { ...toSave, landmarks: toSave.landmarks.filter((l) => !dropped.includes(l)) }
      }
      setDraft(toSave)
      setSaved(snapshot(toSave))
      setSaveState('saved')
      return true
    } catch {
      setSaveState('failed')
      return false
    }
  }

  function goTo(s: WizardStep) {
    setErrors({})
    setParams({ step: String(s) })
  }

  async function next() {
    const e = validateStep(step, draft)
    setErrors(e)
    if (Object.keys(e).length) return
    const target = Math.min(7, step + 1) as WizardStep
    const furthest = Math.max(draft.currentStep, target) as WizardStep
    if (await persist({ ...draft, currentStep: furthest })) goTo(target)
  }

  async function saveAndExit() {
    const e = validateStep(step, draft)
    setErrors(e)
    if (Object.keys(e).length) return
    if (await persist(draft)) navigate('/dashboard')
  }

  async function submit() {
    const all = validateAll(draft)
    if (all.size) return
    if (await persist({ ...draft, status: 'submitted', currentStep: 7 }, true)) {
      navigate(`/trips/${draft.id}`, { state: { flash: 'wiz.review.submitted' } })
    }
  }

  function toggleDestination(slug: string, on: boolean) {
    if (on) {
      update({ destinations: [...draft.destinations, slug] })
      return
    }
    const destinations = draft.destinations.filter((d) => d !== slug)
    const r = reconcileLandmarks(draft.landmarks, destinations, refData.landmarkBySlug)
    update({ destinations, landmarks: r.landmarks })
    if (r.removed.length) {
      setNotice((n) => ({
        destinations: [...(n?.destinations ?? []), slug],
        landmarks: [...(n?.landmarks ?? []), ...r.removed],
      }))
    }
  }

  function undoRemoval() {
    if (!notice) return
    update({
      destinations: [...new Set([...draft.destinations, ...notice.destinations])],
      landmarks: [...new Set([...draft.landmarks, ...notice.landmarks])],
    })
    setNotice(null)
  }

  const err = (k: string) => (errors[k] ? t(`error.${errors[k]}` as MessageKey) : undefined)
  const stepTitle = t(`wiz.steps.${step}` as MessageKey)

  const noticeView = notice && notice.landmarks.length > 0 && (step === 1 || step === 3) && (
    <div role="status" aria-live="polite" className="mb-5 rounded-2xl border border-gold/50 bg-accent px-4 py-3 text-sm" data-testid="removal-notice">
      <p className="font-semibold">{t('wiz.dest.removedTitle')}</p>
      <p className="mt-1">
        {t('wiz.dest.removedBody', {
          destinations: formatList(notice.destinations.map((d) => { const x = refData.destinationBySlug.get(d); return x ? pick(x) : d })),
          landmarks: formatList(notice.landmarks.map((l) => { const x = refData.landmarkBySlug.get(l); return x ? pick(x) : l })),
        })}
      </p>
      <div className="mt-2 flex gap-2">
        {notice.destinations.length > 0 && (
          <Button variant="outline" onClick={undoRemoval} className="min-h-9 py-1">
            {t('wiz.dest.undo')}
          </Button>
        )}
        <Button variant="ghost" onClick={() => setNotice(null)} className="min-h-9 py-1">
          {t('wiz.dest.dismiss')}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">{t('wiz.title')}</p>
      <Stepper step={step} maxReachable={maxReachable} onGo={goTo} />

      <Card className="mt-6">
        <h1 ref={headingRef} tabIndex={-1} className="mb-1 text-3xl outline-none sm:text-4xl">
          {stepHeading(step, t)}
        </h1>
        <p className="mb-6 text-sm text-muted">
          {t('wiz.stepOf', { step, total: 7 })} · {stepTitle}
        </p>

        {backToDraft && (
          <div className="mb-5">
            <Alert tone="warning">{t('wiz.backToDraft')}</Alert>
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="mb-5">
            <Alert tone="error">{t('wiz.fixErrors')}</Alert>
          </div>
        )}
        {noticeView}

        {step === 1 && <StepDestinations draft={draft} refData={refData} onToggle={toggleDestination} error={err('destinations')} />}
        {step === 2 && <StepInterests draft={draft} refData={refData} update={update} error={err('interests')} />}
        {step === 3 && <StepLandmarks draft={draft} refData={refData} update={update} />}
        {step === 4 && <StepDates draft={draft} update={update} err={err} />}
        {step === 5 && <StepType draft={draft} update={update} err={err} />}
        {step === 6 && <StepBudget draft={draft} update={update} err={err} />}
        {step === 7 && <StepReview draft={draft} refData={refData} update={update} onEdit={goTo} />}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => goTo((step - 1) as WizardStep)}>
                {t('wiz.back')}
              </Button>
            )}
            <Button variant="ghost" onClick={saveAndExit} busy={saveState === 'saving'}>
              {t('wiz.saveExit')}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span aria-live="polite" className="text-xs text-muted" data-testid="save-state">
              {saveState === 'saving' && t('state.saving')}
              {saveState === 'saved' && !dirty && t('state.saved')}
              {saveState === 'failed' && <span className="text-danger">{t('state.saveFailed')}</span>}
            </span>
            {step < 7 ? (
              <Button onClick={next} busy={saveState === 'saving'} data-testid="wizard-next">
                {t('wiz.next')}
              </Button>
            ) : (
              <Button onClick={submit} busy={saveState === 'saving'} disabled={validateAll(draft).size > 0} data-testid="wizard-submit">
                {initial.status === 'submitted' ? t('wiz.review.resubmit') : t('wiz.review.submit')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function stepHeading(step: WizardStep, t: (k: MessageKey) => string) {
  const map: Record<WizardStep, MessageKey> = {
    1: 'wiz.dest.title', 2: 'wiz.int.title', 3: 'wiz.lm.title', 4: 'wiz.dates.title', 5: 'wiz.type.title', 6: 'wiz.budget.title', 7: 'wiz.review.title',
  }
  return t(map[step])
}

function Stepper({ step, maxReachable, onGo }: { step: WizardStep; maxReachable: WizardStep; onGo: (s: WizardStep) => void }) {
  const { t } = useI18n()
  return (
    <nav aria-label={t('wiz.progress')} className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(step / 7) * 100}%` }} />
      </div>
      <ol className="mt-3 hidden gap-1 md:flex">
        {WIZARD_STEPS.map((s) => {
          const reachable = s <= maxReachable
          return (
            <li key={s} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                aria-current={s === step ? 'step' : undefined}
                onClick={() => onGo(s)}
                className={`w-full rounded-full px-2 py-1.5 text-xs transition ${
                  s === step ? 'bg-navy font-semibold text-sand' : reachable ? 'hover:bg-accent' : 'text-muted/60'
                }`}
              >
                {s}. {t(`wiz.steps.${s}` as MessageKey)}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function StepDestinations({ draft, refData, onToggle, error }: { draft: TripDraft; refData: ReferenceIndex; onToggle: (slug: string, on: boolean) => void; error?: string }) {
  const { t, pick, formatNumber } = useI18n()
  return (
    <Fieldset legend={t('wiz.dest.lead')} error={error} hint={t('wiz.dest.order')}>
      <p className="text-sm font-semibold" aria-live="polite">{t('wiz.dest.selected', { count: formatNumber(draft.destinations.length) })}</p>
      <div className="flex flex-col gap-6">
        {refData.governorates.map((g) => (
          <section key={g.slug} aria-labelledby={`gov-${g.slug}`}>
            <h2 id={`gov-${g.slug}`} className="mb-2 text-2xl">{pick(g)}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {refData.destinations.filter((d) => d.governorate_slug === g.slug).map((d) => {
                const checked = draft.destinations.includes(d.slug)
                const count = refData.landmarksByDestination.get(d.slug)?.length ?? 0
                return (
                  <li key={d.slug}>
                    <label
                      data-testid={`dest-${d.slug}`}
                      className={`flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border transition focus-within:ring-2 focus-within:ring-gold/60 ${
                        checked ? 'border-gold-deep/50 bg-gold-soft' : 'border-line bg-card hover:border-gold'
                      }`}
                    >
                      <span className="relative block">
                        <DestinationArt governorate={g.slug} className="h-20 w-full" />
                        <span className="absolute bottom-1 end-2 rounded bg-black/35 px-1.5 text-[0.6rem] text-white">{t('wiz.dest.photoPending')}</span>
                      </span>
                      <span className="flex items-start gap-2 p-3">
                        <input type="checkbox" className="mt-1 size-4 accent-[oklch(58%_.1_75)]" checked={checked} onChange={(e) => onToggle(d.slug, e.target.checked)} />
                        <span className="flex flex-col">
                          <span className="font-semibold">{pick(d)}</span>
                          <span className="text-xs text-muted">{t('wiz.dest.landmarkCount', { count: formatNumber(count) })}</span>
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </Fieldset>
  )
}

function StepInterests({ draft, refData, update, error }: { draft: TripDraft; refData: ReferenceIndex; update: (p: Partial<TripDraft>) => void; error?: string }) {
  const { t, pick } = useI18n()
  return (
    <Fieldset legend={t('wiz.int.lead')} error={error}>
      <div className="flex flex-wrap gap-2">
        {refData.interests.map((i) => (
          <Chip
            key={i.slug}
            testId={`interest-${i.slug}`}
            label={pick(i)}
            checked={draft.interests.includes(i.slug)}
            onChange={(on) => update({ interests: on ? [...draft.interests, i.slug] : draft.interests.filter((x) => x !== i.slug) })}
          />
        ))}
      </div>
    </Fieldset>
  )
}

function StepLandmarks({ draft, refData, update }: { draft: TripDraft; refData: ReferenceIndex; update: (p: Partial<TripDraft>) => void }) {
  const { t, pick, formatNumber, formatList } = useI18n()
  const [query, setQuery] = useState('')
  const selected = new Set(draft.landmarks)
  const q = query.trim().toLowerCase()

  const toggle = (slug: string, on: boolean) =>
    update({ landmarks: on ? [...draft.landmarks, slug] : draft.landmarks.filter((x) => x !== slug) })

  const ranked = useMemo(
    () => draft.destinations.map((d) => ({ dest: d, items: rankLandmarks(refData.landmarksByDestination.get(d) ?? [], draft.interests) })),
    [draft.destinations, draft.interests, refData],
  )

  if (!draft.destinations.length) return <Alert tone="info">{t('wiz.lm.noDestinations')}</Alert>

  const matchesQuery = (n: RankedLandmark): boolean =>
    !q || n.landmark.name_ar.toLowerCase().includes(q) || n.landmark.name_en.toLowerCase().includes(q) || n.children.some(matchesQuery)

  const row = (n: RankedLandmark, child = false) => {
    const l = n.landmark
    const checked = selected.has(l.slug)
    return (
      <li key={l.slug} className={child ? 'ms-6 border-s-2 border-line ps-3' : ''}>
        <label data-testid={`lm-${l.slug}`} className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition ${checked ? 'bg-gold-soft' : 'hover:bg-accent'}`}>
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[oklch(58%_.1_75)]" checked={checked} onChange={(e) => toggle(l.slug, e.target.checked)} />
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold">{pick(l)}</span>
            <span className="text-xs text-muted">
              {t(`type.${l.type}` as MessageKey)} · {pick({ name_ar: l.section_ar, name_en: l.section_en })}
            </span>
            {n.matches.length > 0 ? (
              <span className="text-xs text-gold-deep">
                {t('wiz.lm.why', { interests: formatList(n.matches.map((m) => { const i = refData.interestBySlug.get(m); return i ? pick(i) : m })) })}
              </span>
            ) : (
              draft.interests.length > 0 && <span className="text-xs text-muted">{t('wiz.lm.noMatch')}</span>
            )}
            {l.flags.map((f) => (
              <span key={f} className="text-xs font-medium text-danger">⚠ {t(`wiz.lm.flag.${f}` as MessageKey)}</span>
            ))}
          </span>
        </label>
        {n.children.length > 0 && (
          <div className="mt-1">
            <p className="ms-6 text-xs text-muted">{t('wiz.lm.subsites')}</p>
            <ul className="flex flex-col gap-1">{n.children.filter(matchesQuery).map((c) => row(c, true))}</ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-muted">{t('wiz.lm.lead')}</p>
      <Alert tone="warning">{t('wiz.lm.unverified')}</Alert>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-80">
          <Field label={t('wiz.lm.search')}>
            {({ id }) => <Input id={id} type="search" value={query} onChange={(e) => setQuery(e.target.value)} />}
          </Field>
        </div>
        <p className="text-sm font-semibold" aria-live="polite">{t('wiz.lm.selectedCount', { count: formatNumber(draft.landmarks.length) })}</p>
      </div>
      {ranked.map(({ dest, items }) => {
        const d = refData.destinationBySlug.get(dest)
        const g = d && refData.governorateBySlug.get(d.governorate_slug)
        const visible = items.filter(matchesQuery)
        return (
          <section key={dest} aria-labelledby={`lmh-${dest}`} className="flex flex-col gap-2">
            <h2 id={`lmh-${dest}`} className="text-2xl">
              {d ? pick(d) : dest}
              {g && <span className="ms-2 text-base text-muted">{pick(g)}</span>}
            </h2>
            {g && (g.note_ar || g.sources.length > 0) && (
              <details className="rounded-xl bg-sand-deep px-3 py-2 text-xs">
                <summary className="cursor-pointer font-semibold">{t('wiz.lm.sources')}</summary>
                {g.note_ar && (
                  <p dir="rtl" lang="ar" className="mt-2">
                    <span className="font-semibold">{t('wiz.lm.governorateNote')}: </span>
                    {g.note_ar}
                  </p>
                )}
                <ul className="mt-2 flex flex-col gap-1">
                  {g.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer noopener" className="underline" dir="auto">
                        {s.label_ar}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {visible.length ? <ul className="flex flex-col gap-1">{visible.map((n) => row(n))}</ul> : <p className="text-sm text-muted">{t('wiz.lm.noResults')}</p>}
          </section>
        )
      })}
    </div>
  )
}

function StepDates({ draft, update, err }: { draft: TripDraft; update: (p: Partial<TripDraft>) => void; err: (k: string) => string | undefined }) {
  const { t } = useI18n()
  const dur = computeDuration(draft)
  const today = todayIso()
  const sameDay = Boolean(draft.arrivalDate) && draft.arrivalDate === draft.departureDate
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('wiz.dates.arrival')} error={err('arrivalDate')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="date" min={today} aria-describedby={describedBy} invalid={invalid} value={draft.arrivalDate} onChange={(e) => update({ arrivalDate: e.target.value })} data-testid="arrival-date" />
          )}
        </Field>
        <Field label={t('wiz.dates.departure')} error={err('departureDate')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="date" min={draft.arrivalDate || today} aria-describedby={describedBy} invalid={invalid} value={draft.departureDate} onChange={(e) => update({ departureDate: e.target.value })} data-testid="departure-date" />
          )}
        </Field>
        <Field label={t('wiz.dates.arrivalTime')} optional hint={t('wiz.dates.timeHint')} error={err('arrivalTime')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="time" aria-describedby={describedBy} invalid={invalid} value={draft.arrivalTime} onChange={(e) => update({ arrivalTime: e.target.value })} />
          )}
        </Field>
        <Field label={t('wiz.dates.departureTime')} optional hint={t('wiz.dates.timeHint')} error={err('departureTime')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="time" aria-describedby={describedBy} invalid={invalid} value={draft.departureTime} onChange={(e) => update({ departureTime: e.target.value })} />
          )}
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        {sameDay ? (
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" className="size-4" checked={draft.arrivalDayAvailable} onChange={(e) => update({ arrivalDayAvailable: e.target.checked, departureDayAvailable: e.target.checked })} />
            {t('wiz.dates.sameDayAvailable')}
          </label>
        ) : (
          <>
            <label className="flex min-h-11 items-center gap-3">
              <input type="checkbox" className="size-4" checked={draft.arrivalDayAvailable} onChange={(e) => update({ arrivalDayAvailable: e.target.checked })} data-testid="arrival-available" />
              {t('wiz.dates.arrivalAvailable')}
            </label>
            <label className="flex min-h-11 items-center gap-3">
              <input type="checkbox" className="size-4" checked={draft.departureDayAvailable} onChange={(e) => update({ departureDayAvailable: e.target.checked })} data-testid="departure-available" />
              {t('wiz.dates.departureAvailable')}
            </label>
          </>
        )}
      </div>
      <div className="max-w-xs">
        <Field label={t('wiz.dates.travelers')} error={err('travelers')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="number" inputMode="numeric" min={1} max={100} step={1} aria-describedby={describedBy} invalid={invalid} value={draft.travelers} onChange={(e) => update({ travelers: e.target.value })} data-testid="travelers" />
          )}
        </Field>
      </div>
      <section aria-live="polite" className="rounded-2xl bg-sand-deep p-4 text-sm" data-testid="duration">
        <h2 className="eyebrow mb-2">{t('wiz.dates.durationTitle')}</h2>
        {!dur ? (
          <p className="text-muted">{t('wiz.dates.durationPending')}</p>
        ) : dur.sameDay ? (
          <p>{t('wiz.dates.sameDay', { days: dur.visitDays })}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            <li>{t('wiz.dates.nights', { nights: dur.nights })}</li>
            <li>{t('wiz.dates.calendarDays', { days: dur.calendarDays })}</li>
            <li className="font-semibold">{t('wiz.dates.visitDays', { days: dur.visitDays, middle: dur.middleDays })}</li>
          </ul>
        )}
      </section>
    </div>
  )
}

function StepType({ draft, update, err }: { draft: TripDraft; update: (p: Partial<TripDraft>) => void; err: (k: string) => string | undefined }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-8">
      <Fieldset legend={t('wiz.type.tripType')} error={err('tripType')}>
        <div className="grid gap-2 sm:grid-cols-3">
          {TRIP_TYPES.map((tt) => (
            <Chip key={tt} type="radio" name="trip-type" testId={`type-${tt}`} checked={draft.tripType === tt} onChange={() => update({ tripType: tt })} label={t(`wiz.type.${tt}` as MessageKey)} description={t(`wiz.type.${tt}Body` as MessageKey)} />
          ))}
        </div>
      </Fieldset>
      <Fieldset legend={t('wiz.type.companions')} error={err('companions')}>
        <div className="flex flex-wrap gap-2">
          {COMPANIONS.map((c) => (
            <Chip key={c} type="radio" name="companions" testId={`comp-${c}`} checked={draft.companions === c} onChange={() => update({ companions: c })} label={t(`wiz.comp.${c}` as MessageKey)} />
          ))}
        </div>
      </Fieldset>
    </div>
  )
}

function StepBudget({ draft, update, err }: { draft: TripDraft; update: (p: Partial<TripDraft>) => void; err: (k: string) => string | undefined }) {
  const { t, formatMoney } = useI18n()
  const split = budgetSplit(draft)
  const toggleCat = (c: BudgetCategory, on: boolean) =>
    update({ budgetCategories: on ? [...draft.budgetCategories, c] : draft.budgetCategories.filter((x) => x !== c) })
  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted">{t('wiz.budget.lead')}</p>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <Field label={t('wiz.budget.amount')} error={err('budgetAmount')}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} inputMode="decimal" dir="ltr" aria-describedby={describedBy} invalid={invalid} value={draft.budgetAmount} onChange={(e) => update({ budgetAmount: e.target.value })} data-testid="budget-amount" />
          )}
        </Field>
        <Field label={t('wiz.budget.currency')} error={err('budgetCurrency')}>
          {({ id, describedBy, invalid }) => (
            <Select id={id} aria-describedby={describedBy} invalid={invalid} value={draft.budgetCurrency} onChange={(e) => update({ budgetCurrency: e.target.value as TripDraft['budgetCurrency'] })} data-testid="budget-currency">
              <option value="">{t('wiz.budget.choose')}</option>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Fieldset legend={t('wiz.budget.basis')} error={err('budgetBasis')}>
        <div className="flex flex-wrap gap-2">
          {BUDGET_BASES.map((b) => (
            <Chip key={b} type="radio" name="basis" testId={`basis-${b}`} checked={draft.budgetBasis === b} onChange={() => update({ budgetBasis: b })} label={t(`wiz.budget.${b}` as MessageKey)} />
          ))}
        </div>
      </Fieldset>
      <Fieldset legend={t('wiz.budget.categories')} error={err('budgetCategories')}>
        <div className="flex flex-wrap gap-2">
          {BUDGET_CATEGORIES.map((c) => (
            <Chip key={c} testId={`cat-${c}`} checked={draft.budgetCategories.includes(c)} onChange={(on) => toggleCat(c, on)} label={t(`wiz.budget.cat.${c}` as MessageKey)} />
          ))}
        </div>
      </Fieldset>
      {split && draft.budgetCurrency && (
        <p className="rounded-2xl bg-sand-deep p-4 text-sm" aria-live="polite">
          {t('wiz.budget.split', { perPerson: formatMoney(split.perPerson, draft.budgetCurrency), group: formatMoney(split.group, draft.budgetCurrency) })}
        </p>
      )}
    </div>
  )
}

function StepReview({ draft, refData, update, onEdit }: { draft: TripDraft; refData: ReferenceIndex; update: (p: Partial<TripDraft>) => void; onEdit: (s: WizardStep) => void }) {
  const { t } = useI18n()
  const problems = validateAll(draft)
  return (
    <div className="flex flex-col gap-5">
      <Alert tone="info">{t('wiz.review.lead')}</Alert>
      {problems.size > 0 && (
        <Alert tone="error" title={t('wiz.review.incomplete')}>
          <ul className="mt-1 flex flex-col gap-1">
            {[...problems.entries()].map(([s, errs]) => (
              <li key={s}>
                <button type="button" className="underline" onClick={() => onEdit(s)}>
                  {t('wiz.review.goToStep')} {s} — {t(`wiz.steps.${s}` as MessageKey)}
                </button>
                : {Object.values(errs).map((c) => t(`error.${c}` as MessageKey)).join(' ')}
              </li>
            ))}
          </ul>
        </Alert>
      )}
      <TripSummary trip={draft} refData={refData} onEdit={onEdit} />
      <Field label={t('wiz.review.notes')} optional>
        {({ id }) => (
          <textarea
            id={id}
            maxLength={2000}
            rows={4}
            className="w-full rounded-xl border border-line bg-card px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            value={draft.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        )}
      </Field>
      <p className="text-sm text-muted">{t('wiz.review.next')}</p>
    </div>
  )
}
