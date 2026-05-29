import type { ParametricConfig, ParametricStyle } from "@/components/cv-templates/parametric-template";
import type { SelectedTemplate, TemplateLayout } from "@/types/resume";

export type CVTemplateCategory = "modern" | "classic" | "minimal" | "executive" | "creative";
export type CVTemplateSection = "summary" | "experience" | "education" | "skills" | "languages" | "references";
export type CVTemplateFont = "sans" | "serif" | "mono";
export type CVTemplateSpacing = "compact" | "normal" | "spacious";
export type CVTemplateHeaderStyle =
  | "split-header"
  | "centered-rule"
  | "sidebar-profile"
  | "band-top"
  | "minimal-line"
  | "card-header"
  | "timeline";

export type CVTemplateDefinition = {
  id: number;
  name: string;
  category: CVTemplateCategory;
  layoutStructure: {
    layout: TemplateLayout;
    parametricStyle: ParametricStyle;
    columns: 1 | 2;
    sectionsOrder: CVTemplateSection[];
  };
  styling: {
    font: CVTemplateFont;
    spacing: CVTemplateSpacing;
    headerStyle: CVTemplateHeaderStyle;
    accentColor: string;
    sidebarBg?: string;
    sidebarText?: string;
  };
  exportFormat: {
    format: "pdf";
    pageSize: "A4";
    orientation: "portrait";
    renderer: "parametric";
    deterministic: true;
  };
  description: string;
  tags: string[];
};

const defaultExportFormat: CVTemplateDefinition["exportFormat"] = {
  format: "pdf",
  pageSize: "A4",
  orientation: "portrait",
  renderer: "parametric",
  deterministic: true,
};

export const cvTemplates: CVTemplateDefinition[] = [
  { id: 51, name: "Axiom Blue", category: "modern", layoutStructure: { layout: "single", parametricStyle: "split-header", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "split-header", accentColor: "#2563eb" }, exportFormat: defaultExportFormat, description: "Split header with a precise blue system accent for product and operations roles.", tags: ["Modern", "Photo", "Blue"] },
  { id: 52, name: "Vector Teal", category: "modern", layoutStructure: { layout: "single", parametricStyle: "split-header", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "split-header", accentColor: "#0f766e" }, exportFormat: defaultExportFormat, description: "Crisp split header with teal hierarchy and structured sections.", tags: ["Modern", "Teal", "ATS"] },
  { id: 53, name: "Orbit Indigo", category: "modern", layoutStructure: { layout: "single", parametricStyle: "card-header", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "card-header", accentColor: "#4f46e5" }, exportFormat: defaultExportFormat, description: "Rounded header card with indigo accents and predictable section blocks.", tags: ["Modern", "Card Header"] },
  { id: 54, name: "Grid Slate", category: "modern", layoutStructure: { layout: "single", parametricStyle: "minimal-line", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "normal", headerStyle: "minimal-line", accentColor: "#334155" }, exportFormat: defaultExportFormat, description: "Strong slate dividers with a clean editorial grid.", tags: ["Modern", "Minimal Rule"] },
  { id: 55, name: "Signal Cyan", category: "modern", layoutStructure: { layout: "single", parametricStyle: "band-top", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "band-top", accentColor: "#0891b2" }, exportFormat: defaultExportFormat, description: "Cyan top band and fixed content order for fast scanning.", tags: ["Modern", "Header Band"] },
  { id: 56, name: "Matrix Green", category: "modern", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#22c55e", sidebarBg: "#052e16", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Dark green sidebar with compact profile hierarchy.", tags: ["Modern", "Sidebar"] },
  { id: 57, name: "Keystone Navy", category: "modern", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#60a5fa", sidebarBg: "#0f172a", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Navy sidebar and blue accents for technical leadership resumes.", tags: ["Modern", "Navy"] },
  { id: 58, name: "Linear Violet", category: "modern", layoutStructure: { layout: "single", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "normal", headerStyle: "minimal-line", accentColor: "#7c3aed" }, exportFormat: defaultExportFormat, description: "Violet section rail creates deterministic visual alignment.", tags: ["Modern", "Accent Bar"] },
  { id: 59, name: "Vertex Amber", category: "modern", layoutStructure: { layout: "single", parametricStyle: "timeline", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "normal", headerStyle: "timeline", accentColor: "#d97706" }, exportFormat: defaultExportFormat, description: "Amber timeline for career progression and project milestones.", tags: ["Modern", "Timeline"] },
  { id: 60, name: "Prism Rose", category: "modern", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-light", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#e11d48", sidebarBg: "#fff1f2", sidebarText: "#0f172a" }, exportFormat: defaultExportFormat, description: "Light rose sidebar with deterministic two-column grouping.", tags: ["Modern", "Light Sidebar"] },
  { id: 61, name: "Oxford Rule", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "centered", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#1e3a8a" }, exportFormat: defaultExportFormat, description: "Classic centered serif title and blue hairline dividers.", tags: ["Classic", "Serif"] },
  { id: 62, name: "Cambridge Stone", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "centered", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#57534e" }, exportFormat: defaultExportFormat, description: "Stone-toned serif layout for traditional industries.", tags: ["Classic", "Stone"] },
  { id: 63, name: "Ledger Black", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "centered", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#111827" }, exportFormat: defaultExportFormat, description: "Black editorial typography with fixed centered structure.", tags: ["Classic", "Editorial"] },
  { id: 64, name: "Barrister Oak", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "centered", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#92400e" }, exportFormat: defaultExportFormat, description: "Warm oak serif styling for legal, finance, and policy profiles.", tags: ["Classic", "Warm"] },
  { id: 65, name: "Archive Burgundy", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "centered", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#7f1d1d" }, exportFormat: defaultExportFormat, description: "Burgundy classic layout with stable section spacing.", tags: ["Classic", "Burgundy"] },
  { id: 66, name: "Manuscript Blue", category: "classic", layoutStructure: { layout: "single", parametricStyle: "clean", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#1d4ed8" }, exportFormat: defaultExportFormat, description: "Traditional serif content with a cleaner single-column header.", tags: ["Classic", "Single Column"] },
  { id: 67, name: "Conservatory Green", category: "classic", layoutStructure: { layout: "single", parametricStyle: "clean", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "serif", spacing: "normal", headerStyle: "centered-rule", accentColor: "#166534" }, exportFormat: defaultExportFormat, description: "Classic green accent and restrained serif spacing.", tags: ["Classic", "Green"] },
  { id: 68, name: "Diplomat Charcoal", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "minimal-line", accentColor: "#374151" }, exportFormat: defaultExportFormat, description: "Charcoal rail sections with traditional serif text blocks.", tags: ["Classic", "Charcoal"] },
  { id: 69, name: "Gazette Brown", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "minimal-line", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "minimal-line", accentColor: "#78350f" }, exportFormat: defaultExportFormat, description: "Newspaper-inspired serif layout with thick brown divider.", tags: ["Classic", "Rule"] },
  { id: 70, name: "Faculty Navy", category: "classic", layoutStructure: { layout: "classic", parametricStyle: "timeline", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "serif", spacing: "normal", headerStyle: "timeline", accentColor: "#1e40af" }, exportFormat: defaultExportFormat, description: "Academic serif timeline for research and faculty careers.", tags: ["Classic", "Timeline"] },
  { id: 71, name: "Whitespace One", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "clean", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#0f172a" }, exportFormat: defaultExportFormat, description: "Pure single-column minimalist layout with black rules.", tags: ["Minimal", "ATS"] },
  { id: 72, name: "Quiet Gray", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "minimal-line", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "sans", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#64748b" }, exportFormat: defaultExportFormat, description: "Soft gray hierarchy with large whitespace and fixed sections.", tags: ["Minimal", "Gray"] },
  { id: 73, name: "North Star", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "split-header", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "spacious", headerStyle: "split-header", accentColor: "#0f766e" }, exportFormat: defaultExportFormat, description: "Minimal split header with muted teal emphasis.", tags: ["Minimal", "Clean"] },
  { id: 74, name: "Paperline", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "clean", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "serif", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#44403c" }, exportFormat: defaultExportFormat, description: "Serif minimal paper layout with calm stone dividers.", tags: ["Minimal", "Serif"] },
  { id: 75, name: "Mono Core", category: "minimal", layoutStructure: { layout: "compact", parametricStyle: "compact-dense", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "mono", spacing: "compact", headerStyle: "minimal-line", accentColor: "#111827" }, exportFormat: defaultExportFormat, description: "Compact monospace layout for engineering and technical resumes.", tags: ["Minimal", "Mono"] },
  { id: 76, name: "Bare Blue", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#2563eb" }, exportFormat: defaultExportFormat, description: "Minimal blue rail sections with consistent export layout.", tags: ["Minimal", "Blue"] },
  { id: 77, name: "Plain Sage", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "clean", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "sans", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#15803d" }, exportFormat: defaultExportFormat, description: "Quiet green accent for understated professional resumes.", tags: ["Minimal", "Green"] },
  { id: 78, name: "White Rail", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "serif", spacing: "spacious", headerStyle: "minimal-line", accentColor: "#475569" }, exportFormat: defaultExportFormat, description: "Whitespace-first serif design with slate section rail.", tags: ["Minimal", "Serif"] },
  { id: 79, name: "Focus Line", category: "minimal", layoutStructure: { layout: "single", parametricStyle: "minimal-line", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "normal", headerStyle: "minimal-line", accentColor: "#0284c7" }, exportFormat: defaultExportFormat, description: "Focused cyan dividers and exact one-column order.", tags: ["Minimal", "Line"] },
  { id: 80, name: "Clean Ledger", category: "minimal", layoutStructure: { layout: "compact", parametricStyle: "compact-dense", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "compact", headerStyle: "minimal-line", accentColor: "#334155" }, exportFormat: defaultExportFormat, description: "Compact minimal ledger for dense experience histories.", tags: ["Minimal", "Compact"] },
  { id: 81, name: "Boardroom Navy", category: "executive", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#93c5fd", sidebarBg: "#111827", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Executive dark sidebar with high-contrast leadership framing.", tags: ["Executive", "Sidebar"] },
  { id: 82, name: "C Suite Gold", category: "executive", layoutStructure: { layout: "single", parametricStyle: "band-top", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "band-top", accentColor: "#a16207" }, exportFormat: defaultExportFormat, description: "Gold top band with serif authority for senior leaders.", tags: ["Executive", "Gold"] },
  { id: 83, name: "Director Slate", category: "executive", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-light", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#475569", sidebarBg: "#f1f5f9", sidebarText: "#0f172a" }, exportFormat: defaultExportFormat, description: "Light slate sidebar for mature executive profiles.", tags: ["Executive", "Light Sidebar"] },
  { id: 84, name: "Principal Blue", category: "executive", layoutStructure: { layout: "single", parametricStyle: "card-header", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "sans", spacing: "normal", headerStyle: "card-header", accentColor: "#1d4ed8" }, exportFormat: defaultExportFormat, description: "Card header designed for principal and head-of-function roles.", tags: ["Executive", "Card"] },
  { id: 85, name: "Operator Charcoal", category: "executive", layoutStructure: { layout: "compact", parametricStyle: "compact-dense", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "compact", headerStyle: "minimal-line", accentColor: "#1f2937" }, exportFormat: defaultExportFormat, description: "Dense executive layout for operators with extensive achievements.", tags: ["Executive", "Compact"] },
  { id: 86, name: "Summit Green", category: "executive", layoutStructure: { layout: "single", parametricStyle: "timeline", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "timeline", accentColor: "#047857" }, exportFormat: defaultExportFormat, description: "Leadership timeline with green milestones and fixed ordering.", tags: ["Executive", "Timeline"] },
  { id: 87, name: "Venture Black", category: "executive", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#facc15", sidebarBg: "#18181b", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Black sidebar with yellow accent for board and startup leaders.", tags: ["Executive", "Board"] },
  { id: 88, name: "Portfolio Steel", category: "executive", layoutStructure: { layout: "single", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "minimal-line", accentColor: "#475569" }, exportFormat: defaultExportFormat, description: "Steel accent rail with serif tone for portfolio executives.", tags: ["Executive", "Serif"] },
  { id: 89, name: "Mandate Maroon", category: "executive", layoutStructure: { layout: "single", parametricStyle: "band-top", columns: 1, sectionsOrder: ["summary", "experience", "education", "skills"] }, styling: { font: "serif", spacing: "normal", headerStyle: "band-top", accentColor: "#7f1d1d" }, exportFormat: defaultExportFormat, description: "Maroon authority band with stable executive section blocks.", tags: ["Executive", "Maroon"] },
  { id: 90, name: "Leadership Indigo", category: "executive", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-light", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#4338ca", sidebarBg: "#eef2ff", sidebarText: "#0f172a" }, exportFormat: defaultExportFormat, description: "Light indigo leadership sidebar for strategy and transformation roles.", tags: ["Executive", "Indigo"] },
  { id: 91, name: "Studio Magenta", category: "creative", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-light", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#db2777", sidebarBg: "#fdf2f8", sidebarText: "#0f172a" }, exportFormat: defaultExportFormat, description: "Magenta sidebar for design, brand, and content professionals.", tags: ["Creative", "Magenta"] },
  { id: 92, name: "Canvas Purple", category: "creative", layoutStructure: { layout: "single", parametricStyle: "card-header", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "card-header", accentColor: "#9333ea" }, exportFormat: defaultExportFormat, description: "Purple card header and fixed content blocks for creative portfolios.", tags: ["Creative", "Card"] },
  { id: 93, name: "Muse Coral", category: "creative", layoutStructure: { layout: "single", parametricStyle: "split-header", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "split-header", accentColor: "#f97316" }, exportFormat: defaultExportFormat, description: "Coral split header for marketers and creative operators.", tags: ["Creative", "Coral"] },
  { id: 94, name: "Pixel Lime", category: "creative", layoutStructure: { layout: "compact", parametricStyle: "compact-dense", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "mono", spacing: "compact", headerStyle: "minimal-line", accentColor: "#65a30d" }, exportFormat: defaultExportFormat, description: "Monospace compact layout with lime accent for digital creators.", tags: ["Creative", "Mono"] },
  { id: 95, name: "Gallery Cyan", category: "creative", layoutStructure: { layout: "single", parametricStyle: "band-top", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "band-top", accentColor: "#06b6d4" }, exportFormat: defaultExportFormat, description: "Cyan band-top template for portfolio-forward candidates.", tags: ["Creative", "Cyan"] },
  { id: 96, name: "Ink Violet", category: "creative", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#c084fc", sidebarBg: "#312e81", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Dark violet sidebar with strong creative contrast.", tags: ["Creative", "Dark Sidebar"] },
  { id: 97, name: "Storyboard Red", category: "creative", layoutStructure: { layout: "single", parametricStyle: "timeline", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "timeline", accentColor: "#dc2626" }, exportFormat: defaultExportFormat, description: "Red timeline layout for project-driven creative careers.", tags: ["Creative", "Timeline"] },
  { id: 98, name: "Craft Amber", category: "creative", layoutStructure: { layout: "single", parametricStyle: "accent-bar", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "serif", spacing: "normal", headerStyle: "minimal-line", accentColor: "#d97706" }, exportFormat: defaultExportFormat, description: "Amber rail with serif craft feel and exact export blocks.", tags: ["Creative", "Serif"] },
  { id: 99, name: "Neon Edge", category: "creative", layoutStructure: { layout: "twoColumn", parametricStyle: "sidebar-dark", columns: 2, sectionsOrder: ["summary", "experience", "skills", "education"] }, styling: { font: "sans", spacing: "normal", headerStyle: "sidebar-profile", accentColor: "#22d3ee", sidebarBg: "#111827", sidebarText: "#ffffff" }, exportFormat: defaultExportFormat, description: "Dark creative sidebar with electric cyan edge treatment.", tags: ["Creative", "High Contrast"] },
  { id: 100, name: "Festival Blue", category: "creative", layoutStructure: { layout: "single", parametricStyle: "card-header", columns: 1, sectionsOrder: ["summary", "experience", "skills", "education", "languages"] }, styling: { font: "sans", spacing: "normal", headerStyle: "card-header", accentColor: "#0ea5e9" }, exportFormat: defaultExportFormat, description: "Bright blue card-header template with deterministic creative blocks.", tags: ["Creative", "Bright"] },
];

export function getCVTemplateById(id: number | string | undefined | null) {
  const numericId = typeof id === "string" ? Number(id) : id;
  return cvTemplates.find((template) => template.id === numericId);
}

/**
 * Source-of-truth for which templates require Pro.
 *
 * Categorical gating keeps the registry rows lean (no per-row flag to
 * maintain) and gives free users 30 templates across three categories —
 * enough variety that the upgrade ask isn't framed as "you get no options."
 */
const PREMIUM_CATEGORIES = new Set<CVTemplateCategory>(["executive", "creative"]);

export function isPremiumTemplate(template: CVTemplateDefinition | undefined | null): boolean {
  if (!template) return false;
  return PREMIUM_CATEGORIES.has(template.category);
}

export function isPremiumTemplateId(id: number | string | undefined | null): boolean {
  return isPremiumTemplate(getCVTemplateById(id));
}

export function cvTemplateToParametricConfig(template: CVTemplateDefinition): ParametricConfig {
  return {
    name: template.name,
    style: template.layoutStructure.parametricStyle,
    pdfLayout: template.layoutStructure.layout,
    color: template.styling.accentColor,
    sidebarBg: template.styling.sidebarBg,
    sidebarText: template.styling.sidebarText,
    font: template.styling.font,
    desc: template.description,
    tags: template.tags,
  };
}

export function cvTemplateToSelectedTemplate(template: CVTemplateDefinition): SelectedTemplate {
  return {
    templateId: template.id,
    name: template.name,
    layout: template.layoutStructure.layout,
    accent: template.styling.accentColor,
    themeColor: template.styling.accentColor,
    fontFamily: template.styling.font,
    spacing: template.styling.spacing,
  };
}
