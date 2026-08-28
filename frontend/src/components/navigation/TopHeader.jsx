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
  CloudSun
} from 'lucide-react'
import { ROLES } from '../../config/navigationConfig'
import { useVisibleMine } from '../../context/useMineData'

export default function TopHeader({
  currentRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  onSelectSearchResult
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
    <header className="h-16 bg-[#121316] border-b border-[#1e2027] px-6 flex items-center justify-between text-slate-200 z-20">
      {/* Search Bar matching screenshot */}
      <div className="relative w-full max-w-sm">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search"
            className="w-full h-9 pl-4 pr-10 rounded-lg bg-[#1a1c22] border border-[#272a34] text-[13px] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition font-sans"
          />
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Quick Search Flyout */}
        {isSearchFocused && (
          <div className="absolute top-11 left-0 w-full bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Telemetry Search</span>
              <span className="font-mono text-[9px] text-slate-400">ESC</span>
            </div>
            <div className="space-y-1 mt-1">
              {filteredSuggestions.map(item => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    if (onSelectSearchResult) onSelectSearchResult(item)
                    setIsSearchFocused(false)
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#222530] cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.type === 'machine' && <Cpu className="w-3.5 h-3.5 text-amber-400" />}
                    {item.type === 'worker' && <HardHat className="w-3.5 h-3.5 text-cyan-400" />}
                    {item.type === 'zone' && <MapPin className="w-3.5 h-3.5 text-rose-400" />}
                    {item.type === 'report' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                    <div>
                      <div className="font-medium text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#252835] text-slate-300 font-mono">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Role & User Profile */}
      <div className="flex items-center gap-5">
        {/* Permission Role Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181a22] hover:bg-[#20232d] border border-[#262835] text-xs text-slate-300 transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-200 capitalize">
              {currentRole.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50">
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

        {/* User Profile matching Screenshot layout: ▾ Oliver [Avatar] */}
        <div className="relative">
          <div
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition group"
          >
            <span className="text-slate-400 text-xs transition group-hover:text-slate-200">▾</span>
            <span className="text-[14px] font-medium text-slate-200 tracking-tight">Oliver</span>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="Oliver"
                className="w-8 h-8 rounded-full object-cover border border-[#2e3140] shadow-sm"
              />
            </div>
          </div>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
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
