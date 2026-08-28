import React from 'react'
import {
  Bell,
  Sparkles,
  Signal,
  BarChart2
} from 'lucide-react'

export default function AiReportPanel({ onOpenReportModal }) {
  return (
    <aside className="w-80 bg-[#16171d] border-l border-[#1f2128] p-6 flex flex-col justify-between text-slate-200 shrink-0 select-none overflow-y-auto">
      {/* AI Report Content matching Screenshot 3 */}
      <div className="space-y-7">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-tight text-white font-sans">
            AI Report
          </h2>
          <button className="text-slate-300 hover:text-white transition p-1">
            <Bell className="w-5 h-5 fill-slate-200 text-slate-200" />
          </button>
        </div>

        {/* 1. Extraction */}
        <div className="space-y-2">
          <h3 className="text-[17px] font-semibold text-white tracking-tight">
            Extraction
          </h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            <div>170 tons per hour</div>
            <div>3400 tons per day predicted yield</div>
          </div>
          <div className="pt-1 flex items-center gap-2 text-[13px] font-medium text-[#ec4899]">
            <BarChart2 className="w-4 h-4 rotate-90" />
            <span>Up to 5% from last week</span>
          </div>
        </div>

        {/* 2. Throughput */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[17px] font-semibold text-white tracking-tight">
            Throughput
          </h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            <div>10 tons per hour crushing</div>
            <div>5 tons per hour screening</div>
            <div>Mechanical failure plant X17</div>
          </div>
          <div className="pt-1 flex items-center gap-2 text-[13px] font-medium text-[#38bdf8]">
            <BarChart2 className="w-4 h-4 rotate-90" />
            <span>Down by 5,100%</span>
          </div>
        </div>

        {/* 3. Shipments */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[17px] font-semibold text-white tracking-tight">
            Shipments
          </h3>
          <div className="text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            <div>17 Side Tippers in que</div>
            <div>Processing plant delays</div>
            <div>No crushed stockpiles loaded</div>
          </div>
          <div className="pt-1 flex items-center gap-2 text-[13px] font-medium text-[#f97316]">
            <BarChart2 className="w-4 h-4 rotate-90" />
            <span>0% Movement</span>
          </div>
        </div>
      </div>

      {/* Bottom AI Trigger Action */}
      <div className="pt-6 border-t border-[#232530] space-y-2">
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
