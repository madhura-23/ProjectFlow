// ============================================================
//  app/api/health/route.ts
//  Health check endpoint — used by CI/CD and CloudWatch
//  GET /api/health
// ============================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const start = Date.now();

  try {
    // Check DB connectivity
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db: "connected",
        latency_ms: Date.now() - start,
        version: process.env.npm_package_version ?? "unknown",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
