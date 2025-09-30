import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/exams', '/practice', '/results']

// Routes that require admin role
const adminRoutes = ['/admin']

// Routes that should redirect to dashboard if user is already logged in
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from Authorization header or cookies
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value

  // Debug logs (disable in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Middleware Debug:')
    console.log('Path:', pathname)
    console.log('Token present:', !!token)
  }

  // Check route types
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If accessing protected or admin route without token, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    const user = verifyToken(token)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('User from token:', user)
      console.log('User role:', user?.role)
    }
    
    // If token is invalid and accessing protected/admin route, redirect to login
    if (!user && (isProtectedRoute || isAdminRoute)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If accessing admin route but user is not admin, redirect to dashboard
    if (user && isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // If token is valid and accessing auth routes, redirect based on role
    if (user && isAuthRoute) {
      if (user.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'], // giữ matcher nếu có
  runtime: 'nodejs', // ⚡ ép dùng Node.js runtime thay vì Edge
};


