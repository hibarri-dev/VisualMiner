import React from 'react'

// Line-art vector icons matching the exact design mockup
export function PreparationIcon({ className = 'w-14 h-14' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Dynamite sticks bound together */}
      <rect x="14" y="24" width="12" height="32" rx="3" transform="rotate(-30 14 24)" />
      <rect x="23" y="16" width="12" height="32" rx="3" transform="rotate(-30 23 16)" />
      <rect x="31" y="22" width="12" height="32" rx="3" transform="rotate(-30 31 22)" />
      {/* Binding bands */}
      <line x1="20" y1="36" x2="44" y2="22" strokeWidth="2.8" />
      <line x1="28" y1="50" x2="52" y2="36" strokeWidth="2.8" />
      {/* Fuse & Spark */}
      <path d="M43 16 C 46 12, 49 10, 53 8" />
      <path d="M53 3 L53 13" strokeWidth="2.2" />
      <path d="M48 8 L58 8" strokeWidth="2.2" />
      <path d="M50 5 L56 11" strokeWidth="1.8" />
      <path d="M56 5 L50 11" strokeWidth="1.8" />
    </svg>
  )
}

export function ExtractionIcon({ className = 'w-14 h-14' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Ore Rocks inside cart */}
      <path d="M21 24 L25 15 L33 13 L38 19 L44 17 L47 24 Z" strokeWidth="2.2" />
      <path d="M27 19 L32 24 L36 18" strokeWidth="1.8" />
      {/* Mine Cart Hopper */}
      <polygon points="12,24 52,24 45,44 19,44" strokeWidth="2.6" />
      <line x1="10" y1="24" x2="54" y2="24" strokeWidth="3.2" />
      {/* Wheels & Axle Assembly */}
      <circle cx="23" cy="50" r="4.5" strokeWidth="2.4" />
      <circle cx="23" cy="50" r="1.8" fill="currentColor" />
      <circle cx="41" cy="50" r="4.5" strokeWidth="2.4" />
      <circle cx="41" cy="50" r="1.8" fill="currentColor" />
      <line x1="27.5" y1="50" x2="36.5" y2="50" strokeWidth="2.2" />
      <line x1="19" y1="44" x2="23" y2="46" strokeWidth="2.2" />
      <line x1="45" y1="44" x2="41" y2="46" strokeWidth="2.2" />
    </svg>
  )
}

export function ProcessingIcon({ className = 'w-14 h-14' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Pit slope terrain */}
      <path d="M6 54 L18 40 L26 48 L38 38 L58 54" strokeWidth="2.2" />
      {/* Headframe / Processing Plant Framework */}
      <polygon points="34,14 44,14 48,54 30,54" strokeWidth="2.4" />
      <line x1="34" y1="22" x2="44" y2="22" />
      <line x1="33" y1="32" x2="45" y2="32" />
      <line x1="32" y1="42" x2="46" y2="42" />
      {/* Structural cross bracing */}
      <line x1="34" y1="22" x2="45" y2="32" strokeWidth="1.6" />
      <line x1="44" y1="22" x2="33" y2="32" strokeWidth="1.6" />
      <line x1="33" y1="32" x2="46" y2="42" strokeWidth="1.6" />
      <line x1="45" y1="32" x2="32" y2="42" strokeWidth="1.6" />
      {/* Top Roof & Sheave */}
      <line x1="31" y1="14" x2="47" y2="14" strokeWidth="2.8" />
      <circle cx="39" cy="10" r="3" strokeWidth="2.2" />
      {/* Conveyor chute */}
      <line x1="48" y1="24" x2="54" y2="34" strokeWidth="2.2" />
      <rect x="50" y="34" width="8" height="12" strokeWidth="2.2" />
    </svg>
  )
}

export function HaulageIcon({ className = 'w-14 h-14' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Ore heap in dump body */}
      <path d="M14 25 C 19 19, 27 19, 36 23" strokeWidth="2.2" />
      {/* Dump Bed */}
      <path d="M10 25 L38 25 L35 42 L13 42 Z" strokeWidth="2.6" />
      <line x1="16" y1="25" x2="19" y2="42" strokeWidth="1.6" />
      <line x1="24" y1="25" x2="26" y2="42" strokeWidth="1.6" />
      <line x1="31" y1="25" x2="33" y2="42" strokeWidth="1.6" />
      {/* Truck Cabin & Grill */}
      <path d="M38 29 L48 29 L53 37 L53 44 L35 44" strokeWidth="2.6" />
      <rect x="42" y="32" width="7" height="6" rx="1" strokeWidth="2" />
      <line x1="38" y1="44" x2="55" y2="44" strokeWidth="2.8" />
      {/* Giant Off-Highway Tires */}
      <circle cx="20" cy="46" r="6" strokeWidth="2.6" />
      <circle cx="20" cy="46" r="2.5" fill="currentColor" />
      <circle cx="46" cy="46" r="6" strokeWidth="2.6" />
      <circle cx="46" cy="46" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function ShippingIcon({ className = 'w-14 h-14' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Wharf / Port Crane Structure */}
      <line x1="10" y1="28" x2="10" y2="48" strokeWidth="2.6" />
      <line x1="16" y1="28" x2="16" y2="48" strokeWidth="2.6" />
      <line x1="10" y1="36" x2="16" y2="36" strokeWidth="2" />
      <line x1="10" y1="44" x2="16" y2="44" strokeWidth="2" />
      {/* Jib Crane Boom */}
      <line x1="8" y1="28" x2="36" y2="22" strokeWidth="2.6" />
      <line x1="18" y1="18" x2="18" y2="28" strokeWidth="2.2" />
      <line x1="18" y1="18" x2="36" y2="22" strokeWidth="1.6" />
      <line x1="18" y1="18" x2="8" y2="28" strokeWidth="1.6" />
      <line x1="32" y1="23" x2="32" y2="32" strokeWidth="1.8" />
      {/* Bulk Cargo Ship */}
      <path d="M30 46 L34 40 L50 40 L54 44 L50 48 L32 48 Z" strokeWidth="2.4" />
      <path d="M42 36 L48 36 L48 40 L42 40 Z" strokeWidth="2" />
      {/* Water Waves */}
      <line x1="8" y1="52" x2="56" y2="52" strokeWidth="2.2" />
      <line x1="14" y1="56" x2="50" y2="56" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  )
}

export const STAGE_CARDS_DATA = [
  { id: 'preparation', label: 'Preparation', icon: PreparationIcon, metric: '+80%' },
  { id: 'extraction', label: 'Extraction', icon: ExtractionIcon, metric: '+40%' },
  { id: 'processing', label: 'Processing', icon: ProcessingIcon, metric: '-122%' },
  { id: 'haulage', label: 'Haulage', icon: HaulageIcon, metric: '-36%' },
  { id: 'shipping', label: 'Shipping', icon: ShippingIcon, metric: '-16%' }
]

export default function MiningStageCards({
  activeStage = 'extraction',
  onSelectStage,
  stageMetrics = {}
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-2">
      {STAGE_CARDS_DATA.map(stage => {
        const isActive = activeStage === stage.id
        const IconComponent = stage.icon
        const metricDisplay = stageMetrics[stage.id]?.metric || stage.metric

        return (
          <div
            key={stage.id}
            onClick={() => onSelectStage && onSelectStage(stage.id)}
            className={`relative rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer select-none min-h-[175px] sm:min-h-[195px] ${
              isActive
                ? 'bg-[#18191e] shadow-2xl'
                : 'bg-[#18191e] hover:bg-[#1f2027] border border-[#23252e] hover:border-[#2f3240] shadow-md'
            }`}
          >
            {/* Active Gradient Border Overlay (Neon Blue/Purple/Magenta matching screenshot) */}
            {isActive && (
              <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#ec4899] -z-10 shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
            )}

            {/* Stage Title */}
            <span className="text-sm sm:text-base font-normal tracking-wide text-white">
              {stage.label}
            </span>

            {/* Vector Line-Art Icon */}
            <div className="my-2 flex items-center justify-center text-white">
              <IconComponent className="w-14 h-14 sm:w-16 sm:h-16 stroke-white" />
            </div>

            {/* Metric Indicator */}
            <span className="text-sm sm:text-base font-semibold tracking-tight text-white">
              {metricDisplay}
            </span>
          </div>
        )
      })}
    </div>
  )
}
