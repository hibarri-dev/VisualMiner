import data from './drillholes.json'
import { drillMeta } from '../three/oreBody'

const filings = drillMeta.project?.filings || []

/** Raven's three-bucket normalization — every connector maps into one of these. */
export function normalizedLayer() {
  const spatial = [
    {
      kind: 'point',
      name: 'Drill collars',
      count: data.collars.length,
      crs: drillMeta.origin?.crs,
      source: 'Micromine-style collar table (from NI 43-101)'
    },
    {
      kind: 'line',
      name: 'Hole traces',
      count: data.collars.length,
      metres: drillMeta.metresDrilled,
      source: 'Desurveyed azimuth / dip / length'
    },
    {
      kind: 'line',
      name: 'Assay intervals',
      count: data.intervals.length,
      source: 'LIMS composites published in investor filings'
    },
    {
      kind: 'plane',
      name: 'Appleton Fault (seismic target)',
      count: 1,
      source: '3-D seismic survey 2023 — schematic structure plane'
    }
  ]

  const timeseries = Object.entries(drillMeta.metresByYear || {}).map(([year, metres]) => ({
    entity_id: 'queensway-nfg',
    metric: 'metres_drilled',
    value: metres,
    timestamp: `${year}-12-31`
  }))

  const documents = filings.map(f => ({
    mine: drillMeta.project?.name,
    date: f.date,
    stage: 'prospecting',
    author: drillMeta.project?.company,
    title: f.title,
    kind: f.kind,
    url: f.url,
    content: f.title
  }))

  return { spatial, timeseries, documents }
}

export const PIPELINE_STEPS = [
  { id: 'ingest', label: 'Ingest filings', detail: '3 public NI 43-101 drill + seismic disclosures' },
  { id: 'normalize', label: 'Normalize', detail: 'Spatial vectors · time-series · documents' },
  { id: 'desurvey', label: 'Desurvey holes', detail: 'Collar + azimuth/dip → 3D traces' },
  { id: 'estimate', label: 'IDW shells', detail: 'Grade interpolant around intercepts (not a resource)' },
  { id: 'summarize', label: 'AI summary', detail: 'What an exec sees without opening six PDFs' }
]

export function explorationNarrative() {
  const p = drillMeta.project || {}
  const best = drillMeta.bestIntercept || {}
  const metres = drillMeta.metresDrilled || 0
  return {
    extraction: [
      `${p.company} · ${p.ticker}`,
      'No operating mine — prospecting / PEA stage'
    ],
    throughput: [
      `${drillMeta.holeCount} holes · ${Math.round(metres).toLocaleString()} m drilled`,
      `${drillMeta.intervalCount} published composites ≥ 1 g/t Au`
    ],
    shipments: [
      `Best: ${best.grade} g/t Au over ${(best.to - best.from).toFixed(2)} m in ${best.id}`,
      p.seismic || '3-D seismic used to target deep holes'
    ]
  }
}
