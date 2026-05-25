import type { ComponentType } from "react";
import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { getCvLabels, type CvLabels, type CvLang } from "@/lib/cv-labels";
import { OnyxPreview } from "./onyx-preview";
import { SterlingPreview } from "./sterling-preview";
import { AtlasPreview } from "./atlas-preview";
import { AuroraPreview } from "./aurora-preview";
import { MeridianPreview } from "./meridian-preview";
import { BeaconPreview } from "./beacon-preview";
import { QuillPreview } from "./quill-preview";
import { VertexPreview } from "./vertex-preview";
import { ObsidianPreview } from "./obsidian-preview";
import { HelixPreview } from "./helix-preview";
import { makeParametric, parametricTemplates } from "./parametric-template";
import { cvTemplates, cvTemplateToParametricConfig } from "@/templates/cvTemplates";

const handcrafted: Record<string, ComponentType<{ resume: ResumeData; settings?: SelectedTemplate; labels?: CvLabels }>> = {
  "Modern Minimalist": OnyxPreview,
  "Professional Serif": SterlingPreview,
  "Creative Tech": AtlasPreview,
  "Lumina Compact": VertexPreview,
  "Startup Operator": AuroraPreview,
  "Graduate Clean": MeridianPreview,
  "Executive Impact": BeaconPreview,
  "Academic Classic": QuillPreview,
  "Obsidian Dark": ObsidianPreview,
  "Helix Modern": HelixPreview,
};

const map: Record<string, ComponentType<{ resume: ResumeData; settings?: SelectedTemplate; labels?: CvLabels }>> = {
  ...handcrafted,
  ...parametricTemplates,
};

const registryById: Record<number, ComponentType<{ resume: ResumeData; settings?: SelectedTemplate; labels?: CvLabels }>> = {};
const registryByName: Record<string, ComponentType<{ resume: ResumeData; settings?: SelectedTemplate; labels?: CvLabels }>> = {};

for (const template of cvTemplates) {
  const Preview = makeParametric(cvTemplateToParametricConfig(template));
  registryById[template.id] = Preview;
  registryByName[template.name] = Preview;
}

export function TemplateRenderer({
  resume,
  templateName,
  template,
  settings
}: {
  resume: ResumeData;
  templateName?: string;
  template?: SelectedTemplate;
  settings?: SelectedTemplate;
}) {
  const templateId = template?.templateId ?? settings?.templateId;
  const name = templateName || template?.name || "Modern Minimalist";
  const Preview = (templateId ? registryById[templateId] : undefined) || registryByName[name] || map[name] || OnyxPreview;
  const effectiveSettings = settings || template;
  const labels = getCvLabels((effectiveSettings?.cvLanguage as CvLang) || "en");
  return <Preview resume={resume} settings={effectiveSettings} labels={labels} />;
}
