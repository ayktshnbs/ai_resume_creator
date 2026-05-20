"use client";

import Link from "next/link";
import type { DragEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import {
  clearResumeData,
  createId,
  loadApiKey,
  loadResumeData,
  loadSelectedTemplate,
  saveApiKey,
  saveResumeData,
  saveSelectedTemplate
} from "@/lib/resume-storage";
import { emptyResumeData, type EducationItem, type ExperienceItem, type ResumeData, type ResumeReference, type SelectedTemplate } from "@/types/resume";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSession } from "next-auth/react";
import { ResumePDF } from "@/components/resume-pdf";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { ALL_LANGUAGES } from "@/lib/languages";

type AiState = {
  full: boolean;
  summary: boolean;
  bullets: Record<string, boolean>;
  error: string;
};

type ResumeHelperAction =
  | "improve_summary"
  | "improve_bullet"
  | "suggest_skills"
  | "generate_cover_letter"
  | "analyze_resume"
  | "extract_resume";

type ResumeAnalysis = {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  summary: string;
};

type HelperState = {
  action: ResumeHelperAction | null;
  error: string;
  resultText: string;
  skills: string[];
  analysis: ResumeAnalysis | null;
  extractingId: string | null;
};

const initialAiState: AiState = {
  full: false,
  summary: false,
  bullets: {},
  error: ""
};

const initialHelperState: HelperState = {
  action: null,
  error: "",
  resultText: "",
  skills: [],
  analysis: null,
  extractingId: null
};

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(emptyResumeData);
  const [template, setTemplate] = useState<SelectedTemplate>(loadSelectedTemplate());
  const [skillDraft, setSkillDraft] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [referenceMessage, setReferenceMessage] = useState("");
  const [ai, setAi] = useState<AiState>(initialAiState);
  const [helper, setHelper] = useState<HelperState>(initialHelperState);
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [showDesignConfig, setShowDesignConfig] = useState(false);
  const [languageDraft, setLanguageDraft] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    setIsClient(true);
    if (status === "loading") return;
    
    setResume(loadResumeData(userId));
    setTemplate(loadSelectedTemplate(userId));
    setApiKey(loadApiKey(userId));
    setLoaded(true);
  }, [userId, status]);

  useEffect(() => {
    if (loaded) {
      saveResumeData(resume, userId);
    }
  }, [loaded, resume, userId]);

  const fullName = `${resume.firstName} ${resume.lastName}`.trim();

  function updateResume<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setResume((current) => ({ ...current, [key]: value }));
  }

  function updateTemplate(patch: Partial<SelectedTemplate>) {
    setTemplate((current) => {
      const next = { ...current, ...patch };
      saveSelectedTemplate(next, userId);
      return next;
    });
  }

  function addExperience() {
    const newItem: ExperienceItem = {
      id: createId("exp"),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""]
    };
    setResume((current) => ({ ...current, experiences: [newItem, ...current.experiences] }));
  }

  function updateExperience(id: string, patch: Partial<ExperienceItem>) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((exp) => (exp.id === id ? { ...exp, ...patch } : exp))
    }));
  }

  function deleteExperience(id: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.filter((exp) => exp.id !== id)
    }));
  }

  function addBullet(experienceId: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((exp) =>
        exp.id === experienceId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      )
    }));
  }

  function updateBullet(experienceId: string, index: number, value: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((exp) =>
        exp.id === experienceId
          ? { ...exp, bullets: exp.bullets.map((b, i) => (i === index ? value : b)) }
          : exp
      )
    }));
  }

  function deleteBullet(experienceId: string, index: number) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((exp) =>
        exp.id === experienceId ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) } : exp
      )
    }));
  }

  function addEducation() {
    const newItem: EducationItem = {
      id: createId("edu"),
      school: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: ""
    };
    setResume((current) => ({ ...current, education: [newItem, ...current.education] }));
  }

  function updateEducation(id: string, patch: Partial<EducationItem>) {
    setResume((current) => ({
      ...current,
      education: current.education.map((edu) => (edu.id === id ? { ...edu, ...patch } : edu))
    }));
  }

  function deleteEducation(id: string) {
    setResume((current) => ({
      ...current,
      education: current.education.filter((edu) => edu.id !== id)
    }));
  }

  function addSkill() {
    if (!skillDraft.trim()) return;
    setResume((current) => ({
      ...current,
      skills: Array.from(new Set([...current.skills, skillDraft.trim()]))
    }));
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setResume((current) => ({
      ...current,
      skills: current.skills.filter((s) => s !== skill)
    }));
  }

  function addLanguage(lang: string) {
    setResume((current) => ({
      ...current,
      languages: Array.from(new Set([...current.languages, lang]))
    }));
    setLanguageDraft("");
    setShowLanguageMenu(false);
  }

  function removeLanguage(lang: string) {
    setResume((current) => ({
      ...current,
      languages: current.languages.filter((l) => l !== lang)
    }));
  }

  function removeReference(id: string) {
    setResume((current) => ({
      ...current,
      references: current.references.filter((ref) => ref.id !== id)
    }));
  }

  async function shareResume() {
    const url = `${window.location.origin}/resume`;

    try {
      await window.navigator.clipboard.writeText(url);
      setShareMessage("Temporary preview URL copied. Public sharing will require login/backend.");
    } catch {
      window.alert("Sharing requires login/backend. For now, use this local preview URL: " + url);
    }
  }

  async function handleReferenceUpload(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
    const MAX_PDF_BYTES = 12 * 1024 * 1024;
    const MAX_TEXT_BYTES = 1 * 1024 * 1024;

    const importedReferences: ResumeReference[] = [];
    const rejected: string[] = [];
    let importedResume: Partial<ResumeData> | null = null;
    setReferenceMessage("");

    for (const file of Array.from(files)) {
      const kind = getReferenceKind(file);
      const addedAt = new Date().toISOString();

      const sizeCap =
        kind === "image"
          ? MAX_IMAGE_BYTES
          : kind === "pdf"
          ? MAX_PDF_BYTES
          : kind === "text" || kind === "json"
          ? MAX_TEXT_BYTES
          : MAX_PDF_BYTES;

      if (file.size > sizeCap) {
        rejected.push(`${file.name} (${formatFileSize(file.size)} — limit ${formatFileSize(sizeCap)})`);
        continue;
      }

      try {
        if (kind === "json" || kind === "text") {
          const text = await file.text();
          const reference: ResumeReference = {
            id: createId("ref"),
            name: file.name,
            kind,
            mimeType: file.type || "text/plain",
            size: file.size,
            addedAt,
            text
          };

          if (kind === "json") {
            const parsed = parseImportedResume(text);
            if (parsed) {
              importedResume = { ...(importedResume ?? {}), ...parsed };
              reference.imported = true;
            }
          }

          importedReferences.push(reference);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        importedReferences.push({
          id: createId("ref"),
          name: file.name,
          kind,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          addedAt,
          dataUrl
        });
      } catch (error) {
        console.error("Reference upload failed:", error);
        rejected.push(`${file.name} (could not be read)`);
      }
    }

    if (importedReferences.length > 0) {
      setResume((current) => ({
        ...mergeImportedResume(current, importedResume),
        references: [...current.references, ...importedReferences]
      }));

      // Automatically trigger AI extraction for the first valid text/json reference found
      const firstExtractable = importedReferences.find(ref => ref.kind === "text" || ref.kind === "json");
      if (firstExtractable && !importedResume) {
        void extractFromReference(firstExtractable);
      }
    }

    if (rejected.length > 0) {
      setReferenceMessage(
        `Some files were skipped: ${rejected.join(", ")}. Keep images under 6MB and PDFs under 12MB.`
      );
    } else if (importedReferences.length > 0) {
      setReferenceMessage(
        importedResume
          ? "Uploaded files were attached and the JSON resume file was used to populate the form."
          : "Uploaded files were attached to this draft. AI is automatically processing your documents."
      );
    }
  }

  async function runHelperAction(action: ResumeHelperAction, text = "", referenceId?: string) {
    setHelper((current) => ({
      ...current,
      action,
      error: "",
      resultText: "",
      skills: [],
      analysis: null,
      extractingId: referenceId || null
    }));

    try {
      const response = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resumeData: resume,
          text,
          targetRole: resume.title,
          userApiKey: apiKey
        })
      });

      const data = (await response.json()) as {
        analysis?: ResumeAnalysis;
        error?: string;
        resultText?: string;
        skills?: string[];
        resumeData?: ResumeData;
      };

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      setHelper((current) => ({
        ...current,
        action: null,
        error: "",
        resultText: data.resultText || "",
        skills: data.skills || [],
        analysis: data.analysis || null,
        extractingId: null
      }));

      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      setHelper((current) => ({ ...current, action: null, error: message, extractingId: null }));
      return null;
    }
  }

  async function extractFromReference(reference: ResumeReference) {
    if (!reference.text?.trim()) {
      setHelper((current) => ({ ...current, error: "This reference has no extractable text." }));
      return;
    }

    const data = await runHelperAction("extract_resume", reference.text, reference.id);
    if (data?.resumeData) {
      setResume((current) => mergeImportedResume(current, data.resumeData!));
      setReferenceMessage(`Data successfully extracted from "${reference.name}" and merged into your draft.`);
    }
  }

  async function improveSummary() {
    if (!resume.summary.trim()) {
      setAi((current) => ({ ...current, error: "Add a summary draft first." }));
      return;
    }

    setAi((current) => ({ ...current, summary: true, error: "" }));

    try {
      const data = await runHelperAction("improve_summary", resume.summary);
      if (data?.resultText) {
        updateResume("summary", data.resultText);
      }
    } finally {
      setAi((current) => ({ ...current, summary: false }));
    }
  }

  async function improveBullet(experienceId: string, bulletIndex: number, text: string) {
    if (!text.trim()) {
      setAi((current) => ({ ...current, error: "Add bullet text before improving it." }));
      return;
    }

    const key = `${experienceId}-${bulletIndex}`;
    setAi((current) => ({ ...current, bullets: { ...current.bullets, [key]: true }, error: "" }));

    try {
      const data = await runHelperAction("improve_bullet", text);
      if (data?.resultText) {
        updateBullet(experienceId, bulletIndex, data.resultText);
      }
    } finally {
      setAi((current) => {
        const nextBullets = { ...current.bullets };
        delete nextBullets[key];
        return { ...current, bullets: nextBullets };
      });
    }
  }

  function addSuggestedSkills() {
    if (helper.skills.length === 0) {
      return;
    }

    setResume((current) => ({
      ...current,
      skills: Array.from(new Set([...current.skills, ...helper.skills]))
    }));
  }

  async function improveFullResume() {
    setAi((current) => ({ ...current, full: true, error: "" }));

    try {
      const response = await fetch("/api/ai/improve-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume, targetRole: resume.title })
      });
      const data = (await response.json()) as { resumeData?: ResumeData; improvedText?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      if (data.resumeData) {
        setResume(data.resumeData);
      } else if (data.improvedText) {
        updateResume("summary", data.improvedText);
      }
    } catch (error) {
      setAi((current) => ({ ...current, error: getErrorMessage(error) }));
    } finally {
      setAi((current) => ({ ...current, full: false }));
    }
  }

  return (
    <AppShell active="resume" fullHeight>
      <div className="flex h-full flex-col overflow-hidden bg-background md:flex-row">
        <section className="h-full w-full overflow-y-auto border-r border-outline/30 bg-surface p-4 md:w-1/2 md:p-8 lg:w-5/12">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-ink">New Resume</h1>
              <p className="mt-1 text-sm text-muted">Autosaves locally. Sign in later to sync across devices.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center justify-center gap-2 rounded-xl border border-outline/70 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
                onClick={() => setShowDesignConfig(true)}
                type="button"
              >
                <Icon name="palette" />
                Design
              </button>
              <button
                className="primary-gradient flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient disabled:opacity-60"
                disabled={ai.full}
                onClick={improveFullResume}
                type="button"
              >
                <Icon name="sparkle" />
                {ai.full ? "Rewriting…" : "Optimize with AI"}
              </button>
            </div>
          </header>

          {showDesignConfig && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
              <div className="soft-card w-full max-w-lg rounded-2xl p-6 shadow-panel text-ink">
                <div className="mb-5 flex items-center justify-between border-b border-outline/30 pb-4">
                  <h2 className="text-xl font-bold">Design Settings</h2>
                  <button onClick={() => setShowDesignConfig(false)} type="button">
                    <Icon name="close" />
                  </button>
                </div>
                
                <div className="space-y-6 text-left">
                  {/* Color Picker */}
                  <div>
                    <p className="mb-3 font-label text-[10px] font-bold uppercase tracking-widest text-muted text-left">Theme Color</p>
                    <div className="flex flex-wrap gap-2">
                      {["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#111827"].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateTemplate({ themeColor: color })}
                          className={`h-8 w-8 rounded-full border-2 transition ${
                            template.themeColor === color ? "border-ink scale-110 shadow-md" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          type="button"
                        />
                      ))}
                      <input 
                        type="color" 
                        value={template.themeColor} 
                        onChange={(e) => updateTemplate({ themeColor: e.target.value })}
                        className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-outline/30 bg-transparent p-0"
                      />
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <p className="mb-3 font-label text-[10px] font-bold uppercase tracking-widest text-muted text-left">Typography</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["sans", "serif", "mono"] as const).map((font) => (
                        <button
                          key={font}
                          onClick={() => updateTemplate({ fontFamily: font })}
                          className={`rounded-xl border px-3 py-2 text-sm font-bold transition capitalize ${
                            template.fontFamily === font 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-outline/50 bg-white hover:bg-surface-soft"
                          }`}
                          type="button"
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <p className="mb-3 font-label text-[10px] font-bold uppercase tracking-widest text-muted text-left">Document Spacing</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["compact", "normal", "spacious"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateTemplate({ spacing: s })}
                          className={`rounded-xl border px-3 py-2 text-sm font-bold transition capitalize ${
                            template.spacing === s 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-outline/50 bg-white hover:bg-surface-soft"
                          }`}
                          type="button"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="flex w-full justify-center rounded-xl bg-ink py-3 font-bold text-white shadow-panel transition hover:brightness-110"
                    onClick={() => setShowDesignConfig(false)}
                    type="button"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {ai.error && <p className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">{ai.error}</p>}
          {referenceMessage && <p className="mb-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{referenceMessage}</p>}

          <div className="space-y-5">
            <AiHelperPanel
              helper={helper}
              isAnalyzing={helper.action === "analyze_resume"}
              isGeneratingCover={helper.action === "generate_cover_letter"}
              isSuggestingSkills={helper.action === "suggest_skills"}
              onAnalyze={() => void runHelperAction("analyze_resume")}
              onGenerateCover={() => void runHelperAction("generate_cover_letter")}
              onSuggestSkills={() => void runHelperAction("suggest_skills")}
              onAddSuggestedSkills={addSuggestedSkills}
            />

            <FormSection icon="person" title="Profile Details">
              <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row text-left">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-outline/70 bg-surface-soft">
                  {resume.photoUrl ? (
                    <img
                      alt="Profile"
                      className="h-full w-full object-cover"
                      src={resume.photoUrl}
                      style={{
                        objectPosition: `${resume.photoX ?? 50}% ${resume.photoY ?? 50}%`,
                        transform: `scale(${(resume.photoScale ?? 100) / 100})`
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <Icon name="person" />
                    </div>
                  )}
                  <input
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const dataUrl = await readFileAsDataUrl(file);
                        updateResume("photoUrl", dataUrl);
                      }
                    }}
                    type="file"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-ink">Upload your professional photo</p>
                  <p className="text-xs text-muted">Clear background recommended. Max 2MB.</p>
                  {resume.photoUrl && (
                    <button className="text-xs font-bold text-error" onClick={() => updateResume("photoUrl", "")} type="button">
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {resume.photoUrl && (
                <div className="mb-8 rounded-xl bg-surface-soft p-4">
                  <p className="mb-4 font-label text-[10px] font-bold uppercase tracking-widest text-muted text-left">Photo Position & Scale</p>
                  <div className="space-y-4">
                    <PhotoSlider label="X Position" max={100} min={0} onChange={(v) => updateResume("photoX", v)} value={resume.photoX ?? 50} />
                    <PhotoSlider label="Y Position" max={100} min={0} onChange={(v) => updateResume("photoY", v)} value={resume.photoY ?? 50} />
                    <PhotoSlider label="Scale" max={200} min={50} onChange={(v) => updateResume("photoScale", v)} value={resume.photoScale ?? 100} />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 text-left">
                <Field label="First Name" onChange={(v) => updateResume("firstName", v)} value={resume.firstName} />
                <Field label="Last Name" onChange={(v) => updateResume("lastName", v)} value={resume.lastName} />
                <Field label="Professional Title" onChange={(v) => updateResume("title", v)} value={resume.title} />
                <Field label="Email Address" onChange={(v) => updateResume("email", v)} value={resume.email} />
                <Field label="Phone Number" onChange={(v) => updateResume("phone", v)} value={resume.phone} />
                <Field label="Location" onChange={(v) => updateResume("location", v)} value={resume.location} />
                <Field label="Portfolio / Website" onChange={(v) => updateResume("website", v)} value={resume.website} />
              </div>
            </FormSection>

            <FormSection icon="sparkle" title="Executive Summary">
              <textarea
                className="field min-h-32 resize-none"
                onChange={(e) => updateResume("summary", e.target.value)}
                placeholder="Briefly describe your high-level impact and expertise..."
                value={resume.summary}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted">A compelling summary captures recruiter attention in seconds.</p>
                <button
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary disabled:opacity-60"
                  disabled={ai.summary || !resume.summary.trim()}
                  onClick={improveSummary}
                  type="button"
                >
                  <Icon name="sparkle" />
                  {ai.summary ? "Refining..." : "Refine with AI"}
                </button>
              </div>
            </FormSection>

            <FormSection icon="work" title="Professional History">
              <div className="space-y-6">
                {resume.experiences.map((exp) => (
                  <ExperienceEditor
                    experience={exp}
                    isImproving={(idx) => ai.bullets[`${exp.id}-${idx}`]}
                    key={exp.id}
                    onAddBullet={() => addBullet(exp.id)}
                    onDelete={() => deleteExperience(exp.id)}
                    onDeleteBullet={(idx) => deleteBullet(exp.id, idx)}
                    onImproveBullet={(idx, text) => void improveBullet(exp.id, idx, text)}
                    onUpdate={(patch) => updateExperience(exp.id, patch)}
                    onUpdateBullet={(idx, val) => updateBullet(exp.id, idx, val)}
                  />
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline/70 bg-surface-soft py-4 text-sm font-bold text-ink transition hover:bg-outline/10" onClick={addExperience} type="button">
                  <Icon name="add" />
                  Add Experience
                </button>
              </div>
            </FormSection>

            <FormSection icon="education" title="Academic Background">
              <div className="space-y-6">
                {resume.education.map((edu) => (
                  <EducationEditor education={edu} key={edu.id} onDelete={() => deleteEducation(edu.id)} onUpdate={(patch) => updateEducation(edu.id, patch)} />
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline/70 bg-surface-soft py-4 text-sm font-bold text-ink transition hover:bg-outline/10" onClick={addEducation} type="button">
                  <Icon name="add" />
                  Add Education
                </button>
              </div>
            </FormSection>

            <FormSection icon="bolt" title="Skills & Competencies">
              <div className="flex gap-2 text-left">
                <input
                  className="field"
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addSkill()}
                  placeholder="e.g. Project Management, React, SQL..."
                  value={skillDraft}
                />
                <button className="rounded-xl bg-ink px-6 py-2 text-sm font-bold text-white" onClick={addSkill} type="button">
                  Add
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-left">
                {resume.skills.map((skill) => (
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary transition hover:bg-primary/20" key={skill} onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection 
              icon="language" 
              title="Languages"
              className={showLanguageMenu ? "z-40" : "z-10"}
            >
              <div className="relative text-left">
                <div className="flex gap-2">
                  <input
                    className="field"
                    onChange={(event) => {
                      setLanguageDraft(event.target.value);
                      setShowLanguageMenu(true);
                    }}
                    onFocus={() => setShowLanguageMenu(true)}
                    placeholder="Search languages..."
                    value={languageDraft}
                  />
                  {languageDraft && (
                    <button 
                      className="rounded-xl bg-ink px-6 py-2 text-sm font-bold text-white" 
                      onClick={() => addLanguage(languageDraft)}
                      type="button"
                    >
                      Add
                    </button>
                  )}
                </div>

                {showLanguageMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-60 overflow-y-auto rounded-xl border border-outline/30 bg-white p-2 shadow-panel">
                      {ALL_LANGUAGES.filter(l => 
                        l.toLowerCase().includes(languageDraft.toLowerCase()) && 
                        !resume.languages.includes(l)
                      ).slice(0, 50).map((lang) => (
                        <button
                          key={lang}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-primary/10 hover:text-primary transition"
                          onClick={() => addLanguage(lang)}
                          type="button"
                        >
                          {lang}
                        </button>
                      ))}
                      {ALL_LANGUAGES.filter(l => 
                        l.toLowerCase().includes(languageDraft.toLowerCase()) && 
                        !resume.languages.includes(l)
                      ).length === 0 && (
                        <p className="px-3 py-2 text-xs text-muted italic text-left">No matching languages found. Press 'Add' to use custom text.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 text-left">
                {resume.languages.map((lang) => (
                  <button 
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary transition hover:bg-primary/20" 
                    key={lang} 
                    onClick={() => removeLanguage(lang)}
                    type="button"
                  >
                    {lang} ×
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection icon="upload" title="Reference Materials">
              <p className="text-sm leading-6 text-muted text-left">
                Securely attach supporting documents. You can use AI to extract data from text or JSON files to auto-populate your resume.
              </p>
              <label
                className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-outline/70 bg-surface-soft px-5 py-6 text-center"
                onDragOver={(event: DragEvent<HTMLLabelElement>) => event.preventDefault()}
                onDrop={(event: DragEvent<HTMLLabelElement>) => {
                  event.preventDefault();
                  void handleReferenceUpload(event.dataTransfer.files);
                }}
              >
                <Icon className="text-primary" name="upload" />
                <span className="mt-3 text-sm font-bold text-ink">Upload supporting documentation</span>
                <span className="mt-1 text-xs text-muted">PDF, TXT, or JSON formats</span>
                <input
                  accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md,.json,image/*,application/pdf,text/plain,application/json"
                  className="hidden"
                  multiple
                  onChange={(event) => {
                    void handleReferenceUpload(event.currentTarget.files);
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
              <div className="mt-4 grid gap-3">
                {resume.references.length > 0 &&
                  resume.references.map((reference) => (
                    <ReferenceCard
                      key={reference.id}
                      onDelete={() => removeReference(reference.id)}
                      onExtract={() => void extractFromReference(reference)}
                      extracting={helper.extractingId === reference.id}
                      reference={reference}
                    />
                  ))
                }
              </div>
            </FormSection>
          </div>
        </section>

        <section className="hidden h-full flex-1 flex-col bg-surface-soft p-6 md:flex lg:p-8">
          <div className="glass-panel z-10 mx-auto mb-6 flex w-full max-w-4xl items-center justify-between rounded-2xl px-5 py-3 shadow-ambient">
            <Link className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary" href="/templates">
              <Icon name="palette" />
              {template.name}
            </Link>
            <div className="flex gap-3">
              <button className="rounded-xl border border-outline/50 bg-white px-4 py-2 text-sm font-bold text-ink" onClick={shareResume} type="button">
                Share
              </button>
              {isClient ? (
                <div onClick={(e) => {
                  // TODO: Connect to real Pro status from backend
                  const isPro = false;
                  if (!isPro) {
                    e.preventDefault();
                    alert("PDF Export is a Pro feature. Please upgrade to download your resume.");
                    router.push("/#pricing");
                  }
                }}>
                  <PDFDownloadLink
                    document={<ResumePDF data={resume} template={template} />}
                    fileName={`${resume.firstName || "Resume"}_${resume.lastName || ""}.pdf`}
                    style={{ pointerEvents: "auto" }}
                  >
                    {({ loading }) => (
                      <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={loading} type="button">
                        {loading ? "Preparing..." : "Export PDF"}
                      </button>
                    )}
                  </PDFDownloadLink>
                </div>
              ) : (                <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white opacity-50" disabled type="button">
                  Export PDF
                </button>
              )}
            </div>
          </div>
          {shareMessage && <p className="mx-auto mb-4 w-full max-w-4xl rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{shareMessage}</p>}
          <div className="flex-1 overflow-y-auto">
            <ResumeDocument resume={resume} template={template} />
          </div>
        </section>

        <Link className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-panel md:hidden" href="/templates">
          <Icon name="visibility" />
        </Link>
      </div>
    </AppShell>
  );
}

function PhotoSlider({ label, max, min, onChange, value }: { label: string; max: number; min: number; onChange: (v: number) => void; value: number }) {
  return (
    <div className="text-left">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-xs font-bold text-ink">{value}</span>
      </div>
      <input className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-outline/40 accent-primary" max={max} min={min} onChange={(e) => onChange(Number(e.target.value))} type="range" value={value} />
    </div>
  );
}

function Field({ label, onChange, placeholder, value }: { label: string; onChange: (v: string) => void; placeholder?: string; value: string }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      <input className="field" onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type="text" value={value} />
    </label>
  );
}

function FormSection({ children, className = "", icon, title }: { children: ReactNode; className?: string; icon: IconName; title: string }) {
  return (
    <section className={`soft-card relative rounded-2xl p-6 ${className}`}>
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function ExperienceEditor({
  experience,
  isImproving,
  onAddBullet,
  onDelete,
  onDeleteBullet,
  onImproveBullet,
  onUpdate,
  onUpdateBullet
}: {
  experience: ExperienceItem;
  isImproving: (index: number) => boolean;
  onAddBullet: () => void;
  onDelete: () => void;
  onDeleteBullet: (index: number) => void;
  onImproveBullet: (index: number, text: string) => void;
  onUpdate: (patch: Partial<ExperienceItem>) => void;
  onUpdateBullet: (index: number, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-outline/40 bg-white p-4 text-left">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-ink">Experience Item</h3>
        <button className="flex items-center gap-1 text-sm font-bold text-error" onClick={onDelete} type="button">
          <Icon className="h-4 w-4" name="delete" />
          Delete
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Role Title" onChange={(value) => onUpdate({ role: value })} value={experience.role} />
        <Field label="Company" onChange={(value) => onUpdate({ company: value })} value={experience.company} />
        <Field label="Location" onChange={(value) => onUpdate({ location: value })} value={experience.location} />
        <Field label="Start Date" onChange={(value) => onUpdate({ startDate: value })} value={experience.startDate} />
        <Field label="End Date" onChange={(value) => onUpdate({ endDate: value })} value={experience.endDate} />
        <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-muted">
          <input checked={experience.current} onChange={(event) => onUpdate({ current: event.target.checked, endDate: event.target.checked ? "" : experience.endDate })} type="checkbox" />
          Current role
        </label>
      </div>
      <div className="mt-4 space-y-3">
        <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-muted">Bullet Points</p>
        {experience.bullets.map((bullet, index) => (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]" key={`${experience.id}-${index}`}>
            <input className="field" onChange={(event) => onUpdateBullet(index, event.target.value)} placeholder="Led, built, improved, reduced..." value={bullet} />
            <button
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary disabled:opacity-60"
              disabled={isImproving(index) || !bullet.trim()}
              onClick={() => onImproveBullet(index, bullet)}
              type="button"
            >
              <Icon className="h-4 w-4" name="sparkle" />
              {isImproving(index) ? "Polishing…" : "Polish"}
            </button>
            <button className="rounded-xl border border-outline/70 bg-white px-3 py-2 text-sm font-bold text-ink" onClick={() => onDeleteBullet(index)} type="button">
              Delete
            </button>
          </div>
        ))}
        <button className="rounded-xl border border-outline/70 bg-surface-soft px-3 py-2 text-sm font-bold text-ink" onClick={onAddBullet} type="button">
          Add Bullet
        </button>
      </div>
    </div>
  );
}

function EducationEditor({ education, onDelete, onUpdate }: { education: EducationItem; onDelete: () => void; onUpdate: (patch: Partial<EducationItem>) => void }) {
  return (
    <div className="rounded-xl border border-outline/40 bg-white p-4 text-left">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-ink">Education Item</h3>
        <button className="flex items-center gap-1 text-sm font-bold text-error" onClick={onDelete} type="button">
          <Icon className="h-4 w-4" name="delete" />
          Delete
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="School" onChange={(value) => onUpdate({ school: value })} value={education.school} />
        <Field label="Degree" onChange={(value) => onUpdate({ degree: value })} value={education.degree} />
        <Field label="Location" onChange={(value) => onUpdate({ location: value })} value={education.location} />
        <Field label="Start Date" onChange={(value) => onUpdate({ startDate: value })} value={education.startDate} />
        <Field label="End Date" onChange={(value) => onUpdate({ endDate: value })} value={education.endDate} />
      </div>
    </div>
  );
}

function ResumeDocument({ resume, template }: { resume: ResumeData; template: SelectedTemplate }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-4 flex justify-center">
      <div 
        className="origin-top shadow-2xl transition-transform duration-300" 
        style={{ 
          width: "800px", 
          minHeight: "1132px",
          transform: "scale(var(--preview-scale, 1))",
          backgroundColor: "#fff"
        }}
      >
        <TemplateRenderer resume={resume} templateName={template.name} settings={template} />
      </div>
      <style jsx>{`
        div {
          --preview-scale: 0.45;
        }
        @media (min-width: 640px) { div { --preview-scale: 0.6; } }
        @media (min-width: 768px) { div { --preview-scale: 0.8; } }
        @media (min-width: 1024px) { div { --preview-scale: 0.9; } }
        @media (min-width: 1280px) { div { --preview-scale: 1.0; } }
      `}</style>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="rounded-xl bg-surface-soft px-4 py-3 text-sm text-muted">{text}</p>;
}

function AiHelperPanel({
  helper,
  isAnalyzing,
  isGeneratingCover,
  isSuggestingSkills,
  onAnalyze,
  onGenerateCover,
  onSuggestSkills,
  onAddSuggestedSkills
}: {
  helper: HelperState;
  isAnalyzing: boolean;
  isGeneratingCover: boolean;
  isSuggestingSkills: boolean;
  onAnalyze: () => void;
  onGenerateCover: () => void;
  onSuggestSkills: () => void;
  onAddSuggestedSkills: () => void;
}) {
  return (
    <section className="soft-card rounded-2xl p-5 text-left">
      <header className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <Icon className="text-primary" name="analytics" />
            AI Helper
          </h2>
          <span className="rounded-full bg-success/10 px-3 py-1 font-label text-xs font-bold text-success">
            ✦ Free — no API key needed
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted">
          Three quick actions you can run on your draft. Each one reads the whole resume for context.
        </p>
      </header>
      <div className="grid gap-2 md:grid-cols-3">
        <HelperAction
          caption="Score, strengths, and gaps"
          icon="analytics"
          label="Analyze CV"
          loading={isAnalyzing}
          loadingLabel="Analyzing…"
          disabled={helper.action !== null}
          onClick={onAnalyze}
          variant="primary"
        />
        <HelperAction
          caption="Skills tailored to your role"
          icon="sparkle"
          label="Suggest Skills"
          loading={isSuggestingSkills}
          loadingLabel="Suggesting…"
          disabled={helper.action !== null}
          onClick={onSuggestSkills}
          variant="ghost"
        />
        <HelperAction
          caption="Drafted from your experience"
          icon="document"
          label="Cover Letter"
          loading={isGeneratingCover}
          loadingLabel="Drafting…"
          disabled={helper.action !== null}
          onClick={onGenerateCover}
          variant="ghost"
        />
      </div>

      {helper.error && (
        <p className="mt-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
          {helper.error}
        </p>
      )}

      {helper.analysis && (
        <div className="mt-4 rounded-2xl border border-outline/40 bg-surface-soft p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted text-left">CV score</p>
              <p className="mt-1 text-3xl font-extrabold text-ink">{helper.analysis.score}</p>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">{helper.analysis.summary}</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <HelperList title="Strengths" items={helper.analysis.strengths} />
            <HelperList title="Gaps" items={helper.analysis.gaps} />
            <HelperList title="Recommendations" items={helper.analysis.recommendations} />
          </div>
        </div>
      )}

      {helper.skills.length > 0 && (
        <div className="mt-4 rounded-2xl border border-outline/40 bg-surface-soft p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Suggested skills</p>
              <p className="mt-1 text-sm text-muted">Add these to your resume or pick the ones that fit best.</p>
            </div>
            <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white" onClick={onAddSuggestedSkills} type="button">
              Add all skills
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {helper.skills.map((skill) => (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {helper.resultText && (
        <div className="mt-4 rounded-2xl border border-outline/40 bg-surface-soft p-4">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Generated text</p>
          <textarea className="field min-h-40 resize-none bg-white mt-3" readOnly value={helper.resultText} />
        </div>
      )}
    </section>
  );
}

function HelperList({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
        {items.map((item) => (
          <li className="rounded-xl bg-white px-3 py-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HelperAction({
  caption,
  disabled,
  icon,
  label,
  loading,
  loadingLabel,
  onClick,
  variant
}: {
  caption: string;
  disabled: boolean;
  icon: IconName;
  label: string;
  loading: boolean;
  loadingLabel: string;
  onClick: () => void;
  variant: "primary" | "ghost";
}) {
  const base = "flex h-full flex-col items-start gap-1.5 rounded-xl px-4 py-3 text-left transition disabled:opacity-60";
  const styles = variant === "primary" ? `${base} bg-primary/10 hover:bg-primary/15` : `${base} border border-outline/70 bg-white hover:bg-surface-soft`;
  const labelColor = variant === "primary" ? "text-primary" : "text-ink";
  return (
    <button className={styles} disabled={disabled} onClick={onClick} type="button">
      <span className={`flex items-center gap-2 text-sm font-bold ${labelColor}`}>
        <Icon className="h-4 w-4" name={icon} />
        {loading ? loadingLabel : label}
      </span>
      <span className="text-[11px] leading-snug text-muted">{caption}</span>
    </button>
  );
}

function getReferenceKind(file: File): ResumeReference["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (file.type === "application/json" || file.name.toLowerCase().endsWith(".json")) return "json";
  if (file.type.startsWith("text/") || file.name.toLowerCase().match(/\.(txt|md)$/)) return "text";
  return "other";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function parseImportedResume(text: string): Partial<ResumeData> | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    const candidate = extractResumeObject(parsed);
    return candidate;
  } catch {
    return null;
  }
}

function extractResumeObject(value: unknown): Partial<ResumeData> | null {
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
    resume.skills = source.skills.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean);
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
      bullets: Array.isArray(item.bullets) ? item.bullets.filter((b): b is string => typeof b === "string") : [""]
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

function mergeImportedResume(current: ResumeData, imported: Partial<ResumeData> | null) {
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
    experiences: imported.experiences && imported.experiences.length > 0 ? imported.experiences : current.experiences,
    education: imported.education && imported.education.length > 0 ? imported.education : current.education
  };
}


function ReferenceCard({
  reference,
  onDelete,
  onExtract,
  extracting
}: {
  reference: ResumeReference;
  onDelete: () => void;
  onExtract?: () => void;
  extracting?: boolean;
}) {
  const label = getReferenceLabel(reference.kind);
  const canExtract = (reference.kind === "text" || reference.kind === "json") && Boolean(onExtract);
  return (
    <div className="rounded-xl border border-outline/40 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon className="text-primary" name={reference.kind === "image" ? "photo" : "document"} />
            <h3 className="truncate font-bold text-ink">{reference.name}</h3>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-muted">
            {label} · {formatFileSize(reference.size)}
            {reference.imported ? " · imported" : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {canExtract && (
            <button
              className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary disabled:opacity-60"
              disabled={extracting}
              onClick={onExtract}
              type="button"
            >
              <Icon className="h-4 w-4" name="sparkle" />
              {extracting ? "Extracting…" : "Extract"}
            </button>
          )}
          <button className="rounded-xl border border-outline/70 bg-surface-soft px-3 py-2 text-sm font-bold text-ink" onClick={onDelete} type="button">
            Remove
          </button>
        </div>
      </div>
      {reference.kind === "image" && reference.dataUrl && (
        <img alt={reference.name} className="mt-4 h-40 w-full rounded-xl border border-outline/30 object-contain bg-surface-soft" src={reference.dataUrl} />
      )}
      {(reference.kind === "text" || reference.kind === "json") && reference.text && (
        <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-surface-soft p-4 text-xs leading-6 text-muted whitespace-pre-wrap">
          {reference.text.slice(0, 900)}
        </pre>
      )}
    </div>
  );
}

function getReferenceLabel(kind: ResumeReference["kind"]) {
  const labels: Record<ResumeReference["kind"], string> = {
    image: "Image reference",
    pdf: "PDF resume",
    text: "Text note",
    json: "Resume import",
    other: "File reference"
  };
  return labels[kind];
}
