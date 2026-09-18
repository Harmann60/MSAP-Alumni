import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validate.js';
import { loginSchema, googleLoginSchema, setAlumniPasswordSchema } from '../validators/authValidator.js';
import { authLimiter, authSlowDown } from '../middlewares/rateLimiter.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Public: Admin login (Strict rate limiting & brute-force delay)
router.post(
  '/login',
  authLimiter,
  authSlowDown,
  validateRequest({ body: loginSchema }),
  AuthController.login
);

// Public: Verified Alumni login (Checks admin verification & credentials)
router.post(
  '/alumni/login',
  authLimiter,
  authSlowDown,
  validateRequest({ body: loginSchema }),
  AuthController.alumniLogin
);

// Public: Sign In through Google ("Continue with Google")
router.post(
  '/google',
  authLimiter,
  authSlowDown,
  validateRequest({ body: googleLoginSchema }),
  AuthController.googleLogin
);

// Public: Set/Link Account Password (for approved alumni whose status is VERIFIED)
router.post(
  '/alumni/set-password',
  authLimiter,
  authSlowDown,
  validateRequest({ body: setAlumniPasswordSchema }),
  AuthController.setAlumniPassword
);

// Authenticated: Logout (clears HttpOnly cookie)
router.post('/logout', authenticate, AuthController.logout);

// Authenticated: Get currently logged-in admin
router.get('/me', authenticate, AuthController.me);

export default router;
