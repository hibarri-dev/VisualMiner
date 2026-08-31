import React, { useMemo, useState } from 'react'
import { Bell, Sparkles, X } from 'lucide-react'
import Sparkline from './Sparkline'
import { useMineData } from '../../context/useMineData'
import { explorationNarrative } from '../../data/explorationProject'
import { drillMeta } from '../../three/oreBody'
import { inboxRole } from '../../data/managerDesk'

export default function AiReportPanel({
  onOpenReportModal,
  isOpenDrawer,
  onCloseDrawer,
  activeTab,
  activeSubTab,
  currentRole = 'executive'
}) {
  const { mine, readInbox } = useMineData()
  const [inboxOpen, setInboxOpen] = useState(false)
  const { production } = mine
  const trendSign = production.weekTrendPercent > 0 ? 'Up' : 'Down'
  const geology = activeTab === 'sites' && activeSubTab === 'sitetool-orebody'
  const geo = geology ? explorationNarrative() : null
  const metresSeries = geology
    ? Object.values(drillMeta.metresByYear || { 2021: 0, 2022: 0, 2023: 0, 2024: 1 })
    : production.extractionHistory

  const peer = inboxRole(currentRole)
  const seesNotes = currentRole === 'executive' || currentRole === 'admin' || currentRole === 'mine_manager'
  const notifications = seesNotes
    ? (mine.notifications || []).filter(n => n.forRole === peer)
    : []
  const notesIn = seesNotes ? (mine.notes || []).filter(n => n.toRole === peer) : []
  const unreadCount =
    notifications.filter(n => n.unread).length + notesIn.filter(n => n.unread).length

  const inboxItems = useMemo(() => {
    const ntf = notifications.map(n => ({
      id: n.id,
      kind: 'report',
      unread: n.unread,
      title: n.title,
      detail: n.detail,
      at: n.at
    }))
    const nts = notesIn.map(n => ({
      id: n.id,
      kind: 'note',
      unread: n.unread,
      title: `${n.author} → ${n.toRole.replace('_', ' ')}`,
      detail: n.body,
      at: n.at
    }))
    return [...ntf, ...nts].sort((a, b) => Number(b.unread) - Number(a.unread))
  }, [notifications, notesIn])

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

          <div className="flex items-center gap-2 relative">
            {seesNotes && (
              <>
                <button
                  type="button"
                  onClick={() => setInboxOpen(open => !open)}
                  className="relative text-slate-300 hover:text-white transition p-1"
                  aria-label="Inbox"
                >
                  <Bell className="w-5 h-5 fill-slate-200 text-slate-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {inboxOpen && (
                  <div className="absolute right-0 top-8 z-20 w-72 rounded-xl border border-[#2a2e3c] bg-[#14151c] shadow-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {currentRole === 'mine_manager' ? 'Notes from executives' : 'Daily reports & notes'}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            readInbox(currentRole)
                            setInboxOpen(false)
                          }}
                          className="text-[10px] text-indigo-300 hover:text-indigo-200"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    {inboxItems.length === 0 && (
                      <p className="text-[11px] text-slate-500">Nothing in the dummy inbox yet.</p>
                    )}
                    {inboxItems.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        className={`rounded-lg border px-2.5 py-2 ${
                          item.unread ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-[#272b3b] bg-[#191b24]'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-200 leading-snug">{item.title}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                        <div className="text-[9px] font-mono text-slate-500 mt-1">
                          {item.kind} · {item.at}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {!seesNotes && (
              <button type="button" className="text-slate-300 hover:text-white transition p-1" aria-label="Alerts">
                <Bell className="w-5 h-5 fill-slate-200 text-slate-200" />
              </button>
            )}
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

        {!geology && activeTab === 'cycle' && (mine.cycleCapture?.insights || []).map(ins => (
          <div key={ins.id} className="space-y-1 pb-3 border-b border-[#232530]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ins.area}</div>
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight leading-snug">{ins.title}</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">{ins.detail}</p>
          </div>
        ))}

        {!geology && activeTab !== 'cycle' && (mine.insights || []).slice(0, 4).map(ins => (
          <div key={ins.id} className="space-y-1 pb-3 border-b border-[#232530]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ins.area}</div>
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight leading-snug">{ins.title}</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">{ins.detail}</p>
          </div>
        ))}

        {!geology && activeTab !== 'cycle' && (mine.alerts || []).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[13px] font-semibold text-white tracking-tight">Live alerts</h3>
            {(mine.alerts || []).map(al => (
              <div key={al.id} className="text-[12px] text-slate-400 leading-snug">
                <span className="font-mono text-[10px] text-amber-300 uppercase">{al.severity}</span>
                {' · '}
                <span className="text-slate-200">{al.title}</span>
                <div className="text-[11px] text-slate-500">{al.source}</div>
              </div>
            ))}
          </div>
        )}

        {!geology && activeTab !== 'cycle' && (
        <>
        {/* 1. Extraction / Project */}
        <div className="space-y-2">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            {geology ? 'Project' : 'Extraction'}
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {(geology ? geo.extraction : production.narrative.extraction).map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#ec4899]">
            <span>
              {geology
                ? `${drillMeta.holeCount} holes in the model`
                : `${trendSign} ${Math.abs(production.weekTrendPercent)}% from last week`}
            </span>
            <Sparkline values={geology ? metresSeries : production.extractionHistory} color="#ec4899" height={22} />
          </div>
        </div>

        {/* 2. Throughput / Drilling */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            {geology ? 'Drilling' : 'Throughput'}
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {(geology ? geo.throughput : production.narrative.throughput).map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#38bdf8]">
            <span>
              {geology
                ? `${Math.round(drillMeta.metresDrilled).toLocaleString()} m published`
                : `Down ${Math.abs(production.crushingWeekTrendPercent)}% vs last week`}
            </span>
            <Sparkline values={geology ? metresSeries : production.crushingHistory} color="#38bdf8" height={22} />
          </div>
        </div>

        {/* 3. Shipments / Seismic */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-white tracking-tight">
            {geology ? 'Seismic & assays' : 'Shipments'}
          </h3>
          <div className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-normal space-y-0.5">
            {(geology ? geo.shipments : production.narrative.shipments).map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
          {!geology && (
            <div className="pt-1 flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium text-[#f97316]">
              <span>{production.shipmentMovementPercent}% Movement</span>
              <Sparkline values={production.shipmentHistory} color="#f97316" height={22} />
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Bottom AI Action */}
      <div className="pt-6 border-t border-[#232530] space-y-2 mt-4">
        <div className="text-[10px] text-slate-400 font-mono">
          {geology
            ? `${drillMeta.project?.code || 'NFGC-QW'} · NI 43-101 · Public filings`
            : activeTab === 'cycle'
              ? 'Cycle capture · density · collars · blast · diesel · fraud'
              : `${mine.site.code} · Shift ${mine.site.currentShift} · Telemetry Live`}
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
