export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";

export interface User {
  id: string; email: string; name: string; avatarUrl?: string; createdAt: Date;
}
export interface Organization {
  id: string; name: string; slug: string; logoUrl?: string; createdAt: Date;
  members?: Member[]; projects?: Project[];
}
export interface Member {
  id: string; userId: string; orgId: string; role: Role; user: User; joinedAt: Date;
}
export interface Project {
  id: string; orgId: string; name: string; description?: string;
  status: ProjectStatus; color: string; createdById: string;
  createdAt: Date; updatedAt: Date;
  _count?: { tasks: number; members: number }; tasks?: Task[];
}
export interface Task {
  id: string; projectId: string; title: string; description?: string;
  status: TaskStatus; priority: TaskPriority; assigneeId?: string;
  assignee?: User; dueDate?: Date; position: number; createdById: string;
  createdAt: Date; updatedAt: Date; comments?: Comment[]; attachments?: Attachment[];
}
export interface Comment {
  id: string; taskId: string; authorId: string; author: User; content: string; createdAt: Date;
}
export interface Attachment {
  id: string; taskId: string; name: string; url: string;
  size: number; type: string; uploadedById: string; createdAt: Date;
}
