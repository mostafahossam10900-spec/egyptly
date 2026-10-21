import { describe, expect, it } from 'vitest'
import { bundledReferenceData } from '../../src/lib/reference'
import { computeDuration, parseIsoDate } from '../../src/lib/trip/duration'
import { matchingInterests, rankLandmarks } from '../../src/lib/trip/ranking'
import { reconcileLandmarks } from '../../src/lib/trip/reconcile'
import { emptyDraft, type TripDraft } from '../../src/lib/trip/types'
import { budgetSplit, parseBudget, validateAll, validateStep } from '../../src/lib/trip/validation'

const TODAY = '2026-10-22'
const ref = bundledReferenceData()
const bySlug = new Map(ref.landmarks.map((l) => [l.slug, l]))

function complete(over: Partial<TripDraft> = {}): TripDraft {
  return {
    ...emptyDraft('00000000-0000-0000-0000-000000000000'),
    destinations: ['cairo-city', 'giza-pyramids-saqqara'],
    interests: ['history'],
    landmarks: ['great-sphinx'],
    arrivalDate: '2026-11-01',
    departureDate: '2026-11-10',
    travelers: '5',
    tripType: 'multi_day',
    companions: 'family',
    budgetAmount: '5000',
    budgetCurrency: 'USD',
    budgetBasis: 'group',
    budgetCategories: ['accommodation'],
    ...over,
  }
}

describe('duration', () => {
  it('rejects impossible calendar dates', () => {
    expect(parseIsoDate('2026-02-30')).toBeNull()
    expect(parseIsoDate('2026-13-01')).toBeNull()
    expect(parseIsoDate('22/10/2026')).toBeNull()
    expect(parseIsoDate('2028-02-29')).not.toBeNull()
  })

  it('counts nights, calendar days and visit days as explained in the UI', () => {
    const d = computeDuration({ arrivalDate: '2026-11-01', departureDate: '2026-11-10', arrivalDayAvailable: false, departureDayAvailable: false })
    expect(d).toEqual({ nights: 9, calendarDays: 10, sameDay: false, middleDays: 8, visitDays: 8 })
    const d2 = computeDuration({ arrivalDate: '2026-11-01', departureDate: '2026-11-10', arrivalDayAvailable: true, departureDayAvailable: true })
    expect(d2?.visitDays).toBe(10)
  })

  it('handles same-day trips and month/DST boundaries', () => {
    expect(computeDuration({ arrivalDate: '2026-11-01', departureDate: '2026-11-01', arrivalDayAvailable: true, departureDayAvailable: true }))
      .toEqual({ nights: 0, calendarDays: 1, sameDay: true, middleDays: 0, visitDays: 1 })
    expect(computeDuration({ arrivalDate: '2027-03-28', departureDate: '2027-04-02', arrivalDayAvailable: false, departureDayAvailable: false })?.nights).toBe(5)
  })

  it('returns null when departure is before arrival', () => {
    expect(computeDuration({ arrivalDate: '2026-11-10', departureDate: '2026-11-01', arrivalDayAvailable: false, departureDayAvailable: false })).toBeNull()
  })
})

describe('validation', () => {
  it('a complete request has no errors', () => {
    expect(validateAll(complete(), TODAY).size).toBe(0)
  })

  it('requires destinations and interests', () => {
    expect(validateStep(1, complete({ destinations: [] }), TODAY).destinations).toBe('destination_required')
    expect(validateStep(2, complete({ interests: [] }), TODAY).interests).toBe('interest_required')
  })

  it('rejects invalid dates', () => {
    expect(validateStep(4, complete({ arrivalDate: '2026-10-21' }), TODAY).arrivalDate).toBe('arrival_in_past')
    expect(validateStep(4, complete({ arrivalDate: '2026-02-30' }), TODAY).arrivalDate).toBe('arrival_invalid')
    expect(validateStep(4, complete({ departureDate: '2026-10-30' }), TODAY).departureDate).toBe('departure_before_arrival')
    expect(validateStep(4, complete({ departureDate: '2027-06-01' }), TODAY).departureDate).toBe('trip_too_long')
    expect(validateStep(4, complete({ arrivalDate: '' }), TODAY).arrivalDate).toBe('arrival_required')
    expect(validateStep(4, complete({ arrivalDate: TODAY, departureDate: TODAY }), TODAY)).toEqual({})
  })

  it('rejects non-positive or fractional traveller counts', () => {
    for (const v of ['0', '-1', '2.5', 'abc', '101']) {
      expect(validateStep(4, complete({ travelers: v }), TODAY).travelers).toBe('travelers_invalid')
    }
    expect(validateStep(4, complete({ travelers: '' }), TODAY).travelers).toBe('travelers_required')
  })

  it('keeps trip type and companions consistent with dates and travellers', () => {
    expect(validateStep(5, complete({ tripType: 'day_trip' }), TODAY).tripType).toBe('day_trip_same_date')
    expect(validateStep(4, complete({ tripType: 'day_trip' }), TODAY).departureDate).toBe('day_trip_same_date')
    expect(validateStep(5, complete({ tripType: 'day_trip', departureDate: '2026-11-01' }), TODAY)).toEqual({})
    expect(validateStep(5, complete({ companions: 'solo' }), TODAY).companions).toBe('solo_one_traveler')
    expect(validateStep(5, complete({ companions: 'couple', travelers: '2' }), TODAY)).toEqual({})
    expect(validateStep(5, complete({ tripType: '' }), TODAY).tripType).toBe('trip_type_required')
  })

  it('validates budget amount, currency, basis and categories', () => {
    expect(validateStep(6, complete({ budgetAmount: '0' }), TODAY).budgetAmount).toBe('budget_positive')
    expect(validateStep(6, complete({ budgetAmount: '-50' }), TODAY).budgetAmount).toBe('budget_invalid')
    expect(validateStep(6, complete({ budgetAmount: '12abc' }), TODAY).budgetAmount).toBe('budget_invalid')
    expect(validateStep(6, complete({ budgetAmount: '10.555' }), TODAY).budgetAmount).toBe('budget_decimals')
    expect(validateStep(6, complete({ budgetAmount: '20000000' }), TODAY).budgetAmount).toBe('budget_too_large')
    expect(validateStep(6, complete({ budgetAmount: '' }), TODAY).budgetAmount).toBe('budget_required')
    expect(validateStep(6, complete({ budgetCurrency: '' }), TODAY).budgetCurrency).toBe('currency_required')
    expect(validateStep(6, complete({ budgetBasis: '' }), TODAY).budgetBasis).toBe('basis_required')
    expect(validateStep(6, complete({ budgetCategories: [] }), TODAY).budgetCategories).toBe('categories_required')
    expect(parseBudget('5,000.50')).toBe(5000.5)
  })

  it('splits the budget by simple arithmetic', () => {
    expect(budgetSplit(complete())).toEqual({ perPerson: 1000, group: 5000 })
    expect(budgetSplit(complete({ budgetBasis: 'per_person' }))).toEqual({ perPerson: 5000, group: 25000 })
  })
})

describe('destination/landmark reconciliation', () => {
  it('removes landmarks of a removed destination and reports them', () => {
    const r = reconcileLandmarks(['great-sphinx', 'cairo-tower', 'karnak'], ['cairo-city'], bySlug)
    expect(r.landmarks).toEqual(['cairo-tower'])
    expect(r.removed).toEqual(['great-sphinx', 'karnak'])
  })

  it('drops unknown landmark slugs', () => {
    expect(reconcileLandmarks(['nope'], ['cairo-city'], bySlug).removed).toEqual(['nope'])
  })
})

describe('landmark ranking', () => {
  it('orders landmarks by matching interests and explains why', () => {
    const cairo = ref.landmarks.filter((l) => l.destination_slug === 'cairo-city')
    const ranked = rankLandmarks(cairo, ['museums'])
    expect(ranked[0].landmark.type).toBe('museum')
    expect(ranked[0].matches).toEqual(['museums'])
    expect(matchingInterests(bySlug.get('cairo-tower')!, ['museums'])).toEqual([])
  })

  it('nests sub-sites under their parent instead of listing them as separate visits', () => {
    const luxor = ref.landmarks.filter((l) => l.destination_slug === 'luxor-city')
    const ranked = rankLandmarks(luxor, [])
    const vok = ranked.find((n) => n.landmark.slug === 'valley-of-the-kings')!
    expect(vok.children.map((c) => c.landmark.slug)).toContain('tomb-of-tutankhamun')
    expect(ranked.some((n) => n.landmark.slug === 'tomb-of-tutankhamun')).toBe(false)
  })
})
