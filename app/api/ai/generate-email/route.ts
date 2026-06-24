import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const { dealTitle, contactName, notes, lastActivity } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Draft a professional follow-up email for a real estate deal. Keep it concise and warm.

Deal: ${dealTitle}
Contact: ${contactName}
Notes: ${notes || 'N/A'}
Last Activity: ${lastActivity || 'N/A'}

Write only the email body, no subject line. Use a natural, helpful tone.`,
      }],
    }),
  })

  const data = await res.json()
  const draft = data.content?.[0]?.text || 'Unable to generate email draft.'

  return NextResponse.json({ draft })
}
