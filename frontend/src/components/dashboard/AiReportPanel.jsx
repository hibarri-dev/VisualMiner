import React from 'react'
import { Bell, Sparkles, X } from 'lucide-react'
import Sparkline from './Sparkline'
import { useMineData } from '../../context/useMineData'

export default function AiReportPanel({ onOpenReportModal, isOpenDrawer, onCloseDrawer }) {
  const { mine } = useMineData()
  const { production } = mine
  const trendSign = production.weekTrendPercent > 0 ? 'Up' : 'Down'

  const panelContent = (
    <div className="h-full flex flex-col justify-between bg-[#16171d] text-slate-200 p-5 sm:p-6 select-none overflow-y-auto">
      <div className="space-y-6 sm:space-y-7">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-white font-sans">
              AI Report
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-slate-300 hover:text-white transition p-1">
              <Bell className="w-5 h-5 fill-slate-200 text-slate-200" />
            </button>
            {onCloseDrawer && (
              <button
                type="button"
                onClick={onCloseDrawer}
                className="xl:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#20232e] transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Extraction */}
        <div className="space-y-2">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            Extraction
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.extraction.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#ec4899]">
            <span>
              {trendSign} {Math.abs(production.weekTrendPercent)}% from last week
            </span>
            <Sparkline values={production.extractionHistory} color="#ec4899" height={22} />
          </div>
        </div>

        {/* 2. Throughput */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            Throughput
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.throughput.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#38bdf8]">
            <span>Down {Math.abs(production.crushingWeekTrendPercent)}% vs last week</span>
            <Sparkline values={production.crushingHistory} color="#38bdf8" height={22} />
          </div>
        </div>

        {/* 3. Shipments */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            Shipments
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.shipments.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#f97316]">
            <span>{production.shipmentMovementPercent}% Movement</span>
            <Sparkline values={production.shipmentHistory} color="#f97316" height={22} />
          </div>
        </div>
      </div>

      {/* Bottom AI Action */}
      <div className="pt-6 border-t border-[#232530] space-y-2 mt-4">
        <div className="text-[10px] text-slate-400 font-mono">
          {mine.site.code} · Shift {mine.site.currentShift} · Telemetry Live
        </div>
        <button
          onClick={() => {
            if (onOpenReportModal) onOpenReportModal()
            if (onCloseDrawer) onCloseDrawer()
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ingest Site Report (AI Model)</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Static Right Rail (>= 1280px / xl) */}
      <aside className="hidden xl:flex w-80 border-l border-[#1f2128] shrink-0">
        {panelContent}
      </aside>

      {/* 2. Responsive Mobile/Tablet Slide-Over Drawer (< 1280px / xl) */}
      {isOpenDrawer && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={onCloseDrawer}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          {/* Drawer Body */}
          <aside className="relative w-80 max-w-[85vw] h-full shadow-2xl border-l border-[#242735] z-50 animate-slideLeft">
            {panelContent}
          </aside>
        </div>
      )}
    </>
  )
}
