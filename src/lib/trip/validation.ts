import { computeDuration, parseIsoDate, todayIso } from './duration'
import {
  BUDGET_BASES, BUDGET_CATEGORIES, COMPANIONS, CURRENCIES, TRIP_TYPES,
  type TripDraft, type WizardStep,
} from './types'

/** Error codes map to i18n keys `error.<code>`. */
export type ErrorCode =
  | 'destination_required'
  | 'interest_required'
  | 'arrival_required'
  | 'arrival_invalid'
  | 'arrival_in_past'
  | 'departure_required'
  | 'departure_invalid'
  | 'departure_before_arrival'
  | 'trip_too_long'
  | 'time_invalid'
  | 'travelers_required'
  | 'travelers_invalid'
  | 'trip_type_required'
  | 'companions_required'
  | 'day_trip_same_date'
  | 'solo_one_traveler'
  | 'couple_two_travelers'
  | 'budget_required'
  | 'budget_invalid'
  | 'budget_positive'
  | 'budget_too_large'
  | 'budget_decimals'
  | 'currency_required'
  | 'basis_required'
  | 'categories_required'

export type FieldErrors = Partial<Record<string, ErrorCode>>

const MAX_TRIP_NIGHTS = 120
const MAX_TRAVELERS = 100
const MAX_BUDGET = 10_000_000

export function parseTravelers(value: string): number | null {
  if (!/^\s*\d+\s*$/.test(value)) return null
  return Number(value.trim())
}

/** Accepts "1500", "1500.50", "1,500" (comma grouping). Returns null for anything else. */
export function parseBudget(value: string): number | null {
  const v = value.trim().replace(/,(?=\d{3}(\D|$))/g, '')
  if (!/^\d+(\.\d+)?$/.test(v)) return null
  return Number(v)
}

export function validateStep(step: WizardStep, t: TripDraft, today: string = todayIso()): FieldErrors {
  const e: FieldErrors = {}
  switch (step) {
    case 1:
      if (t.destinations.length === 0) e.destinations = 'destination_required'
      break
    case 2:
      if (t.interests.length === 0) e.interests = 'interest_required'
      break
    case 3:
      // Landmarks are optional (assumption R-09); consistency is enforced by reconciliation.
      break
    case 4: {
      const a = parseIsoDate(t.arrivalDate)
      const d = parseIsoDate(t.departureDate)
      if (!t.arrivalDate) e.arrivalDate = 'arrival_required'
      else if (a === null) e.arrivalDate = 'arrival_invalid'
      else if (t.arrivalDate < today) e.arrivalDate = 'arrival_in_past'
      if (!t.departureDate) e.departureDate = 'departure_required'
      else if (d === null) e.departureDate = 'departure_invalid'
      else if (a !== null && d < a) e.departureDate = 'departure_before_arrival'
      else if (a !== null) {
        const dur = computeDuration(t)
        if (dur && dur.nights > MAX_TRIP_NIGHTS) e.departureDate = 'trip_too_long'
        // A trip type chosen earlier still applies when dates are edited later.
        else if (t.tripType === 'day_trip' && t.departureDate !== t.arrivalDate) e.departureDate = 'day_trip_same_date'
      }
      if (t.arrivalTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t.arrivalTime)) e.arrivalTime = 'time_invalid'
      if (t.departureTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t.departureTime)) e.departureTime = 'time_invalid'
      const n = parseTravelers(t.travelers)
      if (!t.travelers.trim()) e.travelers = 'travelers_required'
      else if (n === null || n < 1 || n > MAX_TRAVELERS) e.travelers = 'travelers_invalid'
      break
    }
    case 5: {
      if (!t.tripType || !TRIP_TYPES.includes(t.tripType)) e.tripType = 'trip_type_required'
      if (!t.companions || !COMPANIONS.includes(t.companions)) e.companions = 'companions_required'
      if (t.tripType === 'day_trip' && t.arrivalDate && t.departureDate && t.arrivalDate !== t.departureDate) {
        e.tripType = 'day_trip_same_date'
      }
      const n = parseTravelers(t.travelers)
      if (t.companions === 'solo' && n !== null && n !== 1) e.companions = 'solo_one_traveler'
      if (t.companions === 'couple' && n !== null && n !== 2) e.companions = 'couple_two_travelers'
      break
    }
    case 6: {
      const raw = t.budgetAmount.trim()
      const amount = parseBudget(raw)
      if (!raw) e.budgetAmount = 'budget_required'
      else if (amount === null) e.budgetAmount = 'budget_invalid'
      else if (amount <= 0) e.budgetAmount = 'budget_positive'
      else if (amount > MAX_BUDGET) e.budgetAmount = 'budget_too_large'
      else if (/\.\d{3,}$/.test(raw)) e.budgetAmount = 'budget_decimals'
      if (!t.budgetCurrency || !CURRENCIES.includes(t.budgetCurrency)) e.budgetCurrency = 'currency_required'
      if (!t.budgetBasis || !BUDGET_BASES.includes(t.budgetBasis)) e.budgetBasis = 'basis_required'
      if (t.budgetCategories.length === 0 || !t.budgetCategories.every((c) => BUDGET_CATEGORIES.includes(c))) {
        e.budgetCategories = 'categories_required'
      }
      break
    }
    case 7:
      break
  }
  return e
}

/** All errors for a complete request, keyed by step. Used by the review screen before submitting. */
export function validateAll(t: TripDraft, today?: string): Map<WizardStep, FieldErrors> {
  const out = new Map<WizardStep, FieldErrors>()
  for (const s of [1, 2, 3, 4, 5, 6] as WizardStep[]) {
    const e = validateStep(s, t, today)
    if (Object.keys(e).length) out.set(s, e)
  }
  return out
}

/** Simple arithmetic shown to the tourist; explicitly not a price estimate. */
export function budgetSplit(t: TripDraft): { perPerson: number; group: number } | null {
  const amount = parseBudget(t.budgetAmount)
  const n = parseTravelers(t.travelers)
  if (amount === null || amount <= 0 || n === null || n < 1 || !t.budgetBasis) return null
  return t.budgetBasis === 'per_person'
    ? { perPerson: amount, group: amount * n }
    : { perPerson: amount / n, group: amount }
}
