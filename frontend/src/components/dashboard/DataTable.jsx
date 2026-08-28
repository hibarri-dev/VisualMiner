import React from 'react'

export default function DataTable({ columns, rows, selectedId, onSelect, empty = 'No telemetry in this slice' }) {
  return (
    <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-[#232634] bg-[#14161d]">
      <table className="w-full text-left text-[12px]">
        <thead className="sticky top-0 bg-[#1a1c24] text-[10px] uppercase tracking-wider text-slate-400">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-3 py-2.5 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                {empty}
              </td>
            </tr>
          )}
          {rows.map(row => {
            const active = selectedId && row.id === selectedId
            return (
              <tr
                key={row.id}
                onClick={() => onSelect && onSelect(row)}
                className={`border-t border-[#1f222c] ${onSelect ? 'cursor-pointer' : ''} ${
                  active ? 'bg-indigo-600/15' : 'hover:bg-[#1b1e27]'
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-3 py-2 text-slate-200 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
