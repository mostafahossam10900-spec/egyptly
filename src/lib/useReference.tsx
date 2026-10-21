import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadReferenceData } from './reference'
import type { Destination, Governorate, Interest, Landmark, ReferenceData } from './trip/types'

export interface ReferenceIndex extends ReferenceData {
  landmarkBySlug: Map<string, Landmark>
  destinationBySlug: Map<string, Destination>
  governorateBySlug: Map<string, Governorate>
  interestBySlug: Map<string, Interest>
  landmarksByDestination: Map<string, Landmark[]>
}

type State =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'ready'; data: ReferenceIndex }

interface Value {
  state: State
  retry: () => void
}

const Ctx = createContext<Value | null>(null)

function index(d: ReferenceData): ReferenceIndex {
  const landmarksByDestination = new Map<string, Landmark[]>()
  for (const l of d.landmarks) {
    const arr = landmarksByDestination.get(l.destination_slug) ?? []
    arr.push(l)
    landmarksByDestination.set(l.destination_slug, arr)
  }
  return {
    ...d,
    landmarkBySlug: new Map(d.landmarks.map((l) => [l.slug, l])),
    destinationBySlug: new Map(d.destinations.map((x) => [x.slug, x])),
    governorateBySlug: new Map(d.governorates.map((x) => [x.slug, x])),
    interestBySlug: new Map(d.interests.map((x) => [x.slug, x])),
    landmarksByDestination,
  }
}

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    loadReferenceData()
      .then((d) => active && setState({ status: 'ready', data: index(d) }))
      .catch((error) => active && setState({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  const value = useMemo(() => ({ state, retry }), [state, retry])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReference(): Value {
  const v = useContext(Ctx)
  if (!v) throw new Error('useReference must be used inside ReferenceProvider')
  return v
}
