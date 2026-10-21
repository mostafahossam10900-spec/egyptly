import { parseBudget, parseTravelers } from './trip/validation'
import { requireSupabase } from './supabase'
import type { TripDraft, WizardStep } from './trip/types'

const TRIP_COLUMNS =
  'id, status, current_step, arrival_date, departure_date, arrival_time, departure_time, arrival_day_available, departure_day_available, travelers, trip_type, companions, budget_amount, budget_currency, budget_basis, budget_categories, notes, created_at, updated_at, submitted_at, trip_destinations(destination_slug), trip_interests(interest_slug), trip_landmarks(landmark_slug)'

interface TripRow {
  id: string
  status: 'draft' | 'submitted'
  current_step: number
  arrival_date: string | null
  departure_date: string | null
  arrival_time: string | null
  departure_time: string | null
  arrival_day_available: boolean
  departure_day_available: boolean
  travelers: number | null
  trip_type: TripDraft['tripType'] | null
  companions: TripDraft['companions'] | null
  budget_amount: number | string | null
  budget_currency: TripDraft['budgetCurrency'] | null
  budget_basis: TripDraft['budgetBasis'] | null
  budget_categories: TripDraft['budgetCategories']
  notes: string | null
  created_at: string
  updated_at: string
  submitted_at: string | null
  trip_destinations: { destination_slug: string }[]
  trip_interests: { interest_slug: string }[]
  trip_landmarks: { landmark_slug: string }[]
}

function fromRow(r: TripRow): TripDraft {
  return {
    id: r.id,
    status: r.status,
    currentStep: Math.min(7, Math.max(1, r.current_step)) as WizardStep,
    destinations: r.trip_destinations.map((x) => x.destination_slug),
    interests: r.trip_interests.map((x) => x.interest_slug),
    landmarks: r.trip_landmarks.map((x) => x.landmark_slug),
    arrivalDate: r.arrival_date ?? '',
    departureDate: r.departure_date ?? '',
    arrivalTime: r.arrival_time?.slice(0, 5) ?? '',
    departureTime: r.departure_time?.slice(0, 5) ?? '',
    arrivalDayAvailable: r.arrival_day_available,
    departureDayAvailable: r.departure_day_available,
    travelers: r.travelers?.toString() ?? '',
    tripType: r.trip_type ?? '',
    companions: r.companions ?? '',
    budgetAmount: r.budget_amount === null ? '' : String(Number(r.budget_amount)),
    budgetCurrency: r.budget_currency ?? '',
    budgetBasis: r.budget_basis ?? '',
    budgetCategories: r.budget_categories ?? [],
    notes: r.notes ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    submittedAt: r.submitted_at,
  }
}

/** Only values that already passed validation are sent; anything else is stored as unknown (null). */
function toRow(t: TripDraft) {
  const travelers = parseTravelers(t.travelers)
  const budget = parseBudget(t.budgetAmount)
  return {
    status: t.status,
    current_step: t.currentStep,
    arrival_date: t.arrivalDate || null,
    departure_date: t.departureDate || null,
    arrival_time: t.arrivalTime || null,
    departure_time: t.departureTime || null,
    arrival_day_available: t.arrivalDayAvailable,
    departure_day_available: t.departureDayAvailable,
    travelers: travelers !== null && travelers >= 1 && travelers <= 100 ? travelers : null,
    trip_type: t.tripType || null,
    companions: t.companions || null,
    budget_amount: budget !== null && budget > 0 ? Math.round(budget * 100) / 100 : null,
    budget_currency: t.budgetCurrency || null,
    budget_basis: t.budgetBasis || null,
    budget_categories: t.budgetCategories,
    notes: t.notes.trim() || null,
  }
}

export async function listTrips(): Promise<TripDraft[]> {
  const { data, error } = await requireSupabase().from('trips').select(TRIP_COLUMNS).order('updated_at', { ascending: false })
  if (error) throw error
  return (data as unknown as TripRow[]).map(fromRow)
}

/** Returns null when the trip does not exist OR belongs to someone else (RLS hides it). */
export async function getTrip(id: string): Promise<TripDraft | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const { data, error } = await requireSupabase().from('trips').select(TRIP_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? fromRow(data as unknown as TripRow) : null
}

export async function createTrip(): Promise<string> {
  const { data, error } = await requireSupabase().from('trips').insert({}).select('id').single()
  if (error) throw error
  return data.id as string
}

/**
 * Saves the scalar fields and atomically replaces the selections. Returns landmark slugs the server
 * dropped because their destination is no longer selected.
 */
export async function saveTrip(t: TripDraft): Promise<string[]> {
  const sb = requireSupabase()
  // Selections first: the submission trigger checks them when status becomes 'submitted'.
  const { data: dropped, error: selErr } = await sb.rpc('save_trip_selections', {
    p_trip_id: t.id,
    p_destinations: t.destinations,
    p_interests: t.interests,
    p_landmarks: t.landmarks,
  })
  if (selErr) throw selErr
  const { error } = await sb.from('trips').update(toRow(t)).eq('id', t.id)
  if (error) throw error
  return (dropped as string[] | null) ?? []
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await requireSupabase().from('trips').delete().eq('id', id)
  if (error) throw error
}
