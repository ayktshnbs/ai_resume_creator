"use client";

import type { DragEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";
import {
  clearResumeData,
  createId,
  loadResumeData,
  loadSelectedTemplate,
  saveResumeData
} from "@/lib/resume-storage";
import { useAutoSaveToDb, loadFromDb } from "@/lib/use-db-sync";
import {
  emptyResumeData,
  type EducationItem,
  type ExperienceItem,
  type ResumeData,
  type ResumeReference,
  type SelectedTemplate
} from "@/types/resume";
import { exportToPdf } from "@/lib/export-utils";
import {
  extractPdfText,
  extractResumeObject,
  formatFileSize,
  getErrorMessage,
  getReferenceKind,
  getReferenceLabel,
  mergeImportedResume,
  parseImportedResume,
  readFileAsDataUrl
} from "@/lib/resume-import";
import { getCVTemplateById, cvTemplateToSelectedTemplate } from "@/templates/cvTemplates";

import { StepRail, StepTabs, type StepDef, type StepStatus } from "@/components/resume-builder/step-rail";
import { PreviewPane } from "@/components/resume-builder/preview-pane";
import { SectionShell } from "@/components/resume-builder/section-shell";
import { useUsageQuota, type ConsumeFailureReason } from "@/lib/use-usage-quota";
import { PaywallModal } from "@/components/paywall-modal";
import { UsageChip } from "@/components/usage-chip";
import { useToast } from "@/components/toast";

/* ────────────────────────────────────────────────────────────── */
/*  Types                                                          */
/* ────────────────────────────────────────────────────────────── */

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
  | "analyze_resume";

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
};

type StepId =
  | "import"
  | "profile"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "review";

const initialAiState: AiState = { full: false, summary: false, bullets: {}, error: "" };
const initialHelperState: HelperState = {
  action: null,
  error: "",
  resultText: "",
  skills: [],
  analysis: null
};

/* ────────────────────────────────────────────────────────────── */
/*  Page                                                           */
/* ────────────────────────────────────────────────────────────── */

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const { isPro } = useProStatus();
  const { t } = useI18n();
  const { toast, confirm } = useToast();

  const [resume, setResume] = useState<ResumeData>(emptyResumeData);
  const [template, setTemplate] = useState<SelectedTemplate>({
    name: "Modern Minimalist",
    layout: "single",
    accent: "primary"
  });
  const [skillDraft, setSkillDraft] = useState("");
  const [langDraft, setLangDraft] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [referenceMessage, setReferenceMessage] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [applyingRefId, setApplyingRefId] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState<{ refId: string; text: string; ok: boolean } | null>(null);
  const [linkedInModal, setLinkedInModal] = useState(false);
  const [linkedInText, setLinkedInText] = useState("");
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [ai, setAi] = useState<AiState>(initialAiState);
  const [helper, setHelper] = useState<HelperState>(initialHelperState);
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>("import");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveState, setSaveState] = useState<"saving" | "saved" | "offline">("saved");
  const resumeDocId = useRef<string | null>(null);
  const savedSnapshotRef = useRef<string>("");
  const { quota, consume, refund } = useUsageQuota();
  const [paywall, setPaywall] = useState<{ open: boolean; reason: ConsumeFailureReason }>({
    open: false,
    reason: "limit_reached"
  });

  const uid = session?.user?.id;

  /* ── Load on mount ───────────────────────────────────────── */
  useEffect(() => {
    const local = loadResumeData(uid);
    setResume(local);
    setTemplate(loadSelectedTemplate());
    setLoaded(true);
    savedSnapshotRef.current = JSON.stringify(local);
  }, [uid]);

  useEffect(() => {
    if (!session?.user || !loaded) return;
    loadFromDb<ResumeData>("/api/user/resumes").then((result) => {
      if (result) {
        resumeDocId.current = result.id;
        setResume((local) => ({ ...emptyResumeData, ...result.data, references: local.references }));
      }
    });
  }, [session, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveResumeData(resume, uid);
    const snapshot = JSON.stringify(resume);
    if (snapshot !== savedSnapshotRef.current) {
      setSaveState("saving");
      const timer = setTimeout(() => {
        savedSnapshotRef.current = snapshot;
        setSaveState(session?.user ? "saved" : "offline");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loaded, resume, uid, session]);

  useAutoSaveToDb("/api/user/resumes", resume, loaded, resumeDocId);

  /* ── Loading gate ─────────────────────────────────────────── */
  if (status === "loading") {
    return (
      <AppShell active="resume" fullHeight>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  /* ── Mutators ─────────────────────────────────────────────── */
  function updateResume<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setResume((current) => ({ ...current, [key]: value }));
  }

  function addExperience() {
    const item: ExperienceItem = {
      id: createId("exp"),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""]
    };
    setResume((current) => ({ ...current, experiences: [...current.experiences, item] }));
  }

  function updateExperience(id: string, patch: Partial<ExperienceItem>) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  }

  function deleteExperience(id: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.filter((item) => item.id !== id)
    }));
  }

  function addBullet(experienceId: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((item) =>
        item.id === experienceId ? { ...item, bullets: [...item.bullets, ""] } : item
      )
    }));
  }

  function updateBullet(experienceId: string, bulletIndex: number, value: string) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((item) =>
        item.id === experienceId
          ? { ...item, bullets: item.bullets.map((b, i) => (i === bulletIndex ? value : b)) }
          : item
      )
    }));
  }

  function deleteBullet(experienceId: string, bulletIndex: number) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((item) =>
        item.id === experienceId
          ? { ...item, bullets: item.bullets.filter((_, i) => i !== bulletIndex) }
          : item
      )
    }));
  }

  function addEducation() {
    const item: EducationItem = {
      id: createId("edu"),
      school: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: ""
    };
    setResume((current) => ({ ...current, education: [...current.education, item] }));
  }

  function updateEducation(id: string, patch: Partial<EducationItem>) {
    setResume((current) => ({
      ...current,
      education: current.education.map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  }

  function deleteEducation(id: string) {
    setResume((current) => ({
      ...current,
      education: current.education.filter((item) => item.id !== id)
    }));
  }

  function addSkill() {
    const skill = skillDraft.trim();
    if (!skill || resume.skills.includes(skill)) return;
    setResume((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setResume((current) => ({ ...current, skills: current.skills.filter((s) => s !== skill) }));
  }

  function addLanguage() {
    const lang = langDraft.trim();
    if (!lang || resume.languages.includes(lang)) return;
    setResume((current) => ({ ...current, languages: [...current.languages, lang] }));
    setLangDraft("");
  }

  function removeLanguage(lang: string) {
    setResume((current) => ({ ...current, languages: current.languages.filter((l) => l !== lang) }));
  }

  function removeReference(id: string) {
    setResume((current) => ({
      ...current,
      references: current.references.filter((r) => r.id !== id)
    }));
  }

  async function applyReference(ref: ResumeReference) {
    setApplyingRefId(ref.id);
    setApplyMessage(null);
    let text = ref.text || "";

    if (text.trim().length < 20 && ref.kind === "pdf" && ref.dataUrl) {
      try {
        const blob = await fetch(ref.dataUrl).then((r) => r.blob());
        const file = new File([blob], ref.name, { type: "application/pdf" });
        text = await extractPdfText(file);
        if (text.trim().length > 0) {
          setResume((current) => ({
            ...current,
            references: current.references.map((r) => (r.id === ref.id ? { ...r, text } : r))
          }));
        }
      } catch {
        /* keep going with what we have */
      }
    }

    if (text.trim().length < 20) {
      setApplyMessage({
        refId: ref.id,
        text: "No text could be extracted. Try re-uploading the file.",
        ok: false
      });
      setApplyingRefId(null);
      return;
    }

    try {
      const response = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extract_from_reference", text })
      });
      if (!response.ok) {
        setApplyMessage({ refId: ref.id, text: `API error (${response.status}).`, ok: false });
        setApplyingRefId(null);
        return;
      }
      const data = (await response.json()) as Record<string, unknown>;
      const resumePayload = (data.resumeData ?? data) as Partial<ResumeData> | undefined;
      const extracted = resumePayload ? extractResumeObject(resumePayload) : null;

      if (extracted) {
        setResume((current) => mergeImportedResume(current, extracted));
        setApplyMessage({ refId: ref.id, text: "Data extracted and applied to resume.", ok: true });
      } else if (data.error) {
        setApplyMessage({
          refId: ref.id,
          text: `Error: ${String(data.error).slice(0, 100)}`,
          ok: false
        });
      } else {
        setApplyMessage({ refId: ref.id, text: "No resume data could be extracted.", ok: false });
      }
    } catch {
      setApplyMessage({ refId: ref.id, text: "Extraction failed. Try again.", ok: false });
    } finally {
      setApplyingRefId(null);
    }
  }

  async function clearResume() {
    const ok = await confirm({
      title: "Clear this resume?",
      message: "This wipes every section and removes the local autosave. This can't be undone.",
      confirmLabel: "Clear resume",
      cancelLabel: "Keep editing",
      destructive: true
    });
    if (!ok) return;
    clearResumeData();
    setResume(emptyResumeData);
    setSkillDraft("");
    setLangDraft("");
    setReferenceMessage("");
    setHelper(initialHelperState);
    toast("Resume cleared.", "success");
  }

  async function handleLinkedInImport() {
    if (!linkedInText.trim()) return;
    setLinkedInLoading(true);
    try {
      const res = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extract_from_reference", text: linkedInText })
      });
      const data = (await res.json()) as { resumeData?: Partial<ResumeData> };
      if (data.resumeData) {
        setResume((current) => mergeImportedResume(current, data.resumeData ?? null));
        setReferenceMessage("LinkedIn profile data was imported successfully.");
      } else {
        setReferenceMessage("Could not extract data. Try copying more of your profile.");
      }
    } catch {
      setReferenceMessage("LinkedIn import failed. Please try again.");
    } finally {
      setLinkedInLoading(false);
      setLinkedInModal(false);
      setLinkedInText("");
    }
  }

  async function shareResume() {
    const url = `${window.location.origin}/resume`;
    try {
      await window.navigator.clipboard.writeText(url);
      setShareMessage("Temporary preview URL copied to clipboard.");
      setTimeout(() => setShareMessage(""), 4000);
    } catch {
      setShareMessage("Couldn't copy automatically — your browser blocked clipboard access.");
      setTimeout(() => setShareMessage(""), 5000);
    }
  }

  async function exportCV(templateId?: number) {
    // 1. Gate on the server FIRST. If denied, surface the right paywall and
    //    never touch the PDF pipeline. If allowed, we hold the token in case
    //    the local render fails and we need to refund.
    const debit = await consume("resume", { templateId: templateId ?? template.templateId });
    if (!debit.ok) {
      const reason = "reason" in debit ? debit.reason : "limit_reached";
      if (reason === "network_error") {
        setAi((prev) => ({ ...prev, error: "Couldn't verify your export quota. Check your connection." }));
        return;
      }
      setPaywall({ open: true, reason });
      return;
    }
    const token = debit.token;

    const registryTemplate = getCVTemplateById(templateId);
    const exportTemplate = registryTemplate ? cvTemplateToSelectedTemplate(registryTemplate) : template;
    if (registryTemplate && template.templateId !== registryTemplate.id) {
      setTemplate(exportTemplate);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
    }
    const el = document.getElementById("resume-export");
    if (!el) {
      await refund(token);
      return;
    }
    setExporting(true);
    try {
      const name = `${resume.firstName || "Resume"}_${resume.lastName || ""}`.trim().replace(/\s+/g, "_");
      await exportToPdf(el, name);
    } catch {
      // Local render failed — refund the debit so the user isn't penalized.
      await refund(token);
      setAi((prev) => ({
        ...prev,
        error: "PDF export failed. Try using your browser's Print function instead."
      }));
    } finally {
      setExporting(false);
    }
  }

  function exportPdf() {
    void exportCV(template.templateId);
  }

  async function handleReferenceUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const importedReferences: ResumeReference[] = [];
    let importedResume: Partial<ResumeData> | null = null;
    const textsToExtract: string[] = [];
    setReferenceMessage("");

    for (const file of Array.from(files)) {
      const kind = getReferenceKind(file);
      const addedAt = new Date().toISOString();

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
        } else if (text.trim().length > 20) {
          textsToExtract.push(text);
        }
        importedReferences.push(reference);
        continue;
      }

      if (kind === "pdf") {
        const text = await extractPdfText(file);
        const dataUrl = await readFileAsDataUrl(file);
        if (text && text.trim().length > 20) textsToExtract.push(text);
        importedReferences.push({
          id: createId("ref"),
          name: file.name,
          kind,
          mimeType: file.type || "application/pdf",
          size: file.size,
          addedAt,
          dataUrl,
          text
        });
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
    }

    if (importedReferences.length > 0) {
      setResume((current) => ({
        ...mergeImportedResume(current, importedResume),
        references: [...current.references, ...importedReferences]
      }));
    }

    if (textsToExtract.length > 0 && !importedResume) {
      setExtracting(true);
      setReferenceMessage("Extracting resume data from uploaded files...");
      try {
        const combined = textsToExtract.join("\n\n---\n\n");
        const response = await fetch("/api/ai/resume-helper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "extract_from_reference", text: combined })
        });
        const data = (await response.json()) as { resumeData?: Partial<ResumeData> };
        if (data.resumeData) {
          const extracted = extractResumeObject(data.resumeData);
          if (extracted) {
            setResume((current) => mergeImportedResume(current, extracted));
            setReferenceMessage("Resume data extracted and applied. Continue to the next step.");
          } else {
            setReferenceMessage("Files attached but no structured data could be extracted.");
          }
        } else {
          setReferenceMessage("Files attached but no resume data could be extracted.");
        }
      } catch {
        setReferenceMessage("Files attached. AI extraction failed — fill in the form manually.");
      } finally {
        setExtracting(false);
      }
    } else if (importedResume) {
      setReferenceMessage("Files attached and resume data was used to populate the form.");
    } else {
      setReferenceMessage("Files attached to this draft.");
    }
  }

  async function runHelperAction(action: ResumeHelperAction, text = "") {
    setHelper((current) => ({
      ...current,
      action,
      error: "",
      resultText: "",
      skills: [],
      analysis: null
    }));
    try {
      const response = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resumeData: resume,
          text,
          targetRole: resume.title
        })
      });
      const data = (await response.json()) as {
        analysis?: ResumeAnalysis;
        error?: string;
        resultText?: string;
        skills?: string[];
      };
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      setHelper((current) => ({
        ...current,
        action: null,
        error: "",
        resultText: data.resultText || "",
        skills: data.skills || [],
        analysis: data.analysis || null
      }));
      return data;
    } catch (error) {
      setHelper((current) => ({ ...current, action: null, error: getErrorMessage(error) }));
      return null;
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
      if (data?.resultText) updateResume("summary", data.resultText);
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
      if (data?.resultText) updateBullet(experienceId, bulletIndex, data.resultText);
    } finally {
      setAi((current) => {
        const next = { ...current.bullets };
        delete next[key];
        return { ...current, bullets: next };
      });
    }
  }

  function addSuggestedSkills() {
    if (helper.skills.length === 0) return;
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
        body: JSON.stringify({
          type: "full_resume",
          resumeData: resume,
          text: "",
          targetRole: resume.title
        })
      });
      const data = (await response.json()) as {
        resumeData?: ResumeData;
        improvedText?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      if (data.resumeData) setResume(data.resumeData);
      else if (data.improvedText) updateResume("summary", data.improvedText);
    } catch (error) {
      setAi((current) => ({ ...current, error: getErrorMessage(error) }));
    } finally {
      setAi((current) => ({ ...current, full: false }));
    }
  }

  /* ── Step plumbing ────────────────────────────────────────── */
  const steps: StepDef[] = [
    { id: "import", label: t("step.import"), icon: "upload" },
    { id: "profile", label: t("step.profile"), icon: "person" },
    { id: "summary", label: t("step.summary"), icon: "subject" },
    { id: "experience", label: t("step.experience"), icon: "work" },
    { id: "education", label: t("step.education"), icon: "education" },
    { id: "skills", label: t("step.skills"), icon: "sparkle" },
    { id: "languages", label: t("step.languages"), icon: "language" },
    { id: "review", label: t("step.review"), icon: "check" }
  ];

  const statuses: Record<string, StepStatus> = {
    import: resume.references.length > 0 ? "complete" : "empty",
    profile: profileStatus(resume),
    summary: resume.summary.trim().length === 0 ? "empty" : resume.summary.trim().length < 80 ? "partial" : "complete",
    experience: experienceStatus(resume),
    education: educationStatus(resume),
    skills: resume.skills.length === 0 ? "empty" : resume.skills.length < 5 ? "partial" : "complete",
    languages: resume.languages.length === 0 ? "empty" : "complete",
    review: "empty"
  };

  const stepIndex = steps.findIndex((s) => s.id === activeStep);
  const goPrev = () => {
    if (stepIndex > 0) setActiveStep(steps[stepIndex - 1].id as StepId);
  };
  const goNext = () => {
    if (stepIndex < steps.length - 1) setActiveStep(steps[stepIndex + 1].id as StepId);
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <AppShell active="resume" fullHeight>
      <div className="flex h-full flex-col bg-background lg:flex-row">
        {/* Step rail — desktop */}
        <div className="hidden w-64 shrink-0 border-r border-outline/30 bg-surface/70 backdrop-blur lg:flex lg:flex-col">
          <StepRail
            steps={steps}
            activeId={activeStep}
            statuses={statuses}
            onSelect={(id) => setActiveStep(id as StepId)}
          />
          <div className="border-t border-outline/30 px-5 py-4">
            <button
              type="button"
              onClick={clearResume}
              className="text-xs font-bold text-muted transition hover:text-error"
            >
              Clear all & start over
            </button>
          </div>
        </div>

        {/* Editor middle pane */}
        <div className="relative flex min-w-0 flex-1 flex-col bg-surface lg:max-w-[640px] lg:border-r lg:border-outline/30">
          {/* Mobile step tabs */}
          <div className="border-b border-outline/30 lg:hidden">
            <StepTabs
              steps={steps}
              activeId={activeStep}
              statuses={statuses}
              onSelect={(id) => setActiveStep(id as StepId)}
            />
          </div>

          {ai.error && (
            <div className="mx-4 mt-3 rounded-xl border border-error/20 bg-error/10 px-4 py-2 text-sm font-semibold text-error lg:mx-10">
              {ai.error}
              <button
                type="button"
                onClick={() => setAi((p) => ({ ...p, error: "" }))}
                className="ml-2 underline"
              >
                Dismiss
              </button>
            </div>
          )}
          {shareMessage && (
            <div className="mx-4 mt-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary lg:mx-10">
              {shareMessage}
            </div>
          )}

          {/* Each step renders its own SectionShell */}
          {activeStep === "import" && (
            <ImportStep
              step={stepIndex + 1}
              total={steps.length}
              t={t}
              referenceMessage={referenceMessage}
              extracting={extracting}
              references={resume.references}
              applyingRefId={applyingRefId}
              applyMessage={applyMessage}
              onApplyReference={applyReference}
              onRemoveReference={removeReference}
              onOpenLinkedIn={() => setLinkedInModal(true)}
              onUpload={handleReferenceUpload}
              onPrev={undefined}
              onNext={goNext}
            />
          )}

          {activeStep === "profile" && (
            <ProfileStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              t={t}
              onUpdate={updateResume}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "summary" && (
            <SummaryStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              isPro={isPro}
              aiBusy={ai.summary}
              onUpdate={updateResume}
              onImprove={improveSummary}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "experience" && (
            <ExperienceStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              isPro={isPro}
              ai={ai}
              onAdd={addExperience}
              onUpdate={updateExperience}
              onDelete={deleteExperience}
              onAddBullet={addBullet}
              onUpdateBullet={updateBullet}
              onDeleteBullet={deleteBullet}
              onImproveBullet={improveBullet}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "education" && (
            <EducationStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onDelete={deleteEducation}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "skills" && (
            <SkillsStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              isPro={isPro}
              skillDraft={skillDraft}
              setSkillDraft={setSkillDraft}
              addSkill={addSkill}
              removeSkill={removeSkill}
              helper={helper}
              onSuggest={() => void runHelperAction("suggest_skills")}
              onAddSuggested={addSuggestedSkills}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "languages" && (
            <LanguagesStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              langDraft={langDraft}
              setLangDraft={setLangDraft}
              addLanguage={addLanguage}
              removeLanguage={removeLanguage}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
            />
          )}

          {activeStep === "review" && (
            <ReviewStep
              resume={resume}
              step={stepIndex + 1}
              total={steps.length}
              statuses={statuses}
              steps={steps}
              onJumpTo={(id) => setActiveStep(id as StepId)}
              isPro={isPro}
              ai={ai}
              helper={helper}
              onAudit={() => void runHelperAction("analyze_resume")}
              onGenerateCover={() => void runHelperAction("generate_cover_letter")}
              onImproveFull={improveFullResume}
              onExport={exportPdf}
              exporting={exporting}
              t={t}
              onPrev={goPrev}
              onNext={undefined}
            />
          )}
        </div>

        {/* Preview pane — desktop sticky */}
        <div className="hidden min-w-0 flex-1 lg:flex">
          <PreviewPane
            resume={resume}
            template={template}
            onLanguageChange={(lang) => setTemplate((t) => ({ ...t, cvLanguage: lang }))}
            onExport={exportPdf}
            onShare={shareResume}
            exporting={exporting}
            savedState={saveState}
            usageSlot={<UsageChip quota={quota} kind="resume" />}
            exportLocked={Boolean(quota && !quota.isPro && quota.resume.remaining <= 0)}
          />
        </div>

        {/* Mobile preview FAB */}
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full primary-gradient px-5 py-3 text-sm font-bold text-white shadow-panel lg:hidden"
          aria-label={t("builder.viewPreview")}
        >
          <Icon name="visibility" className="text-[18px]" />
          {t("builder.preview")}
        </button>
      </div>

      {/* Mobile preview drawer */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 top-12 flex flex-col rounded-t-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline/30 px-5 py-3">
              <p className="text-sm font-bold text-ink">{t("builder.preview")}</p>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl p-1.5 text-muted hover:bg-surface-soft"
                aria-label="Close preview"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PreviewPane
                resume={resume}
                template={template}
                onLanguageChange={(lang) => setTemplate((t) => ({ ...t, cvLanguage: lang }))}
                onExport={exportPdf}
                onShare={shareResume}
                exporting={exporting}
                savedState={saveState}
                usageSlot={<UsageChip quota={quota} kind="resume" />}
                exportLocked={Boolean(quota && !quota.isPro && quota.resume.remaining <= 0)}
              />
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Modal */}
      {linkedInModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setLinkedInModal(false);
            setLinkedInText("");
          }}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-3xl bg-surface p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Import from LinkedIn</h2>
              <button
                className="rounded-xl p-2 text-muted hover:bg-surface-soft"
                onClick={() => {
                  setLinkedInModal(false);
                  setLinkedInText("");
                }}
                type="button"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary">How to import:</p>
              <ol className="mt-2 space-y-1 text-xs text-muted">
                <li>1. Open your LinkedIn profile in a browser</li>
                <li>2. Select all text on the page (Ctrl+A / Cmd+A)</li>
                <li>3. Copy it (Ctrl+C / Cmd+C)</li>
                <li>4. Paste it below (Ctrl+V / Cmd+V)</li>
              </ol>
            </div>
            <textarea
              className="field min-h-[180px] resize-none text-sm"
              onChange={(e) => setLinkedInText(e.target.value)}
              placeholder="Paste your LinkedIn profile text here..."
              value={linkedInText}
            />
            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 rounded-xl border border-outline/50 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
                onClick={() => {
                  setLinkedInModal(false);
                  setLinkedInText("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#004182] disabled:opacity-50"
                disabled={!linkedInText.trim() || linkedInLoading}
                onClick={() => void handleLinkedInImport()}
                type="button"
              >
                {linkedInLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Importing...
                  </>
                ) : (
                  "Import Data"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <PaywallModal
        open={paywall.open}
        reason={paywall.reason}
        kind="resume"
        returnPath="/resume"
        onClose={() => setPaywall((p) => ({ ...p, open: false }))}
      />
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Step components                                                */
/* ────────────────────────────────────────────────────────────── */

type TFn = (key: any) => string;

function ImportStep({
  step,
  total,
  t,
  referenceMessage,
  extracting,
  references,
  applyingRefId,
  applyMessage,
  onApplyReference,
  onRemoveReference,
  onOpenLinkedIn,
  onUpload,
  onPrev,
  onNext
}: {
  step: number;
  total: number;
  t: TFn;
  referenceMessage: string;
  extracting: boolean;
  references: ResumeReference[];
  applyingRefId: string | null;
  applyMessage: { refId: string; text: string; ok: boolean } | null;
  onApplyReference: (ref: ResumeReference) => void;
  onRemoveReference: (id: string) => void;
  onOpenLinkedIn: () => void;
  onUpload: (files: FileList | null) => void;
  onPrev: (() => void) | undefined;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="upload"
      step={step}
      total={total}
      title={t("step.import.title")}
      description={t("step.import.desc")}
      tip={t("step.import.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.continue")}
    >
      {referenceMessage && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
          {referenceMessage}
        </div>
      )}

      <button
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#0a66c2]/30 bg-[#0a66c2]/5 px-5 py-4 text-sm font-bold text-[#0a66c2] transition hover:bg-[#0a66c2]/10"
        onClick={onOpenLinkedIn}
        type="button"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Paste from LinkedIn
      </button>

      {extracting && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Extracting resume data...
        </div>
      )}

      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-outline/70 bg-surface-soft px-5 py-8 text-center transition hover:border-primary/50 hover:bg-primary/5"
        onDragOver={(event: DragEvent<HTMLLabelElement>) => event.preventDefault()}
        onDrop={(event: DragEvent<HTMLLabelElement>) => {
          event.preventDefault();
          onUpload(event.dataTransfer.files);
        }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="text-[26px]" name="upload" />
        </span>
        <span className="mt-3 text-sm font-bold text-ink">Drag &amp; drop or click to upload</span>
        <span className="mt-1 text-xs text-muted">PDF, TXT, or JSON · multiple files OK</span>
        <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110">
          <Icon name="upload" className="text-[14px]" />
          Choose files
        </span>
        <input
          accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md,.json,image/*,application/pdf,text/plain,application/json"
          className="hidden"
          multiple
          onChange={(event) => {
            onUpload(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
          type="file"
        />
      </label>

      {references.length > 0 && (
        <div className="space-y-3">
          <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Uploaded references
          </p>
          {references.map((reference) => (
            <ReferenceCard
              key={reference.id}
              reference={reference}
              onDelete={() => onRemoveReference(reference.id)}
              onApply={() => onApplyReference(reference)}
              applying={applyingRefId === reference.id}
              message={applyMessage?.refId === reference.id ? applyMessage : null}
            />
          ))}
        </div>
      )}

      <p className="rounded-2xl bg-surface-soft px-4 py-3 text-xs leading-5 text-muted">
        Prefer to start blank? Click <strong className="text-ink">Continue</strong> below and fill the form
        manually — your draft autosaves at every change.
      </p>
    </SectionShell>
  );
}

function ProfileStep({
  resume,
  step,
  total,
  t,
  onUpdate,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  t: TFn;
  onUpdate: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="person"
      step={step}
      total={total}
      title={t("step.profile.title")}
      description={t("step.profile.desc")}
      tip={t("step.profile.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.next")}
    >
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-outline/30 bg-surface-soft p-5 sm:flex-row">
        <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-dashed border-outline/70 bg-surface">
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
              <Icon name="person" className="text-[40px]" />
            </div>
          )}
          <input
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const dataUrl = await readFileAsDataUrl(file);
                  onUpdate("photoUrl", dataUrl);
                  onUpdate("photoX", 50);
                  onUpdate("photoY", 50);
                  onUpdate("photoScale", 100);
                } catch {
                  /* ignore */
                }
              }
            }}
            type="file"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">{t("resume.profilePhoto")}</p>
          <p className="text-xs text-muted">{t("resume.uploadHeadshot")}</p>
          {resume.photoUrl && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <PhotoSlider
                label="Position X"
                max={100}
                min={0}
                onChange={(v) => onUpdate("photoX", v)}
                value={resume.photoX ?? 50}
              />
              <PhotoSlider
                label="Position Y"
                max={100}
                min={0}
                onChange={(v) => onUpdate("photoY", v)}
                value={resume.photoY ?? 50}
              />
              <PhotoSlider
                label="Zoom"
                max={200}
                min={50}
                onChange={(v) => onUpdate("photoScale", v)}
                value={resume.photoScale ?? 100}
              />
              <div className="flex items-end">
                <button
                  className="text-xs font-bold text-error hover:underline"
                  onClick={() => {
                    onUpdate("photoUrl", undefined);
                    onUpdate("photoX", undefined);
                    onUpdate("photoY", undefined);
                    onUpdate("photoScale", undefined);
                  }}
                  type="button"
                >
                  {t("resume.removePhoto")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("resume.firstName")} onChange={(v) => onUpdate("firstName", v)} value={resume.firstName} />
        <Field label={t("resume.lastName")} onChange={(v) => onUpdate("lastName", v)} value={resume.lastName} />
        <Field
          className="md:col-span-2"
          label={t("resume.jobTitle")}
          onChange={(v) => onUpdate("title", v)}
          value={resume.title}
        />
        <Field
          label={t("resume.email")}
          onChange={(v) => onUpdate("email", v)}
          type="email"
          value={resume.email}
        />
        <Field label={t("resume.phone")} onChange={(v) => onUpdate("phone", v)} value={resume.phone} />
        <Field
          label={t("resume.currentLocation")}
          onChange={(v) => onUpdate("location", v)}
          value={resume.location}
        />
        <Field label={t("resume.website")} onChange={(v) => onUpdate("website", v)} value={resume.website} />
      </div>
    </SectionShell>
  );
}

function SummaryStep({
  resume,
  step,
  total,
  isPro,
  aiBusy,
  onUpdate,
  onImprove,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  isPro: boolean;
  aiBusy: boolean;
  onUpdate: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
  onImprove: () => void;
  t: TFn;
  onPrev: () => void;
  onNext: () => void;
}) {
  const charCount = resume.summary.length;
  const target = 320;
  return (
    <SectionShell
      icon="subject"
      step={step}
      total={total}
      title={t("step.summary.title")}
      description={t("step.summary.desc")}
      tip={t("step.summary.tip")}
      aiSlot={
        isPro ? (
          <button
            className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary disabled:opacity-60"
            disabled={aiBusy || !resume.summary.trim()}
            onClick={onImprove}
            type="button"
          >
            <Icon className="text-[14px]" name="sparkle" />
            {aiBusy ? t("resume.refining") : t("resume.aiRefineSummary")}
          </button>
        ) : (
          <PaymentButton
            price="6"
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary"
          >
            <Icon name="sparkle" className="text-[14px]" />
            Refine with AI
          </PaymentButton>
        )
      }
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.next")}
    >
      <textarea
        className="field min-h-[200px] resize-none text-base leading-7"
        onChange={(event) => onUpdate("summary", event.target.value)}
        placeholder="Senior product manager with 7 years of experience shipping high-impact tools used by millions. Led a 12-person team that drove $4M in net new ARR and cut release cycles 60% through architectural modernization."
        value={resume.summary}
      />
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{t("resume.summaryHint")}</span>
        <span className={charCount > target ? "text-warning font-bold" : ""}>
          {charCount} / {target} chars
        </span>
      </div>
    </SectionShell>
  );
}

function ExperienceStep({
  resume,
  step,
  total,
  isPro,
  ai,
  onAdd,
  onUpdate,
  onDelete,
  onAddBullet,
  onUpdateBullet,
  onDeleteBullet,
  onImproveBullet,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  isPro: boolean;
  ai: AiState;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<ExperienceItem>) => void;
  onDelete: (id: string) => void;
  onAddBullet: (id: string) => void;
  onUpdateBullet: (id: string, index: number, value: string) => void;
  onDeleteBullet: (id: string, index: number) => void;
  onImproveBullet: (id: string, index: number, text: string) => void;
  t: TFn;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="work"
      step={step}
      total={total}
      title={t("step.experience.title")}
      description={t("step.experience.desc")}
      tip={t("step.experience.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.next")}
    >
      {resume.experiences.length === 0 && (
        <EmptyHint text="No roles yet — add your most recent position first." />
      )}
      {resume.experiences.map((experience, idx) => (
        <ExperienceEditor
          experience={experience}
          index={idx}
          isImproving={(i) => Boolean(ai.bullets[`${experience.id}-${i}`])}
          key={experience.id}
          onAddBullet={() => onAddBullet(experience.id)}
          onDelete={() => onDelete(experience.id)}
          onDeleteBullet={(i) => onDeleteBullet(experience.id, i)}
          onImproveBullet={isPro ? (i, text) => onImproveBullet(experience.id, i, text) : undefined}
          onUpdate={(patch) => onUpdate(experience.id, patch)}
          onUpdateBullet={(i, v) => onUpdateBullet(experience.id, i, v)}
        />
      ))}
      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-bold text-primary hover:bg-primary/5"
        onClick={onAdd}
        type="button"
      >
        <Icon name="add" />
        {t("resume.addRole")}
      </button>
    </SectionShell>
  );
}

function EducationStep({
  resume,
  step,
  total,
  onAdd,
  onUpdate,
  onDelete,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<EducationItem>) => void;
  onDelete: (id: string) => void;
  t: TFn;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="education"
      step={step}
      total={total}
      title={t("step.education.title")}
      description={t("step.education.desc")}
      tip={t("step.education.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.next")}
    >
      {resume.education.length === 0 && (
        <EmptyHint text="Add your most recent degree, then any earlier credentials." />
      )}
      {resume.education.map((education) => (
        <EducationEditor
          education={education}
          key={education.id}
          onDelete={() => onDelete(education.id)}
          onUpdate={(patch) => onUpdate(education.id, patch)}
        />
      ))}
      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-bold text-primary hover:bg-primary/5"
        onClick={onAdd}
        type="button"
      >
        <Icon name="add" />
        {t("resume.addEducation")}
      </button>
    </SectionShell>
  );
}

function SkillsStep({
  resume,
  step,
  total,
  isPro,
  skillDraft,
  setSkillDraft,
  addSkill,
  removeSkill,
  helper,
  onSuggest,
  onAddSuggested,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  isPro: boolean;
  skillDraft: string;
  setSkillDraft: (v: string) => void;
  addSkill: () => void;
  removeSkill: (s: string) => void;
  helper: HelperState;
  onSuggest: () => void;
  onAddSuggested: () => void;
  t: TFn;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="sparkle"
      step={step}
      total={total}
      title={t("step.skills.title")}
      description={t("step.skills.desc")}
      tip={t("step.skills.tip")}
      aiSlot={
        isPro ? (
          <button
            className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary disabled:opacity-60"
            disabled={helper.action !== null}
            onClick={onSuggest}
            type="button"
          >
            <Icon className="text-[14px]" name="sparkle" />
            {helper.action === "suggest_skills" ? "Optimizing…" : "Suggest skills"}
          </button>
        ) : null
      }
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.next")}
    >
      <div className="flex gap-2">
        <input
          className="field"
          onChange={(event) => setSkillDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g., Strategic Leadership, React.js, Data Analysis"
          value={skillDraft}
        />
        <button
          className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-60"
          disabled={!skillDraft.trim()}
          onClick={addSkill}
          type="button"
        >
          {t("resume.addSkill")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resume.skills.length === 0 && (
          <p className="text-sm text-muted">No skills yet. Press Enter to add each one quickly.</p>
        )}
        {resume.skills.map((skill) => (
          <button
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-error/10 hover:text-error"
            key={skill}
            onClick={() => removeSkill(skill)}
            type="button"
            aria-label={`Remove ${skill}`}
          >
            {skill}
            <span className="text-xs opacity-60">✕</span>
          </button>
        ))}
      </div>

      {helper.skills.length > 0 && (
        <div className="rounded-2xl border border-outline/40 bg-surface-soft p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-ink">AI suggestions</p>
            <button
              className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-background"
              onClick={onAddSuggested}
              type="button"
            >
              Add all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {helper.skills.map((skill) => (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}

function LanguagesStep({
  resume,
  step,
  total,
  langDraft,
  setLangDraft,
  addLanguage,
  removeLanguage,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  langDraft: string;
  setLangDraft: (v: string) => void;
  addLanguage: () => void;
  removeLanguage: (l: string) => void;
  t: TFn;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <SectionShell
      icon="language"
      step={step}
      total={total}
      title={t("step.languages.title")}
      description={t("step.languages.desc")}
      tip={t("step.languages.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
      nextLabel={t("common.finish")}
    >
      <div className="flex gap-2">
        <input
          className="field"
          onChange={(event) => setLangDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addLanguage();
            }
          }}
          placeholder='e.g., "English (Fluent)", "Turkish (Native)"'
          value={langDraft}
        />
        <button
          className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-60"
          disabled={!langDraft.trim()}
          onClick={addLanguage}
          type="button"
        >
          {t("resume.addLanguage")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {resume.languages.length === 0 && (
          <p className="text-sm text-muted">{t("common.optional")} — add only when relevant.</p>
        )}
        {resume.languages.map((lang) => (
          <button
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-error/10 hover:text-error"
            key={lang}
            onClick={() => removeLanguage(lang)}
            type="button"
            aria-label={`Remove ${lang}`}
          >
            {lang}
            <span className="text-xs opacity-60">✕</span>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

function ReviewStep({
  resume,
  step,
  total,
  statuses,
  steps,
  onJumpTo,
  isPro,
  ai,
  helper,
  onAudit,
  onGenerateCover,
  onImproveFull,
  onExport,
  exporting,
  t,
  onPrev,
  onNext
}: {
  resume: ResumeData;
  step: number;
  total: number;
  statuses: Record<string, StepStatus>;
  steps: StepDef[];
  onJumpTo: (id: string) => void;
  isPro: boolean;
  ai: AiState;
  helper: HelperState;
  onAudit: () => void;
  onGenerateCover: () => void;
  onImproveFull: () => void;
  onExport: () => void;
  exporting: boolean;
  t: TFn;
  onPrev: () => void;
  onNext: undefined;
}) {
  const checklist = steps.filter((s) => s.id !== "import" && s.id !== "review");
  const allComplete = checklist.every((s) => statuses[s.id] === "complete");

  return (
    <SectionShell
      icon="check"
      step={step}
      total={total}
      title={t("step.review.title")}
      description={t("step.review.desc")}
      tip={t("step.review.tip")}
      onPrev={onPrev}
      onNext={onNext}
      prevLabel={t("common.previous")}
    >
      <div
        className={`rounded-3xl p-5 ${
          allComplete
            ? "bg-gradient-to-br from-success/10 via-success/5 to-transparent ring-1 ring-success/20"
            : "bg-gradient-to-br from-warning/10 via-warning/5 to-transparent ring-1 ring-warning/20"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Status</p>
            <p className="mt-1 text-lg font-bold text-ink">
              {allComplete ? t("step.review.exportReady") : t("step.review.finishFirst")}
            </p>
          </div>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="btn-glow flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-background disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {checklist.map((s) => {
          const st = statuses[s.id] || "empty";
          const done = st === "complete";
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJumpTo(s.id)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-outline/30 bg-surface px-4 py-3 text-left transition hover:border-primary/40 hover:bg-surface-soft"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[16px] ${
                    done
                      ? "bg-success/10 text-success"
                      : st === "partial"
                      ? "bg-warning/10 text-warning"
                      : "bg-surface-soft text-muted"
                  }`}
                >
                  <Icon name={done ? "check" : s.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">{s.label}</p>
                  <p className="text-xs text-muted">
                    {done ? t("step.review.complete") : t("step.review.incomplete")}
                  </p>
                </span>
                <span className="text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
                  {t("step.review.jumpTo")} →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="rounded-3xl border border-outline/30 bg-surface p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <Icon name="analytics" className="text-primary" />
            AI tools
          </h3>
          {!isPro && (
            <PaymentButton
              price="6"
              className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary"
            >
              Pro
            </PaymentButton>
          )}
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <button
            className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary disabled:opacity-60"
            disabled={!isPro || helper.action !== null}
            onClick={onAudit}
            type="button"
          >
            {helper.action === "analyze_resume" ? "Auditing…" : "Audit resume"}
          </button>
          <button
            className="rounded-xl border border-outline/40 bg-surface px-4 py-3 text-sm font-bold text-ink disabled:opacity-60"
            disabled={!isPro || ai.full}
            onClick={onImproveFull}
            type="button"
          >
            {ai.full ? "Optimizing…" : "AI-optimize all"}
          </button>
          <button
            className="rounded-xl border border-outline/40 bg-surface px-4 py-3 text-sm font-bold text-ink disabled:opacity-60"
            disabled={!isPro || helper.action !== null}
            onClick={onGenerateCover}
            type="button"
          >
            {helper.action === "generate_cover_letter" ? "Drafting…" : "Draft cover letter"}
          </button>
        </div>

        {helper.error && (
          <p className="mt-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
            {helper.error}
          </p>
        )}

        {helper.analysis && (
          <div className="mt-4 rounded-2xl border border-outline/40 bg-surface-soft p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  CV score
                </p>
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

        {helper.resultText && (
          <div className="mt-4 rounded-2xl border border-outline/40 bg-surface-soft p-4">
            <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Generated text
            </p>
            <textarea className="field min-h-40 resize-none bg-surface" readOnly value={helper.resultText} />
          </div>
        )}
      </section>
    </SectionShell>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Status helpers                                                 */
/* ────────────────────────────────────────────────────────────── */

function profileStatus(resume: ResumeData): StepStatus {
  const fields = [resume.firstName, resume.lastName, resume.title, resume.email];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  if (filled === 0) return "empty";
  if (filled < fields.length) return "partial";
  return "complete";
}

function experienceStatus(resume: ResumeData): StepStatus {
  if (resume.experiences.length === 0) return "empty";
  const allFilled = resume.experiences.every(
    (e) => e.role.trim() && e.company.trim() && e.bullets.filter((b) => b.trim()).length > 0
  );
  return allFilled ? "complete" : "partial";
}

function educationStatus(resume: ResumeData): StepStatus {
  if (resume.education.length === 0) return "empty";
  const allFilled = resume.education.every((e) => e.school.trim() && e.degree.trim());
  return allFilled ? "complete" : "partial";
}

/* ────────────────────────────────────────────────────────────── */
/*  Sub-components                                                 */
/* ────────────────────────────────────────────────────────────── */

function PhotoSlider({
  label,
  max,
  min,
  onChange,
  value
}: {
  label: string;
  max: number;
  min: number;
  onChange: (v: number) => void;
  value: number;
}) {
  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>
      <input
        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-outline/50 accent-primary"
        max={max}
        min={min}
        onChange={(e) => onChange(parseInt(e.target.value))}
        type="range"
        value={value}
      />
    </div>
  );
}

function Field({
  className = "",
  label,
  onChange,
  type = "text",
  value
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block font-label text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <input className="field" onChange={(event) => onChange(event.target.value)} type={type} value={value} />
    </label>
  );
}

function ExperienceEditor({
  experience,
  index,
  isImproving,
  onAddBullet,
  onDelete,
  onDeleteBullet,
  onImproveBullet,
  onUpdate,
  onUpdateBullet
}: {
  experience: ExperienceItem;
  index: number;
  isImproving: (i: number) => boolean;
  onAddBullet: () => void;
  onDelete: () => void;
  onDeleteBullet: (i: number) => void;
  onImproveBullet?: (i: number, text: string) => void;
  onUpdate: (patch: Partial<ExperienceItem>) => void;
  onUpdateBullet: (i: number, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-outline/40 bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
          Role #{index + 1}
        </h3>
        <button
          className="flex items-center gap-1 text-xs font-bold text-error hover:underline"
          onClick={onDelete}
          type="button"
        >
          <Icon className="text-[14px]" name="delete" />
          Delete
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Role Title" onChange={(v) => onUpdate({ role: v })} value={experience.role} />
        <Field label="Company" onChange={(v) => onUpdate({ company: v })} value={experience.company} />
        <Field label="Location" onChange={(v) => onUpdate({ location: v })} value={experience.location} />
        <Field label="Start Date" onChange={(v) => onUpdate({ startDate: v })} value={experience.startDate} />
        <Field label="End Date" onChange={(v) => onUpdate({ endDate: v })} value={experience.endDate} />
        <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-muted">
          <input
            checked={experience.current}
            onChange={(event) =>
              onUpdate({
                current: event.target.checked,
                endDate: event.target.checked ? "" : experience.endDate
              })
            }
            type="checkbox"
          />
          Current role
        </label>
      </div>
      <div className="mt-4 space-y-3">
        <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-muted">Bullet Points</p>
        {experience.bullets.map((bullet, index) => (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]" key={`${experience.id}-${index}`}>
            <input
              className="field"
              onChange={(event) => onUpdateBullet(index, event.target.value)}
              placeholder="Led, built, improved, reduced..."
              value={bullet}
            />
            {onImproveBullet && (
              <button
                className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary disabled:opacity-60"
                disabled={isImproving(index) || !bullet.trim()}
                onClick={() => onImproveBullet(index, bullet)}
                type="button"
              >
                {isImproving(index) ? "Refining…" : "AI refine"}
              </button>
            )}
            <button
              className="rounded-xl border border-outline/70 bg-surface px-3 py-2 text-xs font-bold text-ink"
              onClick={() => onDeleteBullet(index)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="rounded-xl border border-outline/70 bg-surface-soft px-3 py-2 text-xs font-bold text-ink"
          onClick={onAddBullet}
          type="button"
        >
          + Add bullet
        </button>
      </div>
    </div>
  );
}

function EducationEditor({
  education,
  onDelete,
  onUpdate
}: {
  education: EducationItem;
  onDelete: () => void;
  onUpdate: (patch: Partial<EducationItem>) => void;
}) {
  return (
    <div className="rounded-2xl border border-outline/40 bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Education</h3>
        <button
          className="flex items-center gap-1 text-xs font-bold text-error hover:underline"
          onClick={onDelete}
          type="button"
        >
          <Icon className="text-[14px]" name="delete" />
          Delete
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="School" onChange={(v) => onUpdate({ school: v })} value={education.school} />
        <Field label="Degree" onChange={(v) => onUpdate({ degree: v })} value={education.degree} />
        <Field label="Location" onChange={(v) => onUpdate({ location: v })} value={education.location} />
        <Field label="Start Date" onChange={(v) => onUpdate({ startDate: v })} value={education.startDate} />
        <Field label="End Date" onChange={(v) => onUpdate({ endDate: v })} value={education.endDate} />
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="rounded-xl bg-surface-soft px-4 py-3 text-sm text-muted">{text}</p>;
}

function HelperList({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
        {items.map((item) => (
          <li className="rounded-xl bg-surface px-3 py-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReferenceCard({
  reference,
  onDelete,
  onApply,
  applying,
  message
}: {
  reference: ResumeReference;
  onDelete: () => void;
  onApply?: () => void;
  applying?: boolean;
  message?: { text: string; ok: boolean } | null;
}) {
  const label = getReferenceLabel(reference.kind);
  const canApply = reference.kind !== "image";

  return (
    <div className="rounded-2xl border border-outline/40 bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name={reference.kind === "image" ? "photo" : "document"} className="text-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-ink">{reference.name}</h3>
            <p className="text-xs text-muted">
              {label} · {formatFileSize(reference.size)}
              {reference.imported ? " · imported" : ""}
            </p>
          </div>
        </div>
        <button
          className="shrink-0 rounded-lg p-1.5 text-muted transition hover:bg-surface-soft hover:text-error"
          onClick={onDelete}
          type="button"
          title="Remove"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {canApply && onApply && (
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-50"
          onClick={onApply}
          disabled={applying}
          type="button"
        >
          {applying ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Extracting & applying...
            </>
          ) : (
            <>
              <Icon name="sparkle" className="text-[14px]" />
              Apply to resume
            </>
          )}
        </button>
      )}

      {message && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
            message.ok
              ? "border border-success/20 bg-success/10 text-success"
              : "border border-error/20 bg-error/10 text-error"
          }`}
        >
          <Icon name={message.ok ? "check" : "close"} className="text-[16px]" />
          {message.text}
        </div>
      )}
    </div>
  );
}
