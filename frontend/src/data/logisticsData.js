/**
 * Logistics, Weighbridge Fraud Checks & Captive Rail Telemetry
 * Provides realistic dummy datasets for 34t/42t road tippers, weighbridge scale verification,
 * fraud checks, and Jindal Steel captive coal rail sidings.
 */

export const TIPPER_CAPACITY_OPTIONS = [
  { id: '34t', label: '34t Standard Multi-Axle', payloadCapacityKg: 34000, tareAvgKg: 12500 },
  { id: '42t', label: '42t Heavy-Duty Tipper', payloadCapacityKg: 42000, tareAvgKg: 15200 },
  { id: '55t', label: '55t Articulated Haul Semi', payloadCapacityKg: 55000, tareAvgKg: 18400 }
]

export const WEIGHBRIDGE_LOGS = [
  {
    id: 'WB-8901',
    vehicleId: 'KA-34-TB-1842',
    carrier: 'Jindal Road Logistics',
    config: '34t Standard Multi-Axle',
    driver: 'Ramesh Gowda',
    status: 'fraud_flagged',
    fraudSeverity: 'critical',
    tareKg: 12450,
    plannedKg: 34000,
    grossScaleKg: 50420,
    actualCargoKg: 37970,
    discrepancyKg: 3970,
    discrepancyPct: 11.68,
    fraudReason: 'Overload Mismatch (+3,970 kg over declared BOL). High risk of axle overload / illicit coal diversion.',
    cargo: 'Anthracite Seam A ROM',
    destination: 'Jindal Vijayanagar Thermal Plant',
    timeIn: '14:22',
    scaleTime: '15:04',
    gateStatus: 'HELD_SECURITY',
    bay: 'Weighbridge Bay 1'
  },
  {
    id: 'WB-8902',
    vehicleId: 'KA-34-TC-9912',
    carrier: 'Deccan Bulk Transport',
    config: '42t Heavy-Duty Tipper',
    driver: 'Arjun Naik',
    status: 'fraud_flagged',
    fraudSeverity: 'warning',
    tareKg: 15300,
    plannedKg: 42000,
    grossScaleKg: 54100,
    actualCargoKg: 38800,
    discrepancyKg: -3200,
    discrepancyPct: -7.62,
    fraudReason: 'Underload Mismatch (-3,200 kg missing). Potential intermediate pilferage or improper pad tare.',
    cargo: 'Chrome Concentrate 50%',
    destination: 'Mangalore Port Terminal 2',
    timeIn: '14:05',
    scaleTime: '14:48',
    gateStatus: 'AUDIT_PENDING',
    bay: 'Weighbridge Bay 2'
  },
  {
    id: 'WB-8903',
    vehicleId: 'KA-34-TA-4450',
    carrier: 'National Freight Lines',
    config: '34t Standard Multi-Axle',
    driver: 'Vijay Kumar',
    status: 'ticketed',
    fraudSeverity: 'clean',
    tareKg: 12380,
    plannedKg: 34000,
    grossScaleKg: 46420,
    actualCargoKg: 34040,
    discrepancyKg: 40,
    discrepancyPct: 0.12,
    fraudReason: null,
    cargo: 'Anthracite Seam A ROM',
    destination: 'Toranagallu Power Feeder',
    timeIn: '13:50',
    scaleTime: '14:35',
    gateStatus: 'DISPATCHED',
    bay: 'Weighbridge Bay 1'
  },
  {
    id: 'WB-8904',
    vehicleId: 'KA-34-TD-7801',
    carrier: 'Jindal Road Logistics',
    config: '42t Heavy-Duty Tipper',
    driver: 'Mohammed Salim',
    status: 'ticketed',
    fraudSeverity: 'clean',
    tareKg: 15150,
    plannedKg: 42000,
    grossScaleKg: 57120,
    actualCargoKg: 41970,
    discrepancyKg: -30,
    discrepancyPct: -0.07,
    fraudReason: null,
    cargo: 'Gold Quartz Ore QZ-1',
    destination: 'South Basin Wash Plant',
    timeIn: '13:40',
    scaleTime: '14:20',
    gateStatus: 'DISPATCHED',
    bay: 'Weighbridge Bay 2'
  },
  {
    id: 'WB-8905',
    vehicleId: 'KA-34-TB-5519',
    carrier: 'Kolar Minerals Haulage',
    config: '34t Standard Multi-Axle',
    driver: 'Basavaraj P',
    status: 'loading',
    fraudSeverity: 'clean',
    tareKg: 12600,
    plannedKg: 34000,
    grossScaleKg: null,
    actualCargoKg: null,
    discrepancyKg: 0,
    discrepancyPct: 0,
    fraudReason: null,
    cargo: 'Conc 42% Chrome (Held)',
    destination: 'Bellary Smelter Yard',
    timeIn: '14:45',
    scaleTime: 'Pending',
    gateStatus: 'PAD_LOADING',
    bay: 'Loading Pad 3'
  },
  {
    id: 'WB-8906',
    vehicleId: 'KA-34-TC-1102',
    carrier: 'Deccan Bulk Transport',
    config: '55t Articulated Haul Semi',
    driver: 'Manjunath Swamy',
    status: 'empty_in',
    fraudSeverity: 'clean',
    tareKg: 18350,
    plannedKg: 55000,
    grossScaleKg: null,
    actualCargoKg: null,
    discrepancyKg: 0,
    discrepancyPct: 0,
    fraudReason: null,
    cargo: 'Raw Anthracite Coal',
    destination: 'Jindal Steel Pellet Plant',
    timeIn: '15:10',
    scaleTime: 'Pending',
    gateStatus: 'GATE_ENTRY_TARED',
    bay: 'Gate Inbound 1'
  }
]

export const JINDAL_RAIL_SIDINGS = {
  sidingName: 'Jindal Toranagallu Captive Rail Siding',
  division: 'Hubli Division (SWR)',
  connectedLine: 'Ballari–Hosapete Double Electrified Line',
  dailyCapacityTons: 18000,
  dispatchedTodayTons: 11660,
  sidingBufferStockpileTons: 42500,
  activeLoadingRateTph: 650,
  rakes: [
    {
      id: 'JINDAL-RAKE-104',
      locoNumber: 'WDG-4D #12891 (Twin Traction)',
      wagonCount: 58,
      wagonType: 'BOXN High-Sided Coal Wagon',
      commodity: 'Anthracite Seam A Raw Coal',
      loadedTons: 3840,
      targetTons: 3850,
      status: 'loading',
      destination: 'Jindal Vijayanagar 600MW Captive Power Station',
      departureEta: '16:30 Today',
      track: 'Track 2 (Rapid Loading Silo)',
      driverCrew: 'S. N. Patil / Loco Pilot',
      rakeIntegrity: '99.7% Scale Verified'
    },
    {
      id: 'JINDAL-RAKE-105',
      locoNumber: 'WAG-9HC #31450 (Heavy Freight)',
      wagonCount: 58,
      wagonType: 'BOXN Heavy Duty',
      commodity: 'Coking Coal Blend Grade G9',
      loadedTons: 3910,
      targetTons: 3900,
      status: 'in_transit',
      destination: 'Jindal Raigarh Blast Furnace Siding',
      departureEta: 'Departed 12:45 (On Mainline)',
      track: 'Mainline Up Line',
      driverCrew: 'A. K. Sharma / Senior Pilot',
      rakeIntegrity: 'Cleared Weighbridge 100%'
    },
    {
      id: 'JINDAL-RAKE-106',
      locoNumber: 'WDG-4G #49012 (GE Evolution Series)',
      wagonCount: 45,
      wagonType: 'BOBRN Bottom Discharge Hopper',
      commodity: 'Silica Sand & Fine Ore',
      loadedTons: 0,
      targetTons: 3200,
      status: 'empty_placed',
      destination: 'Angul Pellet Plant Siding',
      departureEta: 'Tomorrow 06:00',
      track: 'Track 1 (Siding Yard Pad)',
      driverCrew: 'Shift C Crew Assigned',
      rakeIntegrity: 'Pre-Trip Inspection Done'
    }
  ]
}

export const STAGE_FINANCIAL_IMPACTS = {
  preparation: [
    { type: 'profit', label: 'Optimized Blast Fragmentation', value: '+$14,200/day', note: 'Higher explosive density reduced secondary boulder crushing by 38%' },
    { type: 'loss', label: 'Drill Rig Bit Wear (Hard Granite)', value: '-$3,800/day', note: 'Bench 4 North abrasive strata required 2 premature drill replacements' }
  ],
  extraction: [
    { type: 'profit', label: 'High-Grade QZ-1 Gold Extraction', value: '+$48,500/day', note: 'Head grade 3.42 g/t yields maximum gross margin ($84/ton mined)' },
    { type: 'profit', label: 'Anthracite Seam A Direct Sell Raw', value: '+$32,000/day', note: 'Zero processing overhead; direct dispatch to Jindal thermal rakes' },
    { type: 'loss', label: 'QZ-2 Low Grade Pit Idle Cost', value: '-$4,500/day', note: 'Fleet waiting time on deferred low-grade seam (1.1 g/t)' }
  ],
  processing: [
    { type: 'loss', label: 'Primary Crusher X17 Breakdown Bottleneck', value: '-$18,500/hr', note: 'Jaw seizure blocked 200 t/h ROM feed to named concentrate piles' },
    { type: 'loss', label: 'Conc 42% Chrome Off-Spec Penalty', value: '-$9,200/batch', note: 'Lab returned 41.6% Cr2O3; requires blending before sale clearance' },
    { type: 'profit', label: 'Conc 50% High-Purity Premium', value: '+$64,000/day', note: 'Clean stockpile meets export spec (+12% pricing bonus)' }
  ],
  haulage: [
    { type: 'loss', label: 'Pit Ramp Congestion Idle Burn', value: '-$6,400/day', note: '22.4 min cycle time vs 16.2 min baseline burns 320L excess diesel' },
    { type: 'profit', label: 'Full 97% Payload Capacity Utilization', value: '+$11,800/day', note: '58.2t payload average per truck run saves 8 daily round trips' }
  ],
  shipping: [
    { type: 'loss', label: 'Gate Truck Demurrage & Idling', value: '-$8,100/day', note: '17 tippers held at gate unable to load crushed fines' },
    { type: 'profit', label: 'Jindal Rail Rapid Rake Dispatch', value: '+$52,000/rake', note: 'Bulk rail transit reduces per-ton freight by 44% vs road highway' },
    { type: 'profit', label: 'Weighbridge Fraud Prevention Catch', value: '+$12,400 today', note: 'Flagged WB-8901 and WB-8902 prevented 7.1 tons of unaccounted cargo loss' }
  ]
}

export const INITIAL_MANAGER_NOTES = [
  {
    id: 'note-01',
    author: 'Vasanth (Mine Manager)',
    role: 'mine_manager',
    timestamp: '14:45',
    title: 'X17 Primary Crusher & Weighbridge Audit Notice',
    content: 'Millwrights are replacing the eccentric bearing on Jaw Crusher X17. Estimated restart 18:30. In the meantime, tippers for chrome conc are held at gate. 2 trucks flagged for weight mismatch at Gate 1.',
    flag: 'action_required'
  },
  {
    id: 'note-02',
    author: 'Oliver (Executive Oversight)',
    role: 'executive',
    timestamp: '15:10',
    title: 'Rail Dispatch Priority Confirmation',
    content: 'Approved prioritizing Rake 104 Anthracite loading for Jindal Power. Ensure security inspects truck KA-34-TB-1842 before releasing gate barrier.',
    flag: 'acknowledged'
  }
]
