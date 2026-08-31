/**
 * Comprehensive dummy telemetry data for VisualMiner Production & Mining Cycle
 * Provides realistic numbers for all 5 stages across different time ranges and mines.
 */

export const STAGE_DATA_BY_MINE_AND_RANGE = {
  kulilia: {
    today: {
      preparation: {
        metric: '+80%',
        metricColor: 'text-emerald-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 45, value: '18,500 t', delta: '+8%' },
          { id: 'processed', label: 'Drill Grid', heightPct: 25, value: '92 Holes', delta: '+14%' },
          { id: 'shipped', label: 'Blasted Volume', heightPct: 75, value: '54,000 m³', delta: '+80%' },
          { id: 'raw_ore', label: 'Raw Ore Exp.', heightPct: 92, value: '78,200 t', delta: '+22%' }
        ]
      },
      extraction: {
        metric: '+40%',
        metricColor: 'text-emerald-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 38, value: '28,400 t', delta: '+12%' },
          { id: 'processed', label: 'Processed', heightPct: 18, value: '14,200 t', delta: '-8%' },
          { id: 'shipped', label: 'Shipped', heightPct: 68, value: '49,800 t', delta: '+24%' },
          { id: 'raw_ore', label: 'Raw Ore', heightPct: 96, value: '67,500 t', delta: '+40%' }
        ]
      },
      processing: {
        metric: '-122%',
        metricColor: 'text-rose-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 52, value: '34,100 t', delta: '+5%' },
          { id: 'processed', label: 'Processed (X17)', heightPct: 14, value: '8,400 t', delta: '-122%' },
          { id: 'shipped', label: 'Shipped', heightPct: 60, value: '41,000 t', delta: '+10%' },
          { id: 'raw_ore', label: 'Raw Ore Feed', heightPct: 88, value: '62,000 t', delta: '+15%' }
        ]
      },
      haulage: {
        metric: '-36%',
        metricColor: 'text-rose-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 40, value: '26,000 t', delta: '-10%' },
          { id: 'processed', label: 'Transit Cycles', heightPct: 22, value: '18 Trips/h', delta: '-36%' },
          { id: 'shipped', label: 'Shipped', heightPct: 65, value: '44,500 t', delta: '+18%' },
          { id: 'raw_ore', label: 'Pit Haul Tonnage', heightPct: 84, value: '59,000 t', delta: '+12%' }
        ]
      },
      shipping: {
        metric: '-16%',
        metricColor: 'text-rose-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 48, value: '31,200 t', delta: '+6%' },
          { id: 'processed', label: 'Weighbridge Load', heightPct: 28, value: '19,800 t', delta: '-16%' },
          { id: 'shipped', label: 'Shipped Port', heightPct: 72, value: '52,400 t', delta: '+15%' },
          { id: 'raw_ore', label: 'Allocated Ore', heightPct: 90, value: '64,000 t', delta: '+20%' }
        ]
      }
    },
    yesterday: {
      extraction: {
        metric: '+35%',
        metricColor: 'text-emerald-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 35, value: '26,100 t', delta: '+10%' },
          { id: 'processed', label: 'Processed', heightPct: 15, value: '12,800 t', delta: '-12%' },
          { id: 'shipped', label: 'Shipped', heightPct: 64, value: '47,200 t', delta: '+20%' },
          { id: 'raw_ore', label: 'Raw Ore', heightPct: 92, value: '64,100 t', delta: '+35%' }
        ]
      }
    },
    this_week: {
      extraction: {
        metric: '+48%',
        metricColor: 'text-emerald-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 42, value: '142,000 t', delta: '+16%' },
          { id: 'processed', label: 'Processed', heightPct: 24, value: '88,500 t', delta: '-4%' },
          { id: 'shipped', label: 'Shipped', heightPct: 74, value: '260,000 t', delta: '+28%' },
          { id: 'raw_ore', label: 'Raw Ore', heightPct: 98, value: '380,000 t', delta: '+48%' }
        ]
      }
    },
    this_month: {
      extraction: {
        metric: '+52%',
        metricColor: 'text-emerald-400',
        chart: [
          { id: 'stockpiled', label: 'Stockpiled', heightPct: 46, value: '580,000 t', delta: '+22%' },
          { id: 'processed', label: 'Processed', heightPct: 26, value: '320,000 t', delta: '+2%' },
          { id: 'shipped', label: 'Shipped', heightPct: 78, value: '1,050,000 t', delta: '+34%' },
          { id: 'raw_ore', label: 'Raw Ore', heightPct: 99, value: '1,420,000 t', delta: '+52%' }
        ]
      }
    }
  }
}

export function getStageData(mineId = 'kulilia', timeRange = 'today', stageId = 'extraction') {
  const mineData = STAGE_DATA_BY_MINE_AND_RANGE[mineId] || STAGE_DATA_BY_MINE_AND_RANGE.kulilia
  const rangeData = mineData[timeRange] || mineData.today || STAGE_DATA_BY_MINE_AND_RANGE.kulilia.today
  return (
    rangeData[stageId] ||
    STAGE_DATA_BY_MINE_AND_RANGE.kulilia.today[stageId] ||
    STAGE_DATA_BY_MINE_AND_RANGE.kulilia.today.extraction
  )
}
