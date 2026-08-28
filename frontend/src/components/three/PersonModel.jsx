import React from 'react'

const SUIT_BY_ROLE = {
  operators: '#f59e0b',
  geologists: '#0ea5e9',
  safety: '#ef4444',
  other: '#22c55e'
}

export default function PersonModel({ roleGroup, selected }) {
  const suit = SUIT_BY_ROLE[roleGroup] || SUIT_BY_ROLE.other
  const scale = selected ? 1.55 : 1

  return (
    <group scale={scale}>
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.14, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      )}
      <mesh position={[0, 0.05, 0.018]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.04]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, -0.018]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.04]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <capsuleGeometry args={[0.038, 0.09, 4, 8]} />
        <meshStandardMaterial color={suit} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.155, 0.012]}>
        <boxGeometry args={[0.07, 0.05, 0.02]} />
        <meshStandardMaterial color="#fde047" roughness={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.13, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.012, 0.07, 3, 6]} />
        <meshStandardMaterial color={suit} roughness={0.65} />
      </mesh>
      <mesh position={[0.05, 0.13, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.012, 0.07, 3, 6]} />
        <meshStandardMaterial color={suit} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.235, 0]} castShadow>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color="#e7c9a3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.268, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.042, 0.028, 12]} />
        <meshStandardMaterial color="#fde047" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.258, 0.03]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.06, 0.012, 0.03]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>
    </group>
  )
}
