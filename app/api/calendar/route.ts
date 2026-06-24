import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { summary, description, startTime, endTime } = await req.json()

  const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    return NextResponse.json({ error: 'Google Calendar not configured. Set GOOGLE_CALENDAR_CLIENT_EMAIL and GOOGLE_CALENDAR_PRIVATE_KEY in .env' }, { status: 500 })
  }

  try {
    const { google } = await import('googleapis')
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        start: { dateTime: startTime, timeZone: 'America/New_York' },
        end: { dateTime: endTime, timeZone: 'America/New_York' },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    })

    return NextResponse.json({ eventId: event.data.id, link: event.data.htmlLink })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
