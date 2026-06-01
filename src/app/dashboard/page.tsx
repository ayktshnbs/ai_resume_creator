"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import type { ResumeData, SelectedTemplate } from "@/types/resume";

type RecentResume = {
  id: string;
  title: string;
  data: ResumeData;
  template: SelectedTemplate | null;
  updatedAt: string;
};

type RecentCoverLetter = {
  id: string;
  title: string;
  templateId: string | null;
  updatedAt: string;
};

const copy = {
  en: {
    dailyEdition: "The Desk · Daily Edition",
    welcomeBack: "Welcome back,",
    intro: "Your career documents — filed, edited, and ready to publish. Pick up where you left off, or start something new for tomorrow's edition.",
    newResume: "+ New résumé",
    newLetter: "+ New cover letter",
    proBadge: "★ Pro subscriber",
    freeBadge: "Free reader",
    resumesLabel: "Résumés",
    lettersLabel: "Cover letters",
    planLabel: "Plan",
    planSection: "§03 · Plan",
    proValue: "Pro",
    proSubLine: "All features unlocked",
    proHint: "★ Subscriber benefits active",
    freeValue: "Free",
    freeUsed: (n: number) => `${n}/2 used`,
    unlimited: "Unlimited",
    of: (n: number, limit: number) => `${n} of ${limit}`,
    open: "Open →",
    upgradeBtn: "Upgrade — €3/mo",
    bannerEyebrow: "Editorial",
    bannerLimit: "Free limit reached",
    bannerMore: "Get more with Pro",
    bannerLimitTitlePre: "Subscribe to publish ",
    bannerLimitTitleAccent: "unlimited",
    bannerLimitTitlePost: " issues.",
    bannerProgressTitle: (used: number, total: number) => ({ pre: "", accent: `${used}/${total}`, post: " documents used.", line2: "Go to unlimited." }),
    bannerLead: "Unlimited résumés & letters, the AI editor, résumé scoring, and high-resolution PDF exports.",
    bannerChips: ["Unlimited", "AI Editor", "ATS scoring", "Hi-res PDF"],
    bannerPriceLine: { strike: "€6", current: "€3", suffix: " / month" },
    bannerCta: "Subscribe to Pro →",
    bannerFine: "Cancel anytime. No commitment.",
    recentEyebrow: "No. 02 — Files in production",
    recentTitlePre: "Recent ",
    recentTitleAccent: "documents",
    recentLead: "Pick up where you left off — or start something new.",
    tabAll: "All",
    tabResumes: "Résumés",
    tabLetters: "Letters",
    actionsEyebrow: "No. 03 — Quick assignments",
    actionsTitlePre: "From the ",
    actionsTitleAccent: "editor",
    actionAnthology: { title: "Browse the anthology", desc: "100 designs for every career stage." },
    actionAi: { title: "Send to the AI editor", desc: "Refine summary, bullets, and skills." },
    actionLetter: { title: "Tailored letter", desc: "Generate from a job description." },
    actionLinkedin: { title: "Import from LinkedIn", desc: "Autofill from your existing profile." },
    assignment: "Assignment",
    proLabel: "Pro",
    footerLeft: "— A daily edition of you, hand-set with care. —",
    footerRight: "CV with AI · The Desk",
    // Empty state
    emptyAll: { eyebrow: "— Blank page —", title: "Nothing here yet.", desc: "Start with a résumé or a cover letter — every edit autosaves and lives on this desk.", primary: "+ New résumé", secondary: "+ Cover letter" },
    emptyResumes: { eyebrow: "— Blank page —", title: "No résumés yet.", desc: "Build your first résumé in minutes. Import from LinkedIn or start blank.", primary: "+ New résumé", secondary: "Browse anthology" },
    emptyLetters: { eyebrow: "— Blank page —", title: "No cover letters yet.", desc: "Pair every application with a tailored letter — pick a template to begin.", primary: "+ New letter", secondary: "Browse anthology" },
    resumeBadge: "Résumé",
    letterBadge: "Letter",
    edit: "Edit →",
    updatedPrefix: "Updated ",
    coverLetterDefault: "Cover letter",
    dearHiring: "Dear hiring manager,",
    sincerely: "Sincerely yours,",
    justNow: "just now",
    minutesAgo: (n: number) => `${n}m ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,
    // Sign-in gate
    signInTitlePre: "Sign in to ",
    signInTitleAccent: "read",
    signInTitlePost: " your desk.",
    deskEyebrow: "— The Desk —",
    // Onboarding modal
    onbStepLabel: "Introduction",
    onbSkip: "Skip ×",
    onbBack: "← Back",
    onbSkipBtn: "Skip",
    onbNext: "Next →",
    onbStart: "Get started →",
    onbSteps: [
      { title: "Welcome to The Desk.", desc: "Build professional, ATS-optimised résumés and letters in minutes. Our AI editor crafts content that recruiters actually want to read." },
      { title: "Set your first manuscript.", desc: "Pick from 100 typeset templates, fill in your details, then let the AI editor optimise your copy. Import from LinkedIn to save time." },
      { title: "Pair it with a letter.", desc: "Paste a job listing and the AI dictates a tailored cover letter that matches your experience to the role." },
      { title: "Score, sign, send.", desc: "Get an ATS score, export a hi-res PDF, and ship it. You're ready for the front page." },
    ],
    dateLocale: "en-US",
  },
  tr: {
    dailyEdition: "Masa · Günlük Baskı",
    welcomeBack: "Tekrar hoş geldiniz,",
    intro: "Kariyer belgeleriniz — dosyalandı, düzenlendi, gönderime hazır. Kaldığınız yerden devam edin ya da yarının baskısı için yeni bir şey başlatın.",
    newResume: "+ Yeni CV",
    newLetter: "+ Yeni ön yazı",
    proBadge: "★ Pro abone",
    freeBadge: "Ücretsiz okur",
    resumesLabel: "CV",
    lettersLabel: "Ön yazı",
    planLabel: "Plan",
    planSection: "§03 · Plan",
    proValue: "Pro",
    proSubLine: "Tüm özellikler açık",
    proHint: "★ Abone avantajları aktif",
    freeValue: "Ücretsiz",
    freeUsed: (n: number) => `${n}/2 kullanıldı`,
    unlimited: "Sınırsız",
    of: (n: number, limit: number) => `${n} / ${limit}`,
    open: "Aç →",
    upgradeBtn: "Yükselt — €3/ay",
    bannerEyebrow: "Editör notu",
    bannerLimit: "Ücretsiz sınıra ulaştınız",
    bannerMore: "Pro ile fazlası",
    bannerLimitTitlePre: "Abone olun, ",
    bannerLimitTitleAccent: "sınırsız",
    bannerLimitTitlePost: " sayı yayımlayın.",
    bannerProgressTitle: (used: number, total: number) => ({ pre: `${used}/${total} belge kullanıldı.`, accent: "", post: "", line2: "Sınırsıza geçin." }),
    bannerLead: "Sınırsız özgeçmiş ve ön yazı, yapay zekâ editör, ATS puanlama ve yüksek çözünürlüklü PDF.",
    bannerChips: ["Sınırsız", "Yapay zekâ editör", "ATS puanlama", "HD PDF"],
    bannerPriceLine: { strike: "€6", current: "€3", suffix: " / ay" },
    bannerCta: "Pro'ya abone ol →",
    bannerFine: "İstediğiniz zaman iptal edebilirsiniz. Taahhüt yok.",
    recentEyebrow: "No. 02 — Hazırlanan dosyalar",
    recentTitlePre: "Son ",
    recentTitleAccent: "belgeler",
    recentLead: "Kaldığınız yerden devam edin ya da yeni bir şey başlatın.",
    tabAll: "Tümü",
    tabResumes: "Özgeçmiş",
    tabLetters: "Mektup",
    actionsEyebrow: "No. 03 — Hızlı görevler",
    actionsTitlePre: "Editörden ",
    actionsTitleAccent: "görevler",
    actionAnthology: { title: "Antolojiye göz at", desc: "Her kariyer aşaması için 100 tasarım." },
    actionAi: { title: "Yapay zekâ editöre gönder", desc: "Özeti, maddeleri ve yetkinlikleri geliştir." },
    actionLetter: { title: "Kişiye özel mektup", desc: "Bir iş ilanından oluştur." },
    actionLinkedin: { title: "LinkedIn'den içe aktar", desc: "Mevcut profilinizden otomatik doldurun." },
    assignment: "Görev",
    proLabel: "Pro",
    footerLeft: "— Sizin günlük baskınız, özenle dizildi. —",
    footerRight: "CV with AI · Masa",
    emptyAll: { eyebrow: "— Boş sayfa —", title: "Henüz hiçbir şey yok.", desc: "Bir CV veya ön yazıyla başlayın — her düzenleme otomatik kaydedilir ve bu masada kalır.", primary: "+ Yeni CV", secondary: "+ Ön yazı" },
    emptyResumes: { eyebrow: "— Boş sayfa —", title: "Henüz CV yok.", desc: "İlk CV'nizi dakikalar içinde hazırlayın. LinkedIn'den içe aktarın ya da sıfırdan başlayın.", primary: "+ Yeni CV", secondary: "Antolojiye göz at" },
    emptyLetters: { eyebrow: "— Boş sayfa —", title: "Henüz ön yazı yok.", desc: "Her başvuruyu kişiye özel bir mektupla eşleştirin — başlamak için bir şablon seçin.", primary: "+ Yeni mektup", secondary: "Antolojiye göz at" },
    resumeBadge: "CV",
    letterBadge: "Mektup",
    edit: "Düzenle →",
    updatedPrefix: "Güncellendi: ",
    coverLetterDefault: "Ön yazı",
    dearHiring: "Sayın Yetkili,",
    sincerely: "Saygılarımla,",
    justNow: "az önce",
    minutesAgo: (n: number) => `${n} dk önce`,
    hoursAgo: (n: number) => `${n} sa önce`,
    daysAgo: (n: number) => `${n} gün önce`,
    signInTitlePre: "Panonuza ",
    signInTitleAccent: "erişmek",
    signInTitlePost: " için giriş yapın.",
    deskEyebrow: "— Kontrol Paneli —",
    onbStepLabel: "Tanıtım",
    onbSkip: "Atla ×",
    onbBack: "← Geri",
    onbSkipBtn: "Atla",
    onbNext: "Sonraki →",
    onbStart: "Başla →",
    onbSteps: [
      { title: "Masa'ya hoş geldiniz.", desc: "Dakikalar içinde profesyonel, ATS uyumlu özgeçmiş ve mektuplar hazırlayın. Yapay zekâ editörümüz, işe alımcıların okumak isteyeceği metni kaleme alır." },
      { title: "İlk müsveddenizi dizin.", desc: "100 hazır şablondan birini seçin, bilgilerinizi girin ve metni yapay zekâ editöre geliştirtin. Zamandan kazanmak için LinkedIn'den içe aktarabilirsiniz." },
      { title: "Bir ön yazıyla eşleştirin.", desc: "Bir iş ilanı yapıştırın; yapay zekâ, deneyiminizi role göre uyarlayan kişiye özel bir ön yazı hazırlasın." },
      { title: "Puanlayın, imzalayın, gönderin.", desc: "ATS puanınızı alın, yüksek çözünürlüklü PDF'i dışa aktarın ve gönderin. Artık manşete hazırsınız." },
    ],
    dateLocale: "tr-TR",
  },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { isPro, resumeCount, coverLetterCount, loaded } = useProStatus();
  const { t, lang } = useI18n();
  const c = copy[lang === "tr" ? "tr" : "en"];
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [resumes, setResumes] = useState<RecentResume[]>([]);
  const [coverLetters, setCoverLetters] = useState<RecentCoverLetter[]>([]);
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [tab, setTab] = useState<"all" | "resumes" | "letters">("all");

  useEffect(() => {
    if (loaded && !localStorage.getItem("onboarding_seen")) {
      setShowOnboarding(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    Promise.all([
      fetch("/api/user/resumes").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/user/cover-letters").then((r) => (r.ok ? r.json() : []))
    ])
      .then(([rs, cls]) => {
        if (cancelled) return;
        setResumes(Array.isArray(rs) ? rs : []);
        setCoverLetters(Array.isArray(cls) ? cls : []);
        setDocsLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setDocsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (status === "loading") {
    return (
      <AppShell active="dashboard">
        <div className="noise-paper flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-deep/20 border-t-saffron" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell active="dashboard">
        <div className="noise-paper flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <p className="font-serif text-sm italic text-saffron">{c.deskEyebrow}</p>
          <h1 className="headline-editorial text-4xl md:text-6xl">
            {c.signInTitlePre}<em>{c.signInTitleAccent}</em>{c.signInTitlePost}
          </h1>
          <p className="font-serif max-w-md text-lg italic text-ink-soft">{t("gate.signInDashboardDesc")}</p>
          <div className="flex gap-3">
            <Link href="/signin" className="btn-editorial">
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className="btn-editorial btn-editorial-ghost">
              {t("auth.signUpBtn")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const firstName = session.user?.name?.split(" ")[0] || "there";
  const totalDocs = resumeCount + coverLetterCount;
  const resumeLimit = isPro ? Infinity : 1;
  const letterLimit = isPro ? Infinity : 1;
  const dateLabel = new Date().toLocaleDateString(c.dateLocale, {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });

  return (
    <AppShell active="dashboard">
      <div className="noise-paper min-h-screen">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-4 py-8 md:px-10 md:py-12">

          {/* ─── Editorial masthead ─── */}
          <header className="border-b-[3px] border-ink-deep pb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-deep/30 pb-2">
              <p className="font-edit text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                {c.dailyEdition}
              </p>
              <p className="font-serif text-xs italic text-saffron">{dateLabel}</p>
              <PlanBadge isPro={isPro} loaded={loaded} c={c} />
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="headline-editorial text-[48px] sm:text-[64px] md:text-[80px] lg:text-[92px]">
                  {c.welcomeBack}<br /><em>{firstName}</em>.
                </h1>
                <p className="font-serif mt-5 max-w-xl text-[17px] italic leading-snug text-ink-soft">{c.intro}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/resume" className="btn-editorial">
                  {c.newResume}
                </Link>
                <Link href="/cover-letter" className="btn-editorial btn-editorial-ghost">
                  {c.newLetter}
                </Link>
              </div>
            </div>
          </header>

          {/* ─── Editorial usage strip ─── */}
          <section className="grid grid-cols-1 gap-0 border-2 border-ink-deep md:grid-cols-3 md:divide-x-2 md:divide-ink-deep">
            <UsageCell
              icon="document"
              label={c.resumesLabel}
              count={resumeCount}
              limit={resumeLimit}
              isPro={isPro}
              loaded={loaded}
              accent="saffron"
              href="/resume"
              marker="§01"
              c={c}
            />
            <UsageCell
              icon="subject"
              label={c.lettersLabel}
              count={coverLetterCount}
              limit={letterLimit}
              isPro={isPro}
              loaded={loaded}
              accent="moss"
              href="/cover-letter"
              marker="§02"
              c={c}
            />
            <PlanCell isPro={isPro} loaded={loaded} totalDocs={totalDocs} c={c} />
          </section>

          {/* ─── Editorial upgrade banner (Free only) ─── */}
          {!isPro && loaded && (
            <UpgradeBanner totalDocs={totalDocs} resumeCount={resumeCount} coverLetterCount={coverLetterCount} c={c} />
          )}

          {/* ─── Recent documents ─── */}
          <section>
            <div className="mb-6 flex flex-col gap-4 border-b border-ink-deep/30 pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-serif text-sm italic text-saffron">{c.recentEyebrow}</p>
                <h2 className="headline-editorial mt-1 text-3xl md:text-4xl">{c.recentTitlePre}<em>{c.recentTitleAccent}</em></h2>
                <p className="font-serif mt-2 text-sm italic text-ink-soft">{c.recentLead}</p>
              </div>
              <DocTabs
                value={tab}
                onChange={setTab}
                counts={{ all: resumes.length + coverLetters.length, resumes: resumes.length, letters: coverLetters.length }}
                c={c}
              />
            </div>

            <RecentDocs
              tab={tab}
              resumes={resumes}
              coverLetters={coverLetters}
              loaded={docsLoaded}
              c={c}
            />
          </section>

          {/* ─── Quick actions ─── */}
          <section>
            <div className="mb-6 border-b border-ink-deep/30 pb-3">
              <p className="font-serif text-sm italic text-saffron">{c.actionsEyebrow}</p>
              <h2 className="headline-editorial mt-1 text-3xl md:text-4xl">{c.actionsTitlePre}<em>{c.actionsTitleAccent}</em></h2>
            </div>
            <div className="grid gap-px bg-ink-deep border-2 border-ink-deep md:grid-cols-2 lg:grid-cols-4">
              <ActionTile
                href="/templates"
                icon="palette"
                title={c.actionAnthology.title}
                description={c.actionAnthology.desc}
                marker="A"
                c={c}
              />
              <ActionTile
                href="/resume"
                icon="sparkle"
                title={c.actionAi.title}
                description={c.actionAi.desc}
                marker="B"
                proOnly={!isPro}
                c={c}
              />
              <ActionTile
                href="/cover-letter"
                icon="edit"
                title={c.actionLetter.title}
                description={c.actionLetter.desc}
                marker="C"
                proOnly={!isPro}
                c={c}
              />
              <ActionTile
                href="/resume"
                icon="upload"
                title={c.actionLinkedin.title}
                description={c.actionLinkedin.desc}
                marker="D"
                c={c}
              />
            </div>
          </section>

          {/* ─── Footer slug ─── */}
          <footer className="border-t border-ink-deep/30 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-xs italic text-ink-soft">{c.footerLeft}</p>
              <p className="font-edit text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                {c.footerRight}
              </p>
            </div>
          </footer>

          {/* Onboarding modal */}
          {showOnboarding && (
            <OnboardingModal c={c} onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem("onboarding_seen", "1");
            }} />
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ── Plan Badge ─────────────────────────────────────────── */
function PlanBadge({ isPro, loaded, c }: { isPro: boolean; loaded: boolean; c: (typeof copy)["en"] }) {
  if (!loaded) return null;
  if (isPro) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-saffron px-2.5 py-0.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-saffron">
        {c.proBadge}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 border border-ink-deep/40 px-2.5 py-0.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
      {c.freeBadge}
    </span>
  );
}

/* ── Usage Cell ─────────────────────────────────────────── */
function UsageCell({
  icon, label, count, limit, isPro, loaded, accent, href, marker, c
}: {
  icon: IconName;
  label: string;
  count: number;
  limit: number;
  isPro: boolean;
  loaded: boolean;
  accent: "saffron" | "moss";
  href: string;
  marker: string;
  c: (typeof copy)["en"];
}) {
  const percent = isPro ? 100 : Math.min((count / Math.max(limit, 1)) * 100, 100);
  const limitText = isPro ? c.unlimited : c.of(count, limit);
  const accentText = accent === "saffron" ? "text-saffron" : "text-moss";
  const accentBg = accent === "saffron" ? "bg-saffron" : "bg-moss";

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 bg-paper-soft px-6 py-6 transition hover:bg-paper-warm"
    >
      <div className="flex items-baseline justify-between">
        <span className={`font-serif text-sm italic ${accentText}`}>{marker} · {label}</span>
        <Icon name={icon} className={`text-[20px] ${accentText}`} />
      </div>
      <div className="flex items-baseline gap-3">
        <p className="font-serif text-[48px] leading-none text-ink-deep">{loaded ? count : "—"}</p>
        <p className="font-serif text-sm italic text-ink-soft">{loaded ? limitText : ""}</p>
      </div>
      {!isPro && loaded && (
        <div className="h-[3px] w-full bg-ink-deep/15">
          <div
            className={`h-full transition-all ${percent >= 100 ? "bg-oxblood" : accentBg}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      <p className="font-serif text-xs italic text-ink-soft opacity-0 transition group-hover:opacity-100">
        {c.open}
      </p>
    </Link>
  );
}

/* ── Plan Cell ─────────────────────────────────────────── */
function PlanCell({ isPro, loaded, totalDocs, c }: { isPro: boolean; loaded: boolean; totalDocs: number; c: (typeof copy)["en"] }) {
  if (!loaded) {
    return (
      <div className="flex flex-col gap-3 bg-paper-soft px-6 py-6">
        <span className="font-serif text-sm italic text-saffron">{c.planSection}</span>
        <p className="font-serif text-[48px] leading-none text-ink-soft">—</p>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="flex flex-col gap-3 bg-ink-deep px-6 py-6 text-paper-soft">
        <span className="font-serif text-sm italic" style={{ color: "var(--saffron-bright)" }}>{c.planSection}</span>
        <div className="flex items-baseline gap-3">
          <p className="font-serif text-[48px] leading-none text-paper-soft">{c.proValue}</p>
          <p className="font-serif text-sm italic text-paper-soft/65">{c.proSubLine}</p>
        </div>
        <p className="font-serif text-xs italic text-paper-soft/55">{c.proHint}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between gap-3 bg-paper-soft px-6 py-6">
      <div>
        <span className="font-serif text-sm italic text-saffron">{c.planSection}</span>
        <div className="mt-2 flex items-baseline gap-3">
          <p className="font-serif text-[48px] leading-none text-ink-deep">{c.freeValue}</p>
          <p className="font-serif text-sm italic text-ink-soft">{c.freeUsed(totalDocs)}</p>
        </div>
      </div>
      <Link
        href="/pricing"
        className="self-start bg-ink-deep px-4 py-2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron"
      >
        {c.upgradeBtn}
      </Link>
    </div>
  );
}

/* ── Upgrade Banner (editorial pull quote) ─────────────── */
function UpgradeBanner({ totalDocs, resumeCount, coverLetterCount, c }: { totalDocs: number; resumeCount: number; coverLetterCount: number; c: (typeof copy)["en"] }) {
  const atLimit = resumeCount >= 1 && coverLetterCount >= 1;
  const progress = c.bannerProgressTitle(totalDocs, 2);
  return (
    <div className="relative border-2 border-ink-deep bg-ink-deep text-paper-soft">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_30%,rgba(180,83,10,0.3),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(63,91,71,0.25),transparent_50%)]" />
      <div className="relative grid gap-8 p-7 md:grid-cols-[1.6fr_1fr] md:items-end md:p-10">
        <div>
          <p className="font-serif text-sm italic" style={{ color: "var(--saffron-bright)" }}>
            {c.bannerEyebrow} — {atLimit ? c.bannerLimit : c.bannerMore}
          </p>
          <h3 className="headline-editorial mt-3 text-[36px] leading-[0.95] text-paper-soft md:text-[48px]" style={{ color: "var(--paper-soft)" }}>
            {atLimit
              ? <>{c.bannerLimitTitlePre}<em style={{ color: "var(--saffron-bright)" }}>{c.bannerLimitTitleAccent}</em>{c.bannerLimitTitlePost}</>
              : <>{progress.pre}{progress.accent ? <em style={{ color: "var(--saffron-bright)" }}>{progress.accent}</em> : null}{progress.post}<br />{progress.line2}</>}
          </h3>
          <p className="font-serif mt-4 max-w-md text-[16px] italic leading-snug text-paper-soft/75">{c.bannerLead}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {c.bannerChips.map((feature) => (
              <span key={feature} className="border border-paper-soft/30 px-3 py-1 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft/80">
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <p className="font-serif text-right text-xs italic text-paper-soft/60">
            <span className="line-through decoration-saffron-bright">{c.bannerPriceLine.strike}</span> · <em className="not-italic text-paper-soft">{c.bannerPriceLine.current}</em>{c.bannerPriceLine.suffix}
          </p>
          <Link
            href="/pricing"
            className="bg-saffron px-6 py-3.5 font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep"
          >
            {c.bannerCta}
          </Link>
          <p className="text-right font-serif text-[11px] italic text-paper-soft/55">{c.bannerFine}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Document Tabs ──────────────────────────────────────── */
function DocTabs({
  value, onChange, counts, c
}: {
  value: "all" | "resumes" | "letters";
  onChange: (v: "all" | "resumes" | "letters") => void;
  counts: { all: number; resumes: number; letters: number };
  c: (typeof copy)["en"];
}) {
  const tabs: Array<{ id: "all" | "resumes" | "letters"; label: string; count: number }> = [
    { id: "all", label: c.tabAll, count: counts.all },
    { id: "resumes", label: c.tabResumes, count: counts.resumes },
    { id: "letters", label: c.tabLetters, count: counts.letters }
  ];
  return (
    <div className="inline-flex shrink-0 items-center border-2 border-ink-deep">
      {tabs.map((tab, i) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-baseline gap-2 px-4 py-2 font-edit text-[11px] font-bold uppercase tracking-[0.18em] transition ${
              active ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep hover:bg-paper-warm"
            } ${i > 0 ? "border-l-2 border-ink-deep" : ""}`}
          >
            {tab.label}
            <span className={`font-serif text-xs italic normal-case tracking-normal ${active ? "text-saffron-bright" : "text-saffron"}`}>
              ({tab.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Recent Documents Grid ─────────────────────────────── */
function RecentDocs({
  tab, resumes, coverLetters, loaded, c
}: {
  tab: "all" | "resumes" | "letters";
  resumes: RecentResume[];
  coverLetters: RecentCoverLetter[];
  loaded: boolean;
  c: (typeof copy)["en"];
}) {
  const items = useMemo(() => {
    const r = resumes.map((d) => ({ kind: "resume" as const, doc: d }));
    const l = coverLetters.map((d) => ({ kind: "letter" as const, doc: d }));
    if (tab === "resumes") return r;
    if (tab === "letters") return l;
    return [...r, ...l].sort((a, b) => new Date(b.doc.updatedAt).getTime() - new Date(a.doc.updatedAt).getTime());
  }, [resumes, coverLetters, tab]);

  if (!loaded) {
    return (
      <div className="grid gap-px bg-ink-deep border-2 border-ink-deep sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-paper-soft p-5">
            <div className="aspect-[3/4] bg-rule-soft/40" />
            <div className="mt-4 h-4 w-2/3 bg-rule-soft/40" />
            <div className="mt-2 h-3 w-1/2 bg-rule-soft/30" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState tab={tab} c={c} />;
  }

  return (
    <div className="grid gap-px bg-ink-deep border-2 border-ink-deep sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 6).map((item, idx) =>
        item.kind === "resume" ? (
          <ResumeDocCard key={`r-${item.doc.id}`} doc={item.doc} index={idx} c={c} />
        ) : (
          <LetterDocCard key={`l-${item.doc.id}`} doc={item.doc} index={idx} c={c} />
        )
      )}
    </div>
  );
}

/* ── Resume Doc Card ───────────────────────────────────── */
function ResumeDocCard({ doc, index, c }: { doc: RecentResume; index: number; c: (typeof copy)["en"] }) {
  const name = [doc.data.firstName, doc.data.lastName].filter(Boolean).join(" ") || doc.title || "Untitled";
  const title = doc.data.title || "—";
  const templateName = doc.template?.name || "Modern Minimalist";

  return (
    <Link
      href="/resume"
      className="group flex flex-col bg-paper-soft transition hover:bg-paper-warm"
    >
      <div className="relative flex aspect-[3/4] items-end overflow-hidden border-b-2 border-ink-deep bg-paper">
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-ink-deep bg-paper-soft px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-ink-deep">
          {c.resumeBadge}
        </div>
        <div className="absolute left-3 top-3 font-serif text-xs italic text-saffron">No. {(index + 1).toString().padStart(2, "0")}</div>
        <div className="absolute inset-x-0 top-1/4 px-6">
          <p className="font-serif text-xs italic text-ink-soft">{title}</p>
          <p className="font-serif mt-1 text-3xl leading-tight text-ink-deep">{name}</p>
          <div className="mt-3 h-px w-12 bg-saffron" />
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-3/4 bg-ink-deep/30" />
            <div className="h-1.5 w-full bg-ink-deep/15" />
            <div className="h-1.5 w-2/3 bg-ink-deep/15" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-baseline justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="font-serif truncate text-[16px] italic text-ink-deep">{templateName}</p>
          <p className="font-serif mt-0.5 text-xs italic text-ink-soft">{c.updatedPrefix}{formatRelativeTime(doc.updatedAt, c)}</p>
        </div>
        <span className="font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-saffron transition group-hover:text-ink-deep">
          {c.edit}
        </span>
      </div>
    </Link>
  );
}

/* ── Letter Doc Card ───────────────────────────────────── */
function LetterDocCard({ doc, index, c }: { doc: RecentCoverLetter; index: number; c: (typeof copy)["en"] }) {
  return (
    <Link
      href="/cover-letter"
      className="group flex flex-col bg-paper-soft transition hover:bg-paper-warm"
    >
      <div className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden border-b-2 border-ink-deep bg-paper">
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-moss bg-paper-soft px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-moss">
          {c.letterBadge}
        </div>
        <div className="absolute left-3 top-3 font-serif text-xs italic text-moss">№ {(index + 1).toString().padStart(2, "0")}</div>
        <div className="absolute inset-x-0 top-1/4 px-6">
          <p className="font-serif text-sm italic text-ink-soft">{c.dearHiring}</p>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full bg-ink-deep/30" />
            <div className="h-1.5 w-5/6 bg-ink-deep/20" />
            <div className="h-1.5 w-4/5 bg-ink-deep/20" />
            <div className="mt-3 h-px w-12 bg-moss" />
            <div className="h-1.5 w-3/4 bg-ink-deep/20" />
            <div className="h-1.5 w-2/3 bg-ink-deep/15" />
          </div>
          <p className="font-serif mt-4 text-sm italic text-moss">{c.sincerely}</p>
        </div>
      </div>
      <div className="flex flex-1 items-baseline justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="font-serif truncate text-[16px] italic text-ink-deep">{doc.title || c.coverLetterDefault}</p>
          <p className="font-serif mt-0.5 text-xs italic text-ink-soft">{c.updatedPrefix}{formatRelativeTime(doc.updatedAt, c)}</p>
        </div>
        <span className="font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-moss transition group-hover:text-ink-deep">
          {c.edit}
        </span>
      </div>
    </Link>
  );
}

/* ── Empty State ───────────────────────────────────────── */
function EmptyState({ tab, c }: { tab: "all" | "resumes" | "letters"; c: (typeof copy)["en"] }) {
  const map = { all: c.emptyAll, resumes: c.emptyResumes, letters: c.emptyLetters };
  const cfg = map[tab];
  const links = {
    all: { primary: "/resume", secondary: "/cover-letter" },
    resumes: { primary: "/resume", secondary: "/templates" },
    letters: { primary: "/cover-letter", secondary: "/templates" },
  }[tab];

  return (
    <div className="border-2 border-ink-deep bg-paper-soft p-10 text-center">
      <p className="font-serif text-sm italic text-saffron">{cfg.eyebrow}</p>
      <h3 className="headline-editorial mt-3 text-3xl md:text-4xl">{cfg.title}</h3>
      <p className="font-serif mx-auto mt-3 max-w-md text-base italic leading-snug text-ink-soft">{cfg.desc}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href={links.primary} className="btn-editorial">
          {cfg.primary}
        </Link>
        <Link href={links.secondary} className="btn-editorial btn-editorial-ghost">
          {cfg.secondary}
        </Link>
      </div>
    </div>
  );
}

/* ── Action Tile ───────────────────────────────────────── */
function ActionTile({
  href, icon, title, description, marker, proOnly, c
}: {
  href: string;
  icon: IconName;
  title: string;
  description: string;
  marker: string;
  proOnly?: boolean;
  c: (typeof copy)["en"];
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 bg-paper-soft p-6 transition hover:bg-paper-warm"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-serif text-sm italic text-saffron">{c.assignment} {marker}</span>
        <Icon name={icon} className="text-[22px] text-ink-deep transition group-hover:text-saffron" />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="font-serif text-[24px] leading-tight text-ink-deep">{title}</h3>
          {proOnly && (
            <span className="border border-saffron px-1.5 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.16em] text-saffron">{c.proLabel}</span>
          )}
        </div>
        <p className="font-serif mt-2 text-sm italic leading-snug text-ink-soft">{description}</p>
      </div>
      <span className="mt-auto font-edit text-[10px] font-bold uppercase tracking-[0.2em] text-ink-deep opacity-0 transition group-hover:opacity-100">
        {c.open}
      </span>
    </Link>
  );
}

/* ── Utilities ─────────────────────────────────────────── */
function formatRelativeTime(iso: string, c: (typeof copy)["en"]): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return c.justNow;
  if (diffMin < 60) return c.minutesAgo(diffMin);
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return c.hoursAgo(diffHr);
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return c.daysAgo(diffDay);
  return date.toLocaleDateString(c.dateLocale, { year: "numeric", month: "short", day: "numeric" });
}

/* ── Onboarding Modal (editorial) ──────────────────────── */
function OnboardingModal({ onClose, c }: { onClose: () => void; c: (typeof copy)["en"] }) {
  const [step, setStep] = useState(0);
  const steps = c.onbSteps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const marker = (step + 1).toString().padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/55 px-4">
      <div className="w-full max-w-md overflow-hidden border-2 border-ink-deep bg-paper-soft shadow-[12px_12px_0_0_rgba(20,19,15,0.4)]">
        <div className="flex items-baseline justify-between border-b-2 border-ink-deep px-7 py-3">
          <p className="font-serif text-sm italic text-saffron">{c.onbStepLabel} · {marker}/04</p>
          <button onClick={onClose} className="font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep">{c.onbSkip}</button>
        </div>

        <div className="px-7 py-8">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 ${
                  i === step ? "bg-saffron" : i < step ? "bg-ink-deep" : "bg-rule-soft"
                }`}
              />
            ))}
          </div>

          <h2 className="headline-editorial mt-6 text-3xl md:text-4xl">{current.title}</h2>
          <p className="font-serif mt-3 text-base italic leading-snug text-ink-soft">{current.desc}</p>
        </div>

        <div className="flex gap-0 border-t-2 border-ink-deep">
          {step > 0 ? (
            <button
              className="flex-1 bg-paper-soft px-5 py-4 font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-paper-warm"
              onClick={() => setStep(step - 1)}
              type="button"
            >
              {c.onbBack}
            </button>
          ) : (
            <button
              className="flex-1 bg-paper-soft px-5 py-4 font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-soft transition hover:bg-paper-warm"
              onClick={onClose}
              type="button"
            >
              {c.onbSkipBtn}
            </button>
          )}
          <div className="w-px bg-ink-deep" />
          <button
            className="flex-1 bg-ink-deep px-5 py-4 font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron"
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                setStep(step + 1);
              }
            }}
            type="button"
          >
            {isLast ? c.onbStart : c.onbNext}
          </button>
        </div>
      </div>
    </div>
  );
}
