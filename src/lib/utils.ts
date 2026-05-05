import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
export const STATUS_COLORS: Record<string, string> = {
  TODO: "text-ink-muted bg-bg-hover",
  IN_PROGRESS: "text-brand-blue bg-brand-blue/10",
  IN_REVIEW: "text-yellow-400 bg-yellow-400/10",
  DONE: "text-brand-teal bg-brand-teal/10",
};
export const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "text-red-400 bg-red-400/10",
  HIGH: "text-yellow-400 bg-yellow-400/10",
  MEDIUM: "text-brand-blue bg-brand-blue/10",
  LOW: "text-ink-muted bg-bg-hover",
};
