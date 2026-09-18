/**
 * @fileoverview Custom API error classes for the MSAP Alumni backend.
 *
 * All application-level errors extend the base `ApiError` class, which sets
 * `isOperational = true` to signal to the error handler that the error is
 * intentional and its message is safe to expose to the client.
 *
 * Programming/unexpected errors (e.g. null pointer, unhandled promise rejection)
 * will not be instances of `ApiError` and are therefore masked in production.
 *
 * @module utils/apiError
 */

import { HTTP_STATUS } from '../constants/httpStatus.js';

// ─── Base error class ─────────────────────────────────────────────────────────

/**
 * Base operational error class for all MSAP Alumni API errors.
 *
 * Setting `isOperational = true` lets the global error handler distinguish
 * "expected" business-logic errors (safe to surface) from unexpected
 * programming bugs (should be masked in production).
 *
 * @extends {Error}
 */
export class ApiError extends Error {
  /**
   * @param {string}      message    - Human-readable error description.
   * @param {number}      statusCode - HTTP status code to respond with.
   * @param {Array|null} [errors]    - Optional array of field-level error objects.
   */
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    /** Marks this as a known, operational error — safe to send to the client. */
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Specific error subclasses ────────────────────────────────────────────────

/**
 * 400 Bad Request — invalid request body, query, or params.
 * @extends {ApiError}
 */
export class BadRequestError extends ApiError {
  /**
   * @param {string}      [message] - Error description.
   * @param {Array|null} [errors]   - Optional array of field-level validation errors.
   */
  constructor(message = 'Bad Request', errors = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, errors);
  }
}

/**
 * 401 Unauthorized — missing or invalid authentication token.
 * @extends {ApiError}
 */
export class UnauthorizedError extends ApiError {
  /**
   * @param {string} [message] - Error description.
   */
  constructor(message = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * 403 Forbidden — authenticated but insufficient permissions.
 * @extends {ApiError}
 */
export class ForbiddenError extends ApiError {
  /**
   * @param {string} [message] - Error description.
   */
  constructor(message = 'Access forbidden: Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

/**
 * 404 Not Found — requested resource does not exist.
 * @extends {ApiError}
 */
export class NotFoundError extends ApiError {
  /**
   * @param {string} [message] - Error description.
   */
  constructor(message = 'Requested resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * 409 Conflict — resource already exists or state conflict.
 * @extends {ApiError}
 */
export class ConflictError extends ApiError {
  /**
   * @param {string} [message] - Error description.
   */
  constructor(message = 'Resource conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

/**
 * 429 Too Many Requests — rate limit exceeded.
 * @extends {ApiError}
 */
export class TooManyRequestsError extends ApiError {
  /**
   * @param {string} [message] - Error description.
   */
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}
