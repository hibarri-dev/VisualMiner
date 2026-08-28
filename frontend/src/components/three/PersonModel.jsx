import React from 'react'

const SUIT_BY_ROLE = {
  operators: '#f59e0b',
  geologists: '#0ea5e9',
  safety: '#ef4444',
  other: '#22c55e'
}

export default function PersonModel({ roleGroup, selected }) {
  const suit = SUIT_BY_ROLE[roleGroup] || SUIT_BY_ROLE.other
  const scale = selected ? 1.5 : 1

  return (
    <group scale={scale}>
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.12, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      )}
      <mesh position={[0, 0.13, 0]} castShadow>
        <capsuleGeometry args={[0.045, 0.14, 4, 8]} />
        <meshStandardMaterial color={suit} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#e7c9a3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.05, 0.03, 12]} />
        <meshStandardMaterial color="#fde047" roughness={0.5} />
      </mesh>
    </group>
  )
}
