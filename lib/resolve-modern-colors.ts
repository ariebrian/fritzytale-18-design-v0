/**
 * html-to-image (and html2canvas) can't parse modern CSS color functions —
 * and getComputedStyle() serializes our oklch()/color-mix() theme as
 * oklch()/lab() strings, never as plain rgb(), so there's no way to sidestep
 * it by reading "the resolved value" normally. The only reliable way to get
 * a concrete sRGB color out of an arbitrary CSS color string is to ask the
 * browser to actually paint it and read the pixel back.
 */
function cssColorToRgba(cssColor: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return cssColor

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#000'
  try {
    ctx.fillStyle = cssColor
  } catch {
    return cssColor
  }
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
}

const MODERN_COLOR_FN = /(oklch|oklab|lab|lch|color-mix)\(/

/** Replaces every oklch()/oklab()/lab()/lch()/color-mix() call in a CSS value with its resolved rgba(), handling nested parens (color-mix nests other color functions). */
function resolveColorFunctionsInValue(value: string): string {
  const names = ['color-mix', 'oklch', 'oklab', 'lch', 'lab']
  let result = ''
  let i = 0
  while (i < value.length) {
    const name = names.find((n) => value.startsWith(`${n}(`, i))
    if (!name) {
      result += value[i]
      i++
      continue
    }
    let depth = 1
    let j = i + name.length + 1
    while (j < value.length && depth > 0) {
      if (value[j] === '(') depth++
      else if (value[j] === ')') depth--
      j++
    }
    result += cssColorToRgba(value.slice(i, j))
    i = j
  }
  return result
}

const COLOR_PROPS = [
  'color',
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'box-shadow',
  'outline-color',
] as const

/**
 * Walks the subtree, inlines every color-bearing property that resolves to
 * oklch/oklab/lab/lch/color-mix as a plain rgba() equivalent, and returns a
 * function that restores the original inline styles. Meant to bracket a
 * single synchronous DOM-to-image capture — revert immediately after.
 */
export function inlineResolvedColors(root: HTMLElement): () => void {
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  const restores: Array<() => void> = []

  for (const el of elements) {
    const computed = getComputedStyle(el)
    for (const prop of COLOR_PROPS) {
      const value = computed.getPropertyValue(prop)
      if (!value || !MODERN_COLOR_FN.test(value)) continue

      const resolved = resolveColorFunctionsInValue(value)
      const previous = el.style.getPropertyValue(prop)
      el.style.setProperty(prop, resolved)
      restores.push(() => {
        if (previous) el.style.setProperty(prop, previous)
        else el.style.removeProperty(prop)
      })
    }
  }

  return () => restores.forEach((restore) => restore())
}
