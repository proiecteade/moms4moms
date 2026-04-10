import { createSign } from 'node:crypto'

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

async function getAccessToken() {
  const raw = process.env.GOOGLE_ANALYTICS_CREDENTIALS
  if (!raw) throw new Error('Missing credentials')
  const creds = JSON.parse(raw)

  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url')

  const signingInput = `${header}.${payload}`
  const privateKey = creds.private_key.replace(/\\n/g, '\n')
  const sign = createSign('RSA-SHA256')
  sign.update(signingInput)
  const signature = sign.sign(privateKey, 'base64url')
  const jwt = `${signingInput}.${signature}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) throw new Error(tokenData.error_description || 'Token error')
  return tokenData.access_token
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
  if (!propertyId || !process.env.GOOGLE_ANALYTICS_CREDENTIALS) {
    return Response.json({ error: 'Analytics indisponibil' }, { status: 503 })
  }

  try {
    const token = await getAccessToken()

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
