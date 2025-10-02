import { NextResponse } from 'next/server'
import { registerUser, generateToken, AuthUser, RegisterData } from '@/lib/auth'

interface RegisterResult {
  user?: AuthUser
  token?: string
  error?: string
}

export async function POST(req: Request): Promise<NextResponse<RegisterResult>> {
  try {
    const body: RegisterData = await req.json()

    const { full_name, email, phone, password } = body

    if (!full_name || !email || !phone || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
    }

    const result = await registerUser(body)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    if (result.user) {
      const token = generateToken(result.user)
      return NextResponse.json(
        { user: result.user, token },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  } catch (err) {
    console.error('❌ Register API exception:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
