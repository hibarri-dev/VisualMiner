import React, { useMemo, useState } from 'react'
import { FileCheck, MessageSquare, Send } from 'lucide-react'
import { useVisibleMine } from '../../context/useMineData'
import { MANAGER_SITE_ID, PLANT_STATUS_OPTIONS, ROLE_PERSONAS } from '../../data/managerDesk'
import ViewFrame from './ViewFrame'
import StatusBadge from '../dashboard/StatusBadge'

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'

export default function ManagerDeskView() {
  const { mine, stats, postNote, postDailyReport } = useVisibleMine('mine_manager')
  const site = (mine.sites || []).find(s => s.id === MANAGER_SITE_ID) || mine.sites?.[0]
  const plant = mine.plants.find(p => p.id === 'X17')
  const lastReport = (mine.dailyReports || [])[0]
  const inbox = (mine.notes || []).filter(n => n.toRole === 'mine_manager')
  const sent = (mine.dailyReports || []).filter(r => r.submittedDate === new Date().toISOString().slice(0, 10))

  const [tonnes, setTonnes] = useState(() => String(mine.production?.predictedTpd || 3400))
  const [trucks, setTrucks] = useState('0')
  const [plantStatus, setPlantStatus] = useState(plant?.status || 'mechanical_failure')
  const [reportNotes, setReportNotes] = useState('')
  const [noteBody, setNoteBody] = useState('')
  const [flash, setFlash] = useState(null)

  const actions = useMemo(
    () =>
      (mine.insights || []).slice(0, 3).map(i => ({
        id: i.id,
        title: i.title,
        detail: i.detail,
        severity: i.severity
      })),
    [mine.insights]
  )

  const showFlash = message => {
    setFlash(message)
    window.setTimeout(() => setFlash(null), 4200)
  }

  const handleDailySubmit = e => {
    e.preventDefault()
    const result = postDailyReport({
      siteId: MANAGER_SITE_ID,
      tonnes,
      trucks,
      plantStatus,
      notes: reportNotes
    })
    if (result?.report) {
      setReportNotes('')
      showFlash('Daily report sent. Switch the header to Executive to see the notification.')
    }
  }

  const handleNote = e => {
    e.preventDefault()
    const note = postNote({
      fromRole: 'mine_manager',
      toRole: 'executive',
      siteId: MANAGER_SITE_ID,
      body: noteBody
    })
    if (note) {
      setNoteBody('')
      showFlash('Note left for executives. Switch role to read it as Oliver.')
    }
  }

  return (
    <ViewFrame
      scrollPage
      eyebrow="Mine Manager"
      title={site?.name || 'Kolar North Open Pit'}
      description="Your pit only. Submit today's production before close of shift. Notes land in the executive inbox when they switch persona."
    >
      {flash && (
        <div className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-200">
          {flash}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Extraction</div>
          <div className="text-2xl font-semibold text-white">{stats.extractionTph} t/h</div>
          <div className="text-[11px] text-slate-400">{site?.commodity || 'Gold'} · Shift B</div>
        </div>
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gate queue</div>
          <div className="text-2xl font-semibold text-white">{stats.queuedTippers} tippers</div>
          <div className="text-[11px] text-slate-400">Held while plant is starved</div>
        </div>
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plant X17</div>
          <div className="text-lg font-semibold text-white mt-1">
            <StatusBadge value={plant?.status} />
          </div>
          <div className="text-[11px] text-slate-400">{plant?.throughputTph ?? 0} t/h vs 210 nameplate</div>
        </div>
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Last daily report</div>
          <div className="text-lg font-semibold text-white">
            {lastReport ? `${lastReport.tonnes.toLocaleString()} t` : 'Not sent'}
          </div>
          <div className="text-[11px] text-slate-400">
            {lastReport ? `${lastReport.submittedDate} · ${lastReport.submittedAt}` : 'Due before 18:00'}
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">What to act on today</div>
          {actions.map(a => (
            <div key={a.id} className="flex items-start gap-2 text-xs">
              <StatusBadge value={a.severity} />
              <div>
                <div className="text-slate-200 font-medium">{a.title}</div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
        <form
          onSubmit={handleDailySubmit}
          className="rounded-2xl border border-[#232634] bg-[#14151c] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Daily production report</h2>
              <p className="text-[11px] text-slate-400">Executives get a notification when this is submitted.</p>
            </div>
          </div>

          {sent.length > 0 && (
            <div className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              Already submitted today at {sent[0].submittedAt}. Submitting again appends a new copy for the demo.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="ROM tonnes today">
              <input className={inputClass} type="number" min="0" required value={tonnes} onChange={e => setTonnes(e.target.value)} />
            </Field>
            <Field label="Trucks dispatched">
              <input className={inputClass} type="number" min="0" required value={trucks} onChange={e => setTrucks(e.target.value)} />
            </Field>
          </div>
          <Field label="Plant status">
            <select className={inputClass} value={plantStatus} onChange={e => setPlantStatus(e.target.value)}>
              {PLANT_STATUS_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Note to executives (optional)">
            <textarea
              className={`${inputClass} min-h-[72px] resize-none`}
              rows={3}
              value={reportNotes}
              onChange={e => setReportNotes(e.target.value)}
              placeholder="e.g. Hold ST-18 — weighbridge mismatch. No crushed fines to load."
            />
          </Field>
          <button
            type="submit"
            className="mt-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Submit daily report
          </button>
        </form>

        <div className="rounded-2xl border border-[#232634] bg-[#14151c] p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Notes with executives</h2>
              <p className="text-[11px] text-slate-400">
                You are {ROLE_PERSONAS.mine_manager.name}. Messages stay in this dummy store.
              </p>
            </div>
          </div>

          <form onSubmit={handleNote} className="space-y-2 shrink-0">
            <textarea
              className={`${inputClass} min-h-[64px] resize-none`}
              rows={2}
              required
              value={noteBody}
              onChange={e => setNoteBody(e.target.value)}
              placeholder="Write a note for Oliver / executives…"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1e2230] hover:bg-[#262b3c] text-slate-100 border border-[#2c3142] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send to executive
            </button>
          </form>

          <div className="space-y-2 pr-1">
            {(mine.notes || []).length === 0 && (
              <p className="text-[11px] text-slate-500">No notes yet on this pit.</p>
            )}
            {(mine.notes || []).map(n => (
              <div key={n.id} className="rounded-xl border border-[#272b3b] bg-[#191b24] px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-200">
                    {n.author}{' '}
                    <span className="text-slate-500 font-normal">
                      → {n.toRole === 'mine_manager' ? 'you' : 'executive'}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{n.at}</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">{n.body}</p>
                {n.unread && n.toRole === 'mine_manager' && <StatusBadge value="unread" />}
              </div>
            ))}
          </div>

          {inbox.length > 0 && (
            <p className="text-[10px] text-slate-500 shrink-0">
              {inbox.filter(n => n.unread).length} unread from executives · reply above.
            </p>
          )}
        </div>
      </div>
    </ViewFrame>
  )
}
