import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpdateTaskSchema } from "@/lib/validations";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true, comments: { include: { author: true }, orderBy: { createdAt: "asc" } }, attachments: true },
    });
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateTaskSchema.parse(body);
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
      },
      include: { assignee: true },
    });
    return NextResponse.json(task);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update task";
    console.error("Failed to update task:", err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
