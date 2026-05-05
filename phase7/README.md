# 🚀 SaaS Project Manager — Phase 7: Deploy to Production

## ⚡ Run Locally in Under 10 Minutes

### Prerequisites (2 min)
- Node.js 18+ → https://nodejs.org
- Git
- Your project from Phases 1–6

---

## STEP 1 — Copy Phase 7 files into your project (1 min)

```bash
# From inside YOUR project root:
cp phase7/ecosystem.config.js .
cp phase7/.env.example .env.example
cp -r phase7/.github .
cp phase7/app/api/health/route.ts app/api/health/route.ts
cp phase7/sentry.client.config.ts .
```

---

## STEP 2 — Set up environment variables (2 min)

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:
- `DATABASE_URL` → your PostgreSQL connection string
- `NEXTAUTH_SECRET` → run `openssl rand -base64 32`
- `NEXTAUTH_URL` → `http://localhost:3000`

> For demo/presentation: you can use a local PostgreSQL or a free Supabase DB.

---

## STEP 3 — Install & Build (3 min)

```bash
npm install
npx prisma generate
npx prisma db push          # applies schema to your DB
npm run build               # production build
```

---

## STEP 4 — Start the app (30 sec)

**Option A — Simple (for demo):**
```bash
npm run start
# → App running at http://localhost:3000
```

**Option B — With PM2 (production):**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs
# → App running at http://localhost:3000
```

---

## 🎯 That's it! Open http://localhost:3000

---

## Production Deploy (EC2 + Nginx + SSL)

### One-time server setup:
```bash
ssh ubuntu@your-ec2-ip 'bash -s' < scripts/provision-ec2.sh
```

### Ongoing deploys (automatic via GitHub Actions):
Just push to `main`:
```bash
git add . && git commit -m "deploy" && git push origin main
```
GitHub Actions will: lint → build → SSH into EC2 → reload PM2.

### Required GitHub Secrets:
See `docs/GITHUB_SECRETS.md`

---

## Monitoring

| Tool | What it does |
|------|-------------|
| PM2 | Process manager, auto-restart on crash |
| `GET /api/health` | Health check endpoint for uptime monitors |
| Sentry | Error tracking + stack traces |
| CloudWatch | AWS logs + metrics |

```bash
pm2 status          # see all processes
pm2 logs            # live log stream
pm2 monit           # CPU + memory dashboard
curl localhost:3000/api/health   # health check
```

---

## Project Architecture

```
your-project/
├── app/
│   ├── (auth)/          # Phase 3 — Cognito auth
│   ├── (dashboard)/     # Phase 5 — Kanban, List, Dashboard
│   ├── api/
│   │   ├── health/      # ← Phase 7 adds this
│   │   ├── orgs/        # Phase 4
│   │   ├── projects/    # Phase 4
│   │   └── tasks/       # Phase 4
├── prisma/              # Phase 2 — DB schema
├── .github/workflows/   # ← Phase 7 — CI/CD
├── ecosystem.config.js  # ← Phase 7 — PM2
├── nginx/               # ← Phase 7 — Nginx config
└── .env.local           # your secrets (never commit!)
```

---

## Presentation Talking Points

1. **7 phases, 28 days** — planned and executed systematically
2. **Full stack**: Next.js 14 + TypeScript + PostgreSQL + AWS
3. **Production-grade**: CI/CD, SSL, zero-downtime deploys, error monitoring
4. **Key features**: Kanban drag-and-drop, real-time, file uploads, global search
5. **Scalable**: PM2 cluster mode uses all CPU cores; RDS scales independently
