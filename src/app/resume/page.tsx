"use client";

import Link from "next/link";
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
import { emptyResumeData, type EducationItem, type ExperienceItem, type ResumeData, type ResumeReference, type SelectedTemplate } from "@/types/resume";
import { cvLangList, cvLangNames, cvLangFlags, type CvLang } from "@/lib/cv-labels";

import { TemplateRenderer } from "@/components/cv-templates/template-renderer";

type AiState = {
  full: boolean;
  summary: boolean;
  bullets: Record<string, boolean>;
  error: string;
};

type ResumeHelperAction = "improve_summary" | "improve_bullet" | "suggest_skills" | "generate_cover_letter" | "analyze_resume";

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
  analysis: null
};

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const { isPro } = useProStatus();
  const { t } = useI18n();
  const [resume, setResume] = useState<ResumeData>(emptyResumeData);
  const [template, setTemplate] = useState<SelectedTemplate>({ name: "Modern Minimalist", layout: "single", accent: "primary" });
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
  const resumeDocId = useRef<string | null>(null);

  const uid = session?.user?.id;

  useEffect(() => {
    if (!uid) return;
    setResume(loadResumeData(uid));
    setTemplate(loadSelectedTemplate());
    setLoaded(true);
  }, [uid]);

  // Load from DB if logged in (DB data takes priority)
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
    if (loaded && uid) {
      saveResumeData(resume, uid);
    }
  }, [loaded, resume, uid]);

  // Auto-save to DB when logged in (debounced)
  useAutoSaveToDb("/api/user/resumes", resume, loaded, resumeDocId);

  if (status === "loading") {
    return (
      <AppShell active="resume" fullHeight>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell active="resume">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="resume" className="text-[32px]" />
          </div>
          <h1 className="text-2xl font-bold text-ink">{t("gate.signInResume")}</h1>
          <p className="max-w-md text-muted">{t("gate.signInResumeDesc")}</p>
          <div className="flex gap-3">
            <Link href="/signin" className="rounded-xl primary-gradient px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110">{t("nav.signIn")}</Link>
            <Link href="/signup" className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft">{t("auth.signUpBtn")}</Link>
          </div>
        </div>
      </AppShell>
    );
  }

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
          ? { ...item, bullets: item.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)) }
          : item
      )
    }));
  }

  function deleteBullet(experienceId: string, bulletIndex: number) {
    setResume((current) => ({
      ...current,
      experiences: current.experiences.map((item) =>
        item.id === experienceId ? { ...item, bullets: item.bullets.filter((_, index) => index !== bulletIndex) } : item
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

    if (!skill || resume.skills.includes(skill)) {
      return;
    }

    setResume((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setResume((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }));
  }

  function addLanguage() {
    const lang = langDraft.trim();
    if (!lang || resume.languages.includes(lang)) return;
    setResume((current) => ({ ...current, languages: [...current.languages, lang] }));
    setLangDraft("");
  }

  function removeLanguage(lang: string) {
    setResume((current) => ({ ...current, languages: current.languages.filter((item) => item !== lang) }));
  }

  function removeReference(id: string) {
    setResume((current) => ({ ...current, references: current.references.filter((item) => item.id !== id) }));
  }

  async function applyReference(ref: ResumeReference) {
    setApplyingRefId(ref.id);
    setApplyMessage(null);

    let text = ref.text || "";

    // If PDF has no text yet (extraction failed earlier), re-extract from dataUrl
    if (text.trim().length < 20 && ref.kind === "pdf" && ref.dataUrl) {
      try {
        const blob = await fetch(ref.dataUrl).then((r) => r.blob());
        const file = new File([blob], ref.name, { type: "application/pdf" });
        text = await extractPdfText(file);
        if (text.trim().length > 0) {
          setResume((current) => ({
            ...current,
            references: current.references.map((r) =>
              r.id === ref.id ? { ...r, text } : r
            ),
          }));
        }
      } catch {
        // continue with whatever text we have
      }
    }

    if (text.trim().length < 20) {
      setApplyMessage({ refId: ref.id, text: "No text could be extracted. Please remove and re-upload the file.", ok: false });
      setApplyingRefId(null);
      return;
    }

    try {
      const response = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extract_from_reference", text }),
      });
      const data = (await response.json()) as { resumeData?: Partial<ResumeData> };
      if (data.resumeData) {
        const extracted = extractResumeObject(data.resumeData);
        if (extracted) {
          setResume((current) => mergeImportedResume(current, extracted));
          setApplyMessage({ refId: ref.id, text: "Data extracted and applied to resume!", ok: true });
        } else {
          setApplyMessage({ refId: ref.id, text: "Could not extract structured resume data.", ok: false });
        }
      } else {
        setApplyMessage({ refId: ref.id, text: "No resume data found in this file.", ok: false });
      }
    } catch {
      setApplyMessage({ refId: ref.id, text: "Extraction failed. Please try again.", ok: false });
    } finally {
      setApplyingRefId(null);
    }
  }

  function clearResume() {
    if (!window.confirm("Clear this resume and remove the local autosave?")) {
      return;
    }

    clearResumeData();
    setResume(emptyResumeData);
    setSkillDraft("");
    setLangDraft("");
    setReferenceMessage("");
    setHelper(initialHelperState);
  }

  async function handleLinkedInImport() {
    if (!linkedInText.trim()) return;
    setLinkedInLoading(true);
    try {
      const res = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extract_from_reference", text: linkedInText }),
      });
      const data = (await res.json()) as { resumeData?: Partial<ResumeData> };
      if (data.resumeData) {
        setResume((current) => mergeImportedResume(current, data.resumeData ?? null));
        setReferenceMessage("LinkedIn profile data was imported successfully!");
      } else {
        setReferenceMessage("Could not extract data from the pasted text. Try copying more of your profile.");
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
      setShareMessage("Temporary preview URL copied. Public sharing will require login/backend.");
    } catch {
      window.alert("Sharing requires login/backend. For now, use this local preview URL: " + url);
    }
  }

  async function exportPdf() {
    const el = document.getElementById("resume-export");
    if (!el) return;

    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: A4_W,
        windowWidth: A4_W,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfW = 210;
      const pdfH = (canvas.height * pdfW) / canvas.width;
      const pageH = 297;
      const doc = new jsPDF("p", "mm", "a4");

      let y = 0;
      while (y < pdfH) {
        if (y > 0) doc.addPage();
        doc.addImage(imgData, "PNG", 0, -y, pdfW, pdfH);
        y += pageH;
      }

      const name = `${resume.firstName || "Resume"}_${resume.lastName || ""}`.replace(/\s+$/, "");
      doc.save(`${name}.pdf`);
    } catch {
      setAi((prev) => ({ ...prev, error: "PDF export failed. Try using your browser's Print function instead." }));
    } finally {
      setExporting(false);
    }
  }

  async function handleReferenceUpload(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

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
        if (text && text.trim().length > 20) {
          textsToExtract.push(text);
        }
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
            setReferenceMessage("Resume data was extracted from your uploaded files and used to populate the form.");
          } else {
            setReferenceMessage("Files were attached but no structured resume data could be extracted.");
          }
        } else {
          setReferenceMessage("Files were attached but no resume data could be extracted.");
        }
      } catch {
        setReferenceMessage("Files were attached. AI extraction failed — you can fill in the form manually.");
      } finally {
        setExtracting(false);
      }
    } else if (importedResume) {
      setReferenceMessage("Uploaded files were attached and resume data was used to populate the form.");
    } else {
      setReferenceMessage("Uploaded files were attached to this draft.");
    }
  }

  async function runHelperAction(action: ResumeHelperAction, text = "") {
    setHelper((current) => ({ ...current, action, error: "", resultText: "", skills: [], analysis: null }));

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

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

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
      const message = getErrorMessage(error);
      setHelper((current) => ({ ...current, action: null, error: message }));
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
        body: JSON.stringify({ type: "full_resume", resumeData: resume, text: "", targetRole: resume.title })
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
              <h1 className="headline-xl text-3xl text-ink md:text-4xl">{t("resume.title")}</h1>
              <p className="mt-1 text-sm text-muted">{t("resume.autosave")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isPro ? (
                <button
                  className="btn-glow primary-gradient flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient disabled:opacity-60"
                  disabled={ai.full}
                  onClick={improveFullResume}
                  type="button"
                >
                  <Icon name="sparkle" />
                  {ai.full ? t("resume.optimizing") : t("resume.aiOptimize")}
                </button>
              ) : (
                <PaymentButton
                  price="6"
                  className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"
                >
                  <Icon name="sparkle" />
                  {t("resume.upgradeAi")}
                </PaymentButton>
              )}
            </div>
          </header>

          {ai.error && <p className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">{ai.error}</p>}
          {referenceMessage && <p className="mb-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{referenceMessage}</p>}

          <div className="space-y-5">
            {isPro && (
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
            )}

            <FormSection icon="person" title={t("resume.profileDetails")}>
              <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
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
                        try {
                          const dataUrl = await readFileAsDataUrl(file);
                          setResume(prev => ({
                            ...prev,
                            photoUrl: dataUrl,
                            photoX: 50,
                            photoY: 50,
                            photoScale: 100
                          }));
                        } catch (err) {
                          setAi(prev => ({ ...prev, error: "Failed to load image." }));
                        }
                      }
                    }}
                    type="file"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">Profile Photo</p>
                  <p className="text-xs text-muted">Upload a professional headshot.</p>
                  {resume.photoUrl && (
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <PhotoSlider
                          label="Position X"
                          max={100}
                          min={0}
                          onChange={(v) => updateResume("photoX", v)}
                          value={resume.photoX ?? 50}
                        />
                        <PhotoSlider
                          label="Position Y"
                          max={100}
                          min={0}
                          onChange={(v) => updateResume("photoY", v)}
                          value={resume.photoY ?? 50}
                        />
                        <PhotoSlider
                          label="Zoom"
                          max={200}
                          min={50}
                          onChange={(v) => updateResume("photoScale", v)}
                          value={resume.photoScale ?? 100}
                        />
                        <div className="flex items-end">
                          <button
                            className="text-xs font-bold text-error hover:underline"
                            onClick={() => {
                              updateResume("photoUrl", undefined);
                              updateResume("photoX", undefined);
                              updateResume("photoY", undefined);
                              updateResume("photoScale", undefined);
                            }}
                            type="button"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("resume.firstName")} onChange={(value) => updateResume("firstName", value)} value={resume.firstName} />
                <Field label={t("resume.lastName")} onChange={(value) => updateResume("lastName", value)} value={resume.lastName} />
                <Field className="md:col-span-2" label={t("resume.jobTitle")} onChange={(value) => updateResume("title", value)} value={resume.title} />
                <Field label={t("resume.email")} onChange={(value) => updateResume("email", value)} type="email" value={resume.email} />
                <Field label={t("resume.phone")} onChange={(value) => updateResume("phone", value)} value={resume.phone} />
                <Field label={t("resume.currentLocation")} onChange={(value) => updateResume("location", value)} value={resume.location} />
                <Field label={t("resume.website")} onChange={(value) => updateResume("website", value)} value={resume.website} />
              </div>
            </FormSection>

            <FormSection icon="subject" title={t("resume.execSummary")}>
              <textarea
                className="field min-h-32 resize-none"
                onChange={(event) => updateResume("summary", event.target.value)}
                placeholder="Draft your professional summary. Use AI to refine it for maximum impact."
                value={resume.summary}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted">{t("resume.summaryHint")}</p>
                {isPro && (
                  <button
                    className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary disabled:opacity-60"
                    disabled={ai.summary || !resume.summary.trim()}
                    onClick={improveSummary}
                    type="button"
                  >
                    <Icon className="h-4 w-4" name="sparkle" />
                    {ai.summary ? t("resume.refining") : t("resume.aiRefineSummary")}
                  </button>
                )}
              </div>
            </FormSection>

            <FormSection icon="work" title={t("resume.profHistory")}>
              <div className="space-y-4">
                {resume.experiences.length === 0 && <EmptyHint text="Add your professional roles to showcase your career trajectory." />}
                {resume.experiences.map((experience) => (
                  <ExperienceEditor
                    experience={experience}
                    isImproving={(index) => Boolean(ai.bullets[`${experience.id}-${index}`])}
                    key={experience.id}
                    onAddBullet={() => addBullet(experience.id)}
                    onDelete={() => deleteExperience(experience.id)}
                    onDeleteBullet={(index) => deleteBullet(experience.id, index)}
                    onImproveBullet={isPro ? (index, text) => improveBullet(experience.id, index, text) : undefined}
                    onUpdate={(patch) => updateExperience(experience.id, patch)}
                    onUpdateBullet={(index, value) => updateBullet(experience.id, index, value)}
                  />
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-bold text-primary hover:bg-primary/5" onClick={addExperience} type="button">
                  <Icon name="add" />
                  {t("resume.addRole")}
                </button>
              </div>
            </FormSection>

            <FormSection icon="document" title={t("resume.academics")}>
              <div className="space-y-4">
                {resume.education.length === 0 && <EmptyHint text="Highlight your academic achievements and certifications." />}
                {resume.education.map((education) => (
                  <EducationEditor
                    education={education}
                    key={education.id}
                    onDelete={() => deleteEducation(education.id)}
                    onUpdate={(patch) => updateEducation(education.id, patch)}
                  />
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-bold text-primary hover:bg-primary/5" onClick={addEducation} type="button">
                  <Icon name="add" />
                  {t("resume.addEducation")}
                </button>
              </div>
            </FormSection>

            <FormSection icon="sparkle" title={t("resume.skills")}>
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
                <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-60" disabled={!skillDraft.trim()} onClick={addSkill} type="button">
                  {t("resume.addSkill")}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills.length === 0 && <p className="text-sm text-muted">Defined competencies demonstrate your specialized expertise.</p>}
                {resume.skills.map((skill) => (
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary" key={skill} onClick={() => removeSkill(skill)} type="button">
                    {skill} ×
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection icon="language" title={t("resume.languages")}>
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
                  placeholder="e.g., English, Turkish, German"
                  value={langDraft}
                />
                <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-60" disabled={!langDraft.trim()} onClick={addLanguage} type="button">
                  {t("resume.addLanguage")}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.languages.length === 0 && <p className="text-sm text-muted">Add the languages you speak to strengthen your profile.</p>}
                {resume.languages.map((lang) => (
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary" key={lang} onClick={() => removeLanguage(lang)} type="button">
                    {lang} ×
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection icon="upload" title={t("resume.references")}>
              <p className="text-sm leading-6 text-muted">
                Import from LinkedIn or upload an old CV — the AI will extract your details and fill the form automatically.
              </p>
              <button
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#0a66c2]/30 bg-[#0a66c2]/5 px-5 py-4 text-sm font-bold text-[#0a66c2] transition hover:bg-[#0a66c2]/10"
                onClick={() => setLinkedInModal(true)}
                type="button"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Import from LinkedIn
              </button>
              {extracting && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Extracting resume data...
                </div>
              )}
              <label
                className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-outline/70 bg-surface-soft px-5 py-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
                onDragOver={(event: DragEvent<HTMLLabelElement>) => event.preventDefault()}
                onDrop={(event: DragEvent<HTMLLabelElement>) => {
                  event.preventDefault();
                  void handleReferenceUpload(event.dataTransfer.files);
                }}
              >
                <Icon className="text-primary text-[24px]" name="upload" />
                <span className="mt-3 text-sm font-bold text-ink">Drag & drop or click to upload</span>
                <span className="mt-1 text-xs text-muted">PDF, TXT, or JSON formats</span>
                <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110">
                  <Icon name="upload" className="text-[14px]" />
                  Upload & Import
                </span>
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
                      reference={reference}
                      onDelete={() => removeReference(reference.id)}
                      onApply={() => void applyReference(reference)}
                      applying={applyingRefId === reference.id}
                      message={applyMessage?.refId === reference.id ? applyMessage : null}
                    />
                  ))
                }
              </div>
            </FormSection>
          </div>
        </section>

        <section className="hidden h-full flex-1 flex-col bg-surface-soft p-6 md:flex lg:p-8">
          <div className="glass-panel z-10 mx-auto mb-6 flex w-full max-w-4xl items-center justify-between rounded-2xl px-5 py-3 shadow-ambient">
            <div className="flex items-center gap-3">
              <Link className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary" href="/templates">
                <Icon name="palette" />
                {template.name}
              </Link>
              <div className="h-5 w-px bg-outline/30" />
              <select
                className="rounded-lg border border-outline/40 bg-surface px-2 py-1.5 text-xs font-bold text-ink cursor-pointer hover:border-primary/50 focus:border-primary focus:outline-none"
                value={template.cvLanguage || "en"}
                onChange={(e) => setTemplate((t) => ({ ...t, cvLanguage: e.target.value }))}
                title="CV output language"
              >
                {cvLangList.map((lang) => (
                  <option key={lang} value={lang}>
                    {cvLangFlags[lang]} {cvLangNames[lang]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button className="btn-spring rounded-xl border border-outline/50 bg-surface px-4 py-2 text-sm font-bold text-ink" onClick={shareResume} type="button">
                {t("resume.share")}
              </button>
              {isPro ? (
                <button
                  className="btn-glow rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-50"
                  disabled={exporting}
                  onClick={() => void exportPdf()}
                  type="button"
                >
                  {exporting ? t("resume.exporting") : t("resume.exportPdf")}
                </button>
              ) : (
                <PaymentButton
                  price="6"
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background"
                >
                  {t("resume.exportPdfPro")}
                </PaymentButton>
              )}
            </div>
          </div>
          {shareMessage && <p className="mx-auto mb-4 w-full max-w-4xl rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{shareMessage}</p>}
          <ScaledTemplatePreview resume={resume} template={template} />
        </section>

        <Link className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-background shadow-panel md:hidden" href="/templates">
          <Icon name="visibility" />
        </Link>
      </div>
      {/* LinkedIn Import Modal */}
      {linkedInModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setLinkedInModal(false); setLinkedInText(""); }}>
          <div className="mx-4 w-full max-w-lg rounded-3xl bg-surface p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Import from LinkedIn</h2>
              <button className="rounded-xl p-2 text-muted hover:bg-surface-soft" onClick={() => { setLinkedInModal(false); setLinkedInText(""); }} type="button">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary">How to import:</p>
              <ol className="mt-2 space-y-1 text-xs text-muted">
                <li>1. Open your LinkedIn profile in a browser</li>
                <li>2. Select all text on the page (Ctrl+A / Cmd+A)</li>
                <li>3. Copy it (Ctrl+C / Cmd+C)</li>
                <li>4. Paste it in the box below (Ctrl+V / Cmd+V)</li>
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
                onClick={() => { setLinkedInModal(false); setLinkedInText(""); }}
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
    </AppShell>
  );
}

const A4_W = 793;
const A4_H = 1122;

function ScaledTemplatePreview({ resume, template }: { resume: ResumeData; template: SelectedTemplate }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.65);
  const [innerH, setInnerH] = useState(A4_H);

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setScale(Math.min(1, wrapRef.current.clientWidth / A4_W));
      if (innerRef.current) setInnerH(innerRef.current.scrollHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (innerRef.current) setInnerH(innerRef.current.scrollHeight);
    });
    return () => cancelAnimationFrame(frame);
  }, [resume, template]);

  return (
    <div ref={wrapRef} className="flex-1 overflow-y-auto py-2">
      <div
        className="relative mx-auto"
        style={{ width: A4_W * scale, height: innerH * scale }}
      >
        <div
          ref={innerRef}
          id="resume-export"
          className="print-area absolute left-0 top-0 bg-white shadow-panel"
          style={{
            width: A4_W,
            minHeight: A4_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TemplateRenderer resume={resume} templateName={template.name} settings={template} />
        </div>
      </div>
    </div>
  );
}

function PhotoSlider({ label, max, min, onChange, value }: { label: string; max: number; min: number; onChange: (v: number) => void; value: number }) {
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

function FormSection({ children, icon, title }: { children: ReactNode; icon: IconName; title: string }) {
  return (
    <section className="soft-card rounded-2xl p-5">
      <h2 className="section-title mb-5 flex items-center gap-2 text-xl font-bold text-ink">
        <Icon className="icon-bounce text-primary" name={icon} />
        {title}
      </h2>
      {children}
    </section>
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
      <span className="mb-2 block font-label text-xs font-bold uppercase tracking-[0.08em] text-muted">{label}</span>
      <input className="field" onChange={(event) => onChange(event.target.value)} type={type} value={value} />
    </label>
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
  onImproveBullet?: (index: number, text: string) => void;
  onUpdate: (patch: Partial<ExperienceItem>) => void;
  onUpdateBullet: (index: number, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-outline/40 bg-surface p-4">
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
            {onImproveBullet && (
              <button
                className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary disabled:opacity-60"
                disabled={isImproving(index) || !bullet.trim()}
                onClick={() => onImproveBullet(index, bullet)}
                type="button"
              >
                {isImproving(index) ? "Refining..." : "AI-Refine Achievement"}
              </button>
            )}
            <button className="rounded-xl border border-outline/70 bg-surface px-3 py-2 text-sm font-bold text-ink" onClick={() => onDeleteBullet(index)} type="button">
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
    <div className="rounded-xl border border-outline/40 bg-surface p-4">
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
    <section className="soft-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="section-title flex items-center gap-2 text-xl font-bold text-ink">
          <Icon className="icon-bounce text-primary" name="analytics" />
          AI Helper
        </h2>
        <span className="rounded-full bg-success/10 px-3 py-1 font-label text-xs font-bold text-success">
          ✦ Free — no API key needed
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <button
          className="btn-glow rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary disabled:opacity-60"
          disabled={helper.action !== null}
          onClick={onAnalyze}
          type="button"
        >
          {isAnalyzing ? "Auditing..." : "Audit Resume"}
        </button>
        <button
          className="btn-spring rounded-xl border border-outline/70 bg-surface px-4 py-3 text-sm font-bold text-ink disabled:opacity-60"
          disabled={helper.action !== null}
          onClick={onSuggestSkills}
          type="button"
        >
          {isSuggestingSkills ? "Optimizing..." : "Optimize Competencies"}
        </button>
        <button
          className="btn-spring rounded-xl border border-outline/70 bg-surface px-4 py-3 text-sm font-bold text-ink disabled:opacity-60"
          disabled={helper.action !== null}
          onClick={onGenerateCover}
          type="button"
        >
          {isGeneratingCover ? "Drafting..." : "Draft Cover Letter"}
        </button>
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
              <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">CV score</p>
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
            <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background" onClick={onAddSuggestedSkills} type="button">
              Integrate All Competencies
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
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Generated text</p>
          </div>
          <textarea className="field min-h-40 resize-none bg-surface" readOnly value={helper.resultText} />
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
          <li className="rounded-xl bg-surface px-3 py-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReferenceCard({ reference, onDelete, onApply, applying, message }: { reference: ResumeReference; onDelete: () => void; onApply?: () => void; applying?: boolean; message?: { text: string; ok: boolean } | null }) {
  const label = getReferenceLabel(reference.kind);
  const canApply = reference.kind !== "image";

  return (
    <div className="rounded-xl border border-outline/40 bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
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
          {canApply && onApply && (
            <button
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              onClick={onApply}
              disabled={applying}
              type="button"
            >
              {applying ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Applying...
                </>
              ) : (
                <>
                  <Icon name="sparkle" className="text-[14px]" />
                  Apply to Resume
                </>
              )}
            </button>
          )}
          <button className="rounded-xl border border-outline/70 bg-surface-soft px-3 py-2 text-sm font-bold text-ink" onClick={onDelete} type="button">
            Remove
          </button>
        </div>
      </div>

      {message && (
        <div className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${message.ok ? "border border-success/20 bg-success/10 text-success" : "border border-error/20 bg-error/10 text-error"}`}>
          <Icon name={message.ok ? "check" : "close"} className="text-[16px]" />
          {message.text}
        </div>
      )}

      {reference.kind === "image" && reference.dataUrl && (
        <img alt={reference.name} className="mt-4 h-40 w-full rounded-xl border border-outline/30 object-contain bg-surface-soft" src={reference.dataUrl} />
      )}

      {reference.kind === "pdf" && reference.dataUrl && (
        <object
          className="mt-4 h-56 w-full overflow-hidden rounded-xl border border-outline/30 bg-surface-soft"
          data={reference.dataUrl}
          type={reference.mimeType || "application/pdf"}
        >
          <p className="p-4 text-sm text-muted">This browser cannot preview the PDF, but the file is attached to the draft.</p>
        </object>
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

function getReferenceKind(file: File): ResumeReference["kind"] {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }

  if (file.type === "application/json" || file.name.toLowerCase().endsWith(".json")) {
    return "json";
  }

  if (file.type.startsWith("text/") || file.name.toLowerCase().match(/\.(txt|md)$/)) {
    return "text";
  }

  return "other";
}

function parseImportedResume(text: string): Partial<ResumeData> | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    const candidate = extractResumeObject(parsed);

    if (!candidate) {
      return null;
    }

    return candidate;
  } catch {
    return null;
  }
}

function extractResumeObject(value: unknown): Partial<ResumeData> | null {
  if (!isRecord(value)) {
    return null;
  }

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
    resume.skills = source.skills.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (Array.isArray(source.languages)) {
    resume.languages = source.languages.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (Array.isArray(source.experiences)) {
    resume.experiences = source.experiences
      .filter(isRecord)
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : createId("exp"),
        role: typeof item.role === "string" ? item.role : "",
        company: typeof item.company === "string" ? item.company : "",
        location: typeof item.location === "string" ? item.location : "",
        startDate: typeof item.startDate === "string" ? item.startDate : "",
        endDate: typeof item.endDate === "string" ? item.endDate : "",
        current: Boolean(item.current),
        bullets: Array.isArray(item.bullets) ? item.bullets.filter((bullet): bullet is string => typeof bullet === "string") : [""]
      }));
  }

  if (Array.isArray(source.education)) {
    resume.education = source.education
      .filter(isRecord)
      .map((item) => ({
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
  if (!imported) {
    return current;
  }

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
    experiences: imported.experiences && imported.experiences.length > 0 ? imported.experiences : current.experiences,
    education: imported.education && imported.education.length > 0 ? imported.education : current.education
  };
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function extractPdfText(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .filter((item) => "str" in item)
        .map((item) => (item as { str: string }).str)
        .join(" ");
      pages.push(text);
    }
    return pages.join("\n\n");
  } catch {
    return "";
  }
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

