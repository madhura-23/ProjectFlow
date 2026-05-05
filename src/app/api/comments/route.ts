import { NextResponse } from "next/server";
import db from "@/lib/db";
import { CreateCommentSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });
  const comments = await db.comment.findMany({
    where: { taskId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateCommentSchema.parse(body);
    const demoUser = await db.user.findFirst();
    if (!demoUser) return NextResponse.json({ error: "No user" }, { status: 400 });
    const comment = await db.comment.create({
      data: { ...data, authorId: demoUser.id },
      include: { author: true },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create comment";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
