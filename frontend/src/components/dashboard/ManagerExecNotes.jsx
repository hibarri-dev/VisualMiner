import React, { useState } from 'react'
import {
  MessageSquare,
  Send,
  UserCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Plus,
  Bell
} from 'lucide-react'
import { INITIAL_MANAGER_NOTES } from '../../data/logisticsData'

export default function ManagerExecNotes({
  currentRole = 'executive',
  onOpenReportModal,
  notificationBanner,
  onDismissNotification
}) {
  const [notes, setNotes] = useState(INITIAL_MANAGER_NOTES)
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handlePostNote = e => {
    e.preventDefault()
    if (!newNoteText.trim()) return

    const author = currentRole === 'mine_manager' ? 'Vasanth (Mine Manager)' : 'Oliver (Executive Oversight)'
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      role: currentRole,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: newNoteTitle.trim() || 'Operational Directive',
      content: newNoteText.trim(),
      flag: currentRole === 'mine_manager' ? 'action_required' : 'acknowledged'
    }

    setNotes([newNote, ...notes])
    setNewNoteText('')
    setNewNoteTitle('')
    setIsAddingNote(false)
  }

  return (
    <div className="rounded-2xl border border-[#232634] bg-[#14151b] p-4 sm:p-5 my-3 space-y-4">
      {/* Executive Notification Banner (when manager submits daily report) */}
      {notificationBanner && (
        <div className="p-3.5 bg-gradient-to-r from-indigo-950/60 via-purple-900/30 to-transparent border border-indigo-500/40 rounded-xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Bell className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs">
              <span className="font-bold text-white block text-sm">
                {notificationBanner.title}
              </span>
              <p className="text-indigo-200 mt-0.5">
                {notificationBanner.message}
              </p>
            </div>
          </div>
          {onDismissNotification && (
            <button
              onClick={onDismissNotification}
              className="text-indigo-300 hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#20232e] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Executive &amp; Mine Manager Tactical Directives
            </h4>
            <span className="text-[11px] text-slate-400">
              Synchronized operational communication channel for daily shift directives &amp; fraud escalation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Daily Production Report</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222530] hover:bg-[#2c303f] text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNote ? 'Cancel' : 'Add Note'}</span>
          </button>
        </div>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <form onSubmit={handlePostNote} className="p-3.5 rounded-xl bg-[#111217] border border-[#262837] space-y-2.5 text-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">
              Posting as: <span className="text-indigo-400">{currentRole === 'mine_manager' ? 'Vasanth (Mine Manager)' : 'Oliver (Executive)'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live Broadcast</span>
          </div>
          <input
            type="text"
            placeholder="Note Title / Directive Subject..."
            value={newNoteTitle}
            onChange={e => setNewNoteTitle(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#181a22] border border-[#2c303f] focus:border-indigo-500 focus:outline-none text-white text-xs"
          />
          <textarea
            rows={2}
            placeholder="Type tactical message or operational instructions..."
            value={newNoteText}
            onChange={e => setNewNoteText(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#181a22] border border-[#2c303f] focus:border-indigo-500 focus:outline-none text-white text-xs"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Post Directive</span>
            </button>
          </div>
        </form>
      )}

      {/* Notes Stream */}
      <div className="space-y-2.5">
        {notes.map(note => (
          <div
            key={note.id}
            className={`p-3.5 rounded-xl border transition ${
              note.role === 'mine_manager'
                ? 'bg-[#151720] border-indigo-900/40 hover:border-indigo-500/30'
                : 'bg-[#171620] border-pink-900/40 hover:border-pink-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{note.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    note.role === 'mine_manager'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  }`}
                >
                  {note.author}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{note.timestamp}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
