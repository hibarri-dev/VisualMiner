import React, { useState } from 'react'
import Sidebar from '../navigation/Sidebar'
import TopHeader from '../navigation/TopHeader'
import AiReportPanel from '../dashboard/AiReportPanel'
import Viewport from '../views/Viewport'
import SubmitReportModal from '../modals/SubmitReportModal'
import AddMachineModal from '../modals/AddMachineModal'
import AddPersonModal from '../modals/AddPersonModal'
import { useMineData } from '../../context/useMineData'

export default function AppLayout({ children }) {
  const { selectSearchResult } = useMineData()
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
    selectSearchResult(result)
    if (result.type === 'machine' || result.type === 'worker') {
      setActiveTab('maps')
    } else if (result.type === 'report') {
      setActiveTab('site-reports')
    } else if (result.type === 'zone') {
      setActiveTab('processing')
    }
  }

  const viewportProps = { activeTab, activeSubTab, currentRole, onOpenModal: handleOpenModal }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0d10] font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onOpenModal={handleOpenModal}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader
          currentRole={currentRole}
          onSelectRole={setCurrentRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectSearchResult={handleSearchResultClick}
        />

        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {children ? children(viewportProps) : <Viewport {...viewportProps} />}

          <AiReportPanel
            activeTab={activeTab}
            onOpenReportModal={() => handleOpenModal('submit-report')}
          />
        </div>
      </div>

      <SubmitReportModal isOpen={activeModal === 'submit-report'} onClose={handleCloseModal} />
      <AddMachineModal
        isOpen={activeModal === 'add-machine'}
        onClose={handleCloseModal}
        onTracked={() => setActiveTab('maps')}
      />
      <AddPersonModal isOpen={activeModal === 'add-person'} onClose={handleCloseModal} />
    </div>
  )
}
