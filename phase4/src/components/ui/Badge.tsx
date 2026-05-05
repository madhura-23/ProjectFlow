"use client";
import { cn, STATUS_COLORS, PRIORITY_COLORS } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string,string> = { TODO:"Todo", IN_PROGRESS:"In Progress", IN_REVIEW:"In Review", DONE:"Done" };
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", STATUS_COLORS[status])}>
      {labels[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const labels: Record<string,string> = { URGENT:"Urgent", HIGH:"High", MEDIUM:"Medium", LOW:"Low" };
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", PRIORITY_COLORS[priority])}>
      {labels[priority] ?? priority}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string,string> = { URGENT:"bg-red-400", HIGH:"bg-yellow-400", MEDIUM:"bg-brand-blue", LOW:"bg-ink-muted" };
  return <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 inline-block", colors[priority] ?? "bg-ink-muted")} />;
}
