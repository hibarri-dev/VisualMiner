import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { LIDAR_BG } from '../../three/lidarPalette'

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
  variant = 'daylight',
  maxPolarAngle = Math.PI / 2.05,
  palette = 'pit',
  onPointerMissed
}) {
  // The LiDAR view is unlit by design — the point cloud and thermal shaders carry
  // their own colour, so scene lighting would only wash the false-colour ramp out.
  const lidar = variant === 'lidar'
  const geology = palette === 'geology'
  const bg = lidar ? LIDAR_BG : geology ? '#07090f' : '#1c1814'

  return (
    <div className="absolute inset-0" style={{ background: bg }}>
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: cameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={onPointerMissed}
        style={{ width: '100%', height: '100%', background: bg }}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[lidar ? LIDAR_BG : fogColor, fogNear, lidar ? fogFar * 1.6 : fogFar]} />
        {lidar ? (
          <ambientLight intensity={1} />
        ) : geology ? (
          <>
            <hemisphereLight args={['#c7d2fe', '#0b1220', 0.55]} />
            <ambientLight intensity={0.38} />
            <directionalLight position={sunPosition} intensity={1.15} color="#e0e7ff" />
            <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#67e8f9" />
          </>
        ) : (
          <>
            <hemisphereLight args={['#f3e6d2', '#3a3228', 0.72]} />
            <ambientLight intensity={0.42} />
            <directionalLight position={sunPosition} intensity={1.55} color="#fff4e5" />
            <directionalLight position={[-5, 3, -6]} intensity={0.28} color="#c4b8a8" />
          </>
        )}
        <Suspense fallback={null}>{children}</Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={maxPolarAngle}
          target={controlsTarget}
        />
      </Canvas>
    </div>
  )
}
