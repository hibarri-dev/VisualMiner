export const REPORT_TYPES = [
  { id: 'inspection', name: 'Inspection Reports', desc: 'Equipment condition and bench integrity' },
  { id: 'maintenance', name: 'Maintenance Reports', desc: 'Breakdown reports and spare parts logs' },
  { id: 'geological', name: 'Geological Reports', desc: 'Ore grade, lithology & fault line maps' },
  { id: 'blast', name: 'Blast Reports', desc: 'Pattern fragmentation & vibration assays' },
  { id: 'safety', name: 'Safety Reports', desc: 'Incident logs, PPE adherence & hazard flags' },
  { id: 'engineering', name: 'Engineering Drawings', desc: 'nanoCAD/CAD pit design alterations' },
  { id: 'sops', name: 'SOPs', desc: 'Standard Operating Procedures & checklists' },
  { id: 'permits', name: 'Permits', desc: 'Environmental & blasting statutory approvals' },
  { id: 'environmental', name: 'Environmental Reports', desc: 'Dust, water runoff & noise sensors' },
  { id: 'contractor', name: 'Contractor Reports', desc: 'Third-party haulage & drilling logs' }
]

export function createSiteReports() {
  return [
    {
      id: 'rep-assay-204',
      type: 'geological',
      title: 'Geological Blast Assay 204',
      summary: 'Bench 4 North channel samples: Au +3.1% vs Deswik block model.',
      source: 'Laboratory Assay System (LIMS)',
      status: 'ai_updated',
      yieldHint: '+5%',
      zone: 'Bench 4 North',
      at: '08:40'
    },
    {
      id: 'rep-x17',
      type: 'maintenance',
      title: 'X17 Primary Jaw Failure',
      summary: 'SCADA fault F-441. Crusher seized. Throughput collapsed to 10 t/h.',
      source: 'CMMS Maintenance',
      status: 'open',
      yieldHint: null,
      zone: 'Crusher X17 Exclusion',
      at: '07:16'
    },
    {
      id: 'rep-insp-b4',
      type: 'inspection',
      title: 'Bench 4 Highwall Inspection',
      summary: 'No tension cracks. Catch bench debris within tolerance.',
      source: 'CMMS / EHS',
      status: 'cleared',
      yieldHint: null,
      zone: 'Bench 4 North',
      at: '06:55'
    },
    {
      id: 'rep-blast-b3',
      type: 'blast',
      title: 'Bench 3 East Blast Design',
      summary: '118 holes, 4.2 m burden. Predicted P80 380 mm. Window 14:00 tomorrow.',
      source: 'Deswik Mine Planning',
      status: 'scheduled',
      yieldHint: null,
      zone: 'Bench 3 East',
      at: 'Yesterday'
    },
    {
      id: 'rep-safety-x17',
      type: 'safety',
      title: 'X17 Exclusion Broadcast',
      summary: 'Clearance Level 2+ inside 40 m radius. Three plant techs logged in zone.',
      source: 'SAP HR / EHS',
      status: 'active',
      yieldHint: null,
      zone: 'Crusher X17 Exclusion',
      at: '09:18'
    },
    {
      id: 'rep-cad-spiral',
      type: 'engineering',
      title: 'Haul Spiral Revision R12',
      summary: 'nanoCAD update: 8% grade on west ramp, Bench 5 access.',
      source: 'Hexagon Mining',
      status: 'synced',
      yieldHint: null,
      zone: 'Haul Road 2',
      at: 'Yesterday'
    },
    {
      id: 'rep-sop-dump',
      type: 'sops',
      title: 'ROM Dump SOP — Crusher Down',
      summary: 'Hold side tippers. Do not build crushed fines. Recycle wash water only.',
      source: 'SOPs',
      status: 'active',
      yieldHint: null,
      zone: 'ROM Pad',
      at: '09:20'
    },
    {
      id: 'rep-permit-blast',
      type: 'permits',
      title: 'DGMS Blast Permit B-314',
      summary: 'Valid tomorrow 13:00–16:00. Vibration limit 5 mm/s at magazine.',
      source: 'ArcGIS Geospatial',
      status: 'approved',
      yieldHint: null,
      zone: 'Bench 3 East',
      at: 'Mon'
    },
    {
      id: 'rep-dust',
      type: 'environmental',
      title: 'PM10 Dust Log — Pit Rim',
      summary: 'Hourly PM10 142 µg/m³. Water cart on Bench 1. Within permit.',
      source: 'ArcGIS Geospatial',
      status: 'watch',
      yieldHint: null,
      zone: 'Bench 1 Rim',
      at: '09:00'
    },
    {
      id: 'rep-contract-haul',
      type: 'contractor',
      title: 'Contractor Haulage Shift B',
      summary: '17 side tippers on hire. Standing time accruing while X17 is down.',
      source: 'SAP ERP',
      status: 'open',
      yieldHint: null,
      zone: 'Terminal 2',
      at: '09:05'
    },
    {
      id: 'rep-micro-qz1',
      type: 'geological',
      title: 'Micromine QZ-1 grade shell',
      summary: 'Block model locked to Assay 204. QZ-2 parked as low-grade — do not extract while X17 is down.',
      source: 'Micromine Geological',
      status: 'ai_updated',
      yieldHint: '+3.2%',
      zone: 'QZ-1 Quartz Lode',
      at: '08:42'
    },
    {
      id: 'rep-drone-west',
      type: 'geological',
      title: 'West LiDAR block — 3 anomalies',
      summary: 'Pix4D/DroneDeploy orthomosaic. Anomaly A flagged for follow-up drill. No core yet.',
      source: 'Drone LiDAR System',
      status: 'synced',
      yieldHint: null,
      zone: 'Kolar West LiDAR',
      at: 'Today'
    }
  ]
}
