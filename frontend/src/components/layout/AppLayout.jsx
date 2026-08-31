import React, { useState } from 'react'
import Sidebar from '../navigation/Sidebar'
import TopHeader from '../navigation/TopHeader'
import AiReportPanel from '../dashboard/AiReportPanel'
import Viewport from '../views/Viewport'
import SubmitReportModal from '../modals/SubmitReportModal'
import AddMachineModal from '../modals/AddMachineModal'
import AddPersonModal from '../modals/AddPersonModal'
import RegisterSiteModal from '../modals/RegisterSiteModal'
import { useMineData } from '../../context/useMineData'
import { MANAGER_SITE_ID } from '../../data/managerDesk'

export default function AppLayout({ children }) {
  const { selectSearchResult, setSelectedSiteId } = useMineData()
  const [activeTab, setActiveTab] = useState('production')
  const [activeSubTab, setActiveSubTab] = useState('mines-models')
  const [currentRole, setCurrentRole] = useState('executive')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  // The portfolio asset a 3D view was opened for. Portfolio ids ('moatize') live in a
  // different space from SITES_CATALOG ids, so this is carried alongside, not through
  // setSelectedSiteId.
  const [focusedAsset, setFocusedAsset] = useState(null)

  const handleSelectRole = role => {
    setCurrentRole(role)
    if (role === 'mine_manager') {
      setActiveTab('manager-desk')
      if (setSelectedSiteId) setSelectedSiteId(MANAGER_SITE_ID)
    } else if (activeTab === 'manager-desk') {
      setActiveTab('production')
    }
  }

  /** Cross-view navigation, e.g. clicking a mine on the portfolio map to open its pit. */
  const handleNavigate = (tab, opts = {}) => {
    setActiveTab(tab)
    if (opts.subTab) setActiveSubTab(opts.subTab)
    if ('asset' in opts) setFocusedAsset(opts.asset)
  }

  const handleOpenModal = modalId => {
    setActiveModal(modalId)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  const handleSearchResultClick = result => {
    selectSearchResult(result)
    if (result.type === 'machine' || result.type === 'worker') {
      setActiveTab('maps')
    } else if (result.type === 'report') {
      setActiveTab('site-reports')
    } else if (result.type === 'zone') {
      setActiveTab('processing')
    } else if (result.type === 'site' || result.type === 'ore' || result.type === 'community' || result.type === 'target') {
      setActiveTab('sites')
      setActiveSubTab(`site-${result.siteId || result.id}`)
    } else if (result.type === 'pile') {
      setActiveTab('collections')
    } else if (result.type === 'lab') {
      setActiveTab('processing')
    } else if (result.type === 'handover') {
      setActiveTab('schedule')
    }
  }

  const viewportProps = {
    activeTab,
    activeSubTab,
    currentRole,
    onOpenModal: handleOpenModal,
    onNavigate: handleNavigate,
    focusedAsset
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0d10] font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Responsive Sidebar (Static on Desktop, Overlay Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onOpenModal={handleOpenModal}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentRole={currentRole}
      />

      {/* 2. Main Center Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Responsive Top Header */}
        <TopHeader
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectSearchResult={handleSearchResultClick}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onToggleAiPanel={() => setIsAiDrawerOpen(prev => !prev)}
        />

        {/* Viewport Workspace Slot */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {children ? children(viewportProps) : <Viewport {...viewportProps} />}

          {/* AI Report Panel (Static Rail on >=xl, Slide Drawer on <xl) */}
          <AiReportPanel
            activeTab={activeTab}
            isOpenDrawer={isAiDrawerOpen}
            onCloseDrawer={() => setIsAiDrawerOpen(false)}
            onOpenReportModal={() => handleOpenModal('submit-report')}
          />
        </div>
      </div>

      {/* Modals */}
      <SubmitReportModal isOpen={activeModal === 'submit-report'} onClose={handleCloseModal} />
      <AddMachineModal
        isOpen={activeModal === 'add-machine'}
        onClose={handleCloseModal}
        onTracked={() => setActiveTab('maps')}
      />
      <AddPersonModal isOpen={activeModal === 'add-person'} onClose={handleCloseModal} />
      <RegisterSiteModal
        isOpen={activeModal === 'register-site'}
        onClose={handleCloseModal}
        onRegistered={() => setActiveTab('sites')}
      />
    </div>
  )
}
