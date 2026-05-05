"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { PriorityDot, StatusBadge } from "@/components/ui/Badge";
import type { Task } from "@/types";

interface Props { task: Task; onClick: (id: string) => void; }

export default function TaskCard({ task, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      onClick={() => onClick(task.id)}
      className={cn(
        "bg-bg-card border border-bg-border rounded-xl p-3 cursor-grab active:cursor-grabbing select-none",
        "hover:border-brand-blue/30 transition-all group",
        isDragging && "opacity-50 rotate-1 shadow-2xl shadow-brand-blue/20"
      )}>

      {/* Priority + title */}
      <div className="flex items-start gap-2 mb-2.5">
        <PriorityDot priority={task.priority} />
        <p className="text-xs font-medium text-ink-bright leading-relaxed flex-1 group-hover:text-white">
          {task.title}
        </p>
      </div>

      {/* Status badge */}
      <div className="mb-3">
        <StatusBadge status={task.status} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-ink-muted">
              <Clock size={9} />{formatDate(task.dueDate)}
            </span>
          )}
          {(task.comments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-ink-muted">
              <MessageSquare size={9} />{task.comments?.length}
            </span>
          )}
          {(task.attachments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-ink-muted">
              <Paperclip size={9} />{task.attachments?.length}
            </span>
          )}
        </div>
        {task.assignee && (
          <img src={task.assignee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.name}`}
            className="w-5 h-5 rounded-full" alt={task.assignee.name} title={task.assignee.name} />
        )}
      </div>
    </div>
  );
}
