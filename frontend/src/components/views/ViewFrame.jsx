import React from 'react'

export default function ViewFrame({ eyebrow, title, description, actions, children }) {
  return (
    <div className="flex-1 flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 overflow-y-auto bg-[#0d0e12] min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 shrink-0">
        <div>
          {eyebrow && (
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5 sm:mb-1">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">{title}</h1>
          {description && <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5 max-w-3xl leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
