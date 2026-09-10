import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import slowDown from 'express-slow-down';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import type { Express, Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 500, // Higher limit for development too
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static assets and public API calls
    return req.path.startsWith('/uploads/') || 
           req.path.startsWith('/@vite/') ||
           req.path.startsWith('/@fs/') ||
           req.path.startsWith('/src/') ||
           req.path.startsWith('/node_modules/') ||
           req.path === '/@react-refresh' ||
           req.path.startsWith('/favicon') ||
           /\.(?:js|mjs|css|map|tsx?|png|jpe?g|gif|webp|avif|svg|ico|woff2?|webmanifest|xml|txt)$/i.test(req.path) ||
           // Skip for public portfolio API calls
           (req.method === 'GET' && /^\/api\/(hero|about|projects|partnerships|contact-info|skills|services|case-studies)/.test(req.path));
  }
});

export const contactFormRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each IP to 3 contact form submissions per 10 minutes
  message: {
    error: 'Too many contact form submissions. Please wait 10 minutes before trying again.',
    retryAfter: 10 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 2000 : 200, // Much higher limit for production
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for public portfolio API calls
    return req.method === 'GET' && /^\/api\/(hero|about|projects|partnerships|contact-info|skills|services|case-studies)/.test(req.path);
  }
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very relaxed rate limiting for public portfolio APIs
export const publicPortfolioRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5000 : 1000, // Very high limit for portfolio APIs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Never skip - but with very high limits
    return false;
  }
});

// Slow down middleware for contact form
export const contactSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 2 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 2
  maxDelayMs: 20000, // maximum delay of 20 seconds
  validate: { delayMs: false } // Disable the warning
});

// Input validation for contact form
export const validateContactForm = [
  body('name')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters')
    .custom((value: string) => !/[0-9<>]/.test(value))
    .withMessage('Please enter a valid name')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 180 })
    .withMessage('Email must be less than 180 characters')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    }),
  
  body('message')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .trim(),
];

// Input validation for dashboard login
export const validateLogin = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .escape(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Validation result handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract user-friendly error messages
    const errorMessages = errors.array().map(error => error.msg);
    const firstError = errorMessages[0]; // Show only the first error to keep it simple
    
    return res.status(400).json({
      success: false,
      message: firstError || 'Please check your input and try again'
    });
  }
  next();
};

// Security headers and middleware setup
export const setupSecurity = (app: Express) => {
  // Enable trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);
  
  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://malekfouda.com', 'https://www.malekfouda.com']
      : true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
  }));

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://challenges.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        frameSrc: ["'self'", "https://challenges.cloudflare.com"],
        connectSrc: ["'self'", "https://www.google-analytics.com", "https://challenges.cloudflare.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        childSrc: ["'none'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
      reportOnly: false,
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));

  // Additional security middleware
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  
  // Remove powered by header
  app.disable('x-powered-by');
  
  // Apply very relaxed rate limiting for public portfolio APIs first
  app.use('/api/hero', publicPortfolioRateLimit);
  app.use('/api/about', publicPortfolioRateLimit);
  app.use('/api/projects', publicPortfolioRateLimit);
  app.use('/api/partnerships', publicPortfolioRateLimit);
  app.use('/api/contact-info', publicPortfolioRateLimit);
  app.use('/api/skills', publicPortfolioRateLimit);
  
  // Apply general rate limiting (skip for public portfolio APIs)
  app.use(generalRateLimit);
  
  // Apply auth rate limiting to auth routes
  app.use('/api/auth', authRateLimit);
  
  // Apply contact form rate limiting and slow down
  app.use('/api/contact', contactFormRateLimit, contactSlowDown);
  
  // Apply API rate limiting to API routes (exclude public portfolio APIs)
  app.use('/api', apiRateLimit);
  
  // Security headers middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    next();
  });
};

// SQL injection prevention helper
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potential SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\s+\w+\s*=\s*\w+)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT|ONLOAD|ONERROR|ONCLICK)\b)/gi,
    /(<|>|&lt;|&gt;)/g
  ];
  
  let sanitized = input;
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};

// XSS prevention helper
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /eval\s*\(/gi,
    /document\./gi,
    /window\./gi
  ];
  
  let sanitized = input;
  xssPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
};

// IP blocking middleware (for malicious IPs)
const blockedIPs = new Set<string>();
const suspiciousActivity = new Map<string, number>();

export const ipSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
  
  // Check if IP is blocked
  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Track suspicious activity - only block clearly malicious tools
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /^python/i,           // Only at start of user agent
    /^curl\//i,           // Only at start of user agent
    /^wget\//i,           // Only at start of user agent
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /metasploit/i,
    /burpsuite/i,
    /w3af/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /exploit/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    const count = suspiciousActivity.get(clientIP) || 0;
    suspiciousActivity.set(clientIP, count + 1);
    
    // Block IP after 10 suspicious requests
    if (count >= 10) {
      blockedIPs.add(clientIP);
      return res.status(403).json({ error: 'Access denied due to suspicious activity' });
    }
  }
  
  next();
};

// File upload security
export const uploadSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check for file upload attacks
  if (req.files || req.file) {
    const files: Express.Multer.File[] = [];
    if (req.file) files.push(req.file);
    if (Array.isArray(req.files)) files.push(...req.files);
    else if (req.files) files.push(...Object.values(req.files).flat());
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type' });
      }
      
      if (file.size > maxSize) {
        return res.status(400).json({ error: 'File too large' });
      }
      
      // Check for malicious file names
      const maliciousPatterns = [
        /\.\./g,
        /\//g,
        /\\/g,
        /\0/g,
        /\x00/g,
        /[<>:"|?*]/g
      ];
      
      const fileName = file.originalname || '';
      if (maliciousPatterns.some(pattern => pattern.test(fileName))) {
        return res.status(400).json({ error: 'Invalid file name' });
      }
    }
  }
  
  next();
};

export { blockedIPs, suspiciousActivity };
