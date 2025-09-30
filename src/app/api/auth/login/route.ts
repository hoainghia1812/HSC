import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    // Login user
    const result = await loginUser({ email, password })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    if (result.user && result.token) {
      return NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: result.user,
        token: result.token
      })
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng nhập' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trên server' },
      { status: 500 }
    )
  }
}
