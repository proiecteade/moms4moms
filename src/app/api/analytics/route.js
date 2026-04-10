import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

function getClient() {
  const raw = process.env.GOOGLE_ANALYTICS_CREDENTIALS
  if (!raw || !propertyId) return null
  try {
    const credentials = JSON.parse(raw)
    return new BetaAnalyticsDataClient({ credentials })
  } catch {
    return null
  }
}

export async function GET() {
  const client = getClient()
  if (!client) {
    return Response.json({ error: 'Analytics indisponibil' }, { status: 503 })
  }

  try {
    const [overviewResp, pagesResp] = await Promise.all([
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    ])

    const row = overviewResp[0]?.rows?.[0]?.metricValues || []
    const overview = {
      users: row[0]?.value || '0',
      sessions: row[1]?.value || '0',
      pageviews: row[2]?.value || '0',
    }

    const pages = (pagesResp[0]?.rows || []).map(r => ({
      path: r.dimensionValues[0]?.value,
      views: r.metricValues[0]?.value,
    }))

    return Response.json({ overview, pages })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
