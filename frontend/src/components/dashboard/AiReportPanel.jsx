import React from 'react'
import { Bell, Sparkles } from 'lucide-react'
import Sparkline from './Sparkline'
import { useMineData } from '../../context/useMineData'

export default function AiReportPanel({ onOpenReportModal }) {
  const { mine } = useMineData()
  const { production } = mine
  const trendSign = production.weekTrendPercent > 0 ? 'Up' : 'Down'

  return (
    <aside className="w-80 bg-[#16171d] border-l border-[#1f2128] p-6 flex flex-col justify-between text-slate-200 shrink-0 select-none overflow-y-auto">
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-tight text-white font-sans">AI Report</h2>
          <button className="text-slate-300 hover:text-white transition p-1">
            <Bell className="w-5 h-5 fill-slate-200 text-slate-200" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Daily yield bot — stage-aware. Pit can be fine while plant, lab, or gate destroy the sale.
        </p>

        {(mine.insights || []).slice(0, 4).map(ins => (
          <div key={ins.id} className="space-y-1 pb-3 border-b border-[#232530]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ins.area}</div>
            <h3 className="text-[15px] font-semibold text-white tracking-tight leading-snug">{ins.title}</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">{ins.detail}</p>
          </div>
        ))}

        <div className="space-y-2 pt-1">
          <h3 className="text-[15px] font-semibold text-white tracking-tight">Live pulse</h3>
          <h3 className="text-[17px] font-semibold text-white tracking-tight">Extraction</h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.extraction.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[13px] font-medium text-[#ec4899]">
            <span>
              {trendSign} {Math.abs(production.weekTrendPercent)}% from last week
            </span>
            <Sparkline values={production.extractionHistory} color="#ec4899" height={22} />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h3 className="text-[17px] font-semibold text-white tracking-tight">Throughput</h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.throughput.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[13px] font-medium text-[#38bdf8]">
            <span>Down {Math.abs(production.crushingWeekTrendPercent)}% vs last week</span>
            <Sparkline values={production.crushingHistory} color="#38bdf8" height={22} />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h3 className="text-[17px] font-semibold text-white tracking-tight">Shipments</h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {production.narrative.shipments.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[13px] font-medium text-[#f97316]">
            <span>{production.shipmentMovementPercent}% Movement</span>
            <Sparkline values={production.shipmentHistory} color="#f97316" height={22} />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#232530] space-y-2">
        <div className="text-[10px] text-slate-500 font-mono">
          {mine.site.code} · Shift {mine.site.currentShift} · dummy telemetry
        </div>
        <button
          onClick={onOpenReportModal}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ingest Site Report (AI Model)</span>
        </button>
      </div>
    </aside>
  )
}
