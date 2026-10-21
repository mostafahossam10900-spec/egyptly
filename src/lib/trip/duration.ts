// Duration rules (docs/DECISIONS.md R-02). Whether arrival/departure days count as visit days is an
// open product question (U-02), so the tourist states it explicitly and the formula is shown.

export interface DurationInput {
  arrivalDate: string
  departureDate: string
  arrivalDayAvailable: boolean
  departureDayAvailable: boolean
}

export interface Duration {
  nights: number
  calendarDays: number
  sameDay: boolean
  /** Full calendar days strictly between arrival and departure. */
  middleDays: number
  /** Days the tourist said they can visit places (middle days + available arrival/departure days). */
  visitDays: number
}

const DAY_MS = 86_400_000

/** Parses yyyy-mm-dd as a UTC calendar date (no time zone drift). Returns null if invalid. */
export function parseIsoDate(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const t = Date.UTC(y, mo - 1, d)
  const back = new Date(t)
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null
  return t
}

export function computeDuration(input: DurationInput): Duration | null {
  const a = parseIsoDate(input.arrivalDate)
  const d = parseIsoDate(input.departureDate)
  if (a === null || d === null || d < a) return null
  const nights = Math.round((d - a) / DAY_MS)
  const calendarDays = nights + 1
  if (nights === 0) {
    const available = input.arrivalDayAvailable || input.departureDayAvailable
    return { nights: 0, calendarDays: 1, sameDay: true, middleDays: 0, visitDays: available ? 1 : 0 }
  }
  const middleDays = calendarDays - 2
  const visitDays = middleDays + (input.arrivalDayAvailable ? 1 : 0) + (input.departureDayAvailable ? 1 : 0)
  return { nights, calendarDays, sameDay: false, middleDays, visitDays }
}

/** Today's date in the user's local calendar as yyyy-mm-dd. */
export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
