import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
]

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com *.openai.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: *.stripe.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' *.stripe.com *.openai.com api.openai.com;
  worker-src 'self' blob:;
`.replace(/\s{2,}/g, ' ').trim()

// CORS configuration
const corsOptions = {
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'https://rankme.app',
    'https://www.rankme.app'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'x-csrf-token'
  ]
}



// Check if origin is allowed
function isOriginAllowed(origin: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true // Allow all origins in development
  }
  
  return corsOptions.allowedOrigins.includes(origin)
}

// Handle CORS
function handleCORS(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin')
  
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // Same-origin request or direct navigation
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  
  response.headers.set('Access-Control-Allow-Methods', corsOptions.allowedMethods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
  
  return response
}

// Main middleware function
export async function middleware(request: NextRequest) {
  try {
    const { pathname, origin } = request.nextUrl
    
    // Handle preflight CORS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      return handleCORS(request, response)
    }
  
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/coach', '/report', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(url)
    }
  }
  
  // Continue with the request
  const response = NextResponse.next()
  
  // Apply security headers
  securityHeaders.forEach((header) => {
    response.headers.set(header.key, header.value)
  })
  
  // Apply CSP header
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', ContentSecurityPolicy)
  }
  
    // Handle CORS for API routes
    if (pathname.startsWith('/api/')) {
      return handleCORS(request, response)
    }
    
    return response
  } catch (error) {
    // Log middleware errors but don't crash the app
    console.error('Middleware error:', error)
    
    // Return a basic response for any middleware errors
    const response = NextResponse.next()
    
    // Still apply basic security headers even if there's an error
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    
    return response
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}