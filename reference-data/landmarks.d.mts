export type LandmarkTuple = [slug: string, name_ar: string, name_en: string, type: string, parent?: string | null, flags?: string[]]

export interface SourceDestination {
  slug: string
  name_ar: string
  name_en: string
  sections: { name_ar: string; name_en: string; items: LandmarkTuple[] }[]
}

export interface SourceGovernorate {
  slug: string
  name_ar: string
  name_en: string
  note_ar: string | null
  sources: [label_ar: string, url: string][]
  destinations: SourceDestination[]
}

export const SOURCE_DOCUMENT: string
export const governorates: SourceGovernorate[]
export const interests: [slug: string, name_en: string, name_ar: string][]
export const typeInterests: Record<string, string[]>
