import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'

export default function Scene3D({
  children,
  cameraPosition = [0, 5, 8],
  minDistance = 3,
  maxDistance = 14,
  sunPosition = [8, 1.6, 4],
  turbidity = 9,
  fogColor = '#3a2a1a',
  fogNear = 9,
  fogFar = 22
}) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: 42 }}
      gl={{ antialias: true }}
    >
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <Sky sunPosition={sunPosition} turbidity={turbidity} rayleigh={1.4} mieCoefficient={0.012} mieDirectionalG={0.85} />
      <ambientLight intensity={0.7} />
      <directionalLight position={sunPosition} intensity={1.3} color="#fff2d8" />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#7dd3fc" />
      <Suspense fallback={null}>{children}</Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={minDistance}
        maxDistance={maxDistance}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  )
}
