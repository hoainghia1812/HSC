import { NextRequest, NextResponse } from 'next/server'
import { registerUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Register API started')
    console.log('📝 Environment check:')
    console.log('  - SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')
    console.log('  - SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING')
    console.log('  - SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING')
    
    const body = await request.json()
    console.log('📥 Request body received:', { 
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      birth_date: body.birth_date,
      password: body.password ? '[HIDDEN]' : 'MISSING'
    })
    
    const { full_name, email, phone, birth_date, password } = body

    // Validate required fields
    if (!full_name || !email || !phone || !password) {
      console.log('❌ Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }
    console.log('✅ Required fields validation passed')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Email validation failed:', email)
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }
    console.log('✅ Email validation passed')

    // Validate phone format (Vietnam phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    if (!phoneRegex.test(phone)) {
      console.log('❌ Phone validation failed:', phone)
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      )
    }
    console.log('✅ Phone validation passed')

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password validation failed: length =', password.length)
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }
    console.log('✅ Password validation passed')

    // Register user
    console.log('🔄 Calling registerUser function...')
    const result = await registerUser({
      full_name,
      email,
      phone,
      birth_date,
      password
    })
    console.log('📤 registerUser result:', { 
      hasError: !!result.error,
      hasUser: !!result.user,
      error: result.error
    })

    if (result.error) {
      console.log('❌ Register failed with error:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    if (result.user) {
      console.log('✅ User registered successfully:', result.user.id)
      // Generate token for auto login after registration
      const token = generateToken(result.user)
      console.log('🔑 JWT token generated')
      
      return NextResponse.json({
        success: true,
        message: 'Đăng ký thành công',
        user: result.user,
        token
      })
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    )

  } catch (error) {
    console.error('💥 FATAL ERROR in Register API:')
    console.error('  - Error type:', typeof error)
    console.error('  - Error message:', error instanceof Error ? error.message : error)
    console.error('  - Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('  - Full error object:', error)
    
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trên server' },
      { status: 500 }
    )
  }
}
