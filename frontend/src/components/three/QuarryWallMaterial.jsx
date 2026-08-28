import { useLayoutEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace, DoubleSide } from 'three'
import { QUARRY_WALL } from '../../three/modelCatalog'

export function useQuarryWall(repeatX = 10, repeatY = 6) {
  const [map, bumpMap] = useTexture([QUARRY_WALL.diff, QUARRY_WALL.disp])

  useLayoutEffect(() => {
    ;[map, bumpMap].forEach(tex => {
      tex.wrapS = RepeatWrapping
      tex.wrapT = RepeatWrapping
      tex.repeat.set(repeatX, repeatY)
      tex.anisotropy = 8
      tex.needsUpdate = true
    })
    map.colorSpace = SRGBColorSpace
  }, [map, bumpMap, repeatX, repeatY])

  return { map, bumpMap }
}

export function QuarryWallMaterial({ repeatX = 10, repeatY = 6, color = '#c4b8a8' }) {
  const { map, bumpMap } = useQuarryWall(repeatX, repeatY)
  return (
    <meshStandardMaterial
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.55}
      color={color}
      roughness={0.94}
      metalness={0.03}
      side={DoubleSide}
    />
  )
}
