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
import { parametricTemplates } from "./parametric-template";

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
  const name = templateName || template?.name || "Modern Minimalist";
  const Preview = map[name] || OnyxPreview;
  const effectiveSettings = settings || template;
  const labels = getCvLabels((effectiveSettings?.cvLanguage as CvLang) || "en");
  return <Preview resume={resume} settings={effectiveSettings} labels={labels} />;
}
