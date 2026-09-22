/**
 * Mine Shift Reports Dummy Data & Templates
 */

export const INITIAL_SHIFT_REPORTS = [
  {
    id: 'REP-2026-0922-D1',
    date: '2026-09-22',
    shift: 'Day Shift (06:00 - 18:00)',
    mineName: 'Kolar North Open Pit',
    managerName: 'Devraj Mudaliar',
    oreType: 'Thermal Coal',
    oreSpec: 'RB1 (6000 kcal/kg Export Quality)',
    tonsExtracted: 18450,
    tonsProcessed: 16200,
    tonsInStockpile: 84200,
    tonsLoadedForTrucking: 14800,
    tonsDispatchedOnTrucks: 14200,
    managerNotes: 'High productivity shift on Bench 4 North. Excavator EX-04 experienced a minor hydraulic hose leak at 11:30, resolved in 35 mins. Wash plant throughput exceeded target by +4%. Truck dispatch flow to Richards Bay rail siding ran continuously with 0 weighbridge discrepancies.',
    handoverNotes: 'Bench 4 blasting completed at 16:30. Night shift crew should clear remaining blasted rock at Block B3 before 21:00. Ensure haul road #2 dust suppression sprinkler remains active.',
    pdfAttachment: { name: 'Shift_Summary_Kolar_20260922_Day.pdf', size: '2.4 MB', uploadedAt: '2026-09-22 17:45' },
    labSpecSheet: { name: 'Assay_Lab_Cert_RB1_Batch884.pdf', size: '1.8 MB', ashContent: '12.4%', moisture: '8.1%', volatileMatter: '24.2%', calorificValue: '6020 kcal/kg' }
  },
  {
    id: 'REP-2026-0921-N2',
    date: '2026-09-21',
    shift: 'Night Shift (18:00 - 06:00)',
    mineName: 'Witbank Basin Pit 2',
    managerName: 'Johan Pretorius',
    oreType: 'Export Thermal Coal',
    oreSpec: 'RB2 (5500 kcal/kg Standard)',
    tonsExtracted: 15200,
    tonsProcessed: 14100,
    tonsInStockpile: 62500,
    tonsLoadedForTrucking: 12000,
    tonsDispatchedOnTrucks: 11400,
    managerNotes: 'Heavy rain between 01:00 and 03:00 slowed pit haulage on Ramp 1. De-watering pumps deployed on Sump 3. All trucks weighed cleanly at main gate weighbridge.',
    handoverNotes: 'Inspect Ramp 1 gravel grade at 06:30. Crushing plant feeder #2 scheduled for routine screen cleaning during day shift meal break.',
    pdfAttachment: { name: 'Shift_Log_Witbank_20260921_Night.pdf', size: '3.1 MB', uploadedAt: '2026-09-22 05:50' },
    labSpecSheet: { name: 'Witbank_Assay_Spec_RB2.pdf', size: '1.2 MB', ashContent: '15.8%', moisture: '9.4%', volatileMatter: '22.8%', calorificValue: '5540 kcal/kg' }
  },
  {
    id: 'REP-2026-0921-D1',
    date: '2026-09-21',
    shift: 'Day Shift (06:00 - 18:00)',
    mineName: 'Hospet Coking Ore Yard',
    managerName: 'Kavitha Rao',
    oreType: 'Metallurgical Coking Coal',
    oreSpec: 'Anthracite Grade A (Low Volatile)',
    tonsExtracted: 9800,
    tonsProcessed: 9500,
    tonsInStockpile: 41000,
    tonsLoadedForTrucking: 8900,
    tonsDispatchedOnTrucks: 8900,
    managerNotes: 'Metallurgical grade processing running smoothly. Heavy media separation plant operating at 98.2% efficiency. All 8900 tons loaded directly to Mangalore Port train rakes.',
    handoverNotes: 'Train rake #4 arrived at 17:15; loading expected to finish by 20:30. No equipment issues.',
    pdfAttachment: { name: 'Hospet_Daily_Log_20260921.pdf', size: '1.9 MB', uploadedAt: '2026-09-21 18:10' },
    labSpecSheet: { name: 'Anthracite_Assay_Cert_A.pdf', size: '2.0 MB', ashContent: '9.2%', moisture: '4.5%', volatileMatter: '11.0%', calorificValue: '7100 kcal/kg' }
  }
]
