// ============================================================
//  sentry.client.config.ts  — paste at project root
// ============================================================
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,          // 100% in dev, lower in prod
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
});

// ============================================================
//  sentry.server.config.ts  — paste at project root
// ============================================================
// import * as Sentry from "@sentry/nextjs";
// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   tracesSampleRate: 1.0,
//   environment: process.env.NODE_ENV,
//   enabled: process.env.NODE_ENV === "production",
// });
