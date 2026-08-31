import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Compass,
  Map,
  Mountain,
  Flame,
  Truck,
  Cpu,
  Users,
  Calendar,
  BarChart3,
  Boxes,
  Anchor,
  FileText,
  MessageSquare
} from 'lucide-react'
import { SITE_GROUPS, getNavigationItems } from '../../config/navigationConfig'
import { useVisibleMine } from '../../context/useMineData'

export default function Sidebar({
  activeTab,
  onSelectTab,
  activeSubTab,
  onSelectSubTab,
  onOpenModal,
  isOpenMobile,
  onCloseMobile,
  currentRole
}) {
  const { stats } = useVisibleMine(currentRole)
  const navigationItems = getNavigationItems(stats, currentRole)
  const [expandedMenus, setExpandedMenus] = useState({
    sites: false,
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

  const handleItemClick = item => {
    onSelectTab(item.id)
    if (item.children && item.children.length > 0 && !expandedMenus[item.id]) {
      setExpandedMenus(prev => ({ ...prev, [item.id]: true }))
    }
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  const handleSubItemClick = (parentId, subId) => {
    onSelectTab(parentId)
    onSelectSubTab(subId)
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#121316] text-slate-300 select-none">
      {/* Top Section */}
      <div className="flex-1 flex flex-col pt-4 sm:pt-6 pb-4 overflow-y-auto">
        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex items-center justify-between px-4 pb-3 mb-2 border-b border-[#1e2027]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              VM
            </div>
            <span className="font-bold text-white text-sm">VisualMiner</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1c22] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                  onClick={() => handleItemClick(item)}
                  className={`group relative flex items-center justify-between px-3.5 sm:px-4 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#d1d5db] text-[#121316] font-semibold shadow-xs'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#1a1c22]'
                  }`}
                >
                  <span className="tracking-tight truncate mr-1">{item.label}</span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && !isActive && (
                      <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#1e212b] text-slate-400 border border-slate-700/50">
                        {item.badge}
                      </span>
                    )}

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
                </div>

                {/* Submenu Drawer */}
                {hasChildren && isExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-1 animate-fadeIn">
                    {item.quickAction && (
                      <button
                        onClick={() => {
                          if (onOpenModal) onOpenModal(item.quickAction.modalId)
                          if (onCloseMobile) onCloseMobile()
                        }}
                        className="w-full mb-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/25 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{item.quickAction.label}</span>
                      </button>
                    )}

                    {item.children.map((subItem, i) => {
                      const isSubActive = activeSubTab === subItem.id
                      // Header whenever the group changes, so a mine still reads as a
                      // mine now that plants, ports and tools share the same list.
                      const prevGroup = i > 0 ? item.children[i - 1].group : null
                      const groupLabel =
                        subItem.group && subItem.group !== prevGroup
                          ? (SITE_GROUPS.find(g => g.id === subItem.group) || {}).label
                          : null
                      return (
                        <React.Fragment key={subItem.id}>
                        {groupLabel ? (
                          <div className="px-2.5 pt-2.5 pb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                            {groupLabel}
                          </div>
                        ) : null}
                        <div
                          onClick={() => handleSubItemClick(item.id, subItem.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition ${
                            isSubActive
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
                          }`}
                        >
                          <span className="truncate">{subItem.label}</span>
                          {subItem.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1e212b] text-slate-300 border border-slate-700/50 shrink-0 ml-1">
                              {subItem.badge}
                            </span>
                          )}
                        </div>
                        </React.Fragment>
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
        <span className="text-slate-400">10 APIs</span>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-[#1e2027] shrink-0 z-30 flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Mobile/Tablet Overlay Drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          {/* Drawer Panel */}
          <aside className="relative w-64 max-w-[80vw] h-full shadow-2xl border-r border-[#232635] z-50 animate-slideRight">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
