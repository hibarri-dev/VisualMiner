import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MineDataContext } from './mineContext'
import {
  addMachineToMine,
  addPersonToMine,
  addSiteToMine,
  acceptDraftHandover,
  createMineState,
  ingestSiteReport,
  liveStats,
  tickMine,
  buildSearchIndex,
  sendNote,
  submitDailyReport,
  markNotificationsRead,
  markInboxRead
} from '../data'
import { applyLiveCoal, fetchLiveCoalPrices } from '../data/coalPrices'

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

  useEffect(() => {
    let cancelled = false
    fetchLiveCoalPrices()
      .then(quotes => {
        if (cancelled || !quotes.length) return
        setMine(prev => ({
          ...prev,
          cycleCapture: applyLiveCoal(prev.cycleCapture, quotes)
        }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
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

  const postNote = useCallback(payload => {
    const result = sendNote(mineRef.current, payload)
    setMine(result.mine)
    return result.note
  }, [])

  const postDailyReport = useCallback(payload => {
    const result = submitDailyReport(mineRef.current, payload)
    setMine(result.mine)
    return result
  }, [])

  const readNotifications = useCallback((role = 'executive') => {
    setMine(prev => markNotificationsRead(prev, role))
  }, [])

  const readInbox = useCallback((role = 'executive') => {
    setMine(prev => markInboxRead(prev, role))
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
      postNote,
      postDailyReport,
      readNotifications,
      readInbox,
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
      postNote,
      postDailyReport,
      readNotifications,
      readInbox,
      selectSearchResult
    ]
  )

  return <MineDataContext.Provider value={value}>{children}</MineDataContext.Provider>
}
