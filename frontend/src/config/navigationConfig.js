import {
  Map,
  Mountain,
  Flame,
  Anchor,
  Truck,
  HardHat,
  Users,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Boxes,
  Database,
  Layers,
  Shield,
  Radio,
  Cpu,
  Activity,
  Workflow,
  Wrench,
  AlertTriangle,
  FileCheck,
  Award,
  Scroll,
  FolderGit2
} from 'lucide-react'

export const ROLES = [
  { id: 'executive', label: 'Executive', description: 'Full executive oversight, financial & operational KPIs' },
  { id: 'admin', label: 'Admin', description: 'System configuration, API integrations & access control' },
  { id: 'mine_manager', label: 'Mine Manager', description: 'Pit operations, fleet dispatch & shift planning' },
  { id: 'worker', label: 'Worker', description: 'Personal tag telemetry, tasks & safety broadcasts' }
]

export const NAVIGATION_ITEMS = [
  {
    id: 'maps',
    label: 'Maps',
    icon: Map,
    badge: 'Live 3D',
    description: '3D spatial mining site overview & contour elevation'
  },
  {
    id: 'mines',
    label: 'Mines',
    icon: Mountain,
    description: 'Active open pit models, telemetry feeds & geofences',
    children: [
      { id: 'mines-models', label: '3D Mine Models (nanoCAD/CAD)', icon: Layers, badge: 'CAD' },
      {
        id: 'mines-feeds',
        label: 'Data Feed APIs',
        icon: Database,
        badge: '10 feeds',
        subItems: [
          { id: 'feed-cat', name: 'CAT Fleet System', status: 'connected', latency: '42ms' },
          { id: 'feed-sap', name: 'SAP ERP', status: 'connected', latency: '120ms' },
          { id: 'feed-scada', name: 'SCADA Telemetry', status: 'live', latency: '18ms' },
          { id: 'feed-hexagon', name: 'Hexagon Mining', status: 'connected', latency: '65ms' },
          { id: 'feed-deswik', name: 'Deswik Mine Planning', status: 'syncing', latency: '210ms' },
          { id: 'feed-micromine', name: 'Micromine Geological', status: 'connected', latency: '90ms' },
          { id: 'feed-arcgis', name: 'ArcGIS Geospatial', status: 'connected', latency: '55ms' },
          { id: 'feed-drone', name: 'Drone LiDAR System', status: 'live', latency: '30ms' },
          { id: 'feed-cmms', name: 'CMMS Maintenance', status: 'connected', latency: '140ms' },
          { id: 'feed-lab', name: 'Laboratory Assay System', status: 'connected', latency: '80ms' }
        ]
      },
      { id: 'mines-geofence', label: 'Geofence & Zones', icon: Shield, badge: '6 active' }
    ]
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: Flame,
    description: 'Crushing, washing, screening and stockpile yield',
    children: [
      { id: 'proc-crushing', label: 'Crushing (10 t/h)', icon: Workflow, status: 'warning' },
      { id: 'proc-washing', label: 'Washing Plant', icon: Activity, status: 'normal' },
      { id: 'proc-screening', label: 'Screening (5 t/h)', icon: Layers, status: 'normal' },
      { id: 'proc-yield', label: 'Yield Analytics', icon: BarChart3, badge: '+5%' },
      { id: 'proc-stockpiles', label: 'Stockpiles & Yard', icon: Boxes, badge: '4 zones' }
    ]
  },
  {
    id: 'ports',
    label: 'Ports',
    icon: Anchor,
    badge: 'Terminal 2',
    description: 'Harbor transshipment and bulk vessel loading'
  },
  {
    id: 'shipments',
    label: 'Shipments',
    icon: Truck,
    badge: '17 Queued',
    status: 'alert',
    description: 'Haul truck queues, dispatch logistics & movement'
  },
  {
    id: 'machines',
    label: 'Machines',
    icon: Cpu,
    badge: '48 Active',
    description: 'Live yellow machine tracking, fuel & payload telemetry',
    quickAction: { label: 'Add Machine', modalId: 'add-machine' },
    children: [
      { id: 'mach-fleet', label: 'All Yellow Fleet (48)', icon: Truck },
      { id: 'mach-haulers', label: 'Haul Trucks (26)', icon: Truck },
      { id: 'mach-excavators', label: 'Excavators & Shovels (14)', icon: Wrench },
      { id: 'mach-drills', label: 'Drill Rigs (8)', icon: Activity }
    ]
  },
  {
    id: 'humans',
    label: 'Humans',
    icon: Users,
    badge: '142 on Site',
    description: 'Live worker tracking, RFID/IoT tags & safety clearances',
    quickAction: { label: 'Add Person', modalId: 'add-person' },
    children: [
      { id: 'hum-active', label: 'Active Personnel (142)', icon: HardHat },
      { id: 'hum-operators', label: 'Machine Operators (64)', icon: HardHat },
      { id: 'hum-geologists', label: 'Geologists & Engineers (22)', icon: Mountain },
      { id: 'hum-safety', label: 'Safety Supervisors (12)', icon: Shield }
    ]
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Calendar,
    description: 'Drilling, blasting and shift planning timetable',
    children: [
      { id: 'sch-drilling', label: 'Drilling Program', icon: Wrench },
      { id: 'sch-blasting', label: 'Blasting Schedule', icon: AlertTriangle, badge: 'Tomorrow 14:00' },
      { id: 'sch-shifts', label: 'Shift Handover Timetable', icon: Calendar }
    ]
  },
  {
    id: 'production',
    label: 'Production',
    icon: BarChart3,
    badge: '170 t/h',
    description: 'Real-time tonnage output and predicted daily yields'
  },
  {
    id: 'collections',
    label: 'Collections',
    icon: Boxes,
    children: [
      { id: 'col-yard', label: 'Yard Inventory', icon: Boxes },
      { id: 'col-reclaim', label: 'Reclaimer Feeders', icon: Workflow }
    ]
  },
  {
    id: 'site-reports',
    label: 'Site Reports',
    icon: FileText,
    badge: 'AI Powered',
    description: '10 automated report feeds with AI model interpretation',
    quickAction: { label: 'Submit Report', modalId: 'submit-report' },
    children: [
      { id: 'rep-inspection', label: 'Inspection Reports', icon: FileCheck },
      { id: 'rep-maintenance', label: 'Maintenance Reports', icon: Wrench, badge: 'Plant X17' },
      { id: 'rep-geological', label: 'Geological Reports', icon: Mountain },
      { id: 'rep-blast', label: 'Blast Reports', icon: AlertTriangle },
      { id: 'rep-safety', label: 'Safety Reports', icon: Shield },
      { id: 'rep-engineering', label: 'Engineering Drawings', icon: FolderGit2 },
      { id: 'rep-sops', label: 'SOPs', icon: Scroll },
      { id: 'rep-permits', label: 'Permits', icon: Award },
      { id: 'rep-environmental', label: 'Environmental Reports', icon: Activity },
      { id: 'rep-contractor', label: 'Contractor Reports', icon: Users }
    ]
  },
  {
    id: 'messaging',
    label: 'Messaging',
    icon: MessageSquare,
    badge: '3 new',
    description: 'Radio dispatch channels & AI safety alerts'
  }
]
