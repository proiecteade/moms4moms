import { GoogleAuth } from 'google-auth-library'

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

function getAuth() {
  const raw = process.env.GOOGLE_ANALYTICS_CREDENTIALS
  if (!raw || !propertyId) return null
  try {
    const credentials = JSON.parse(raw)
    return new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    })
  } catch {
    return null
  }
}

async function runReport(token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  return res.json()
}

export async function GET() {
  const auth = getAuth()
  if (!auth) {
    return Response.json({ error: 'Analytics indisponibil' }, { status: 503 })
  }

  try {
    const client = await auth.getClient()
    const { token } = await client.getAccessToken()

    const [overviewData, pagesData] = await Promise.all([
      runReport(token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      }),
      runReport(token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    ])

    const row = overviewData.rows?.[0]?.metricValues || []
    const overview = {
      users: row[0]?.value || '0',
      sessions: row[1]?.value || '0',
      pageviews: row[2]?.value || '0',
    }

    const pages = (pagesData.rows || []).map(r => ({
      path: r.dimensionValues[0]?.value,
      views: r.metricValues[0]?.value,
    }))

    return Response.json({ overview, pages })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
