#!/bin/bash
# ============================================================
#  PHASE 7 — ONE-COMMAND SETUP
#  Run: chmod +x setup.sh && ./setup.sh
# ============================================================
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════╗"
echo "║      SaaS Project Manager — Phase 7 Setup       ║"
echo "║      Deploy to Production in < 10 minutes       ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── 1. Check Node / npm ──────────────────────────────────
info "Checking Node.js..."
node -v &>/dev/null || err "Node.js not found. Install from https://nodejs.org (v18+)"
npm -v  &>/dev/null || err "npm not found."
log "Node $(node -v) / npm $(npm -v)"

# ── 2. Install dependencies ──────────────────────────────
info "Installing dependencies..."
npm install 2>&1 | tail -5
log "Dependencies installed"

# ── 3. Generate .env.local if missing ───────────────────
if [ ! -f .env.local ]; then
  warn ".env.local not found — generating from template..."
  cp .env.example .env.local
  warn "👉 OPEN .env.local and fill in your values before continuing!"
  echo ""
  cat .env.local
  echo ""
  read -p "Press ENTER once you've updated .env.local..." _
fi
log ".env.local ready"

# ── 4. Prisma setup ──────────────────────────────────────
info "Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma db push
log "Database schema applied"

# ── 5. Build ─────────────────────────────────────────────
info "Building Next.js for production..."
npm run build
log "Build complete"

# ── 6. Start with PM2 ────────────────────────────────────
if command -v pm2 &>/dev/null; then
  info "Starting with PM2..."
  pm2 start ecosystem.config.js
  pm2 save
  log "App running under PM2"
else
  warn "PM2 not installed globally. Starting with npm start instead..."
  warn "To use PM2: npm install -g pm2 && pm2 start ecosystem.config.js"
  npm run start &
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗"
echo "║  ✅ YOUR APP IS LIVE!                            ║"
echo "║  👉 http://localhost:3000                        ║"
echo "╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Useful commands:"
echo "  pm2 logs          → live logs"
echo "  pm2 status        → process status"
echo "  pm2 restart all   → restart"
echo ""
