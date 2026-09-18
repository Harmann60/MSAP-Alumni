import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { configureSecurityHeaders, configureCors } from './middlewares/security.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { xssSanitizer } from './middlewares/xssSanitizer.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './config/logger.js';
import { NotFoundError } from './utils/apiError.js';
import routes from './routes/index.js';

const app = express();

// 1. Trust Reverse Proxy (Render / Cloudflare)
app.set('trust proxy', 1);

// 2. Security Headers (Helmet CSP, HSTS, Frameguard, etc.)
app.use(configureSecurityHeaders());

// 3. CORS Policy
app.use(configureCors());

// 4. Request Logging with Winston integration
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
    skip: (req) => req.originalUrl.includes('/health'), // Don't spam logs with health checks
  })
);

// 5. Body Parsing with strict payload size caps (Prevents DoS via memory saturation)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 6. Cookie Parser
app.use(cookieParser());

// 7. Industry-Standard XSS Sanitizer (Recursively strips script tags, event attributes, javascript:)
app.use(xssSanitizer);

// 8. Rate Limiting on API routes
app.use('/api', globalLimiter);

// 9. API Routes
app.use('/api/v1', routes);

// 10. Handle 404 for undefined endpoints
app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// 11. Centralized Error Handler (Masks sensitive internal errors in production)
app.use(errorHandler);

export default app;
