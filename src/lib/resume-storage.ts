import {
  emptyCoverLetterData,
  emptyResumeData,
  defaultTemplate,
  type CoverLetterData,
  type ResumeData,
  type ResumeReference,
  type SelectedTemplate
} from "@/types/resume";

const RESUME_KEY = "ai-cv-builder.resume-data";
const COVER_LETTER_KEY = "ai-cv-builder.cover-letter-data";
const COVER_LETTER_TEMPLATE_KEY = "ai-cv-builder.cover-letter-template";
const TEMPLATE_KEY = "ai-cv-builder.selected-template";
const API_KEY_STORE = "ai-cv-builder.openai-api-key";

function getStoreKey(base: string, userId?: string) {
  return userId ? `${base}.${userId}` : base;
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadResumeData(userId?: string): ResumeData {
  if (typeof window === "undefined") return emptyResumeData;
  try {
    const key = getStoreKey(RESUME_KEY, userId);
    const stored = window.localStorage.getItem(key);
    if (!stored) return emptyResumeData;
    return { ...emptyResumeData, ...(JSON.parse(stored) as Partial<ResumeData>) };
  } catch {
    return emptyResumeData;
  }
}

function makePersistable(data: ResumeData): ResumeData {
  const slim: ResumeReference[] = data.references.map((ref) => {
    if (ref.kind === "image" || ref.kind === "pdf" || ref.kind === "other") {
      const { dataUrl: _dataUrl, ...rest } = ref;
      void _dataUrl;
      return rest;
    }
    if (ref.text && ref.text.length > 200_000) {
      return { ...ref, text: ref.text.slice(0, 200_000) };
    }
    return ref;
  });
  let photoUrl = data.photoUrl;
  if (photoUrl && photoUrl.startsWith("data:")) {
    photoUrl = undefined;
  }
  return { ...data, photoUrl, references: slim };
}

export function saveResumeData(data: ResumeData, userId?: string) {
  if (typeof window === "undefined") return;
  const persistable = makePersistable(data);
  const key = getStoreKey(RESUME_KEY, userId);
  try {
    window.localStorage.setItem(key, JSON.stringify(persistable));
  } catch (error) {
    try {
      window.localStorage.setItem(key, JSON.stringify({ ...persistable, references: [] }));
    } catch {
      console.warn("Could not autosave resume to localStorage:", error);
    }
  }
}

export function loadCoverLetterData(userId?: string): CoverLetterData {
  if (typeof window === "undefined") return emptyCoverLetterData;
  try {
    const key = getStoreKey(COVER_LETTER_KEY, userId);
    const stored = window.localStorage.getItem(key);
    if (!stored) return emptyCoverLetterData;
    return { ...emptyCoverLetterData, ...(JSON.parse(stored) as Partial<CoverLetterData>) };
  } catch {
    return emptyCoverLetterData;
  }
}

export function saveCoverLetterData(data: CoverLetterData, userId?: string) {
  if (typeof window === "undefined") return;
  const key = getStoreKey(COVER_LETTER_KEY, userId);
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not autosave cover letter to localStorage:", error);
  }
}

export function loadCoverLetterTemplateId(fallback: string, userId?: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const key = getStoreKey(COVER_LETTER_TEMPLATE_KEY, userId);
    const stored = window.localStorage.getItem(key);
    return stored || fallback;
  } catch {
    return fallback;
  }
}

export function saveCoverLetterTemplateId(id: string, userId?: string) {
  if (typeof window === "undefined") return;
  const key = getStoreKey(COVER_LETTER_TEMPLATE_KEY, userId);
  try {
    window.localStorage.setItem(key, id);
  } catch (error) {
    console.warn("Could not save cover letter template id:", error);
  }
}

export function clearResumeData(userId?: string) {
  if (typeof window === "undefined") return;
  const key = getStoreKey(RESUME_KEY, userId);
  window.localStorage.removeItem(key);
}

export function loadSelectedTemplate(userId?: string): SelectedTemplate {
  if (typeof window === "undefined") return defaultTemplate;
  try {
    const key = getStoreKey(TEMPLATE_KEY, userId);
    const stored = window.localStorage.getItem(key);
    if (!stored) return defaultTemplate;
    return { ...defaultTemplate, ...(JSON.parse(stored) as Partial<SelectedTemplate>) };
  } catch {
    return defaultTemplate;
  }
}

export function saveSelectedTemplate(template: SelectedTemplate, userId?: string) {
  if (typeof window === "undefined") return;
  const key = getStoreKey(TEMPLATE_KEY, userId);
  window.localStorage.setItem(key, JSON.stringify(template));
}

export function loadApiKey(userId?: string): string {
  if (typeof window === "undefined") return "";
  const key = getStoreKey(API_KEY_STORE, userId);
  return window.localStorage.getItem(key) || "";
}

export function saveApiKey(key: string, userId?: string) {
  if (typeof window === "undefined") return;
  const storeKey = getStoreKey(API_KEY_STORE, userId);
  window.localStorage.setItem(storeKey, key);
}
