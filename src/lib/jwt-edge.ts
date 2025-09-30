// Edge Runtime compatible JWT verification
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only-change-in-production'

// Convert string secret to JWK format for jose
async function getSecretKey() {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(JWT_SECRET)
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function verifyTokenEdge(token: string) {
  try {
    const secret = await getSecretKey()
    const { payload } = await jwtVerify(token, secret)
    
    return payload as {
      id: string
      email: string
      role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
      iat: number
      exp: number
    }
  } catch (error) {
    console.log('❌ Edge JWT verification failed:', error instanceof Error ? error.message : error)
    return null
  }
}
