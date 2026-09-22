/**
 * Shipping, Incoterms, Vessel Telemetry & Demurrage Simulation Data
 */

export const INCOTERMS = [
  { code: 'EXW', name: 'ExWorks', buyerPortRequired: false, buyerRisk: 'Pickup at mine gate. Buyer handles all freight & customs.' },
  { code: 'FCA', name: 'Free Carrier', buyerPortRequired: false, buyerRisk: 'Delivered to named inland carrier. Buyer handles main transit.' },
  { code: 'FAS', name: 'Free Alongside Ship', buyerPortRequired: false, buyerRisk: 'Delivered alongside vessel at origin port berth.' },
  { code: 'FOB', name: 'Free On Board', buyerPortRequired: false, buyerRisk: 'Loaded onto vessel at origin port. Risk shifts once on ship.' },
  { code: 'CFR', name: 'Cost & Freight', buyerPortRequired: true, buyerRisk: 'Seller pays freight to destination port; buyer covers marine insurance & port unloading.' },
  { code: 'CIF', name: 'Cost, Insurance & Freight', buyerPortRequired: true, buyerRisk: 'Seller covers freight & insurance to destination port. Buyer handles berth/terminal unloading.' },
  { code: 'CPT', name: 'Carriage Paid To', buyerPortRequired: true, buyerRisk: 'Seller delivers to carrier at destination. Risk shifts at origin carrier handoff.' },
  { code: 'CIP', name: 'Carriage & Insurance Paid', buyerPortRequired: true, buyerRisk: 'Seller pays carriage & insurance to destination point.' },
  { code: 'DAP', name: 'Delivered At Place', buyerPortRequired: true, buyerRisk: 'Seller delivers goods ready for unloading at named destination. Seller bears demurrage risks until ready for unloading.' },
  { code: 'DPU', name: 'Delivered At Place Unloaded', buyerPortRequired: true, buyerRisk: 'Seller delivers and unloads cargo at destination terminal.' },
  { code: 'DDP', name: 'Delivered Duty Paid', buyerPortRequired: true, buyerRisk: 'Seller handles maximum obligation: freight, customs, duties, and destination delivery.' }
]

export const DEMO_CLIENTS = [
  { id: 'cli-jindal', name: 'Jindal Steel & Power Ltd', country: 'India', primaryPort: 'New Mangalore Bulk Port' },
  { id: 'cli-arcelor', name: 'ArcelorMittal Global Trading', country: 'Luxembourg / SA', primaryPort: 'Richards Bay Dry Bulk Terminal' },
  { id: 'cli-eskom', name: 'Eskom Holdings SOC Ltd', country: 'South Africa', primaryPort: 'Durban Terminal 2' },
  { id: 'cli-tata', name: 'Tata International Bulk Minerals', country: 'India', primaryPort: 'Mundra Port Bulk Siding' }
]

export const MOCK_TRUCKS = [
  {
    id: 'TRK-9041',
    driver: 'Rajesh Kumar',
    carrier: 'Jindal Haulage Logistics',
    grossWeightTons: 54.2,
    tareWeightTons: 18.5,
    netPayloadTons: 35.7,
    cargoSpec: 'RB1 High CV Coal (6000 kcal/kg)',
    origin: 'Kolar Pit 4 Weighbridge',
    destination: 'Richards Bay Berth 3 Siding',
    weighbridgeCertId: 'WB-2026-0922-8419',
    weighbridgeStatus: 'VERIFIED_MATCH',
    varianceKg: 120,
    dockSlot: 'Dock Slot #04 (14:00 - 15:30)',
    dockStatus: 'ON_TIME',
    delayMinutes: 0,
    etaMinutes: 18,
    status: 'EN_ROUTE_PORT'
  },
  {
    id: 'TRK-8812',
    driver: 'Sipho Dlamini',
    carrier: 'TransNet Road Fleet',
    grossWeightTons: 58.9,
    tareWeightTons: 19.1,
    netPayloadTons: 39.8,
    cargoSpec: 'RB2 Export Grade Coal (5500 kcal/kg)',
    origin: 'Witbank Pit 2 Gate',
    destination: 'Richards Bay Berth 2 Stacking Yard',
    weighbridgeCertId: 'WB-2026-0922-3104',
    weighbridgeStatus: 'FLAGGED_TARE_DISCREPANCY',
    varianceKg: 1450,
    dockSlot: 'Dock Slot #02 (13:15 - 14:45)',
    dockStatus: 'DELAYED',
    delayMinutes: 42,
    etaMinutes: 65,
    status: 'CONGESTED_AT_GATE'
  },
  {
    id: 'TRK-7405',
    driver: 'Amit Patel',
    carrier: 'Hospet Roadways',
    grossWeightTons: 49.8,
    tareWeightTons: 17.8,
    netPayloadTons: 32.0,
    cargoSpec: 'Metallurgical Coking Coal',
    origin: 'Hospet Processing Yard',
    destination: 'Mangalore Port Terminal 2',
    weighbridgeCertId: 'WB-2026-0922-7721',
    weighbridgeStatus: 'VERIFIED_MATCH',
    varianceKg: 40,
    dockSlot: 'Dock Slot #01 (11:00 - 12:30)',
    dockStatus: 'UNLOADED',
    delayMinutes: 0,
    etaMinutes: 0,
    status: 'UNLOADED_COMPLETE'
  }
]

export const MOCK_VESSELS = [
  {
    id: 'VES-JINDAL-ENT',
    name: 'MV Jindal Enterprise',
    imo: 'IMO 9842104',
    flag: 'Panama',
    capacityTons: 75000,
    loadedTons: 68500,
    cargoSpec: 'RB1 Premium Coal',
    originPort: 'Richards Bay Dry Bulk Terminal (South Africa)',
    destinationPort: 'New Mangalore Bulk Port (India)',
    incoterm: 'DAP',
    client: 'Jindal Steel & Power Ltd',
    laycanStart: '2026-09-20',
    laycanEnd: '2026-09-25',
    cancellingDate: '2026-09-25T23:59:00Z',
    noticeOfReadiness: 'Tendered 2026-09-21 08:30 GMT',
    laytimeAllowedHours: 72,
    laytimeUsedHours: 64,
    laytimeRemainingHours: 8,
    berthSlot: 'Berth #02 - Deepwater Coal Pier',
    berthWindow: '2026-09-22 06:00 to 2026-09-25 18:00',
    marineTrafficStatus: 'EN_ROUTE_DESTINATION',
    destinationBerthStatus: 'CRITICAL_CONGESTION_0_SLOTS',
    demurrageRiskStatus: 'HIGH_DEMURRAGE_RISK',
    demurrageRatePerDay: 28000,
    predictedDemurrageDays: 3.5,
    predictedCostUSD: 98000
  },
  {
    id: 'VES-AFRICAN-FLAME',
    name: 'MV African Flame',
    imo: 'IMO 9710382',
    flag: 'Liberia',
    capacityTons: 60000,
    loadedTons: 42000,
    cargoSpec: 'RB2 Commercial Coal',
    originPort: 'Maputo Bulk Terminal (Mozambique)',
    destinationPort: 'Mundra Port Bulk Siding (India)',
    incoterm: 'FOB',
    client: 'ArcelorMittal Global Trading',
    laycanStart: '2026-09-21',
    laycanEnd: '2026-09-26',
    cancellingDate: '2026-09-26T18:00:00Z',
    noticeOfReadiness: 'Tendered 2026-09-22 04:15 GMT',
    laytimeAllowedHours: 48,
    laytimeUsedHours: 18,
    laytimeRemainingHours: 30,
    berthSlot: 'Berth #04 - Conveyor Pier B',
    berthWindow: '2026-09-22 12:00 to 2026-09-24 12:00',
    marineTrafficStatus: 'MOORED_AT_BERTH_LOADING',
    destinationBerthStatus: 'SLOTS_AVAILABLE',
    demurrageRiskStatus: 'ON_SCHEDULE',
    demurrageRatePerDay: 22000,
    predictedDemurrageDays: 0,
    predictedCostUSD: 0
  }
]

export const DEMO_SCENARIOS = [
  {
    id: 'scen-dap-sa-india',
    title: '🚨 DAP Demo: SA to India Destination Demurrage',
    badge: 'CRITICAL DEMURRAGE RISK',
    badgeColor: 'rose',
    description: 'MV Jindal Enterprise is enroute from Richards Bay (SA) to Mangalore (India) under DAP incoterm. Destination terminal has 0 open slots. Predicted demurrage penalty: $98,000.',
    incoterm: 'DAP',
    client: 'Jindal Steel & Power Ltd',
    vesselId: 'VES-JINDAL-ENT',
    product: 'RB1 High CV Export Coal',
    volume: 68500,
    portOfLoading: 'Richards Bay Dry Bulk Terminal',
    portOfDestination: 'New Mangalore Bulk Port (India)',
    demurrageAmountUSD: 98000
  },
  {
    id: 'scen-fob-on-time',
    title: '✅ FOB Standard: On-Time Loading at Maputo',
    badge: 'ON SCHEDULE',
    badgeColor: 'emerald',
    description: 'MV African Flame is loading at Maputo berth #04 under FOB. Truck haulage rate is optimal, laytime 30 hours remaining.',
    incoterm: 'FOB',
    client: 'ArcelorMittal Global Trading',
    vesselId: 'VES-AFRICAN-FLAME',
    product: 'RB2 Commercial Coal',
    volume: 42000,
    portOfLoading: 'Maputo Bulk Terminal',
    portOfDestination: 'Mundra Port Bulk Siding',
    demurrageAmountUSD: 0
  },
  {
    id: 'scen-cif-laycan-warning',
    title: '⚠️ CIF Risk: Laycan Window Miss Alert',
    badge: 'LAYCAN RISK',
    badgeColor: 'amber',
    description: 'Truck gate congestion at Witbank mine is slowing down delivery to Richards Bay. Risk of missing cancelling date by 14 hours.',
    incoterm: 'CIF',
    client: 'Tata International Bulk Minerals',
    vesselId: 'VES-JINDAL-ENT',
    product: 'Metallurgical Coal',
    volume: 55000,
    portOfLoading: 'Richards Bay Dry Bulk Terminal',
    portOfDestination: 'Mundra Port Bulk Siding',
    demurrageAmountUSD: 44000
  }
]
