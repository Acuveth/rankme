import { NextRequest, NextResponse } from 'next/server'
import { ZodError, ZodSchema } from 'zod'

// Input validation middleware
export function withValidation<T>(
  schema: ZodSchema<T>
) {
  return function(handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        let data: any
        
        // Handle different request methods
        if (request.method === 'GET') {
          // For GET requests, validate query parameters
          const url = new URL(request.url)
          const params = Object.fromEntries(url.searchParams.entries())
          data = params
        } else {
          // For POST, PUT, PATCH requests, validate request body
          const body = await request.json().catch(() => ({}))
          data = body
        }
        
        // Validate the data
        const validatedData = schema.parse(data)
        
        // Call the handler with validated data
        return handler(request, validatedData)
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              error: 'Validation Error',
              message: 'Invalid input data',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
              }))
            },
            { status: 400 }
          )
        }
        
        // Handle other errors (e.g., JSON parsing errors)
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Invalid request format'
          },
          { status: 400 }
        )
      }
    }
  }
}

// Security headers middleware
export function withSecurityHeaders(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request)
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Add CSP header for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none';"
      )
    }
    
    return response
  }
}

// CORS middleware
export function withCORS(
  options: {
    origin?: string | string[]
    methods?: string[]
    credentials?: boolean
  } = {},
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': options.origin 
            ? Array.isArray(options.origin) 
              ? options.origin.join(', ') 
              : options.origin
            : process.env.NODE_ENV === 'production' 
              ? 'https://rankme.app' 
              : 'http://localhost:3003',
          'Access-Control-Allow-Methods': (options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).join(', '),
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': options.credentials ? 'true' : 'false',
          'Access-Control-Max-Age': '86400' // 24 hours
        }
      })
    }
    
    const response = await handler(request)
    
    // Add CORS headers to actual response
    response.headers.set(
      'Access-Control-Allow-Origin',
      options.origin 
        ? Array.isArray(options.origin) 
          ? options.origin.join(', ') 
          : options.origin
        : process.env.NODE_ENV === 'production' 
          ? 'https://rankme.app' 
          : 'http://localhost:3003'
    )
    
    if (options.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    return response
  }
}

// Combine multiple middleware functions
export function withMiddleware(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  // This would typically use NextAuth's getToken or similar
  // For now, this is a placeholder that checks for a session
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')
  
  // Check for session cookie or authorization header
  if (!cookieHeader && !authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    )
  }
  
  // In a real implementation, you'd validate the token/session here
  // For now, we'll assume the request is authenticated if headers are present
  return { userId: 'user_id_from_session' }
}

// Error handling middleware with sanitization
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)
      
      // Sanitize error responses for production
      if (process.env.NODE_ENV === 'production') {
        // Don't expose internal errors in production
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again.'
          },
          { status: 500 }
        )
      } else {
        // In development, provide more detailed error information
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          },
          { status: 500 }
        )
      }
    }
  }
}

// Input sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .replace(/[^\w\s\-_.@]/g, '') // Keep only safe characters
    .trim()
    .slice(0, 1000) // Limit length
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key)
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value)
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[sanitizedKey] = value
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      )
    } else if (value && typeof value === 'object') {
      sanitized[sanitizedKey] = sanitizeObject(value)
    }
  }
  
  return sanitized
}