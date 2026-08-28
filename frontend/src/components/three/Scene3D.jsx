import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function Scene3D({
  children,
  cameraPosition = [0, 5, 8],
  minDistance = 3,
  maxDistance = 16,
  sunPosition = [6, 8, 4],
  fogColor = '#07090f',
  fogNear = 12,
  fogFar = 34,
  controlsTarget = [0, -0.85, 0],
  onPointerMissed
}) {
  return (
    <div className="absolute inset-0 bg-[#07090f]">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: cameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={onPointerMissed}
        style={{ width: '100%', height: '100%', background: '#07090f' }}
      >
        <color attach="background" args={['#07090f']} />
        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
        <hemisphereLight args={['#9ecbff', '#0b1020', 0.7]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={sunPosition} intensity={1.15} color="#dbeafe" />
        <directionalLight position={[-5, 3, -6]} intensity={0.45} color="#22d3ee" />
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
