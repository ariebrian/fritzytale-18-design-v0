export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'guest'
}

/** Slugifies `base` and, if already present in `taken`, appends -2, -3, etc. Mutates `taken`. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base)
  let candidate = root
  let n = 2
  while (taken.has(candidate)) {
    candidate = `${root}-${n}`
    n += 1
  }
  taken.add(candidate)
  return candidate
}
