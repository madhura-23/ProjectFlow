"use client";
import { useState, useEffect, useCallback } from "react";
import { X, MessageSquare, Paperclip, Calendar, User, Flag, Loader2, Trash2, Send } from "lucide-react";
import { cn, formatDate, STATUS_COLORS, PRIORITY_COLORS } from "@/lib/utils";
import type { Task, Comment } from "@/types";

interface Props {
  taskId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

const STATUSES = ["TODO","IN_PROGRESS","IN_REVIEW","DONE"] as const;
const PRIORITIES = ["URGENT","HIGH","MEDIUM","LOW"] as const;
const STATUS_LABELS: Record<string,string> = { TODO:"Todo", IN_PROGRESS:"In Progress", IN_REVIEW:"In Review", DONE:"Done" };
const PRIORITY_LABELS: Record<string,string> = { URGENT:"Urgent", HIGH:"High", MEDIUM:"Medium", LOW:"Low" };

export default function TaskModal({ taskId, onClose, onUpdated }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("");

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();
      setTask(data);
      setTitle(data.title);
    } finally { setLoading(false); }
  }, [taskId]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  const updateField = async (field: string, value: string | null) => {
    if (!task) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const updated = await res.json();
      setTask(updated);
      onUpdated?.();
    } finally { setSaving(false); }
  };

  const saveTitle = async () => {
    if (!task || title === task.title) { setEditTitle(false); return; }
    await updateField("title", title);
    setEditTitle(false);
  };

  const postComment = async () => {
    if (!task || !commentText.trim()) return;
    setPostingComment(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, content: commentText.trim() }),
      });
      setCommentText("");
      fetchTask();
    } finally { setPostingComment(false); }
  };

  const deleteComment = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    fetchTask();
  };

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-bg-panel border-l border-bg-border overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border sticky top-0 bg-bg-panel z-10">
          <div className="flex items-center gap-2">
            {saving && <Loader2 size={13} className="animate-spin text-ink-muted" />}
            <span className="text-xs text-ink-muted">Task detail</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-hover text-ink-muted hover:text-ink-bright transition-colors">
            <X size={15} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={20} className="animate-spin text-ink-muted" />
          </div>
        ) : task ? (
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              {editTitle ? (
                <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                  onBlur={saveTitle} onKeyDown={e => e.key === "Enter" && saveTitle()}
                  className="w-full text-xl font-semibold text-ink-bright bg-bg-card border border-brand-blue/50 rounded-lg px-3 py-2 focus:outline-none" />
              ) : (
                <h2 className="text-xl font-semibold text-ink-bright cursor-pointer hover:text-white"
                  onClick={() => setEditTitle(true)}>{task.title}</h2>
              )}
              <p className="text-xs text-ink-muted mt-1">Click title to edit</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-card border border-bg-border rounded-xl p-3">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-1"><Flag size={9} />Priority</div>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map(p => (
                    <button key={p} onClick={() => updateField("priority", p)}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border transition-all",
                        task.priority === p ? PRIORITY_COLORS[p] + " border-current" : "border-transparent text-ink-muted hover:bg-bg-hover")}>
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-bg-card border border-bg-border rounded-xl p-3">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest mb-2">Status</div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateField("status", s)}
                      className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border transition-all",
                        task.status === s ? STATUS_COLORS[s] + " border-current" : "border-transparent text-ink-muted hover:bg-bg-hover")}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-bg-card border border-bg-border rounded-xl p-3">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-1"><User size={9} />Assignee</div>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <img src={task.assignee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.name}`}
                      className="w-5 h-5 rounded-full" alt={task.assignee.name} />
                    <span className="text-xs text-ink-bright">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-ink-muted">Unassigned</span>
                )}
              </div>

              <div className="bg-bg-card border border-bg-border rounded-xl p-3">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={9} />Due date</div>
                {task.dueDate ? (
                  <span className="text-xs text-ink-bright">{formatDate(task.dueDate)}</span>
                ) : (
                  <span className="text-xs text-ink-muted">No due date</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-bg-card border border-bg-border rounded-xl p-4">
              <div className="text-[10px] text-ink-muted uppercase tracking-widest mb-3 flex items-center gap-1">
                <Paperclip size={9} />Description
              </div>
              <textarea defaultValue={task.description ?? ""}
                onBlur={e => updateField("description", e.target.value)}
                rows={4}
                placeholder="Add a description..."
                className="w-full bg-transparent text-sm text-ink-mid placeholder:text-ink-muted resize-none focus:outline-none focus:text-ink-bright transition-colors" />
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-ink-muted" />
                <span className="text-sm font-medium text-ink-bright">Comments</span>
                <span className="text-xs text-ink-muted">({(task.comments ?? []).length})</span>
              </div>

              <div className="space-y-3 mb-4">
                {(task.comments ?? []).map((c: Comment) => (
                  <div key={c.id} className="flex gap-3 group">
                    <img src={c.author?.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.name}`}
                      className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" alt={c.author?.name} />
                    <div className="flex-1 bg-bg-card border border-bg-border rounded-xl px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-ink-bright">{c.author?.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-ink-muted">{formatDate(c.createdAt)}</span>
                          <button onClick={() => deleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-red-400 transition-all">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-ink-mid leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-6 h-6 rounded-full flex-shrink-0 mt-1" alt="me" />
                <div className="flex-1 flex gap-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && postComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-bg-card border border-bg-border rounded-xl px-3 py-2 text-xs text-ink-bright placeholder:text-ink-muted focus:outline-none focus:border-brand-blue/50 transition-colors" />
                  <button onClick={postComment} disabled={!commentText.trim() || postingComment}
                    className="w-8 h-8 flex items-center justify-center bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 rounded-lg text-white transition-colors flex-shrink-0">
                    {postingComment ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
