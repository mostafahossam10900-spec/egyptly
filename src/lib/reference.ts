import { flattenReferenceData } from '../../reference-data/flatten.mjs'
import { governorates as sourceGovernorates, interests as sourceInterests } from '../../reference-data/landmarks.mjs'
import { supabase } from './supabase'
import type { ReferenceData } from './trip/types'

/** Reference data bundled with the app (same source file as the database seed). Used in demo mode. */
export function bundledReferenceData(): ReferenceData {
  const flat = flattenReferenceData(sourceGovernorates)
  return {
    governorates: flat.governorates.map((g) => ({
      ...g,
      sources: g.sources.map(([label_ar, url]) => ({ label_ar, url })),
    })),
    destinations: flat.destinations,
    landmarks: flat.landmarks.map((l) => ({ ...l, access_status: 'unverified', name_en_reviewed: false })),
    interests: sourceInterests.map(([slug, name_en, name_ar], i) => ({ slug, name_en, name_ar, sort_order: i + 1 })),
  }
}

/** Loads reference data from the database when configured (so admins can update it in Phase 2). */
export async function loadReferenceData(): Promise<ReferenceData> {
  if (!supabase) return bundledReferenceData()
  const [g, d, l, i] = await Promise.all([
    supabase.from('governorates').select('slug, name_ar, name_en, note_ar, discussion_order, sources').order('discussion_order'),
    supabase.from('destinations').select('slug, governorate_slug, name_ar, name_en, sort_order').order('sort_order'),
    supabase
      .from('landmarks')
      .select('slug, destination_slug, section_ar, section_en, name_ar, name_en, name_en_reviewed, type, parent_slug, flags, access_status, sort_order')
      .order('sort_order'),
    supabase.from('interests').select('slug, name_en, name_ar, sort_order').order('sort_order'),
  ])
  const err = g.error ?? d.error ?? l.error ?? i.error
  if (err) throw err
  return {
    governorates: g.data as ReferenceData['governorates'],
    destinations: d.data as ReferenceData['destinations'],
    landmarks: l.data as ReferenceData['landmarks'],
    interests: i.data as ReferenceData['interests'],
  }
}
