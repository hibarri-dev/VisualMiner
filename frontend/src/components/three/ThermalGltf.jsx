import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const thermalMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: { uTime: { value: 0 } },
  vertexShader: `
    varying vec3 vN;
    varying vec3 vV;
    void main() {
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying vec3 vN;
    varying vec3 vV;
    uniform float uTime;
    void main() {
      float fresnel = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.35);
      vec3 core = vec3(1.0, 0.18, 0.04);
      vec3 mid = vec3(1.0, 0.48, 0.08);
      vec3 rim = vec3(0.2, 0.95, 1.0);
      vec3 col = mix(mix(core, mid, 0.55 + 0.15 * sin(uTime * 3.0)), rim, fresnel);
      gl_FragColor = vec4(col, 0.92);
    }
  `
})

export default function ThermalGltf({ url, size = 0.4, selected = false }) {
  const { scene } = useGLTF(url)
  const fitted = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse(obj => {
      if (obj.isMesh) {
        obj.material = thermalMat
        obj.castShadow = false
      }
    })
    const box = new THREE.Box3().setFromObject(clone)
    const dim = box.getSize(new THREE.Vector3())
    const max = Math.max(dim.x, dim.y, dim.z) || 1
    const scale = size / max
    return { clone, scale, y: -box.min.y * scale }
  }, [scene, size])

  useFrame(state => {
    thermalMat.uniforms.uTime.value = state.clock.elapsedTime
  })

  const scale = selected ? fitted.scale * 1.22 : fitted.scale

  return (
    <group position={[0, fitted.y, 0]}>
      <group scale={scale}>
        <primitive object={fitted.clone} />
      </group>
    </group>
  )
}
