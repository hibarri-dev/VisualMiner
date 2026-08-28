import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function Scene3D({
  children,
  cameraPosition = [0, 5, 8],
  minDistance = 3,
  maxDistance = 16,
  sunPosition = [6, 8, 4],
  fogColor = '#2a241c',
  fogNear = 12,
  fogFar = 34,
  controlsTarget = [0, -0.85, 0],
  onPointerMissed
}) {
  return (
    <div className="absolute inset-0 bg-[#1c1814]">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: cameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={onPointerMissed}
        style={{ width: '100%', height: '100%', background: '#1c1814' }}
      >
        <color attach="background" args={['#1c1814']} />
        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
        <hemisphereLight args={['#f3e6d2', '#3a3228', 0.72]} />
        <ambientLight intensity={0.42} />
        <directionalLight position={sunPosition} intensity={1.55} color="#fff4e5" />
        <directionalLight position={[-5, 3, -6]} intensity={0.28} color="#c4b8a8" />
        <Suspense fallback={null}>{children}</Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={Math.PI / 2.05}
          target={controlsTarget}
        />
      </Canvas>
    </div>
  )
}
