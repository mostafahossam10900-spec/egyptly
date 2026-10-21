import { typeInterests } from '../../../reference-data/landmarks.mjs'
import type { Landmark } from './types'

const TYPE_INTERESTS = typeInterests as Record<string, string[]>

/** Interests (from the tourist's selection) that a landmark's type relates to — assumption R-05. */
export function matchingInterests(landmark: Landmark, selectedInterests: string[]): string[] {
  const related = TYPE_INTERESTS[landmark.type] ?? []
  return selectedInterests.filter((i) => related.includes(i))
}

export interface RankedLandmark {
  landmark: Landmark
  matches: string[]
  children: RankedLandmark[]
}

/**
 * Orders a destination's landmarks by how many selected interests they relate to (then by source
 * order). Sub-sites stay nested under their parent site and are never ranked as separate visits.
 */
export function rankLandmarks(landmarks: Landmark[], selectedInterests: string[]): RankedLandmark[] {
  const bySlug = new Map(landmarks.map((l) => [l.slug, l]))
  const node = (l: Landmark): RankedLandmark => ({ landmark: l, matches: matchingInterests(l, selectedInterests), children: [] })
  const top: RankedLandmark[] = []
  const nodes = new Map<string, RankedLandmark>()
  for (const l of landmarks) nodes.set(l.slug, node(l))
  for (const l of landmarks) {
    const n = nodes.get(l.slug)!
    if (l.parent_slug && bySlug.has(l.parent_slug)) nodes.get(l.parent_slug)!.children.push(n)
    else top.push(n)
  }
  const score = (n: RankedLandmark) => Math.max(n.matches.length, ...n.children.map((c) => c.matches.length))
  return top.sort((a, b) => score(b) - score(a) || a.landmark.sort_order - b.landmark.sort_order)
}
