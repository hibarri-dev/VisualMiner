import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MineDataContext } from './mineContext'
import {
  addMachineToMine,
  addPersonToMine,
  addSiteToMine,
  acceptDraftHandover,
  buildSearchIndex,
  createMineState,
  ingestSiteReport,
  liveStats,
  tickMine
} from '../data'

export function MineDataProvider({ children }) {
  const [mine, setMine] = useState(() => createMineState())
  const [selectedMachineId, setSelectedMachineId] = useState('X7UIH53')
  const [selectedPersonId, setSelectedPersonId] = useState('arvind-chopra')
  const [selectedReportId, setSelectedReportId] = useState('rep-assay-204')
  const mineRef = useRef(mine)

  useEffect(() => {
    mineRef.current = mine
  }, [mine])

  useEffect(() => {
    const id = setInterval(() => {
      setMine(prev => tickMine(prev))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const ingestReport = useCallback(submission => {
    const result = ingestSiteReport(mineRef.current, submission)
    setMine(result.mine)
    return result.aiResult
  }, [])

  const addMachine = useCallback(payload => {
    const result = addMachineToMine(mineRef.current, payload)
    setMine(result.mine)
    setSelectedMachineId(result.machine.id)
    return result.machine
  }, [])

  const addPerson = useCallback(payload => {
    const result = addPersonToMine(mineRef.current, payload)
    setMine(result.mine)
    setSelectedPersonId(result.person.id)
    return result.person
  }, [])

  const addSite = useCallback(payload => {
    const result = addSiteToMine(mineRef.current, payload)
    setMine(result.mine)
    return result.site
  }, [])

  const acceptHandover = useCallback(() => {
    setMine(prev => acceptDraftHandover(prev))
  }, [])

  const selectSearchResult = useCallback(result => {
    if (result.type === 'machine') setSelectedMachineId(result.id)
    if (result.type === 'worker') setSelectedPersonId(result.id)
    if (result.type === 'report') setSelectedReportId(result.id)
  }, [])

  const stats = useMemo(() => liveStats(mine), [mine])
  const searchIndex = useMemo(() => buildSearchIndex(mine), [mine])

  const value = useMemo(
    () => ({
      mine,
      stats,
      searchIndex,
      selectedMachineId,
      selectedPersonId,
      selectedReportId,
      setSelectedMachineId,
      setSelectedPersonId,
      setSelectedReportId,
      ingestReport,
      addMachine,
      addPerson,
      addSite,
      acceptHandover,
      selectSearchResult
    }),
    [
      mine,
      stats,
      searchIndex,
      selectedMachineId,
      selectedPersonId,
      selectedReportId,
      ingestReport,
      addMachine,
      addPerson,
      addSite,
      acceptHandover,
      selectSearchResult
    ]
  )

  return <MineDataContext.Provider value={value}>{children}</MineDataContext.Provider>
}
