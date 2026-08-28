import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  ChevronDown,
  Cpu,
  HardHat,
  MapPin,
  FileText,
  Check,
  ShieldCheck,
  CloudSun,
  Menu,
  Sparkles
} from 'lucide-react'
import { ROLES } from '../../config/navigationConfig'
import { useVisibleMine } from '../../context/useMineData'

export default function TopHeader({
  currentRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
  onToggleMobileSidebar,
  onToggleAiPanel
}) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef(null)
  const { searchIndex } = useVisibleMine(currentRole)

  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredSuggestions = searchQuery.trim()
    ? searchIndex.filter(
        s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(s.id).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchIndex.slice(0, 8)

  return (
    <header className="h-16 bg-[#121316] border-b border-[#1e2027] px-3 sm:px-6 flex items-center justify-between text-slate-200 z-20 gap-2 sm:gap-4">
      {/* Left: Hamburger (Mobile) + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-[#1a1c22] hover:bg-[#222530] text-slate-300 hover:text-white transition cursor-pointer shrink-0"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search..."
              className="w-full h-9 pl-3.5 pr-9 rounded-lg bg-[#1a1c22] border border-[#272a34] text-[13px] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition font-sans"
            />
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick Search Flyout */}
          {isSearchFocused && (
            <div className="absolute top-11 left-0 w-full sm:w-96 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Quick Telemetry Search</span>
                <span className="font-mono text-[9px] text-slate-400">ESC</span>
              </div>
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                {filteredSuggestions.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      if (onSelectSearchResult) onSelectSearchResult(item)
                      setIsSearchFocused(false)
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#222530] cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      {item.type === 'machine' && <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {item.type === 'worker' && <HardHat className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      {item.type === 'zone' && <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      {item.type === 'report' && <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      <div className="truncate">
                        <div className="font-medium text-slate-200 truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#252835] text-slate-300 font-mono shrink-0">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: AI Toggle (Tablet/Mobile) + Role + Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Responsive AI Report Drawer Button (Shown on screens < xl) */}
        <button
          type="button"
          onClick={onToggleAiPanel}
          className="xl:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Report</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* Permission Role Selector */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#181a22] hover:bg-[#20232d] border border-[#262835] text-xs text-slate-300 transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline font-medium text-slate-200 capitalize truncate max-w-[100px]">
              {currentRole.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Role Permissions
              </div>
              {ROLES.map(role => (
                <div
                  key={role.id}
                  onClick={() => {
                    onSelectRole(role.id)
                    setIsRoleDropdownOpen(false)
                  }}
                  className={`flex items-start justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition ${
                    currentRole === role.id
                      ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30'
                      : 'hover:bg-[#222530] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-100">{role.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{role.description}</div>
                  </div>
                  {currentRole === role.id && <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer hover:opacity-90 transition group"
          >
            <span className="hidden sm:inline text-slate-400 text-xs transition group-hover:text-slate-200">▾</span>
            <span className="hidden sm:inline text-[13px] font-medium text-slate-200 tracking-tight">Oliver</span>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="Oliver"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#2e3140] shadow-sm"
              />
            </div>
          </div>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#232635]">
                <div className="font-semibold text-white">Oliver Vance</div>
                <div className="text-[10px] text-slate-400">Chief Mining Engineer</div>
              </div>
              <div className="py-1 space-y-0.5">
                <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#222530] text-slate-300">
                  Settings & APIs
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#222530] text-rose-400">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
