import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { STAGE_FINANCIAL_IMPACTS } from '../../data/logisticsData'
import { formatUsdShift } from '../../data/stagePnl'

export default function ProfitLossIndicators({ activeStage = 'extraction', pnl }) {
  const impacts = STAGE_FINANCIAL_IMPACTS[activeStage] || STAGE_FINANCIAL_IMPACTS.extraction
  const profitItems = impacts.filter(i => i.type === 'profit')
  const lossItems = impacts.filter(i => i.type === 'loss')
  const stage = pnl?.stages?.[activeStage]
  const making = stage?.verdict !== 'losing'

  return (
    <div className="rounded-2xl border border-[#232634] bg-[#14151b] p-4 sm:p-5 my-3 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#20232e] pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              making
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white capitalize">
              {activeStage} — {stage ? (making ? 'making money' : 'losing money') : 'economic impact'}
            </h4>
            <span className="text-[11px] text-slate-400">
              Dummy P&amp;L this period. Same unit on every stage so you can pick where to act.
            </span>
          </div>
        </div>

        {stage ? (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              In {formatUsdShift(stage.revenue)}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/25">
              Out {formatUsdShift(-stage.cost)}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border font-bold ${
                making
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/25'
              }`}
            >
              Net {stage.metric}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {profitItems.length} Revenue Drivers
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/25">
              {lossItems.length} Margin Leaks
            </span>
          </div>
        )}
      </div>

      {stage?.decision && (
        <p
          className={`text-xs sm:text-sm leading-relaxed rounded-xl px-3.5 py-2.5 border ${
            making
              ? 'text-emerald-100 bg-emerald-500/10 border-emerald-500/20'
              : 'text-rose-100 bg-rose-500/10 border-rose-500/20'
          }`}
        >
          {stage.decision}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/20 via-[#161820] to-[#161820] border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Money-making</span>
          </div>
          <div className="space-y-2">
            {profitItems.map(item => (
              <div
                key={item.label}
                className="p-2.5 rounded-lg bg-[#111217] border border-[#232634] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">{item.note}</p>
                </div>
                <span className="font-mono font-bold text-emerald-300 text-sm shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-950/20 via-[#161820] to-[#161820] border border-rose-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            <span>Money-losing</span>
          </div>
          <div className="space-y-2">
            {lossItems.map(item => (
              <div
                key={item.label}
                className="p-2.5 rounded-lg bg-[#111217] border border-[#232634] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-rose-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">{item.note}</p>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
