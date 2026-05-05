"use client";
import { useState, useEffect } from "react";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";
import TaskModal from "@/components/tasks/TaskModal";
import type { Task } from "@/types";

type Status = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id:"TODO",        label:"To Do",       color:"text-ink-muted"  },
  { id:"IN_PROGRESS", label:"In Progress", color:"text-brand-blue" },
  { id:"IN_REVIEW",   label:"In Review",   color:"text-yellow-400" },
  { id:"DONE",        label:"Done",        color:"text-brand-teal" },
];

const COLUMN_BORDER: Record<Status, string> = {
  TODO: "border-ink-muted/20", IN_PROGRESS: "border-brand-blue/30",
  IN_REVIEW: "border-yellow-400/30", DONE: "border-brand-teal/30",
};

interface Props { projectId: string; }

export default function KanbanBoard({ projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<Status | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      setTasks(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [projectId]);

  const byStatus = (status: Status) => tasks.filter(t => t.status === status);

  const handleDragStart = (e: DragStartEvent) => {
    setDragging(tasks.find(t => t.id === e.active.id) ?? null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setDragging(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    // Determine target column
    const overTask = tasks.find(t => t.id === over.id);
    const targetStatus = overTask?.status ?? (over.id as Status);

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || activeTask.status === targetStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: targetStatus as Task["status"] } : t));

    await fetch(`/api/tasks/${active.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    });
  };

  const addTask = async (status: Status) => {
    if (!newTitle.trim()) { setAddingTo(null); return; }
    setCreating(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, title: newTitle.trim(), status }),
      });
      setNewTitle("");
      setAddingTo(null);
      fetchTasks();
    } finally { setCreating(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-ink-muted" />
    </div>
  );

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {COLUMNS.map(col => {
            const colTasks = byStatus(col.id);
            return (
              <div key={col.id} className={cn(
                "flex-shrink-0 w-72 flex flex-col rounded-xl border bg-bg-panel/50",
                COLUMN_BORDER[col.id]
              )}>
                {/* Column header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-bg-border">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium", col.color)}>{col.label}</span>
                    <span className="text-[10px] text-ink-muted bg-bg-hover px-1.5 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button onClick={() => { setAddingTo(col.id); setNewTitle(""); }}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-bg-hover text-ink-muted hover:text-ink-bright transition-colors">
                    <Plus size={13} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                  <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {colTasks.map(task => (
                      <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                    ))}
                  </SortableContext>

                  {/* Add card inline */}
                  {addingTo === col.id && (
                    <div className="bg-bg-card border border-brand-blue/40 rounded-xl p-2.5">
                      <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") addTask(col.id); if (e.key === "Escape") setAddingTo(null); }}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-xs text-ink-bright placeholder:text-ink-muted focus:outline-none mb-2" />
                      <div className="flex gap-1.5">
                        <button onClick={() => addTask(col.id)} disabled={creating}
                          className="text-[10px] px-2.5 py-1 bg-brand-blue text-white rounded-lg flex items-center gap-1 disabled:opacity-50">
                          {creating ? <Loader2 size={9} className="animate-spin" /> : null}
                          Add
                        </button>
                        <button onClick={() => setAddingTo(null)}
                          className="text-[10px] px-2.5 py-1 text-ink-muted hover:bg-bg-hover rounded-lg">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {dragging && <TaskCard task={dragging} onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      <TaskModal taskId={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchTasks} />
    </>
  );
}
