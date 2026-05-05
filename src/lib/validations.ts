import { z } from "zod";
export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().default("#3a7bff"),
});
export const CreateTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(["TODO","IN_PROGRESS","IN_REVIEW","DONE"]).default("TODO"),
  priority: z.enum(["URGENT","HIGH","MEDIUM","LOW"]).default("MEDIUM"),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});
export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO","IN_PROGRESS","IN_REVIEW","DONE"]).optional(),
  priority: z.enum(["URGENT","HIGH","MEDIUM","LOW"]).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  position: z.number().optional(),
});
export const CreateCommentSchema = z.object({
  taskId: z.string(),
  content: z.string().min(1).max(2000),
});
