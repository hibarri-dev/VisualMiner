import React from 'react'
import {
  Truck,
  HardHat,
  Sparkles,
  Maximize2
} from 'lucide-react'

export default function DefaultSlotView({ activeTab, activeSubTab, onOpenModal }) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto bg-[#0d0e12]">
      {/* 1. 3D Open Pit Model Viewport (Matching Screenshot 3 Top Section) */}
      <div className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden bg-[#16171d] border border-[#232634] shadow-xl select-none group">
        {/* Synthetic Open Pit Elevation Heatmap & 3D Terrain */}
        <div className="absolute inset-0">
          <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 900 450">
            <defs>
              <radialGradient id="pitDepression" cx="52%" cy="48%" r="48%">
                <stop offset="0%" stopColor="#040b3c" />
                <stop offset="18%" stopColor="#03309a" />
                <stop offset="35%" stopColor="#0284c7" />
                <stop offset="48%" stopColor="#059669" />
                <stop offset="62%" stopColor="#eab308" />
                <stop offset="78%" stopColor="#ea580c" />
                <stop offset="92%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>
              <linearGradient id="rockTexture" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Surrounding Terrain Crust */}
            <rect width="900" height="450" fill="url(#rockTexture)" />

            {/* Elliptical Terraced Pit Benches */}
            <ellipse cx="468" cy="216" rx="420" ry="195" fill="url(#pitDepression)" />
            
            {/* Terraced Contour Step Lines */}
            <ellipse cx="468" cy="216" rx="370" ry="170" fill="none" stroke="#ea580c" strokeWidth="2.5" opacity="0.85" />
            <ellipse cx="468" cy="216" rx="310" ry="142" fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.9" />
            <ellipse cx="468" cy="216" rx="250" ry="114" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.9" />
            <ellipse cx="468" cy="216" rx="190" ry="86" fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.95" />
            <ellipse cx="468" cy="216" rx="130" ry="58" fill="none" stroke="#3b82f6" strokeWidth="2.5" opacity="0.95" />
            <ellipse cx="468" cy="216" rx="70" ry="32" fill="#020826" stroke="#1e40af" strokeWidth="2" opacity="1" />

            {/* Spiral Haul Roads */}
            <path d="M 120 120 Q 300 240 470 216 T 820 310" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 6" opacity="0.85" />
          </svg>
        </div>

        {/* Floating Haul Truck 1 (Upper Left Bench) */}
        <div className="absolute left-[31%] top-[24%] flex items-center">
          <div className="w-8 h-6 rounded bg-[#f59e0b] border-2 border-[#fbbf24] shadow-md flex items-center justify-center">
            <Truck className="w-4 h-4 text-[#78350f] fill-[#fde68a]" />
          </div>
        </div>

        {/* Floating Haul Truck 2 (Lower Left Edge) */}
        <div className="absolute left-[19%] bottom-[20%] flex items-center">
          <div className="w-14 h-10 rounded-md bg-[#f59e0b] border-2 border-[#fbbf24] shadow-xl flex items-center justify-center">
            <Truck className="w-7 h-7 text-[#78350f] fill-[#fde68a]" />
          </div>
        </div>

        {/* Floating Haul Truck 3 with Exact HUD Card matching Screenshot 3 */}
        <div className="absolute right-[28%] bottom-[14%] flex flex-col items-center z-10">
          {/* White HUD Marker Card */}
          <div className="mb-2 w-48 p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-white/80 font-sans pointer-events-auto select-text">
            <div className="font-bold text-[14px] text-slate-900 tracking-tight">
              X7UIH53
            </div>
            <div className="mt-1 space-y-0.5 text-[12px] text-slate-600 font-medium">
              <div>Fuel Tank: 87%</div>
              <div>Payload: 6700kg</div>
              <div>Dumping</div>
            </div>
          </div>

          {/* Connected Pointer Line */}
          <div className="w-[1.5px] h-7 bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white/50"></div>

          {/* Yellow Dump Truck Icon */}
          <div className="mt-1 w-14 h-10 rounded-md bg-[#f59e0b] border-2 border-[#fbbf24] shadow-2xl flex items-center justify-center">
            <Truck className="w-7 h-7 text-[#78350f] fill-[#fde68a]" />
          </div>
        </div>
      </div>

      {/* 2. 3D Worker Topography Viewport (Matching Screenshot 3 Bottom Section) */}
      <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#16171d] border border-[#232634] shadow-xl select-none group">
        {/* Synthetic Thermal Ridge Wireframe Landscape */}
        <div className="absolute inset-0">
          <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 900 380">
            <defs>
              <linearGradient id="elevationGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="65%" stopColor="#06b6d4" />
                <stop offset="85%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Mountain Ridge Layers */}
            <path d="M 0 380 L 0 220 Q 200 90 450 180 T 900 120 L 900 380 Z" fill="url(#elevationGrad)" opacity="0.3" />
            <path d="M 0 280 Q 220 140 450 220 T 900 160" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 0 240 Q 240 100 480 180 T 900 110" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 0 200 Q 260 70 510 140 T 900 70" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 0 160 Q 280 40 540 100 T 900 30" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />

            {/* Terrain Contours Point Mesh */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1={i * 50}
                y1="380"
                x2={i * 50 + 20}
                y2={120 + Math.sin(i) * 60}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        {/* Worker 1 with Exact HUD Card matching Screenshot 3 */}
        <div className="absolute left-[26%] top-[12%] flex flex-col items-center z-10">
          {/* Dark Charcoal HUD Marker Card */}
          <div className="mb-2 w-52 p-3.5 rounded-2xl bg-[#282b36] text-slate-200 shadow-2xl border border-[#3b4050] font-sans pointer-events-auto select-text">
            <div className="font-bold text-[14px] text-white tracking-tight">
              Arvind Chopra
            </div>
            <div className="mt-1 space-y-0.5 text-[12px] text-slate-300 font-medium">
              <div>31, Machine Operator</div>
              <div>Clearance Level 2</div>
              <div>Machine XYTH67</div>
            </div>
          </div>

          {/* Connected Pointer Line */}
          <div className="w-[1.5px] h-7 bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white/50"></div>

          {/* Thermal Worker Silhouette */}
          <div className="mt-1 relative flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-amber-400 border border-red-500 shadow-lg shadow-amber-400/80"></div>
            <div className="w-6 h-9 rounded-t-lg bg-gradient-to-b from-amber-400 via-cyan-400 to-blue-600 border border-cyan-300 shadow-xl"></div>
          </div>
        </div>

        {/* Additional Thermal Worker Silhouettes in background */}
        <div className="absolute left-[43%] bottom-[30%] flex flex-col items-center opacity-85">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-4 h-7 rounded-t-lg bg-gradient-to-b from-amber-400 to-blue-500"></div>
        </div>

        <div className="absolute right-[36%] bottom-[25%] flex flex-col items-center opacity-90">
          <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
          <div className="w-5 h-8 rounded-t-lg bg-gradient-to-b from-red-400 via-amber-400 to-cyan-500"></div>
        </div>

        <div className="absolute right-[25%] bottom-[15%] flex flex-col items-center opacity-95">
          <div className="w-4 h-4 rounded-full bg-amber-400"></div>
          <div className="w-6 h-9 rounded-t-lg bg-gradient-to-b from-amber-400 via-cyan-400 to-blue-600"></div>
        </div>
      </div>
    </div>
  )
}
