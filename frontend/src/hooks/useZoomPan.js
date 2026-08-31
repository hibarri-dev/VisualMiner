import { useCallback, useEffect, useRef, useState } from 'react'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * Pan / zoom for an SVG that keeps a fixed `viewBox`.
 *
 * Rather than rewriting the viewBox (which forces every child to rescale and makes
 * "keep this marker the same size on screen" impossible), this drives a single
 * `translate(x y) scale(k)` on one wrapper <g>. Children that must not grow with the
 * zoom counter-scale by `1 / k`, and strokes use `vectorEffect="non-scaling-stroke"`.
 *
 * Coordinates: `x`/`y` are in viewBox units, so screen input has to be mapped through
 * the `preserveAspectRatio="xMidYMid meet"` letterboxing before it means anything.
 */
export default function useZoomPan({ width, height, minScale = 1, maxScale = 16 }) {
  const svgRef = useRef(null)
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const [panning, setPanning] = useState(false)

  const viewRef = useRef(view)
  const pointers = useRef(new Map())
  const pinch = useRef(null)
  const dragged = useRef(false)
  const anim = useRef(0)

  const commit = useCallback(next => {
    viewRef.current = next
    setView(next)
  }, [])

  // At k = minScale the allowed translate range collapses to a point, so the map
  // sits exactly in frame and cannot be dragged off into empty space.
  const clampView = useCallback(
    (k, x, y) => {
      const kk = clamp(k, minScale, maxScale)
      return {
        k: kk,
        x: clamp(x, width - width * kk, 0),
        y: clamp(y, height - height * kk, 0)
      }
    },
    [width, height, minScale, maxScale]
  )

  /** Screen px -> viewBox units, undoing the `meet` fit and centring. */
  const toViewBox = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current
      if (!svg) return [0, 0]
      const r = svg.getBoundingClientRect()
      const s = Math.min(r.width / width, r.height / height) || 1
      return [
        (clientX - r.left - (r.width - width * s) / 2) / s,
        (clientY - r.top - (r.height - height * s) / 2) / s
      ]
    },
    [width, height]
  )

  const pxPerUnit = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return 1
    const r = svg.getBoundingClientRect()
    return Math.min(r.width / width, r.height / height) || 1
  }, [width, height])

  const stopAnim = useCallback(() => cancelAnimationFrame(anim.current), [])

  const animateTo = useCallback(
    (target, ms = 360) => {
      stopAnim()
      const from = viewRef.current
      const to = clampView(target.k, target.x, target.y)
      const t0 = performance.now()
      const step = now => {
        const p = Math.min(1, (now - t0) / ms)
        const e = 1 - Math.pow(1 - p, 3)
        commit(
          clampView(
            from.k + (to.k - from.k) * e,
            from.x + (to.x - from.x) * e,
            from.y + (to.y - from.y) * e
          )
        )
        if (p < 1) anim.current = requestAnimationFrame(step)
      }
      anim.current = requestAnimationFrame(step)
    },
    [clampView, commit, stopAnim]
  )

  /** Zoom by `factor`, holding the viewBox point (vx, vy) fixed under the cursor. */
  const zoomAt = useCallback(
    (factor, vx, vy) => {
      const { k, x, y } = viewRef.current
      const k2 = clamp(k * factor, minScale, maxScale)
      if (k2 === k) return
      commit(clampView(k2, vx - ((vx - x) / k) * k2, vy - ((vy - y) / k) * k2))
    },
    [clampView, commit, minScale, maxScale]
  )

  /** Zoom about the centre of the frame — what the +/- buttons and keys use. */
  const zoomBy = useCallback(
    (factor, ms = 220) => {
      const { k, x, y } = viewRef.current
      const cx = width / 2
      const cy = height / 2
      const k2 = clamp(k * factor, minScale, maxScale)
      animateTo({ k: k2, x: cx - ((cx - x) / k) * k2, y: cy - ((cy - y) / k) * k2 }, ms)
    },
    [animateTo, width, height, minScale, maxScale]
  )

  /** Centre a point given in viewBox units, at scale `k`. */
  const focusOn = useCallback(
    (wx, wy, k = 4.5) => {
      const kk = clamp(k, minScale, maxScale)
      animateTo({ k: kk, x: width / 2 - wx * kk, y: height / 2 - wy * kk })
    },
    [animateTo, width, height, minScale, maxScale]
  )

  const reset = useCallback(() => animateTo({ k: minScale, x: 0, y: 0 }), [animateTo, minScale])

  const panBy = useCallback(
    (dxUnits, dyUnits) => {
      const { k, x, y } = viewRef.current
      commit(clampView(k, x + dxUnits, y + dyUnits))
    },
    [clampView, commit]
  )

  // Wheel has to be a native non-passive listener: React routes onWheel through a
  // passive root listener, where preventDefault() is a no-op and the page scrolls.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined
    const onWheel = e => {
      e.preventDefault()
      stopAnim()
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1
      const [vx, vy] = toViewBox(e.clientX, e.clientY)
      zoomAt(Math.pow(1.0022, -e.deltaY * unit), vx, vy)
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [toViewBox, zoomAt, stopAnim])

  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const onPointerDown = useCallback(
    e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stopAnim()
      dragged.current = false
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY, moved: 0 })
      if (pointers.current.size === 1) setPanning(true)
      if (pointers.current.size === 2) pinch.current = null
      e.currentTarget.setPointerCapture?.(e.pointerId)
    },
    [stopAnim]
  )

  const onPointerMove = useCallback(
    e => {
      const prev = pointers.current.get(e.pointerId)
      if (!prev) return
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      // 4px of accumulated travel promotes the gesture from a click to a drag, so a
      // slightly shaky click on a marker still selects it instead of being swallowed.
      const moved = (prev.moved || 0) + Math.hypot(dx, dy)
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY, moved })
      if (moved > 4) dragged.current = true

      if (pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        if (pinch.current && pinch.current.dist > 0) {
          const [vx, vy] = toViewBox(mx, my)
          zoomAt(dist / pinch.current.dist, vx, vy)
          const s = pxPerUnit()
          panBy((mx - pinch.current.mx) / s, (my - pinch.current.my) / s)
        }
        pinch.current = { dist, mx, my }
        return
      }

      const s = pxPerUnit()
      panBy(dx / s, dy / s)
    },
    [panBy, pxPerUnit, toViewBox, zoomAt]
  )

  const endPointer = useCallback(e => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 0) setPanning(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }, [])

  /** True when the gesture that just ended was a drag, so click handlers can bail. */
  const wasDragged = useCallback(() => dragged.current, [])

  return {
    svgRef,
    view,
    panning,
    transform: `translate(${view.x} ${view.y}) scale(${view.k})`,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer
    },
    toViewBox,
    zoomAt,
    zoomBy,
    focusOn,
    reset,
    panBy,
    wasDragged,
    minScale,
    maxScale
  }
}
