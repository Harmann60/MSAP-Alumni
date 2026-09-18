/**
 * @fileoverview Standardised API response helpers for the MSAP Alumni backend.
 *
 * All route handlers should use these static methods instead of calling
 * `res.json()` directly. This ensures every API response follows the same
 * envelope schema:
 *
 * ```json
 * {
 *   "success": true | false,
 *   "message": "Human-readable description",
 *   "data": { ... } | null,
 *   "errors": [ ... ]   // only on error responses with field details
 * }
 * ```
 *
 * @module utils/apiResponse
 */

// ─── Response helpers ─────────────────────────────────────────────────────────

/**
 * Utility class providing static factory methods for consistent API responses.
 */
export class ApiResponse {
  /**
   * Send a successful JSON response.
   *
   * @param {import('express').Response} res        - Express response object.
   * @param {*}                          [data]     - Response payload. Pass `null` for empty responses.
   * @param {string}                     [message]  - Human-readable success message.
   * @param {number}                     [statusCode=200] - HTTP status code.
   * @returns {import('express').Response}
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a 201 Created response. Shorthand for `success()` with status 201.
   *
   * @param {import('express').Response} res       - Express response object.
   * @param {*}                          [data]    - The newly created resource.
   * @param {string}                     [message] - Success message.
   * @returns {import('express').Response}
   */
  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * Send an error JSON response.
   *
   * Prefer forwarding errors via `next(err)` to the central error handler
   * rather than calling this directly. Use this only when you need to bypass
   * the error handler (e.g. in the error handler itself).
   *
   * @param {import('express').Response} res        - Express response object.
   * @param {string}                     [message]  - Error description.
   * @param {number}                     [statusCode=500] - HTTP status code.
   * @param {Array|null}                 [errors]   - Optional field-level error array.
   * @returns {import('express').Response}
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }
}
