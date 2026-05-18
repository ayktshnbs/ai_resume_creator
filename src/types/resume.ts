export type TemplateLayout = "single" | "classic" | "twoColumn" | "compact";

export type TemplateAccent = "primary" | "primaryBright" | "secondary" | "ink" | "success" | "warning";

export type SelectedTemplate = {
  name: string;
  layout: TemplateLayout;
  accent: TemplateAccent | string;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
};

export type ResumeReferenceKind = "image" | "pdf" | "text" | "json" | "file";

export type ResumeReference = {
  id: string;
  name: string;
  kind: ResumeReferenceKind;
  mimeType: string;
  size: number;
  addedAt: string;
  text?: string;
  dataUrl?: string;
  imported?: boolean;
};

export type ResumeData = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl?: string;
  photoX?: number;
  photoY?: number;
  photoScale?: number;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  references: ResumeReference[];
};

export const emptyResumeData: ResumeData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  references: []
};
