export type TemplateLayout = "single" | "classic" | "twoColumn" | "compact";

export type TemplateVariant = "minimal" | "classic" | "tech" | "compact" | "startup" | "graduate";

export type TemplateFont = "sans" | "serif" | "mono";

export type TemplateSpacing = "compact" | "normal" | "spacious";

export type TemplateAccent = "primary" | "primaryBright" | "secondary" | "ink" | "success" | "warning";

export type SelectedTemplate = {
  name: string;
  layout: TemplateLayout;
  accent: TemplateAccent | string;
  variant?: TemplateVariant;
  themeColor?: string;
  fontFamily?: TemplateFont;
  fontSize?: number;
  spacing?: TemplateSpacing;
  parametricStyle?: string;
};

export const defaultTemplate: SelectedTemplate = {
  name: "Modern Minimalist",
  layout: "single",
  accent: "primary",
  variant: "minimal",
  themeColor: "#2563eb",
  fontFamily: "sans",
  fontSize: 10,
  spacing: "normal"
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

export type ResumeReferenceKind = "image" | "pdf" | "text" | "json" | "other";

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
  languages: string[];
  references: ResumeReference[];
};

export type CoverLetterData = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientAddress: string;
  subject: string;
  body: string;
};

export const emptyCoverLetterData: CoverLetterData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  date: "",
  recipientName: "",
  recipientTitle: "",
  recipientCompany: "",
  recipientAddress: "",
  subject: "",
  body: ""
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
  languages: [],
  references: []
};
