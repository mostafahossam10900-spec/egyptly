import type { SourceGovernorate } from './landmarks.mjs'

export interface FlatReferenceData {
  governorates: {
    slug: string; name_ar: string; name_en: string; note_ar: string | null
    discussion_order: number; sources: [string, string][]
  }[]
  destinations: { slug: string; governorate_slug: string; name_ar: string; name_en: string; sort_order: number }[]
  landmarks: {
    slug: string; destination_slug: string; section_ar: string; section_en: string; name_ar: string; name_en: string
    type: string; parent_slug: string | null; flags: string[]; sort_order: number
  }[]
}

export function flattenReferenceData(governorates: SourceGovernorate[]): FlatReferenceData
export function validateReferenceData(data: FlatReferenceData, interests: unknown[]): string[]
