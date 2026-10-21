import type { Landmark } from './types'

export interface Reconciliation {
  landmarks: string[]
  removed: string[]
}

/**
 * Keeps only landmarks that belong to the selected destinations. Mirrors the database rule
 * (trip_landmarks → trip_destinations composite foreign key) so the UI can tell the tourist
 * exactly which landmarks were removed.
 */
export function reconcileLandmarks(
  selectedLandmarks: string[],
  destinations: string[],
  landmarksBySlug: Map<string, Landmark>,
): Reconciliation {
  const keep: string[] = []
  const removed: string[] = []
  const destSet = new Set(destinations)
  for (const slug of selectedLandmarks) {
    const l = landmarksBySlug.get(slug)
    if (l && destSet.has(l.destination_slug)) keep.push(slug)
    else removed.push(slug)
  }
  return { landmarks: keep, removed }
}
