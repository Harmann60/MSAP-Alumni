/**
 * @fileoverview Winston logger configuration for the MSAP Alumni backend.
 *
 * Features:
 *  - Log level: `debug` in development, `info` in production.
 *  - Automatic masking of sensitive fields (passwords, tokens, secrets, etc.)
 *    to prevent credential leakage in log files or log aggregation services.
 *  - Consistent timestamp format: `YYYY-MM-DD HH:mm:ss`.
 *  - Colourised output in development for readability.
 *
 * Usage:
 *   import { logger } from './config/logger.js';
 *   logger.info('Server started');
 *   logger.error('Something went wrong', { error: err.message });
 *
 * @module config/logger
 */

import winston from 'winston';
import { env } from './env.js';

// ─── Sensitive key list ────────────────────────────────────────────────────────

/**
 * List of key name fragments that should be redacted from log output.
 * Any object key that contains one of these substrings (case-insensitive)
 * will have its value replaced with `[REDACTED]`.
 *
 * @type {string[]}
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'jwt',
  'secret',
  'authorization',
  'cookie',
  'phone',
  'email',
  'dkim',
  'smtp_pass',
];

// ─── Masking helper ────────────────────────────────────────────────────────────

/**
 * Recursively walks an object and replaces the values of any keys that match
 * `SENSITIVE_KEYS` with the string `[REDACTED]`.
 *
 * @param {*} obj - The value to sanitize. Handles objects, arrays, and primitives.
 * @returns {*} A deep copy with sensitive values redacted.
 */
function maskSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskSensitiveData);

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = maskSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// ─── Custom format ────────────────────────────────────────────────────────────

/**
 * Winston `printf` format that produces a single-line log entry:
 * `[YYYY-MM-DD HH:mm:ss] [LEVEL]: message { ...metadata }`
 *
 * Metadata is sanitized before serialization to prevent sensitive data leakage.
 */
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const sanitizedMeta = Object.keys(metadata).length ? maskSensitiveData(metadata) : '';
  const metaString = sanitizedMeta ? ` ${JSON.stringify(sanitizedMeta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
});

// ─── Logger instance ──────────────────────────────────────────────────────────

/**
 * Singleton Winston logger instance used throughout the application.
 *
 * Transports:
 *  - **Console** — always active. Colourised in development.
 *
 * To add file or cloud log transports (e.g. Winston Daily Rotate File or
 * Logtail), add them to the `transports` array below.
 *
 * @type {import('winston').Logger}
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
  ],
});
