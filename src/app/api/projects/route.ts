import { NextResponse } from "next/server";
import db from "@/lib/db";
import { CreateProjectSchema } from "@/lib/validations";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tasks: true } } },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateProjectSchema.parse(body);
    // TODO: get real userId from Cognito session
    const demoUser = await db.user.findFirst();
    if (!demoUser) return NextResponse.json({ error: "No user found" }, { status: 400 });
    const demoOrg  = await db.organization.findFirst();
    if (!demoOrg)  return NextResponse.json({ error: "No org found"  }, { status: 400 });
    const project = await db.project.create({
      data: { ...data, orgId: demoOrg.id, createdById: demoUser.id },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
