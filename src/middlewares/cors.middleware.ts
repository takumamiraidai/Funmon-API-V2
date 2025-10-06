import { cors } from 'hono/cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://funmon.pages.dev',
  'https://funmon2.pages.dev',
];

export const corsMiddleware = cors({
  origin: (origin) => {
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
});
