import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumber(
  val: string | number | undefined,
  fallback: number
): number;
export function toNumber(
  val: string | number | undefined,
  fallback?: number
): number | undefined {
  if(!val || !String(val).trim()) {
    return fallback;
  }
  
  const n = Number(val);
  return Number.isNaN(n) ? fallback : n;
}
