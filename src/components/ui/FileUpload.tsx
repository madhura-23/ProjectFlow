"use client";
import { useState, useRef } from "react";
import { Upload, X, File, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile { name: string; size: number; url: string; status: "uploading"|"done"|"error"; }

interface Props { taskId: string; onUploaded?: (url: string, name: string) => void; }

export default function FileUpload({ taskId, onUploaded }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    const entry: UploadedFile = { name: file.name, size: file.size, url: "", status: "uploading" };
    setFiles(prev => [...prev, entry]);
    try {
      const res = await fetch("/api/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { fileUrl } = await res.json();
      setFiles(prev => prev.map(f => f.name === file.name ? { ...f, url: fileUrl, status: "done" } : f));
      onUploaded?.(fileUrl, file.name);
    } catch {
      setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: "error" } : f));
    }
  };

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(upload);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          dragging ? "border-brand-blue bg-brand-blue/5" : "border-bg-border hover:border-brand-blue/40"
        )}>
        <Upload size={20} className="mx-auto text-ink-muted mb-2" />
        <p className="text-xs text-ink-mid">Drop files here or <span className="text-brand-blue">browse</span></p>
        <p className="text-[10px] text-ink-muted mt-1">Any file up to 10MB</p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-card border border-bg-border rounded-xl px-3 py-2.5">
              <File size={14} className="text-ink-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-ink-bright truncate">{f.name}</div>
                <div className="text-[10px] text-ink-muted">{(f.size / 1024).toFixed(1)} KB</div>
              </div>
              {f.status === "uploading" && <Loader2 size={14} className="animate-spin text-brand-blue" />}
              {f.status === "done" && <CheckCircle2 size={14} className="text-brand-teal" />}
              {f.status === "error" && <X size={14} className="text-red-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
