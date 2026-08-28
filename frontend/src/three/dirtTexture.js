import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

let dirt
let gravel

function paintNoise(ctx, size, count, alpha) {
  for (let i = 0; i < count; i += 1) {
    const n = Math.random()
    const r = 70 + n * 90
    const g = 48 + n * 55
    const b = 28 + n * 32
    ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2.5, 1 + Math.random() * 1.5)
  }
}

export function getDirtTexture() {
  if (dirt) return dirt
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#6e5340'
  ctx.fillRect(0, 0, size, size)
  paintNoise(ctx, size, 5000, 0.35)
  dirt = new CanvasTexture(canvas)
  dirt.wrapS = RepeatWrapping
  dirt.wrapT = RepeatWrapping
  dirt.repeat.set(14, 14)
  dirt.colorSpace = SRGBColorSpace
  dirt.anisotropy = 4
  return dirt
}

export function getGravelTexture() {
  if (gravel) return gravel
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#4a4540'
  ctx.fillRect(0, 0, size, size)
  paintNoise(ctx, size, 3500, 0.4)
  gravel = new CanvasTexture(canvas)
  gravel.wrapS = RepeatWrapping
  gravel.wrapT = RepeatWrapping
  gravel.repeat.set(8, 8)
  gravel.colorSpace = SRGBColorSpace
  return gravel
}
