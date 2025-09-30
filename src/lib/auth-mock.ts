import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// JWT Secret - trong production nên dùng environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only-change-in-production'

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

// Mock database
const mockUsers: Array<{
  id: string
  email: string
  full_name: string
  phone: string
  birth_date?: string
  password_hash: string
  role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
  created_at: string
}> = []

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
      full_name: user.full_name,
      phone: user.phone,
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
      full_name: string
      phone: string
      role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
    }
    return {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name,
      phone: decoded.phone,
      role: decoded.role
    }
  } catch {
    return null
  }
}

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Register user (Mock)
export async function registerUser(userData: RegisterData): Promise<{ user?: AuthUser; error?: string }> {
  try {
    // Check if email or phone already exists
    const existingUser = mockUsers.find(u => u.email === userData.email || u.phone === userData.phone)
    
    if (existingUser) {
      if (existingUser.email === userData.email) {
        return { error: 'Email đã được sử dụng' }
      }
      if (existingUser.phone === userData.phone) {
        return { error: 'Số điện thoại đã được sử dụng' }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create new user
    const newUser = {
      id: generateUUID(),
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      birth_date: userData.birth_date,
      password_hash: hashedPassword,
      role: 'user' as const,
      created_at: new Date().toISOString()
    }

    // Add to mock database
    mockUsers.push(newUser)

    console.log('Mock user registered:', { id: newUser.id, email: newUser.email, full_name: newUser.full_name })

    // Return auth user (without password_hash)
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      phone: newUser.phone,
      role: newUser.role
    }

    return { user: authUser }
  } catch {
    console.error('Register exception')
    return { error: 'Có lỗi xảy ra khi đăng ký' }
  }
}

// Login user (Mock)
export async function loginUser(loginData: LoginData): Promise<{ user?: AuthUser; token?: string; error?: string }> {
  try {
    // Find user by email
    const user = mockUsers.find(u => u.email === loginData.email)

    if (!user) {
      return { error: 'Email hoặc mật khẩu không đúng' }
    }

    // Verify password
    const isPasswordValid = await verifyPassword(loginData.password, user.password_hash)
    if (!isPasswordValid) {
      return { error: 'Email hoặc mật khẩu không đúng' }
    }

    // Create auth user object (without password_hash)
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role
    }

    // Generate token
    const token = generateToken(authUser)

    console.log('Mock user logged in:', { id: authUser.id, email: authUser.email })

    return { user: authUser, token }
  } catch {
    console.error('Login exception')
    return { error: 'Có lỗi xảy ra khi đăng nhập' }
  }
}

// Debug function to see all mock users
export function getMockUsers() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return mockUsers.map(({ password_hash, ...user }) => user)
}
