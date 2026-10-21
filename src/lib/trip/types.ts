export const TRIP_TYPES = ['multi_day', 'day_trip', 'layover'] as const
export const COMPANIONS = ['solo', 'couple', 'family', 'friends', 'group'] as const
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'EGP'] as const
export const BUDGET_BASES = ['per_person', 'group'] as const
export const BUDGET_CATEGORIES = [
  'flights', 'accommodation', 'local_transport', 'entry_tickets', 'food', 'guide_fee', 'activities',
] as const

export type TripType = (typeof TRIP_TYPES)[number]
export type Companions = (typeof COMPANIONS)[number]
export type Currency = (typeof CURRENCIES)[number]
export type BudgetBasis = (typeof BUDGET_BASES)[number]
export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number]
export type TripStatus = 'draft' | 'submitted'

export const WIZARD_STEPS = [1, 2, 3, 4, 5, 6, 7] as const
export type WizardStep = (typeof WIZARD_STEPS)[number]

/** Client-side shape of a trip request (one row + its selections). */
export interface TripDraft {
  id: string
  status: TripStatus
  currentStep: WizardStep
  destinations: string[]
  interests: string[]
  landmarks: string[]
  arrivalDate: string // yyyy-mm-dd or ''
  departureDate: string
  arrivalTime: string // HH:MM or ''
  departureTime: string
  arrivalDayAvailable: boolean
  departureDayAvailable: boolean
  travelers: string // kept as typed text; validated before save
  tripType: TripType | ''
  companions: Companions | ''
  budgetAmount: string
  budgetCurrency: Currency | ''
  budgetBasis: BudgetBasis | ''
  budgetCategories: BudgetCategory[]
  notes: string
  createdAt?: string
  updatedAt?: string
  submittedAt?: string | null
}

export function emptyDraft(id: string): TripDraft {
  return {
    id,
    status: 'draft',
    currentStep: 1,
    destinations: [],
    interests: [],
    landmarks: [],
    arrivalDate: '',
    departureDate: '',
    arrivalTime: '',
    departureTime: '',
    arrivalDayAvailable: false,
    departureDayAvailable: false,
    travelers: '',
    tripType: '',
    companions: '',
    budgetAmount: '',
    budgetCurrency: '',
    budgetBasis: '',
    budgetCategories: [],
    notes: '',
  }
}

export interface Landmark {
  slug: string
  destination_slug: string
  section_ar: string
  section_en: string
  name_ar: string
  name_en: string
  name_en_reviewed?: boolean
  type: string
  parent_slug: string | null
  flags: string[]
  access_status?: string
  sort_order: number
}

export interface Destination {
  slug: string
  governorate_slug: string
  name_ar: string
  name_en: string
  sort_order: number
}

export interface Governorate {
  slug: string
  name_ar: string
  name_en: string
  note_ar: string | null
  discussion_order: number
  sources: { label_ar: string; url: string }[]
}

export interface Interest {
  slug: string
  name_en: string
  name_ar: string
  sort_order: number
}

export interface ReferenceData {
  governorates: Governorate[]
  destinations: Destination[]
  landmarks: Landmark[]
  interests: Interest[]
}
