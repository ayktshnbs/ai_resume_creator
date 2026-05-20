import type { ComponentType } from "react";
import type { ResumeData, CoverLetterData } from "@/types/resume";
import { OnyxCoverLetter } from "./onyx-cover-letter";
import { SterlingCoverLetter } from "./sterling-cover-letter";
import { AtlasCoverLetter } from "./atlas-cover-letter";
import { AuroraCoverLetter } from "./aurora-cover-letter";
import { BeaconCoverLetter } from "./beacon-cover-letter";

export type CoverLetterTemplateId =
  | "onyx-letter"
  | "sterling-letter"
  | "atlas-letter"
  | "aurora-letter"
  | "beacon-letter";

export const coverLetterTemplates: Array<{
  id: CoverLetterTemplateId;
  name: string;
  description: string;
  accentColor: string;
  accentLabel: string;
  Component: ComponentType<{ resume: ResumeData; coverLetter: CoverLetterData }>;
}> = [
  {
    id: "onyx-letter",
    name: "Modern",
    description: "A clean single-column letter with a strong cobalt accent. The safe default for tech, product, and operations roles.",
    accentColor: "#0058bc",
    accentLabel: "Cobalt",
    Component: OnyxCoverLetter
  },
  {
    id: "sterling-letter",
    name: "Classical",
    description: "Garamond serif, centered name, hairline rules, justified body. The traditional choice for legal, finance, and academia.",
    accentColor: "#6b5235",
    accentLabel: "Oak",
    Component: SterlingCoverLetter
  },
  {
    id: "atlas-letter",
    name: "Sidebar",
    description: "A structured two-column letter with a deep navy sidebar holding your contact details. Crisp and confident.",
    accentColor: "#2563eb",
    accentLabel: "Royal blue",
    Component: AtlasCoverLetter
  },
  {
    id: "aurora-letter",
    name: "Warm",
    description: "A tinted band header with a rounded recipient card and friendly tone. Works well for design, marketing, and startup roles.",
    accentColor: "#4648d4",
    accentLabel: "Indigo",
    Component: AuroraCoverLetter
  },
  {
    id: "beacon-letter",
    name: "Executive",
    description: "A full-width harbor-blue header with a confident two-column recipient block. Suited for senior leadership and heads-of-function.",
    accentColor: "#0b3d5a",
    accentLabel: "Harbor",
    Component: BeaconCoverLetter
  }
];

const cvTemplateToLetter: Record<string, CoverLetterTemplateId> = {
  "Modern Minimalist": "onyx-letter",
  "Professional Serif": "sterling-letter",
  "Creative Tech": "atlas-letter",
  "Lumina Compact": "onyx-letter",
  "Startup Operator": "aurora-letter",
  "Graduate Clean": "onyx-letter",
  "Executive Impact": "beacon-letter",
  "Academic Classic": "sterling-letter",
  "Obsidian Dark": "onyx-letter",
  "Helix Modern": "aurora-letter"
};

export function suggestLetterFromCvTemplate(cvTemplateName: string): CoverLetterTemplateId {
  return cvTemplateToLetter[cvTemplateName] || "onyx-letter";
}

export function getCoverLetterTemplate(id: CoverLetterTemplateId) {
  return coverLetterTemplates.find((t) => t.id === id) || coverLetterTemplates[0];
}

export function CoverLetterRenderer({
  templateId,
  templateName,
  resume,
  coverLetter
}: {
  templateId?: CoverLetterTemplateId;
  templateName?: string;
  resume: ResumeData;
  coverLetter: CoverLetterData;
}) {
  const id =
    templateId ||
    (templateName ? suggestLetterFromCvTemplate(templateName) : "onyx-letter");
  const { Component } = getCoverLetterTemplate(id);
  return <Component coverLetter={coverLetter} resume={resume} />;
}
