import React, { useState } from 'react'
import Sidebar from '../navigation/Sidebar'
import TopHeader from '../navigation/TopHeader'
import AiReportPanel from '../dashboard/AiReportPanel'
import DefaultSlotView from '../views/DefaultSlotView'
import SubmitReportModal from '../modals/SubmitReportModal'

export default function AppLayout({ children }) {
  const [activeTab, setActiveTab] = useState('maps')
  const [activeSubTab, setActiveSubTab] = useState('mines-models')
  const [currentRole, setCurrentRole] = useState('executive')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeModal, setActiveModal] = useState(null)

  const handleOpenModal = modalId => {
    setActiveModal(modalId)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  const handleSearchResultClick = result => {
    if (result.type === 'machine') {
      setActiveTab('machines')
    } else if (result.type === 'worker') {
      setActiveTab('humans')
    } else if (result.type === 'report') {
      setActiveTab('site-reports')
    } else if (result.type === 'zone') {
      setActiveTab('processing')
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0d10] font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Pratik's Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onOpenModal={handleOpenModal}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Content & Top Header Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navigation UX */}
        <TopHeader
          currentRole={currentRole}
          onSelectRole={setCurrentRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectSearchResult={handleSearchResultClick}
        />

        {/* Viewport Workspace Slot (Allows Sahil's 3D, Vasanth's telemetry, Raven's reports to plug in) */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {children ? (
            children({ activeTab, activeSubTab, currentRole, onOpenModal: handleOpenModal })
          ) : (
            <DefaultSlotView
              activeTab={activeTab}
              activeSubTab={activeSubTab}
              onOpenModal={handleOpenModal}
            />
          )}

          {/* AI Report Companion Panel (matching design layout) */}
          <AiReportPanel
            activeTab={activeTab}
            onOpenReportModal={() => handleOpenModal('submit-report')}
          />
        </div>
      </div>

      {/* Site Report AI Modal */}
      <SubmitReportModal
        isOpen={activeModal === 'submit-report'}
        onClose={handleCloseModal}
      />
    </div>
  )
}
