import { NextRequest, NextResponse } from 'next/server'
import { registerUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Register API started')

    // Check environment variables
    const envStatus = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }
    console.log('📝 Environment check:', envStatus)

    if (!envStatus.SUPABASE_URL || !envStatus.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase config is missing on server' },
        { status: 500 }
      )
    }

    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { full_name, email, phone, birth_date, password } = body
    console.log('📥 Body received:', {
      full_name,
      email,
      phone,
      birth_date,
      password: password ? '[HIDDEN]' : 'MISSING',
    })

    // === Validation ===
    if (!full_name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // === Call registerUser ===
    console.log('🔄 Calling registerUser...')
    const result = await registerUser({
      full_name,
      email,
      phone,
      birth_date,
      password,
    })

    if (result?.error) {
      console.error('❌ registerUser error:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    if (result?.user) {
      console.log('✅ User registered:', result.user.id)
      const token = generateToken(result.user)
      return NextResponse.json({
        success: true,
        message: 'Đăng ký thành công',
        user: result.user,
        token,
      })
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng ký (user not returned)' },
      { status: 500 }
    )

  } catch (error: any) {
    console.error('💥 FATAL ERROR Register API:', error)
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra trên server' },
      { status: 500 }
    )
  }
}
