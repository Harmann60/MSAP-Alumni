import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`========================================================`);
  logger.info(`🚀 MSAP Alumni API Server running on port ${env.PORT}`);
  logger.info(`🛡️ Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 CORS Origin Allowed: ${env.CLIENT_URL}`);
  logger.info(`🏥 Health Check: http://localhost:${env.PORT}/api/v1/health`);
  logger.info(`========================================================`);
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  logger.info(`${signal} received. Closing HTTP server cleanly...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10s if dangling connections remain
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', { error });
  process.exit(1);
});
