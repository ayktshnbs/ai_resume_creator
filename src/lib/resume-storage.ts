import { emptyResumeData, type ResumeData, type SelectedTemplate } from '@/types/resume';

const RESUME_KEY = "ai-cv-builder.resume-data";
const TEMPLATE_KEY = "ai-cv-builder.selected-template";
const API_KEY_STORE = "ai-cv-builder.openai-api-key";

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadResumeData(): ResumeData {
  if (typeof window === "undefined") {
    return emptyResumeData;
  }

  try {
    const stored = window.localStorage.getItem(RESUME_KEY);
    if (!stored) {
      return emptyResumeData;
    }

    return { ...emptyResumeData, ...(JSON.parse(stored) as Partial<ResumeData>) };
  } catch {
    return emptyResumeData;
  }
}

export function saveResumeData(data: ResumeData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RESUME_KEY, JSON.stringify(data));
}

export function clearResumeData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(RESUME_KEY);
}

export function loadSelectedTemplate(): SelectedTemplate {
  if (typeof window === "undefined") {
    return { name: "Modern Minimalist", layout: "single", accent: "primary" };
  }

  try {
    const stored = window.localStorage.getItem(TEMPLATE_KEY);
    if (!stored) {
      return { name: "Modern Minimalist", layout: "single", accent: "primary" };
    }

    return JSON.parse(stored) as SelectedTemplate;
  } catch {
    return { name: "Modern Minimalist", layout: "single", accent: "primary" };
  }
}

export function saveSelectedTemplate(template: SelectedTemplate) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TEMPLATE_KEY, JSON.stringify(template));
}

export function loadApiKey(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(API_KEY_STORE) || "";
}

export function saveApiKey(key: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(API_KEY_STORE, key);
}
