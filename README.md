# ProjectFlow

## Quick Start

```bash
# 1. Install deps
npm install

# 2. Copy .env.example to .env.local and fill in DATABASE_URL
cp .env.example .env.local

# 3. Add prisma seed to package.json (already there)

# 4. Run DB
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed

# 5. Run app
npm run dev
```

## What is built
- Phase 1+2: Scaffold, DB schema, Dashboard UI
- Phase 3: Auth pages (Sign In, Sign Up, Verify Email) with AWS Cognito
- Phase 4: REST API - /api/projects, /api/tasks, /api/comments (full CRUD)

## API Endpoints
- GET/POST   /api/projects
- GET/PATCH/DELETE /api/projects/[id]
- GET/POST   /api/tasks?projectId=xxx
- GET/PATCH/DELETE /api/tasks/[id]
- GET/POST   /api/comments?taskId=xxx
- DELETE     /api/comments/[id]
