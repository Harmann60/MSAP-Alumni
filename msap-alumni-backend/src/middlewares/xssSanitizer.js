import xss from 'xss';

// Configure standard XSS options: strip all tags by default for standard fields
const xssOptions = {
  whiteList: {}, // Empty whitelist: strips all HTML tags for maximum safety
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
};

const xssFilter = new xss.FilterXSS(xssOptions);

/**
 * Recursively clean an object, array, or string from any XSS vectors
 */
export function sanitizeValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // 1. Strip all HTML tags & javascript: protocols
    let sanitized = xssFilter.process(value);
    
    // 2. Extra defense: neutralize common injection strings and control characters
    sanitized = sanitized
      .replace(/<[^>]*>?/gm, '') // Secondary regex sweep for incomplete tags
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '');

    return sanitized.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === 'object' && value.constructor === Object) {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      // Also sanitize object keys to prevent prototype pollution or weird key injections
      const cleanKey = sanitizeValue(key);
      cleaned[cleanKey] = sanitizeValue(val);
    }
    return cleaned;
  }

  return value;
}

/**
 * Express middleware to sanitize req.body, req.query, and req.params
 */
export function xssSanitizer(req, _res, next) {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (error) {
    next(error);
  }
}
