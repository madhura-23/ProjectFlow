import { NextResponse } from "next/server";
import db from "@/lib/db";
import { CreateTaskSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const tasks = await db.task.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { position: "asc" },
      include: { assignee: true, comments: { include: { author: true } } },
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateTaskSchema.parse(body);
    const demoUser = await db.user.findFirst();
    if (!demoUser) return NextResponse.json({ error: "No user" }, { status: 400 });
    const last = await db.task.findFirst({ where: { projectId: data.projectId }, orderBy: { position: "desc" } });
    const position = (last?.position ?? 0) + 1000;
    const task = await db.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        position,
        createdById: demoUser.id,
      },
      include: { assignee: true },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create task";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
