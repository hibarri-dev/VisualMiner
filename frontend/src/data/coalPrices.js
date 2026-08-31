/** Live coal indexes. Official Argus API2/API4 is licensed; we pull published market prints. */

const API4_PAGE = 'https://markets.nationalcoal.co.za/api4-coal-price-today/'
const API4_VIA = `https://r.jina.ai/${API4_PAGE}`
const API2_YAHOO = '/coal-live/yahoo'
const API2_YAHOO_DIRECT = 'https://query1.finance.yahoo.com/v8/finance/chart/MTF=F?interval=1d&range=5d'

function num(s) {
  const n = Number(String(s).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseApi4(text) {
  const price = num(
    text.match(/Current Price\$([0-9]+(?:\.[0-9]+)?)\s*USD\/Tonne/)?.[1] ||
      text.match(/API4 coal price today is \*\*\$([0-9]+(?:\.[0-9]+)?)\/t\*\*/i)?.[1] ||
      text.match(/\$([0-9]+(?:\.[0-9]+)?)\s*\n+USD per ton/)?.[1]
  )
  if (price == null) return null
  const asOf = (text.match(/Last Updated:\s*([^\n]+)/i)?.[1] || text.match(/Market Date\s*([^\n]+)/i)?.[1] || '')
    .replace(/\*\*/g, '')
    .trim()
  const vsWeek = num(text.match(/7 Day Change\s*([+\-]?[0-9]+(?:\.[0-9]+)?)%/)?.[1])
  const vsDay = num(text.match(/1 Day Change\s*([+\-]?[0-9]+(?:\.[0-9]+)?)%/)?.[1] || text.match(/Daily Change\s*([+\-]?[0-9]+(?:\.[0-9]+)?)%/)?.[1])
  const rb2 = num(text.match(/### RB2 Coal Price[\s\S]*?Current Price\$([0-9]+(?:\.[0-9]+)?)/)?.[1])
  return { price, asOf, vsWeek, vsDay, rb2 }
}

function parseYahooApi2(json) {
  const meta = json?.chart?.result?.[0]?.meta
  if (!meta?.regularMarketPrice) return null
  const asOf = meta.regularMarketTime
    ? new Date(meta.regularMarketTime * 1000).toISOString().slice(0, 10)
    : ''
  const prev = meta.chartPreviousClose
  const vsWeek =
    prev && prev !== 0 ? Math.round(((meta.regularMarketPrice - prev) / prev) * 1000) / 10 : null
  return { price: meta.regularMarketPrice, asOf, vsWeek }
}

async function readText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.text()
}

export async function fetchLiveCoalPrices() {
  const quotes = []

  try {
    const text = await readText(API4_VIA)
    const api4 = parseApi4(text)
    if (api4) {
      quotes.push({
        id: 'api4-live',
        siteId: 'talcher-anthracite',
        index: 'API4',
        basis: 'FOB Richards Bay 6000 kcal',
        usdPerT: api4.price,
        asOf: api4.asOf || new Date().toISOString().slice(0, 10),
        vsWeekPercent: api4.vsWeek,
        note: 'Live from National Coal daily print (not a licensed Argus feed).',
        source: 'live',
        provider: 'markets.nationalcoal.co.za'
      })
      if (api4.rb2) {
        quotes.push({
          id: 'rb2-live',
          siteId: 'talcher-anthracite',
          index: 'RB2',
          basis: 'Richards Bay grade vs API4',
          usdPerT: api4.rb2,
          asOf: api4.asOf || new Date().toISOString().slice(0, 10),
          vsWeekPercent: api4.vsWeek,
          note: 'Published with the API4 print.',
          source: 'live',
          provider: 'markets.nationalcoal.co.za'
        })
      }
    }
  } catch {
    /* keep going — API2 may still land */
  }

  try {
    let json
    try {
      const res = await fetch(API2_YAHOO)
      if (!res.ok) throw new Error('proxy')
      json = await res.json()
    } catch {
      const res = await fetch(API2_YAHOO_DIRECT)
      if (!res.ok) throw new Error('yahoo')
      json = await res.json()
    }
    const api2 = parseYahooApi2(json)
    if (api2) {
      quotes.push({
        id: 'api2-live',
        siteId: 'talcher-anthracite',
        index: 'API2',
        basis: 'CIF ARA 6000 kcal (Yahoo MTF=F last print)',
        usdPerT: api2.price,
        asOf: api2.asOf,
        vsWeekPercent: api2.vsWeek,
        note: 'CME API2 futures last trade. Contract was delisted; last available print.',
        source: 'live',
        provider: 'Yahoo Finance MTF=F'
      })
    }
  } catch {
    /* API4 alone still satisfies API2 or API4 */
  }

  return quotes
}

export function applyLiveCoal(capture, quotes) {
  if (!capture || !quotes?.length) return capture
  const api4 = quotes.find(q => q.index === 'API4')
  const kpis = capture.production?.kpis || {}
  const nextKpis = {}
  for (const [period, row] of Object.entries(kpis)) {
    nextKpis[period] = api4 ? { ...row, api4Usd: api4.usdPerT } : row
  }
  return {
    ...capture,
    production: {
      ...capture.production,
      kpis: nextKpis,
      coal: quotes
    }
  }
}
