import { describe, expect, it } from 'vitest'
import { flattenReferenceData, validateReferenceData } from '../../reference-data/flatten.mjs'
import { governorates, interests } from '../../reference-data/landmarks.mjs'
import { ar } from '../../src/lib/i18n/ar'
import { en } from '../../src/lib/i18n/en'
import { LOCALES } from '../../src/lib/i18n'

const APPROVED_INTERESTS = [
  'Adventure', 'Architecture', 'Art & culture', 'Bird watching', 'Boat', 'City highlights', 'Classes & workshops',
  'Food & drink', 'History', 'Museums', 'Nature & wildlife', 'Night', 'Off the beaten path', 'Photography',
  'Religious sites', 'Shopping', 'Beaches & relaxation', 'Diving & snorkeling', 'Desert safari & camping',
  'Nile cruises & felucca', 'Ancient Egypt & archaeology', 'Wellness & spa',
]

describe('reference data', () => {
  const flat = flattenReferenceData(governorates)

  it('is internally valid', () => {
    expect(validateReferenceData(flat, interests)).toEqual([])
  })

  it('contains the ten governorates in discussion order and all 283 listed landmarks', () => {
    expect(flat.governorates.map((g) => g.slug)).toEqual([
      'red-sea', 'south-sinai', 'cairo', 'giza', 'luxor', 'aswan', 'alexandria', 'matrouh', 'fayoum', 'new-valley',
    ])
    expect(flat.landmarks).toHaveLength(283)
  })

  it('uses exactly the 22 approved interests, and keeps Day trip / Layover / Family out of them', () => {
    expect(interests.map((i) => i[1])).toEqual(APPROVED_INTERESTS)
    const names = interests.map((i) => i[1].toLowerCase())
    for (const banned of ['day trip', 'layover', 'family']) expect(names).not.toContain(banned)
  })

  it('stores no invented operational data', () => {
    for (const l of flat.landmarks) {
      expect(Object.keys(l).sort()).toEqual(
        ['destination_slug', 'flags', 'name_ar', 'name_en', 'parent_slug', 'section_ar', 'section_en', 'slug', 'sort_order', 'type'].sort(),
      )
    }
  })

  it('keeps Giza landmarks (GEM, pyramids) under Giza, not Cairo', () => {
    const gem = flat.landmarks.find((l) => l.slug === 'grand-egyptian-museum')!
    const dest = flat.destinations.find((d) => d.slug === gem.destination_slug)!
    expect(dest.governorate_slug).toBe('giza')
  })
})

describe('i18n', () => {
  it('Arabic provides every English key with non-empty text', () => {
    for (const k of Object.keys(en) as (keyof typeof en)[]) {
      expect(ar[k], k).toBeTruthy()
    }
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort())
  })

  it('placeholders match between English and Arabic', () => {
    const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
    for (const k of Object.keys(en) as (keyof typeof en)[]) {
      expect(vars(ar[k]), k).toEqual(vars(en[k]))
    }
  })

  it('only English and Arabic are marked complete; the six Phase 4 languages are registered but unavailable', () => {
    expect(LOCALES.filter((l) => l.complete).map((l) => l.code)).toEqual(['en', 'ar'])
    expect(LOCALES.filter((l) => !l.complete).map((l) => l.code)).toEqual(['it', 'es', 'de', 'ru', 'uk', 'tr'])
    expect(LOCALES.find((l) => l.code === 'ar')?.dir).toBe('rtl')
  })
})
