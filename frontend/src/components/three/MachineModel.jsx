import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'

const YELLOW = '#f0b429'
const YELLOW_DARK = '#c4841a'
const YELLOW_DEEP = '#9a6410'
const STEEL = '#2c313c'
const STEEL_LIGHT = '#5b6578'
const TIRE = '#12141a'
const RIM = '#8b939e'
const GLASS = '#7ec8e8'
const GLASS_DARK = '#1b3a4a'
const ORE = '#6b4423'
const CHASSIS = '#1a1d24'

function Wheel({ position, radius = 0.1, width = 0.07 }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, width, 16]} />
        <meshStandardMaterial color={TIRE} roughness={0.95} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.42, radius * 0.42, width + 0.012, 10]} />
        <meshStandardMaterial color={RIM} roughness={0.35} metalness={0.72} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.12, radius * 0.12, width + 0.02, 8]} />
        <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

function Track({ length = 0.52, width = 0.28, height = 0.11 }) {
  const y = height * 0.45
  return (
    <group>
      <mesh position={[0, height * 0.35, 0]} castShadow>
        <boxGeometry args={[length * 0.72, height * 0.45, width * 0.55]} />
        <meshStandardMaterial color={STEEL} roughness={0.7} metalness={0.25} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side} position={[0, y, (width / 2) * 0.78 * side]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[height * 0.42, length * 0.62, 4, 8]} />
            <meshStandardMaterial color={TIRE} roughness={0.96} />
          </mesh>
          {[-0.16, -0.05, 0.05, 0.16].map((z, i) => (
            <mesh key={i} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[height * 0.28, height * 0.28, 0.045, 10]} />
              <meshStandardMaterial color="#3f4550" roughness={0.55} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Cab({ position, size = [0.16, 0.16, 0.18], canopy = true }) {
  const [w, h, d] = size
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={YELLOW} roughness={0.42} metalness={0.18} />
      </mesh>
      <mesh position={[0, h * 0.12, d * 0.28]}>
        <boxGeometry args={[w * 0.78, h * 0.42, 0.02]} />
        <meshStandardMaterial color={GLASS} roughness={0.12} metalness={0.55} transparent opacity={0.78} />
      </mesh>
      <mesh position={[w * 0.48, h * 0.08, 0.01]}>
        <boxGeometry args={[0.012, h * 0.38, d * 0.55]} />
        <meshStandardMaterial color={GLASS_DARK} roughness={0.15} metalness={0.5} transparent opacity={0.7} />
      </mesh>
      {canopy && (
        <mesh position={[0, h * 0.55, 0.02]} castShadow>
          <boxGeometry args={[w * 1.12, 0.018, d * 1.2]} />
          <meshStandardMaterial color={YELLOW_DARK} roughness={0.5} metalness={0.2} />
        </mesh>
      )}
    </group>
  )
}

function Beacon({ position, color = '#ef4444', active }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const pulse = active ? 0.45 + Math.sin(clock.elapsedTime * 8) * 0.45 : 0.15
    ref.current.material.emissiveIntensity = pulse
  })
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.018, 0.018, 0.03, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  )
}

function HaulTruck({ payloadPercent = 0, dumping, moving, broken }) {
  const frontAxle = useRef()
  const rearAxle = useRef()
  const bed = useRef()
  const loadRef = useRef()
  const tilt = useRef(0)
  const loadH = 0.04 + (payloadPercent / 100) * 0.1

  useFrame((_, dt) => {
    const spin = moving ? dt * 6 : 0
    if (frontAxle.current) frontAxle.current.rotation.x += spin
    if (rearAxle.current) rearAxle.current.rotation.x += spin * 0.85
    const target = dumping ? 0.62 : 0
    tilt.current += (target - tilt.current) * Math.min(1, dt * 2.4)
    if (bed.current) bed.current.rotation.x = -tilt.current
    if (loadRef.current) loadRef.current.visible = payloadPercent > 8 && tilt.current < 0.32
  })

  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.72]} />
        <meshStandardMaterial color={CHASSIS} roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.18, 0.18]} castShadow>
        <boxGeometry args={[0.28, 0.1, 0.28]} />
        <meshStandardMaterial color={YELLOW_DARK} roughness={0.48} metalness={0.2} />
      </mesh>
      <Cab position={[-0.05, 0.34, 0.26]} size={[0.18, 0.2, 0.2]} />
      <mesh position={[0.12, 0.28, 0.22]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.22, 8]} />
        <meshStandardMaterial color={STEEL_LIGHT} roughness={0.35} metalness={0.65} />
      </mesh>
      <mesh position={[0.17, 0.22, 0.08]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.08]} />
        <meshStandardMaterial color={STEEL} roughness={0.5} />
      </mesh>
      <Beacon position={[-0.05, 0.48, 0.26]} color={broken ? '#ef4444' : '#facc15'} active={broken || dumping} />

      <group ref={bed} position={[0, 0.2, -0.28]}>
        <mesh position={[0, 0.14, 0.22]} castShadow>
          <boxGeometry args={[0.34, 0.04, 0.52]} />
          <meshStandardMaterial color={YELLOW} roughness={0.45} metalness={0.16} />
        </mesh>
        <mesh position={[0, 0.22, 0.46]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.2, 0.04]} />
          <meshStandardMaterial color={YELLOW_DEEP} roughness={0.5} metalness={0.15} />
        </mesh>
        {[-1, 1].map(side => (
          <mesh key={side} position={[(0.17) * side, 0.24, 0.2]} castShadow>
            <boxGeometry args={[0.03, 0.18, 0.5]} />
            <meshStandardMaterial color={YELLOW} roughness={0.46} metalness={0.16} />
          </mesh>
        ))}
        <mesh position={[0, 0.2, -0.05]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.03]} />
          <meshStandardMaterial color={YELLOW_DARK} roughness={0.5} />
        </mesh>
        {payloadPercent > 8 && (
          <mesh ref={loadRef} position={[0, 0.2 + loadH / 2, 0.18]}>
            <boxGeometry args={[0.28, loadH, 0.4]} />
            <meshStandardMaterial color={ORE} roughness={1} />
          </mesh>
        )}
      </group>

      {dumping && <Sparkles count={18} scale={[0.35, 0.22, 0.35]} size={2.4} speed={0.8} color="#c4a574" position={[0, 0.12, -0.48]} />}

      <group ref={frontAxle} position={[0, 0.1, 0.26]}>
        <Wheel position={[0.17, 0, 0]} radius={0.1} width={0.07} />
        <Wheel position={[-0.17, 0, 0]} radius={0.1} width={0.07} />
      </group>
      <group ref={rearAxle} position={[0, 0.12, -0.22]}>
        <Wheel position={[0.2, 0, 0]} radius={0.12} width={0.08} />
        <Wheel position={[0.12, 0, 0]} radius={0.12} width={0.07} />
        <Wheel position={[-0.12, 0, 0]} radius={0.12} width={0.07} />
        <Wheel position={[-0.2, 0, 0]} radius={0.12} width={0.08} />
      </group>
    </group>
  )
}

function Excavator({ status, oversized }) {
  const house = useRef()
  const boom = useRef()
  const stick = useRef()
  const bucket = useRef()
  const working = status === 'Digging' || status === 'Loading'

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!house.current) return
    if (working) {
      house.current.rotation.y = Math.sin(t * 0.55) * 0.55
      if (boom.current) boom.current.rotation.x = 0.42 + Math.sin(t * 1.15) * 0.2
      if (stick.current) stick.current.rotation.x = -0.8 + Math.sin(t * 1.15 + 0.6) * 0.3
      if (bucket.current) bucket.current.rotation.x = 0.5 + Math.sin(t * 1.15 + 1.1) * 0.4
    }
  })

  const s = oversized ? 1.22 : 1
  return (
    <group scale={s}>
      <Track length={0.5} width={0.3} height={0.12} />
      <group ref={house} position={[0, 0.24, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.16, 0.28]} />
          <meshStandardMaterial color={YELLOW} roughness={0.44} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.12, 0.1]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.14]} />
          <meshStandardMaterial color={YELLOW_DARK} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.14, 0.18]}>
          <boxGeometry args={[0.12, 0.08, 0.02]} />
          <meshStandardMaterial color={GLASS} roughness={0.12} metalness={0.5} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 0.1, -0.12]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.12]} />
          <meshStandardMaterial color={STEEL} roughness={0.55} />
        </mesh>
        <Beacon position={[0, 0.22, 0]} color="#facc15" active={working} />

        <group ref={boom} position={[0, 0.08, 0.12]} rotation={[0.42, 0, 0]}>
          <mesh position={[0, 0, 0.2]} castShadow>
            <boxGeometry args={[0.08, 0.07, 0.42]} />
            <meshStandardMaterial color={YELLOW_DARK} roughness={0.5} metalness={0.15} />
          </mesh>
          <group ref={stick} position={[0, 0, 0.4]} rotation={[-0.8, 0, 0]}>
            <mesh position={[0, 0, 0.16]} castShadow>
              <boxGeometry args={[0.06, 0.055, 0.34]} />
              <meshStandardMaterial color={YELLOW_DEEP} roughness={0.5} />
            </mesh>
            <group ref={bucket} position={[0, 0, 0.34]} rotation={[0.5, 0, 0]}>
              <mesh position={[0, -0.02, 0.07]} castShadow>
                <boxGeometry args={[0.14, 0.1, 0.14]} />
                <meshStandardMaterial color={STEEL} roughness={0.7} metalness={0.35} />
              </mesh>
              {[-0.05, 0, 0.05].map((x, i) => (
                <mesh key={i} position={[x, -0.05, 0.14]} rotation={[0.4, 0, 0]}>
                  <boxGeometry args={[0.02, 0.08, 0.04]} />
                  <meshStandardMaterial color="#111827" roughness={0.6} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function DrillRig({ status, moving }) {
  const mast = useRef()
  const bit = useRef()
  useFrame(({ clock }, dt) => {
    if (moving && mast.current) mast.current.rotation.y += dt * 0.4
    if (bit.current && status === 'Drilling') bit.current.rotation.y = clock.elapsedTime * 10
  })
  return (
    <group>
      <Track length={0.46} width={0.28} height={0.11} />
      <mesh position={[0, 0.22, -0.04]} castShadow>
        <boxGeometry args={[0.24, 0.16, 0.26]} />
        <meshStandardMaterial color={YELLOW} roughness={0.45} metalness={0.18} />
      </mesh>
      <Cab position={[0, 0.36, 0.02]} size={[0.16, 0.14, 0.16]} canopy={false} />
      <group ref={mast} position={[0.02, 0.22, 0.14]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.05, 0.84, 0.05]} />
          <meshStandardMaterial color="#d6dbe6" roughness={0.35} metalness={0.45} />
        </mesh>
        <mesh position={[0.04, 0.42, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.02]} />
          <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh ref={bit} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.025, 0.018, 0.16, 8]} />
          <meshStandardMaterial color={STEEL_LIGHT} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
      <Beacon position={[0, 0.48, -0.04]} color="#22c55e" active={status === 'Drilling'} />
    </group>
  )
}

function FrontLoader({ status, moving, payloadPercent = 0 }) {
  const axleA = useRef()
  const axleB = useRef()
  const arm = useRef()
  useFrame(({ clock }, dt) => {
    if (moving) {
      if (axleA.current) axleA.current.rotation.x += dt * 5
      if (axleB.current) axleB.current.rotation.x += dt * 5
    }
    if (arm.current) {
      const working = status === 'Loading' || status === 'Digging'
      arm.current.rotation.x = working ? -0.15 + Math.sin(clock.elapsedTime * 1.4) * 0.28 : -0.08
    }
  })
  return (
    <group>
      <group ref={axleA} position={[0, 0.12, 0.16]}>
        <Wheel position={[0.16, 0, 0]} radius={0.12} width={0.08} />
        <Wheel position={[-0.16, 0, 0]} radius={0.12} width={0.08} />
      </group>
      <group ref={axleB} position={[0, 0.12, -0.16]}>
        <Wheel position={[0.16, 0, 0]} radius={0.12} width={0.08} />
        <Wheel position={[-0.16, 0, 0]} radius={0.12} width={0.08} />
      </group>
      <mesh position={[0, 0.24, -0.06]} castShadow>
        <boxGeometry args={[0.28, 0.16, 0.32]} />
        <meshStandardMaterial color={YELLOW} roughness={0.44} metalness={0.18} />
      </mesh>
      <Cab position={[0, 0.4, -0.04]} size={[0.18, 0.16, 0.18]} />
      <group ref={arm} position={[0, 0.22, 0.12]}>
        <mesh position={[0, 0.02, 0.16]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.36]} />
          <meshStandardMaterial color={YELLOW_DARK} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0.36]} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.08]} />
          <meshStandardMaterial color={STEEL} roughness={0.65} metalness={0.3} />
        </mesh>
        {payloadPercent > 10 && (
          <mesh position={[0, 0.08, 0.34]}>
            <boxGeometry args={[0.22, 0.08, 0.06]} />
            <meshStandardMaterial color={ORE} roughness={1} />
          </mesh>
        )}
      </group>
    </group>
  )
}

function Dozer({ isGrader }) {
  if (isGrader) {
    return (
      <group>
        {[-0.28, 0.08, 0.32].map((z, i) => (
          <group key={i}>
            <Wheel position={[0.12, 0.09, z]} radius={0.09} width={0.06} />
            <Wheel position={[-0.12, 0.09, z]} radius={0.09} width={0.06} />
          </group>
        ))}
        <mesh position={[0, 0.18, 0.04]} castShadow>
          <boxGeometry args={[0.2, 0.08, 0.7]} />
          <meshStandardMaterial color={CHASSIS} roughness={0.7} />
        </mesh>
        <Cab position={[0, 0.34, 0.12]} size={[0.16, 0.16, 0.16]} />
        <mesh position={[0, 0.12, -0.02]} castShadow>
          <boxGeometry args={[0.42, 0.08, 0.04]} />
          <meshStandardMaterial color={STEEL} roughness={0.55} metalness={0.4} />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      <Track length={0.5} width={0.28} height={0.12} />
      <mesh position={[0, 0.24, -0.02]} castShadow>
        <boxGeometry args={[0.26, 0.16, 0.28]} />
        <meshStandardMaterial color={YELLOW} roughness={0.45} metalness={0.18} />
      </mesh>
      <Cab position={[0, 0.4, 0.02]} size={[0.16, 0.14, 0.16]} />
      <mesh position={[0, 0.14, 0.3]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.05]} />
        <meshStandardMaterial color={STEEL} roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.1, -0.3]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.04, 0.16]} />
        <meshStandardMaterial color={STEEL} roughness={0.6} />
      </mesh>
    </group>
  )
}

function TankTruck({ color, moving, spray }) {
  const frontAxle = useRef()
  const rearAxle = useRef()
  useFrame((_, dt) => {
    const spin = moving ? dt * 5.5 : 0
    if (frontAxle.current) frontAxle.current.rotation.x += spin
    if (rearAxle.current) rearAxle.current.rotation.x += spin
  })
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.26, 0.08, 0.7]} />
        <meshStandardMaterial color={CHASSIS} roughness={0.7} />
      </mesh>
      <Cab position={[0, 0.3, 0.26]} size={[0.18, 0.18, 0.18]} />
      <mesh position={[0, 0.28, -0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.46, 18]} />
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.42, -0.12]}>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshStandardMaterial color={STEEL} roughness={0.5} />
      </mesh>
      {spray && (
        <Sparkles count={14} scale={[0.5, 0.08, 0.2]} size={1.6} speed={1.2} color="#7dd3fc" position={[0, 0.06, -0.42]} />
      )}
      <group ref={frontAxle} position={[0, 0.1, 0.26]}>
        <Wheel position={[0.16, 0, 0]} radius={0.1} />
        <Wheel position={[-0.16, 0, 0]} radius={0.1} />
      </group>
      <group ref={rearAxle} position={[0, 0.1, -0.24]}>
        <Wheel position={[0.16, 0, 0]} radius={0.1} />
        <Wheel position={[-0.16, 0, 0]} radius={0.1} />
      </group>
    </group>
  )
}

const MOVING_STATUSES = new Set(['Hauling', 'Queued', 'Relocating', 'Pushing'])

export default function MachineModel({ type, status, payloadPercent = 0, selected }) {
  const dumping = status === 'Dumping'
  const moving = MOVING_STATUSES.has(status)
  const broken = status === 'Breakdown' || status === 'Maintenance'
  const scale = selected ? 1.28 : 1

  let body = <HaulTruck payloadPercent={payloadPercent} dumping={dumping} moving={moving} broken={broken} />
  if (type === 'excavator') body = <Excavator status={status} />
  else if (type === 'shovel') body = <Excavator status={status} oversized />
  else if (type === 'drill') body = <DrillRig status={status} moving={moving} />
  else if (type === 'front_loader') body = <FrontLoader status={status} moving={moving} payloadPercent={payloadPercent} />
  else if (type === 'dozer') body = <Dozer />
  else if (type === 'grader') body = <Dozer isGrader />
  else if (type === 'water_truck') body = <TankTruck color="#0ea5e9" moving={moving} spray />
  else if (type === 'fuel_truck') body = <TankTruck color="#dc2626" moving={moving} />

  return (
    <group scale={scale * 1.35}>
      {selected && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.46, 40]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      )}
      {broken && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.4, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
        </mesh>
      )}
      {body}
    </group>
  )
}
