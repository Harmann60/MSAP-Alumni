/**
 * @fileoverview Health-check controller for the MSAP Alumni API.
 *
 * Exposes `GET /api/v1/health` — used by Render's deployment health checks
 * and monitoring tools to verify the server is up and the database connection
 * status. This endpoint is intentionally unauthenticated.
 *
 * @module controllers/healthController
 */

import { ApiResponse } from '../utils/apiResponse.js';

import { isConfigured } from '../config/supabase.js';

export class HealthController {
  static getHealth(_req, res) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
      service: 'msap-alumni-backend',
      environment: process.env.NODE_ENV || 'development',
      database: isConfigured ? 'connected' : 'local_mock',
    };
    return ApiResponse.success(res, healthcheck, 'Server is healthy');
  }
}
