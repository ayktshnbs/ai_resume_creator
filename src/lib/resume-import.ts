import { createId } from "@/lib/resume-storage";
import type { ResumeData, ResumeReference } from "@/types/resume";

export function getReferenceLabel(kind: ResumeReference["kind"]) {
  const labels: Record<ResumeReference["kind"], string> = {
    image: "Image reference",
    pdf: "PDF resume",
    text: "Text note",
    json: "Resume import",
    other: "File reference"
  };
  return labels[kind];
}

export function getReferenceKind(file: File): ResumeReference["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (file.type === "application/json" || file.name.toLowerCase().endsWith(".json")) return "json";
  if (file.type.startsWith("text/") || file.name.toLowerCase().match(/\.(txt|md)$/)) return "text";
  return "other";
}

export function parseImportedResume(text: string): Partial<ResumeData> | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    return extractResumeObject(parsed);
  } catch {
    return null;
  }
}

export function extractResumeObject(value: unknown): Partial<ResumeData> | null {
  if (!isRecord(value)) return null;
  const source = isRecord(value.resumeData) ? value.resumeData : value;
  const resume: Partial<ResumeData> = {};

  if (typeof source.firstName === "string") resume.firstName = source.firstName;
  if (typeof source.lastName === "string") resume.lastName = source.lastName;
  if (typeof source.title === "string") resume.title = source.title;
  if (typeof source.email === "string") resume.email = source.email;
  if (typeof source.phone === "string") resume.phone = source.phone;
  if (typeof source.location === "string") resume.location = source.location;
  if (typeof source.website === "string") resume.website = source.website;
  if (typeof source.summary === "string") resume.summary = source.summary;

  if (Array.isArray(source.skills)) {
    resume.skills = source.skills
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(source.languages)) {
    resume.languages = source.languages
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(source.experiences)) {
    resume.experiences = source.experiences.filter(isRecord).map((item) => ({
      id: typeof item.id === "string" ? item.id : createId("exp"),
      role: typeof item.role === "string" ? item.role : "",
      company: typeof item.company === "string" ? item.company : "",
      location: typeof item.location === "string" ? item.location : "",
      startDate: typeof item.startDate === "string" ? item.startDate : "",
      endDate: typeof item.endDate === "string" ? item.endDate : "",
      current: Boolean(item.current),
      bullets: Array.isArray(item.bullets)
        ? item.bullets.filter((bullet): bullet is string => typeof bullet === "string")
        : [""]
    }));
  }

  if (Array.isArray(source.education)) {
    resume.education = source.education.filter(isRecord).map((item) => ({
      id: typeof item.id === "string" ? item.id : createId("edu"),
      school: typeof item.school === "string" ? item.school : "",
      degree: typeof item.degree === "string" ? item.degree : "",
      location: typeof item.location === "string" ? item.location : "",
      startDate: typeof item.startDate === "string" ? item.startDate : "",
      endDate: typeof item.endDate === "string" ? item.endDate : ""
    }));
  }

  return Object.keys(resume).length > 0 ? resume : null;
}

export function mergeImportedResume(current: ResumeData, imported: Partial<ResumeData> | null) {
  if (!imported) return current;
  return {
    ...current,
    firstName: imported.firstName?.trim() ? imported.firstName : current.firstName,
    lastName: imported.lastName?.trim() ? imported.lastName : current.lastName,
    title: imported.title?.trim() ? imported.title : current.title,
    email: imported.email?.trim() ? imported.email : current.email,
    phone: imported.phone?.trim() ? imported.phone : current.phone,
    location: imported.location?.trim() ? imported.location : current.location,
    website: imported.website?.trim() ? imported.website : current.website,
    summary: imported.summary?.trim() ? imported.summary : current.summary,
    skills: imported.skills && imported.skills.length > 0 ? imported.skills : current.skills,
    languages: imported.languages && imported.languages.length > 0 ? imported.languages : current.languages,
    experiences:
      imported.experiences && imported.experiences.length > 0 ? imported.experiences : current.experiences,
    education: imported.education && imported.education.length > 0 ? imported.education : current.education
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function extractPdfText(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items.filter(
        (item) => "str" in item && "transform" in item
      ) as Array<{ str: string; transform: number[] }>;
      const lineTexts: string[] = [];
      let lastY: number | null = null;
      let currentLine = "";
      for (const item of items) {
        const y = Math.round(item.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 3) {
          if (currentLine.trim()) lineTexts.push(currentLine.trim());
          currentLine = "";
        }
        currentLine += (currentLine && !currentLine.endsWith(" ") ? " " : "") + item.str;
        lastY = y;
      }
      if (currentLine.trim()) lineTexts.push(currentLine.trim());
      pages.push(lineTexts.join("\n"));
    }
    return pages.join("\n\n");
  } catch (err) {
    console.error("[PDF extract error]", err);
    return "";
  }
}

export async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}
