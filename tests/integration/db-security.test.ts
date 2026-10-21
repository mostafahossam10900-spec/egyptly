import type { SupabaseClient } from '@supabase/supabase-js'
import { beforeAll, describe, expect, it } from 'vitest'
import { anonClient, signedInTourist } from './helpers'

// Runs against the local Supabase stack: `npx supabase start` then `npm run test:integration`.

let alice: { client: SupabaseClient; userId: string }
let bob: { client: SupabaseClient; userId: string }
let aliceTrip: string

const future = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)

beforeAll(async () => {
  alice = await signedInTourist('alice')
  bob = await signedInTourist('bob')
  const { data, error } = await alice.client.from('trips').insert({}).select('id').single()
  if (error) throw error
  aliceTrip = data.id
  const { error: selErr } = await alice.client.rpc('save_trip_selections', {
    p_trip_id: aliceTrip,
    p_destinations: ['cairo-city', 'giza-pyramids-saqqara'],
    p_interests: ['history'],
    p_landmarks: ['cairo-tower', 'great-sphinx'],
  })
  if (selErr) throw selErr
})

describe('reference data', () => {
  it('is readable anonymously and has the imported counts', async () => {
    const c = anonClient()
    const g = await c.from('governorates').select('slug', { count: 'exact', head: true })
    const l = await c.from('landmarks').select('slug', { count: 'exact', head: true })
    const i = await c.from('interests').select('slug', { count: 'exact', head: true })
    expect([g.count, l.count, i.count]).toEqual([10, 283, 22])
  })

  it('keeps operational fields unknown and every landmark unverified', async () => {
    const { data } = await anonClient()
      .from('landmarks')
      .select('slug')
      .or('latitude.not.is.null,opening_hours.not.is.null,ticket_info.not.is.null,image_url.not.is.null,access_status.neq.unverified')
    expect(data).toEqual([])
  })

  it('cannot be modified by a signed-in user', async () => {
    const { data } = await alice.client.from('landmarks').update({ name_en: 'hacked' }).eq('slug', 'karnak').select()
    expect(data ?? []).toEqual([])
    const { error } = await alice.client.from('interests').insert({ slug: 'x', name_en: 'x', name_ar: 'x', sort_order: 99 })
    expect(error).not.toBeNull()
  })

  it('preserves parent-site relationships', async () => {
    const { data } = await anonClient().from('landmarks').select('parent_slug').eq('slug', 'tomb-of-tutankhamun').single()
    expect(data?.parent_slug).toBe('valley-of-the-kings')
  })
})

describe('accounts and roles', () => {
  it('new users always get the tourist role, even if metadata asks for admin', async () => {
    const { data } = await alice.client.from('profiles').select('role').eq('id', alice.userId).single()
    expect(data?.role).toBe('tourist')
  })

  it('a user cannot promote their own role', async () => {
    const { error } = await alice.client.from('profiles').update({ role: 'admin' }).eq('id', alice.userId)
    expect(error).not.toBeNull()
    const { data } = await alice.client.from('profiles').select('role').eq('id', alice.userId).single()
    expect(data?.role).toBe('tourist')
  })

  it("a user cannot read another user's profile", async () => {
    const { data } = await bob.client.from('profiles').select('id').eq('id', alice.userId)
    expect(data).toEqual([])
  })
})

describe('trip ownership (enforced by the database)', () => {
  it("another user cannot see, update or delete the trip or its selections", async () => {
    const read = await bob.client.from('trips').select('id').eq('id', aliceTrip)
    expect(read.data).toEqual([])
    const sel = await bob.client.from('trip_landmarks').select('landmark_slug').eq('trip_id', aliceTrip)
    expect(sel.data).toEqual([])

    const upd = await bob.client.from('trips').update({ travelers: 99 }).eq('id', aliceTrip).select()
    expect(upd.data ?? []).toEqual([])
    const del = await bob.client.from('trips').delete().eq('id', aliceTrip).select()
    expect(del.data ?? []).toEqual([])

    const { data: still } = await alice.client.from('trips').select('travelers').eq('id', aliceTrip).single()
    expect(still?.travelers).toBeNull()
  })

  it("another user cannot change the trip's selections via the RPC or direct inserts", async () => {
    const rpc = await bob.client.rpc('save_trip_selections', {
      p_trip_id: aliceTrip, p_destinations: ['luxor-city'], p_interests: [], p_landmarks: [],
    })
    expect(rpc.error).not.toBeNull()
    const ins = await bob.client.from('trip_destinations').insert({ trip_id: aliceTrip, destination_slug: 'luxor-city' })
    expect(ins.error).not.toBeNull()
  })

  it('a user cannot create a trip owned by someone else', async () => {
    const { error } = await bob.client.from('trips').insert({ owner_id: alice.userId })
    expect(error).not.toBeNull()
  })

  it('anonymous visitors see no trips', async () => {
    const { data } = await anonClient().from('trips').select('id')
    expect(data).toEqual([])
  })
})

describe('trip consistency (enforced by the database)', () => {
  it('rejects a landmark that is not in one of the trip destinations', async () => {
    const { error } = await alice.client
      .from('trip_landmarks')
      .insert({ trip_id: aliceTrip, destination_slug: 'cairo-city', landmark_slug: 'karnak' })
    expect(error).not.toBeNull()
  })

  it('removing a destination removes its landmarks and reports them', async () => {
    const { data: dropped, error } = await alice.client.rpc('save_trip_selections', {
      p_trip_id: aliceTrip, p_destinations: ['cairo-city'], p_interests: ['history'], p_landmarks: ['cairo-tower', 'great-sphinx'],
    })
    expect(error).toBeNull()
    expect(dropped).toEqual(['great-sphinx'])
    const { data } = await alice.client.from('trip_landmarks').select('landmark_slug').eq('trip_id', aliceTrip)
    expect(data?.map((r) => r.landmark_slug)).toEqual(['cairo-tower'])

    // Direct deletion of the destination row cascades too.
    await alice.client.from('trip_destinations').delete().eq('trip_id', aliceTrip).eq('destination_slug', 'cairo-city')
    const { data: after } = await alice.client.from('trip_landmarks').select('landmark_slug').eq('trip_id', aliceTrip)
    expect(after).toEqual([])
  })

  it('rejects invalid dates, travellers and budget', async () => {
    const bad = [
      { arrival_date: future(10), departure_date: future(5) },
      { travelers: 0 },
      { budget_amount: 0 },
      { budget_amount: -10 },
      { budget_currency: 'BTC' },
      { trip_type: 'day_trip', arrival_date: future(5), departure_date: future(6) },
      { budget_categories: ['flights', 'casino'] },
    ]
    for (const patch of bad) {
      const { error } = await alice.client.from('trips').update(patch).eq('id', aliceTrip)
      expect(error, JSON.stringify(patch)).not.toBeNull()
    }
  })

  it('a request can only be submitted when complete, with future arrival', async () => {
    const { data } = await alice.client.from('trips').insert({}).select('id').single()
    const id = data!.id
    const incomplete = await alice.client.from('trips').update({ status: 'submitted' }).eq('id', id)
    expect(incomplete.error).not.toBeNull()

    const fields = {
      arrival_date: future(10), departure_date: future(15), travelers: 2, trip_type: 'multi_day', companions: 'couple',
      budget_amount: 3000, budget_currency: 'EUR', budget_basis: 'group', budget_categories: ['accommodation'],
    }
    await alice.client.from('trips').update(fields).eq('id', id)
    const noDest = await alice.client.from('trips').update({ status: 'submitted' }).eq('id', id)
    expect(noDest.error?.message).toContain('destination_required')

    await alice.client.rpc('save_trip_selections', { p_trip_id: id, p_destinations: ['aswan-city'], p_interests: ['boat'], p_landmarks: ['philae'] })
    const past = await alice.client.from('trips').update({ status: 'submitted', arrival_date: '2020-01-01', departure_date: '2020-01-03' }).eq('id', id)
    expect(past.error?.message).toContain('arrival_date_in_past')

    const ok = await alice.client.from('trips').update({ status: 'submitted' }).eq('id', id).select('status, submitted_at').single()
    expect(ok.error).toBeNull()
    expect(ok.data?.status).toBe('submitted')
    expect(ok.data?.submitted_at).not.toBeNull()
  })
})
