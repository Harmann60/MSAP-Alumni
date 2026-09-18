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

import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login({ email, password });

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
      const { token, user } = await AuthService.alumniLogin({ email, password });

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
      const { credential, email } = req.body;
      const { token, user } = await AuthService.googleLogin({ credential, email });

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
      const { token, user } = await AuthService.setAlumniPassword({ email, password });

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

  static async logout(_req, res, next) {
    try {
      res.clearCookie('access_token', AuthService.getCookieOptions());
      return ApiResponse.success(res, null, 'Logged out successfully');
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
}
