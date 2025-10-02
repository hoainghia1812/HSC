import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from './supabase'

// JWT Secret - trong production nên dùng environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only-change-in-production'

// Debug logs for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Auth module loaded - JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING')
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
}

export interface RegisterData {
  full_name: string
  email: string
  phone: string
  birth_date?: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      email: string
      full_name?: string
      phone?: string
      role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name || '',
      phone: decoded.phone || '',
      role: decoded.role
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ JWT verification failed:', error instanceof Error ? error.message : error)
    }
    return null
  }
}

// Register user
export async function registerUser(userData: RegisterData): Promise<{ user?: AuthUser; error?: string }> {
  try {
    console.log('🔍 registerUser: Starting registration process')
    console.log('🔍 registerUser: Checking for existing user...')
    
    // Check if email or phone already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email, phone')
      .or(`email.eq.${userData.email},phone.eq.${userData.phone}`)
      .maybeSingle()

    console.log('🔍 registerUser: Check existing user result:', { 
      hasData: !!existingUser, 
      hasError: !!checkError,
      errorCode: checkError?.code,
      errorMessage: checkError?.message
    })

    if (existingUser && !checkError) {
      console.log('⚠️  registerUser: Found existing user')
      const user = existingUser as { email: string; phone: string }
      if (user.email === userData.email) {
        console.log('❌ registerUser: Email already exists')
        return { error: 'Email đã được sử dụng' }
      }
      if (user.phone === userData.phone) {
        console.log('❌ registerUser: Phone already exists')
        return { error: 'Số điện thoại đã được sử dụng' }
      }
    }

    // Hash password
    console.log('🔒 registerUser: Hashing password...')
    const hashedPassword = await hashPassword(userData.password)
    console.log('✅ registerUser: Password hashed successfully')

    // Insert new user
    console.log('💾 registerUser: Inserting new user to database...')
    const { data, error } = await supabaseAdmin
      .from('users')
      // @ts-expect-error - Supabase type issue with insert
      .insert([{
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        birth_date: userData.birth_date || null,
        password_hash: hashedPassword,
        role: 'user'
      }])
      .select('id, email, full_name, phone, role')
      .single()

    console.log('💾 registerUser: Insert result:', {
      hasData: !!data,
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message,
      errorDetails: error?.details,
      errorHint: error?.hint
    })

    if (error) {
      console.error('❌ registerUser: Database insert failed')
      console.error('  - Code:', error.code)
      console.error('  - Message:', error.message)
      console.error('  - Details:', error.details)
      console.error('  - Hint:', error.hint)
      console.error('  - Full error:', error)
      return { error: 'Có lỗi xảy ra khi đăng ký' }
    }

    const newUser = data as AuthUser
    console.log('✅ registerUser: User created successfully:', newUser?.id)
    return { user: newUser }
  } catch (error) {
    console.error('💥 registerUser: EXCEPTION caught:')
    console.error('  - Error type:', typeof error)
    console.error('  - Error message:', error instanceof Error ? error.message : error)
    console.error('  - Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('  - Full error:', error)
    return { error: 'Có lỗi xảy ra khi đăng ký' }
  }
}

// Login user
export async function loginUser(loginData: LoginData): Promise<{ user?: AuthUser; token?: string; error?: string }> {
  try {
    // Get user by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone, role, password_hash')
      .eq('email', loginData.email)
      .single()

    if (error || !user) {
      return { error: 'Email hoặc mật khẩu không đúng' }
    }

    // Verify password
    const userData = user as { 
      id: string; 
      email: string; 
      full_name: string; 
      phone: string; 
      role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'; 
      password_hash: string 
    }
    const isPasswordValid = await verifyPassword(loginData.password, userData.password_hash)
    if (!isPasswordValid) {
      return { error: 'Email hoặc mật khẩu không đúng' }
    }

    // Create auth user object (without password_hash)
    const authUser: AuthUser = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role
    }

    // Generate token
    const token = generateToken(authUser)

    return { user: authUser, token }
  } catch {
    console.error('Login exception')
    return { error: 'Có lỗi xảy ra khi đăng nhập' }
  }
}
