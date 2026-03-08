import helmet from "helmet";

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },

  crossOriginEmbedderPolicy: false,

  referrerPolicy: {
    policy: "no-referrer"
  },

  frameguard: {
    action: "deny"
  },

  hidePoweredBy: true,

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },

  noSniff: true,

  xssFilter: true
});

export default helmetConfig;