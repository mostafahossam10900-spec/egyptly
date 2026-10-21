import type { ReactNode } from 'react'
import { useI18n } from '../lib/i18n'
import type { MessageKey } from '../lib/i18n/en'
import { computeDuration } from '../lib/trip/duration'
import type { TripDraft, WizardStep } from '../lib/trip/types'
import { budgetSplit, parseBudget } from '../lib/trip/validation'
import type { ReferenceIndex } from '../lib/useReference'

function Section({ step, title, onEdit, children }: { step: WizardStep; title: string; onEdit?: (s: WizardStep) => void; children: ReactNode }) {
  const { t } = useI18n()
  return (
    <section className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0" aria-labelledby={`sum-${step}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 id={`sum-${step}`} className="eyebrow">
          {title}
        </h3>
        {onEdit && (
          <button type="button" onClick={() => onEdit(step)} className="min-h-9 rounded-full px-3 text-sm font-semibold underline hover:bg-accent">
            {t('wiz.review.edit')}
            <span className="sr-only"> — {title}</span>
          </button>
        )}
      </div>
      <div className="text-sm">{children}</div>
    </section>
  )
}

export function TripSummary({ trip, refData, onEdit }: { trip: TripDraft; refData: ReferenceIndex; onEdit?: (s: WizardStep) => void }) {
  const { t, pick, formatDate, formatMoney } = useI18n()
  const none = <span className="text-muted">{t('wiz.review.none')}</span>
  const dur = computeDuration(trip)
  const split = budgetSplit(trip)
  const amount = parseBudget(trip.budgetAmount)

  return (
    <div>
      <Section step={1} title={t('wiz.steps.1')} onEdit={onEdit}>
        {trip.destinations.length ? (
          <ul className="flex flex-wrap gap-2">
            {trip.destinations.map((d) => {
              const dest = refData.destinationBySlug.get(d)
              const gov = dest && refData.governorateBySlug.get(dest.governorate_slug)
              return (
                <li key={d} className="rounded-full bg-gold-soft px-3 py-1">
                  {dest ? pick(dest) : d}
                  {gov && <span className="text-muted"> · {pick(gov)}</span>}
                </li>
              )
            })}
          </ul>
        ) : none}
      </Section>
      <Section step={2} title={t('wiz.steps.2')} onEdit={onEdit}>
        {trip.interests.length ? (
          <ul className="flex flex-wrap gap-2">
            {trip.interests.map((i) => {
              const it = refData.interestBySlug.get(i)
              return (
                <li key={i} className="rounded-full border border-line px-3 py-1">
                  {it ? pick(it) : i}
                </li>
              )
            })}
          </ul>
        ) : none}
      </Section>
      <Section step={3} title={t('wiz.steps.3')} onEdit={onEdit}>
        {trip.landmarks.length ? (
          <ul className="list-inside list-disc columns-1 sm:columns-2">
            {trip.landmarks.map((l) => {
              const lm = refData.landmarkBySlug.get(l)
              return <li key={l}>{lm ? pick(lm) : l}</li>
            })}
          </ul>
        ) : none}
      </Section>
      <Section step={4} title={t('wiz.steps.4')} onEdit={onEdit}>
        {trip.arrivalDate && trip.departureDate ? (
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{t('wiz.review.dates', { arrival: formatDate(trip.arrivalDate), departure: formatDate(trip.departureDate) })}</p>
            {dur && (
              <p className="text-muted">
                {dur.sameDay
                  ? t('wiz.dates.sameDay', { days: dur.visitDays })
                  : `${t('wiz.dates.nights', { nights: dur.nights })} · ${t('wiz.dates.visitDays', { days: dur.visitDays, middle: dur.middleDays })}`}
              </p>
            )}
            <p className="text-muted">
              {t('wiz.review.availableDays', {
                arrival: t(trip.arrivalDayAvailable ? 'wiz.review.yes' : 'wiz.review.no'),
                departure: t(trip.departureDayAvailable ? 'wiz.review.yes' : 'wiz.review.no'),
              })}
            </p>
            {(trip.arrivalTime || trip.departureTime) && (
              <p className="text-muted">
                {t('wiz.review.times', {
                  arrival: trip.arrivalTime || t('wiz.review.notGiven'),
                  departure: trip.departureTime || t('wiz.review.notGiven'),
                })}
              </p>
            )}
            {trip.travelers && <p>{t('dash.travelers', { count: trip.travelers })}</p>}
          </div>
        ) : none}
      </Section>
      <Section step={5} title={t('wiz.steps.5')} onEdit={onEdit}>
        {trip.tripType || trip.companions ? (
          <p>
            {trip.tripType ? t(`wiz.type.${trip.tripType}` as MessageKey) : '—'} · {trip.companions ? t(`wiz.comp.${trip.companions}` as MessageKey) : '—'}
          </p>
        ) : none}
      </Section>
      <Section step={6} title={t('wiz.steps.6')} onEdit={onEdit}>
        {amount !== null && trip.budgetCurrency ? (
          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              {formatMoney(amount, trip.budgetCurrency)} · {trip.budgetBasis ? t(`wiz.budget.${trip.budgetBasis}` as MessageKey) : '—'}
            </p>
            {split && (
              <p className="text-muted">
                {t('wiz.budget.split', {
                  perPerson: formatMoney(split.perPerson, trip.budgetCurrency),
                  group: formatMoney(split.group, trip.budgetCurrency),
                })}
              </p>
            )}
            <p className="text-muted">
              {trip.budgetCategories.map((c) => t(`wiz.budget.cat.${c}` as MessageKey)).join(' · ') || t('wiz.review.none')}
            </p>
          </div>
        ) : none}
      </Section>
      {trip.notes && (
        <Section step={7} title={t('wiz.review.notes')}>
          <p className="whitespace-pre-wrap">{trip.notes}</p>
        </Section>
      )}
    </div>
  )
}
