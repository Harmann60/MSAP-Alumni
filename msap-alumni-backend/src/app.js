import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { configureSecurityHeaders, configureCors } from './middlewares/security.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { xssSanitizer } from './middlewares/xssSanitizer.js';
import { csrfProtection } from './middlewares/csrf.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestId } from './middlewares/requestId.js';
import { logger } from './config/logger.js';
import { NotFoundError } from './utils/apiError.js';
import routes from './routes/index.js';

const app = express();

// 1. Trust Reverse Proxy (Render / Cloudflare)
app.set('trust proxy', 1);

// 2. Request ID — must be first so all subsequent logs carry the ID
app.use(requestId);

// 3. Security Headers (Helmet CSP, HSTS, Frameguard, etc.)
app.use(configureSecurityHeaders());

// 4. CORS Policy
app.use(configureCors());

// 5. Request Logging with Winston integration (includes request ID for log correlation)
const morganFormat = ':method :url :status :res[content-length] - :response-time ms reqId=:req[x-request-id]';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
    skip: (req) => req.originalUrl.includes('/health'), // Don't spam logs with health checks
  })
);

// 6. Body Parsing with strict payload size caps (Prevents DoS via memory saturation)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 7. Cookie Parser
app.use(cookieParser());

// 8. Industry-Standard XSS Sanitizer (Recursively strips script tags, event attributes, javascript:)
app.use(xssSanitizer);

// 9. CSRF Protection (Double-Submit Cookie pattern for cookie-authenticated mutations)
app.use(csrfProtection);

// 10. Rate Limiting on API routes
app.use('/api', globalLimiter);

// 10. Root & API Routes
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'msap-alumni-backend', timestamp: new Date().toISOString() });
});
app.use('/api/v1', routes);

// 11. Handle 404 for undefined endpoints
app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// 12. Centralized Error Handler (Masks sensitive internal errors in production)
app.use(errorHandler);

export default app;
