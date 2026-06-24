import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const { dealTitle, dealValue, contactName, propertyTitle, propertyAddress, notes } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate a structured real estate proposal that I can copy and send to a client. Include sections for: property details, offer summary, timeline, next steps.

Deal: ${dealTitle}
Value: $${dealValue}
Client: ${contactName}
Property: ${propertyTitle || 'N/A'}
Address: ${propertyAddress || 'N/A'}
Notes: ${notes || 'N/A'}

Write the proposal in a professional, clear format using plain text.`,
      }],
    }),
  })

  const data = await res.json()
  const proposal = data.content?.[0]?.text || 'Unable to generate proposal.'

  return NextResponse.json({ proposal })
}
