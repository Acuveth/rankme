import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  DATABASE = 'DATABASE_ERROR'
}

// Custom error class
export class APIError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly details?: any
  public readonly shouldLog: boolean

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number,
    details?: any,
    shouldLog: boolean = true
  ) {
    super(message)
    this.name = 'APIError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.shouldLog = shouldLog
  }
}

// Predefined error classes
export class ValidationError extends APIError {
  constructor(message: string = 'Invalid input data', details?: any) {
    super(message, ErrorType.VALIDATION, 400, details, false)
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorType.AUTHENTICATION, 401, undefined, false)
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Access denied') {
    super(message, ErrorType.AUTHORIZATION, 403, undefined, true)
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, ErrorType.NOT_FOUND, 404, undefined, false)
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(message, ErrorType.CONFLICT, 409, undefined, false)
  }
}


export class ExternalAPIError extends APIError {
  constructor(service: string, message: string = 'External service error') {
    super(`${service}: ${message}`, ErrorType.EXTERNAL_API, 502, { service }, true)
  }
}

export class DatabaseError extends APIError {
  constructor(message: string = 'Database operation failed') {
    super(message, ErrorType.DATABASE, 500, undefined, true)
  }
}

// Error response interface
interface ErrorResponse {
  error: string
  message: string
  type?: string
  details?: any
  timestamp: string
  requestId?: string
}

// Sanitize error messages for production
function sanitizeErrorMessage(error: unknown, isDevelopment: boolean): string {
  if (isDevelopment) {
    // In development, show more detailed errors
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  // In production, use generic messages for security
  const productionMessages: Record<string, string> = {
    [ErrorType.VALIDATION]: 'The provided data is invalid.',
    [ErrorType.AUTHENTICATION]: 'Authentication is required to access this resource.',
    [ErrorType.AUTHORIZATION]: 'You do not have permission to access this resource.',
    [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorType.CONFLICT]: 'The request conflicts with an existing resource.',
    [ErrorType.DATABASE]: 'A data processing error occurred.',
    [ErrorType.EXTERNAL_API]: 'An external service is temporarily unavailable.',
    [ErrorType.INTERNAL]: 'An unexpected error occurred. Please try again.'
  }

  if (error instanceof APIError) {
    return productionMessages[error.type] || productionMessages[ErrorType.INTERNAL]
  }

  return productionMessages[ErrorType.INTERNAL]
}

// Extract safe error details for client
function extractSafeDetails(error: unknown, isDevelopment: boolean): any {
  if (!isDevelopment) {
    return undefined
  }

  if (error instanceof ZodError) {
    return error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }))
  }

  if (error instanceof APIError && error.details) {
    return error.details
  }

  return undefined
}

// Log errors securely
function logError(error: unknown, context?: Record<string, any>): void {
  const timestamp = new Date().toISOString()
  
  let logData: any = {
    timestamp,
    context: sanitizeLogContext(context)
  }

  if (error instanceof APIError) {
    logData = {
      ...logData,
      type: error.type,
      statusCode: error.statusCode,
      message: error.message,
      shouldLog: error.shouldLog
    }
    
    if (!error.shouldLog) {
      return // Skip logging for expected errors
    }
  } else if (error instanceof Error) {
    logData = {
      ...logData,
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  } else {
    logData = {
      ...logData,
      error: String(error)
    }
  }

  console.error('[API Error]', JSON.stringify(logData, null, 2))
}

// Sanitize log context to remove sensitive data
function sanitizeLogContext(context?: Record<string, any>): Record<string, any> | undefined {
  if (!context) return undefined

  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'authorization', 'cookie',
    'email', 'phone', 'ssn', 'credit', 'payment'
  ]

  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase()
    
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogContext(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

// Handle different types of errors
export function handleError(error: unknown, context?: Record<string, any>): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const requestId = crypto.randomUUID()

  // Log the error
  logError(error, { ...context, requestId })

  let statusCode = 500
  let errorType = ErrorType.INTERNAL
  let message = sanitizeErrorMessage(error, isDevelopment)

  // Handle specific error types
  if (error instanceof APIError) {
    statusCode = error.statusCode
    errorType = error.type
  } else if (error instanceof ZodError) {
    statusCode = 400
    errorType = ErrorType.VALIDATION
    message = isDevelopment ? 'Validation failed' : sanitizeErrorMessage(error, isDevelopment)
  } else if (error instanceof PrismaClientKnownRequestError) {
    statusCode = 400
    errorType = ErrorType.DATABASE
    
    // Handle specific Prisma errors
    switch (error.code) {
      case 'P2002':
        statusCode = 409
        errorType = ErrorType.CONFLICT
        message = isDevelopment ? 'Unique constraint violation' : 'Resource already exists'
        break
      case 'P2025':
        statusCode = 404
        errorType = ErrorType.NOT_FOUND
        message = isDevelopment ? 'Record not found' : 'Resource not found'
        break
      case 'P2003':
        statusCode = 400
        message = isDevelopment ? 'Foreign key constraint violation' : 'Invalid reference'
        break
      default:
        message = sanitizeErrorMessage(error, isDevelopment)
    }
  } else if (error instanceof PrismaClientValidationError) {
    statusCode = 400
    errorType = ErrorType.VALIDATION
    message = isDevelopment ? 'Database validation error' : 'Invalid data format'
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    error: statusCode >= 500 ? 'Internal Server Error' : 'Client Error',
    message,
    type: errorType,
    timestamp: new Date().toISOString(),
    requestId
  }

  // Add details only in development or for client errors
  const details = extractSafeDetails(error, isDevelopment)
  if (details) {
    errorResponse.details = details
  }

  // Set appropriate headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }


  return NextResponse.json(errorResponse, { status: statusCode, headers })
}

// Wrapper function for API handlers with error handling
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      // Handle connection resets and other network errors gracefully
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
          // Client disconnected - don't log as error, just return
          return new NextResponse(null, { status: 499 }) // Client closed request
        }
      }
      
      return handleError(error, {
        handler: handler.name,
        args: args.length > 0 ? 'present' : 'none'
      })
    }
  }
}

// Helper functions for common error scenarios
export const throwIfNotFound = (resource: any, message?: string): void => {
  if (!resource) {
    throw new NotFoundError(message)
  }
}

export const throwIfUnauthorized = (condition: boolean, message?: string): void => {
  if (!condition) {
    throw new AuthorizationError(message)
  }
}

export const throwIfExists = (resource: any, message?: string): void => {
  if (resource) {
    throw new ConflictError(message)
  }
}

// Input validation wrapper
export const validateInput = <T>(schema: any, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid input data', error.errors)
    }
    throw error
  }
}