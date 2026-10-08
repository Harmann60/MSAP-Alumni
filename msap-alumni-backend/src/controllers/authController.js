/**
 * @fileoverview Authentication controller for the MSAP Alumni API.
 *
 * Handles admin and alumni login/logout. Delegates all business logic to
 * `AuthService` and uses `ApiResponse` for consistent JSON response shaping.
 * Tokens are delivered via both an HttpOnly cookie and the response body
 * to support browser and API clients simultaneously.
 *
 * @module controllers/authController
 */

import { AuthService } from '../services/authService.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      // Pass req.ip so authService can write an audit log entry with the hashed IP
      const { token, user } = await AuthService.login({ email, password, ip: req.ip });

      // Set secure HttpOnly cookie
      res.cookie('access_token', token, AuthService.getCookieOptions());

      return ApiResponse.success(
        res,
        { user, token },
        'Authentication successful'
      );
    } catch (error) {
      next(error);
    }
  }

  static async alumniLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.alumniLogin({ email, password, ip: req.ip });

      // Set secure HttpOnly cookie
      res.cookie('access_token', token, AuthService.getCookieOptions());

      return ApiResponse.success(
        res,
        { user, token },
        'Welcome back to the MSAP Alumni network!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { credential, email, fullName, picture } = req.body;
      const { token, user } = await AuthService.googleLogin({ credential, email, fullName, picture, ip: req.ip });

      res.cookie('access_token', token, AuthService.getCookieOptions());

      return ApiResponse.success(
        res,
        { user, token },
        'Signed in with Google successfully!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async setAlumniPassword(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.setAlumniPassword({ email, password, ip: req.ip });

      res.cookie('access_token', token, AuthService.getCookieOptions());

      return ApiResponse.success(
        res,
        { user, token },
        'Account activated! Your password has been securely saved.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, _res, next) {
    try {
      // Audit the logout event before clearing the cookie
      await AuditService.log({
        action:     AUDIT_ACTIONS.LOGOUT,
        entityName: 'admins',
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { email: req.user?.email },
      });

      _res.clearCookie('access_token', AuthService.getCookieOptions());
      return ApiResponse.success(_res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      return ApiResponse.success(res, { user: req.user }, 'Current session verified');
    } catch (error) {
      next(error);
    }
  }

  static async getCsrfToken(req, res, next) {
    try {
      const csrfToken = req.cookies?.csrf_token;
      return ApiResponse.success(res, { csrfToken }, 'CSRF token retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email, req.ip);
      return ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await AuthService.resetPassword({
        token,
        newPassword: password,
        ip: req.ip,
      });
      return ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}

