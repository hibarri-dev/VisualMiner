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
  const [selectedMachineId, setSelectedMachineId] = useState(null)
  const [selectedPersonId, setSelectedPersonId] = useState(null)
  const [selectedReportId, setSelectedReportId] = useState('rep-assay-204')
  const [selectedSiteId, setSelectedSiteId] = useState('kolar-north')
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
    setSelectedSiteId(result.site.id)
    return result.site
  }, [])

  const acceptHandover = useCallback(() => {
    setMine(prev => acceptDraftHandover(prev))
  }, [])

  const selectSearchResult = useCallback(result => {
    if (result.type === 'machine') setSelectedMachineId(result.id)
    if (result.type === 'worker') setSelectedPersonId(result.id)
    if (result.type === 'report') setSelectedReportId(result.id)
    if (result.type === 'site') setSelectedSiteId(result.id)
    if (result.siteId) setSelectedSiteId(result.siteId)
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
      selectedSiteId,
      setSelectedMachineId,
      setSelectedPersonId,
      setSelectedReportId,
      setSelectedSiteId,
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
      selectedSiteId,
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
