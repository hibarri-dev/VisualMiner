import React from 'react'

const CAT_YELLOW = '#f5a623'
const CAT_YELLOW_DARK = '#c47f13'
const STEEL = '#2b2f3a'
const TIRE = '#15171c'
const GLASS = '#7dd3fc'

function Wheel({ position, radius = 0.09 }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, 0.08, 14]} />
      <meshStandardMaterial color={TIRE} roughness={0.9} />
    </mesh>
  )
}

function TrackBase({ length = 0.5, width = 0.22, height = 0.12 }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial color={STEEL} roughness={0.8} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={side} position={[0, height * 0.3, (width / 2) * side]} castShadow>
          <capsuleGeometry args={[height * 0.55, length * 0.75, 4, 8]} />
          <meshStandardMaterial color={TIRE} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

function HaulTruck({ payloadPercent = 0, dumping }) {
  const bedTilt = dumping ? Math.PI / 7 : 0
  const loadColor = payloadPercent > 5 ? '#8a5a2b' : '#4b5563'
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.5, 0.16, 0.24]} />
        <meshStandardMaterial color={CAT_YELLOW_DARK} roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[-0.17, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.18, 0.22]} />
        <meshStandardMaterial color={CAT_YELLOW} roughness={0.5} />
      </mesh>
      <mesh position={[-0.17, 0.34, 0]}>
        <boxGeometry args={[0.09, 0.08, 0.2]} />
        <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.4} />
      </mesh>
      <group position={[0.08, 0.24, 0]} rotation={[0, 0, -bedTilt]}>
        <mesh position={[0.06, 0.12, 0]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.26]} />
          <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} metalness={0.1} />
        </mesh>
        {payloadPercent > 5 && (
          <mesh position={[0.06, 0.2 + (payloadPercent / 100) * 0.02, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.22]} />
            <meshStandardMaterial color={loadColor} roughness={1} />
          </mesh>
        )}
      </group>
      {[
        [-0.16, 0.09, 0.14],
        [-0.16, 0.09, -0.14],
        [0.17, 0.09, 0.14],
        [0.17, 0.09, -0.14]
      ].map((p, i) => (
        <Wheel key={i} position={p} />
      ))}
    </group>
  )
}

function Excavator() {
  return (
    <group>
      <TrackBase length={0.44} width={0.22} height={0.1} />
      <group position={[0, 0.22, 0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.16, 0.24]} />
          <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} />
        </mesh>
        <mesh position={[0.02, 0.06, 0.09]}>
          <boxGeometry args={[0.12, 0.1, 0.08]} />
          <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.4} />
        </mesh>
        <group position={[0.13, 0.06, 0]} rotation={[0, 0, -0.55]}>
          <mesh position={[0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.26, 0.07, 0.07]} />
            <meshStandardMaterial color={CAT_YELLOW_DARK} roughness={0.6} />
          </mesh>
          <group position={[0.25, -0.02, 0]} rotation={[0, 0, 0.9]}>
            <mesh position={[0.09, 0, 0]} castShadow>
              <boxGeometry args={[0.18, 0.055, 0.06]} />
              <meshStandardMaterial color={CAT_YELLOW_DARK} roughness={0.6} />
            </mesh>
            <mesh position={[0.19, -0.03, 0]} rotation={[0, 0, -0.6]} castShadow>
              <boxGeometry args={[0.1, 0.08, 0.09]} />
              <meshStandardMaterial color={STEEL} roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

function DrillRig() {
  return (
    <group>
      <TrackBase length={0.4} width={0.24} height={0.1} />
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.22]} />
        <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} />
      </mesh>
      <mesh position={[0.02, 0.55, 0]} rotation={[0, 0, -0.08]} castShadow>
        <boxGeometry args={[0.06, 0.62, 0.06]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.02, 0.24, 0]}>
        <boxGeometry args={[0.07, 0.06, 0.07]} />
        <meshStandardMaterial color={STEEL} roughness={0.7} />
      </mesh>
    </group>
  )
}

function FrontLoader() {
  return (
    <group>
      <group>
        {[-0.14, 0.14].map(z =>
          [-0.15, 0.15].map(x => <Wheel key={`${x}-${z}`} position={[x, 0.11, z]} radius={0.1} />)
        )}
      </group>
      <mesh position={[-0.03, 0.22, 0]} castShadow>
        <boxGeometry args={[0.3, 0.18, 0.24]} />
        <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} />
      </mesh>
      <mesh position={[-0.03, 0.28, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.2]} />
        <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0.24, 0.16, 0]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.32, 0.05, 0.05]} />
        <meshStandardMaterial color={CAT_YELLOW_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.16, 0.26]} />
        <meshStandardMaterial color={STEEL} roughness={0.8} />
      </mesh>
    </group>
  )
}

function DozerOrGrader({ isGrader }) {
  return (
    <group>
      <TrackBase length={0.46} width={0.22} height={0.1} />
      <mesh position={[-0.02, 0.2, 0]} castShadow>
        <boxGeometry args={[0.24, 0.14, 0.2]} />
        <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} />
      </mesh>
      <mesh position={[0.24, isGrader ? 0.06 : 0.1, 0]} castShadow>
        <boxGeometry args={[0.04, isGrader ? 0.1 : 0.16, 0.28]} />
        <meshStandardMaterial color={STEEL} roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}

function TankTruck({ color }) {
  return (
    <group>
      <mesh position={[-0.17, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.18, 0.22]} />
        <meshStandardMaterial color={CAT_YELLOW} roughness={0.55} />
      </mesh>
      <mesh position={[0.1, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.4, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {[
        [-0.16, 0.09, 0.14],
        [-0.16, 0.09, -0.14],
        [0.17, 0.09, 0.14],
        [0.17, 0.09, -0.14]
      ].map((p, i) => (
        <Wheel key={i} position={p} />
      ))}
    </group>
  )
}

export default function MachineModel({ type, status, payloadPercent = 0, selected }) {
  const dumping = status === 'Dumping'
  const scale = selected ? 1.55 : 1

  let body = null
  if (type === 'excavator' || type === 'shovel') body = <Excavator />
  else if (type === 'drill') body = <DrillRig />
  else if (type === 'front_loader') body = <FrontLoader />
  else if (type === 'dozer') body = <DozerOrGrader />
  else if (type === 'grader') body = <DozerOrGrader isGrader />
  else if (type === 'water_truck') body = <TankTruck color="#0ea5e9" />
  else if (type === 'fuel_truck') body = <TankTruck color="#ef4444" />
  else body = <HaulTruck payloadPercent={payloadPercent} dumping={dumping} />

  return (
    <group scale={scale}>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}
      {body}
    </group>
  )
}
