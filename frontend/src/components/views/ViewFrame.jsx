import React from 'react'

export default function ViewFrame({ eyebrow, title, description, actions, children }) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-5 overflow-hidden bg-[#0d0e12] min-w-0">
      <div className="flex items-end justify-between gap-4 shrink-0">
        <div>
          {eyebrow && (
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[18px] font-semibold text-white tracking-tight">{title}</h1>
          {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
