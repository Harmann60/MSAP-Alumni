import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  loginSchema,
  googleLoginSchema,
  setAlumniPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';
import { authLimiter, authSlowDown, passwordResetLimiter } from '../middlewares/rateLimiter.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Public: Admin login (Brute-force delay & strict rate limiting)
router.post(
  '/login',
  authSlowDown,
  authLimiter,
  validateRequest({ body: loginSchema }),
  AuthController.login
);

// Public: Verified Alumni login (Checks admin verification & credentials)
router.post(
  '/alumni/login',
  authSlowDown,
  authLimiter,
  validateRequest({ body: loginSchema }),
  AuthController.alumniLogin
);

// Public: Sign In through Google ("Continue with Google")
router.post(
  '/google',
  authSlowDown,
  authLimiter,
  validateRequest({ body: googleLoginSchema }),
  AuthController.googleLogin
);

// Public: Set/Link Account Password (for approved alumni whose status is VERIFIED)
router.post(
  '/alumni/set-password',
  authSlowDown,
  authLimiter,
  validateRequest({ body: setAlumniPasswordSchema }),
  AuthController.setAlumniPassword
);

// Public: Self-Service Forgot Password (request email reset link)
router.post(
  '/forgot-password',
  authSlowDown,
  passwordResetLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  AuthController.forgotPassword
);

// Public: Reset Password (submit new password using token)
router.post(
  '/reset-password',
  authSlowDown,
  authLimiter,
  validateRequest({ body: resetPasswordSchema }),
  AuthController.resetPassword
);

// Public: Retrieve CSRF token
router.get('/csrf-token', AuthController.getCsrfToken);

// Authenticated: Logout (clears HttpOnly cookie)
router.post('/logout', authenticate, AuthController.logout);

// Authenticated: Get currently logged-in admin
router.get('/me', authenticate, AuthController.me);

export default router;
