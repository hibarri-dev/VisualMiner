import React from 'react'
import MapsView from './MapsView'
import PortfolioMapView from './PortfolioMapView'
import OreBodyView from './OreBodyView'
import SitesView from './SitesView'
import FleetView from './FleetView'
import HumansView from './HumansView'
import OpsView from './OpsView'
import CycleView from './CycleView'
import SiteReportsView from './SiteReportsView'
import ManagerDeskView from './ManagerDeskView'
import FeedsView, { GeofenceView, ScheduleView, MessagesView, PortsView } from './CatalogViews'

export default function Viewport({ activeTab, activeSubTab, currentRole, onOpenModal, onNavigate, focusedAsset }) {
  if (activeTab === 'manager-desk') {
    return <ManagerDeskView />
  }

  if (activeTab === 'maps') {
    return <MapsView currentRole={currentRole} focusedAsset={focusedAsset} onNavigate={onNavigate} />
  }

  if (activeTab === 'portfolio') {
    return <PortfolioMapView onNavigate={onNavigate} />
  }

  // Sites covers mines too — an open pit is a site, so the ore-body model, data feeds
  // and geofences are sub-views of Sites rather than a parallel "Mines" section.
  if (activeTab === 'sites') {
    if (activeSubTab === 'sitetool-feeds' || String(activeSubTab).startsWith('feed-')) {
      return <FeedsView currentRole={currentRole} />
    }
    if (activeSubTab === 'sitetool-geofence') return <GeofenceView currentRole={currentRole} />
    if (activeSubTab === 'sitetool-orebody') return <OreBodyView />
    return <SitesView currentRole={currentRole} onOpenModal={onOpenModal} activeSubTab={activeSubTab} />
  }

  if (activeTab === 'machines') {
    return <FleetView activeSubTab={activeSubTab} currentRole={currentRole} onOpenModal={onOpenModal} />
  }

  if (activeTab === 'humans') {
    return <HumansView activeSubTab={activeSubTab} currentRole={currentRole} onOpenModal={onOpenModal} />
  }

  if (activeTab === 'cycle') {
    return <CycleView currentRole={currentRole} />
  }

  if (activeTab === 'production' || activeTab === 'processing' || activeTab === 'shipments' || activeTab === 'collections') {
    return <OpsView activeTab={activeTab} currentRole={currentRole} />
  }

  if (activeTab === 'site-reports') {
    return <SiteReportsView activeSubTab={activeSubTab} currentRole={currentRole} onOpenModal={onOpenModal} />
  }

  if (activeTab === 'schedule') return <ScheduleView currentRole={currentRole} />
  if (activeTab === 'messaging') return <MessagesView currentRole={currentRole} />
  if (activeTab === 'ports') return <PortsView currentRole={currentRole} />

  return <MapsView currentRole={currentRole} focusedAsset={focusedAsset} onNavigate={onNavigate} />
}
