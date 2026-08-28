import React, { useContext, useMemo } from 'react'
import { MineDataContext } from './mineContext'
import { buildSearchIndex, filterMineForRole, liveStats } from '../data'

export function useMineData() {
  const ctx = useContext(MineDataContext)
  if (!ctx) throw new Error('useMineData must be used inside MineDataProvider')
  return ctx
}

export function useVisibleMine(role) {
  const data = useMineData()
  const visible = useMemo(() => filterMineForRole(data.mine, role), [data.mine, role])
  const stats = useMemo(() => liveStats(visible), [visible])
  const searchIndex = useMemo(() => buildSearchIndex(visible), [visible])
  return { ...data, mine: visible, stats, searchIndex }
}
