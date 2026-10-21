// Turns the nested reference data into flat rows (shared by the seed builder, the app's offline
// fallback and the tests).

/** @param {any[]} governorates */
export function flattenReferenceData(governorates) {
  const out = { governorates: [], destinations: [], landmarks: [] };
  let destOrder = 0;
  let lmOrder = 0;
  governorates.forEach((g, gi) => {
    out.governorates.push({
      slug: g.slug, name_ar: g.name_ar, name_en: g.name_en, note_ar: g.note_ar ?? null,
      discussion_order: gi + 1, sources: g.sources,
    });
    for (const d of g.destinations) {
      out.destinations.push({
        slug: d.slug, governorate_slug: g.slug, name_ar: d.name_ar, name_en: d.name_en, sort_order: ++destOrder,
      });
      for (const s of d.sections) {
        for (const [slug, name_ar, name_en, type, parent, flags] of s.items) {
          out.landmarks.push({
            slug, destination_slug: d.slug, section_ar: s.name_ar, section_en: s.name_en,
            name_ar, name_en, type, parent_slug: parent ?? null, flags: flags ?? [], sort_order: ++lmOrder,
          });
        }
      }
    }
  });
  return out;
}

const TYPES = new Set(['ancient_site', 'historic_site', 'museum', 'religious', 'reserve', 'nature', 'beach', 'diving', 'heritage_area', 'modern', 'destination_area']);
const FLAGS = new Set(['special_access', 'viewed_only', 'not_single_site']);

/** Returns a list of problems; empty means valid. */
export function validateReferenceData(data, interests) {
  const problems = [];
  if (data.governorates.length !== 10) problems.push(`expected 10 governorates, got ${data.governorates.length}`);
  if (interests.length !== 22) problems.push(`expected 22 interests, got ${interests.length}`);
  const seen = new Map();
  for (const l of data.landmarks) {
    if (seen.has(l.slug)) problems.push(`duplicate landmark slug ${l.slug}`);
    seen.set(l.slug, l);
    if (!TYPES.has(l.type)) problems.push(`${l.slug}: unknown type ${l.type}`);
    for (const f of l.flags) if (!FLAGS.has(f)) problems.push(`${l.slug}: unknown flag ${f}`);
  }
  for (const l of data.landmarks) {
    if (!l.parent_slug) continue;
    const p = seen.get(l.parent_slug);
    if (!p) problems.push(`${l.slug}: parent ${l.parent_slug} missing`);
    else if (p.destination_slug !== l.destination_slug) problems.push(`${l.slug}: parent in another destination`);
    else if (p.parent_slug) problems.push(`${l.slug}: nested parent chains are not supported`);
  }
  const destSlugs = new Set();
  for (const d of data.destinations) {
    if (destSlugs.has(d.slug)) problems.push(`duplicate destination ${d.slug}`);
    destSlugs.add(d.slug);
  }
  return problems;
}
