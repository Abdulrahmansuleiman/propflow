import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const { notes } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Summarize the following meeting notes into bullet-point action items. Be specific and actionable.

Notes:
${notes}

Output format:
• [Action item 1]
• [Action item 2]
...`,
      }],
    }),
  })

  const data = await res.json()
  const summary = data.content?.[0]?.text || 'Unable to summarize notes.'

  return NextResponse.json({ summary })
}
