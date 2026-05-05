# Monitoring Setup

## CloudWatch
- Install CloudWatch Agent on EC2
- Enable logs for:
  - /var/log/syslog
  - pm2 logs

## Sentry
- npm install @sentry/nextjs
- Add DSN in .env

Example:
SENTRY_DSN=your_dsn_here