import { NextRequest, NextResponse } from 'next/server'
import { createSession, clearSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password === process.env.PASSWORD) {
    await createSession()
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  await clearSession()
  return NextResponse.json({ success: true })
}
