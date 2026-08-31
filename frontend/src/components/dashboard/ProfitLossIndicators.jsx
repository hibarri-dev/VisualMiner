import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { STAGE_FINANCIAL_IMPACTS } from '../../data/logisticsData'

export default function ProfitLossIndicators({ activeStage = 'extraction' }) {
  const impacts = STAGE_FINANCIAL_IMPACTS[activeStage] || STAGE_FINANCIAL_IMPACTS.extraction
  const profitItems = impacts.filter(i => i.type === 'profit')
  const lossItems = impacts.filter(i => i.type === 'loss')

  return (
    <div className="rounded-2xl border border-[#232634] bg-[#14151b] p-4 sm:p-5 my-3 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#20232e] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white capitalize">
              {activeStage} Economic Impact Analysis
            </h4>
            <span className="text-[11px] text-slate-400">
              Categorized revenue generators vs bottleneck margin leaks for executive decision-making
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            {profitItems.length} Revenue Drivers
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/25">
            {lossItems.length} Margin Leaks
          </span>
        </div>
      </div>

      {/* Split Cards: Revenue Generators vs Bottlenecks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. Money-Making Areas (Green) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/20 via-[#161820] to-[#161820] border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Money-Making Drivers (High Margin)</span>
          </div>

          <div className="space-y-2">
            {profitItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#111217] border border-[#232634] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                    {item.note}
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-300 text-sm shrink-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Money-Losing Areas / Bottlenecks (Red) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-950/20 via-[#161820] to-[#161820] border border-rose-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            <span>Money-Losing Bottlenecks &amp; Downtime Costs</span>
          </div>

          <div className="space-y-2">
            {lossItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#111217] border border-[#232634] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-rose-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                    {item.note}
                  </p>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm shrink-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
