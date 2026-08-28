import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Layers,
  Sparkles
} from 'lucide-react'
import { getNavigationItems } from '../../config/navigationConfig'
import { useMineData } from '../../context/useMineData'

export default function Sidebar({
  activeTab,
  onSelectTab,
  activeSubTab,
  onSelectSubTab,
  onOpenModal,
  isCollapsed
}) {
  const { stats } = useMineData()
  const navigationItems = getNavigationItems(stats)
  const [expandedMenus, setExpandedMenus] = useState({
    mines: false,
    processing: false,
    'site-reports': false
  })

  const toggleSubmenu = (id, e) => {
    e.stopPropagation()
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <aside className="w-56 bg-[#121316] border-r border-[#1e2027] flex flex-col justify-between select-none shrink-0 z-30">
      {/* Top Section / Brand Spacing */}
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {navigationItems.map(item => {
            const isActive = activeTab === item.id
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedMenus[item.id]

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Main Nav Item */}
                <div
                  onClick={() => {
                    onSelectTab(item.id)
                    if (hasChildren && !isExpanded) {
                      setExpandedMenus(prev => ({ ...prev, [item.id]: true }))
                    }
                  }}
                  className={`group relative flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#d1d5db] text-[#121316] font-semibold shadow-xs'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#1a1c22]'
                  }`}
                >
                  <span className="tracking-tight">{item.label}</span>

                  {/* Submenu chevron or indicator */}
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={e => toggleSubmenu(item.id, e)}
                      className={`p-0.5 rounded transition ${
                        isActive ? 'text-[#121316]' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenu Drawer */}
                {hasChildren && isExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-1 animate-fadeIn">
                    {item.quickAction && (
                      <button
                        onClick={() => onOpenModal && onOpenModal(item.quickAction.modalId)}
                        className="w-full mb-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/25 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{item.quickAction.label}</span>
                      </button>
                    )}

                    {item.children.map(subItem => {
                      const isSubActive = activeSubTab === subItem.id
                      return (
                        <div
                          key={subItem.id}
                          onClick={() => {
                            onSelectTab(item.id)
                            onSelectSubTab(subItem.id)
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition ${
                            isSubActive
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
                          }`}
                        >
                          <span className="truncate">{subItem.label}</span>
                          {subItem.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1e212b] text-slate-300 border border-slate-700/50">
                              {subItem.badge}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Subtle Bottom Status Indicator */}
      <div className="px-4 py-3 border-t border-[#1e2027] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Telemetry Live</span>
        </div>
        <span className="text-slate-400">{stats.feeds} APIs</span>
      </div>
    </aside>
  )
}
