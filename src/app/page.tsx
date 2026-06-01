"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/use-theme";
import { PARAMETRIC_CONFIGS } from "@/components/cv-templates/parametric-template";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { sampleResume } from "@/components/cv-templates/sample-data";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate } from "@/types/resume";
import { cvTemplates, cvTemplateToSelectedTemplate } from "@/templates/cvTemplates";

type TemplateCard = SelectedTemplate & {
  text: string;
  category: string;
};

const handcraftedTemplates: TemplateCard[] = [
  { name: "Modern Minimalist", text: "Clean single-column with whitespace focus.", accent: "primary", layout: "single", category: "Single Column" },
  { name: "Professional Serif", text: "Traditional layout for executive roles.", accent: "ink", layout: "classic", category: "Classic" },
  { name: "Creative Tech", text: "Two-column layout for tech professionals.", accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Lumina Compact", text: "Dense but breathable layout.", accent: "primaryBright", layout: "compact", category: "Compact" },
  { name: "Startup Operator", text: "Modern SaaS profile with metrics.", accent: "success", layout: "twoColumn", category: "Two Column" },
  { name: "Graduate Clean", text: "Entry-level template with clarity.", accent: "warning", layout: "single", category: "Single Column" },
  { name: "Executive Impact", text: "High-end for senior leadership.", accent: "ink", layout: "classic", category: "Classic" },
  { name: "Academic Classic", text: "Structured for researchers.", accent: "primary", layout: "single", category: "Single Column" },
  { name: "Obsidian Dark", text: "Dark-themed two-column design.", accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Helix Modern", text: "Sleek contemporary layout.", accent: "primaryBright", layout: "single", category: "Single Column" },
];

const parametricCards: TemplateCard[] = PARAMETRIC_CONFIGS.map((c) => ({
  name: c.name,
  text: c.desc,
  accent: "primary",
  layout: c.pdfLayout,
  themeColor: c.color,
  category: "Parametric",
}));

const registryCards: TemplateCard[] = cvTemplates.map((template) => ({
  ...cvTemplateToSelectedTemplate(template),
  text: template.description,
  category: template.category,
}));

const ALL_TEMPLATES: TemplateCard[] = [...handcraftedTemplates, ...parametricCards, ...registryCards];

const ISSUE_DATE = "VOL. MMXXVI · NO. 01";

const copy = {
  en: {
    // Masthead
    tagline: "— Hand-set for ambitious careers —",
    geo: "Worldwide · Print & Web",
    pressLabel: "The Resumé Press",
    estLine: "Est. 2026 · Worldwide circulation",
    signIn: "Sign in",
    subscribe: "Subscribe →",
    menu: "Menu",
    close: "Close ×",
    toDark: "Dark mode",
    toLight: "Light mode",
    dailyEdition: "A daily edition · One reader at a time",
    nav: [
      { label: "Front Page", marker: "01", href: "#hero" },
      { label: "Anthology", marker: "02", href: "#templates" },
      { label: "Toolkit", marker: "03", href: "#features" },
      { label: "Field Notes", marker: "04", href: "#before-after" },
      { label: "The Desk", marker: "05", href: "#management" },
      { label: "Principles", marker: "06", href: "#principles" },
      { label: "Subscribe", marker: "07", href: "#pricing" },
    ],
    // Hero
    heroEyebrow: "No. 01 — The Front Page",
    heroHeadParts: ["The ", "smarter", " way to build your résumé."],
    heroLeadAccent: "Stop fighting with Word.",
    heroLeadBody: " Use a print-grade typesetter, AI editorials that rewrite your bullets, and one-click export to land your next interview — set in the same press that designed this page.",
    ctaPrimary: "Start a new manuscript",
    ctaSecondary: "Browse the anthology",
    stats: [
      { num: "EN · TR", label: "languages typeset" },
      { num: "A4", label: "print-ready format" },
    ],
    statsTemplatesLabel: "templates in press",
    byline: (year: number) => `Reported and typeset for ambitious professionals — Worldwide · ${year}.`,
    plateCaption: "Plate I — Academic Classic, set in Fraunces & Geist",
    plateNumber: "No. 01",
    handsetExample: "— Hand-set example —",
    sheetSize: "A4 · 210 × 297 mm",
    marginalia: "On craft",
    marginaliaQuote: '"Hand-set in Fraunces and Geist. Every line spaced like editorial copy, not a corporate slide."',
    marginaliaSig: "— From the editor",
    pressNotes: "On the press",
    pressNotesQuote: '"No generic gradients. No SaaS clichés. The press aesthetic is a deliberate choice — every page set the way you\'d set a magazine."',
    pressNotesSig: "— From the editor",
    // Anthology
    anthologyEyebrow: "No. 02 — The Anthology",
    anthologyTitleParts: ["Designed for ", "every", " career stage."],
    anthologyLead: (n: number) => `${n} typeset templates, anthology-grade — from entry-level to executive.`,
    viewAll: (n: number) => `View all ${n} templates`,
    setTemplate: "Set this template →",
    plate: "Plate",
    // Toolkit (features)
    toolkitEyebrow: "No. 03 — The Toolkit",
    toolkitTitleParts: ["Built for ", "precision", " and speed."],
    toolkitLead: "A streamlined newsroom workflow — from blank page to polished print. No learning curve, no marketing fluff, no purple gradients.",
    filedUnder: "Filed under: AI · Typography · Export · Live preview",
    f1Marker: "Feature № 01",
    f1Section: "AI desk",
    f1TitleParts: ["The ", "AI Editor", " rewrites your draft."],
    f1Body: "One click and weak bullets become ATS-friendly, achievement-driven sentences. The AI reads the job description, hunts for the keywords that pass automated screens, then sets the language so a hiring manager actually wants to read it.",
    beforeManuscript: "Before · Manuscript",
    beforeSample: '"Managed social media accounts for the company and posted regularly."',
    afterEdit: "After · AI Edit",
    afterSamplePre: '"Grew social engagement ',
    afterSampleAccent: "+156%",
    afterSamplePost: ' across 4 platforms in six months, managing a 40-post weekly cadence."',
    f2Marker: "№ 02",
    f2Section: "Live press",
    f2TitleParts: ["Live ", "preview", ", like a working printer's proof."],
    f2Body: "Edit on the left, watch the page ink itself on the right. What you set is exactly what gets exported.",
    f3Marker: "№ 03",
    f3Section: "Correspondence",
    f3TitleParts: ["Tailored ", "cover letters", ", dictated in seconds."],
    f3Steps: ["Paste the listing", "AI drafts your letter", "Edit, sign, post."],
    f4Marker: "Feature № 04",
    f4Section: "The Press",
    f4TitleParts: ["Pixel-perfect ", "PDF", " — printed on the same press as your favourite magazine."],
    f4Body: "A4 PDFs that match the on-screen preview character-by-character. Hand off to recruiters or feed straight into ATS readers — every kern and ligature intact.",
    pdfStats: [
      { value: "300", unit: "dpi", label: "Resolution" },
      { value: "A4", unit: "210×297", label: "Format" },
      { value: "100%", unit: "vector", label: "Sharpness" },
    ],
    // Field notes
    fieldEyebrow: "No. 04 — Field Notes",
    fieldTitleParts: ["See the ", "difference", " a single edit makes."],
    fieldLead: "One click. Same words, transformed into achievement-driven copy.",
    manuscriptLabel: "Manuscript · Before",
    manuscriptScore: "ATS · 34/100",
    manuscriptSections: [
      { title: "Work Experience", text: "Worked on marketing campaigns and helped the team with various projects and tasks." },
      { title: "Skills", text: "Good at communication, teamwork, and problem solving. Used Excel and PowerPoint." },
      { title: "Achievement", text: "Was responsible for social media accounts and posting content regularly." },
    ],
    manuscriptFooter: "— Likely filtered out by automated readers.",
    editedBy: "edited by AI",
    afterLabel: "After · AI Edit",
    afterScore: "ATS · 92/100",
    afterSections: [
      { title: "Work Experience", text: "Spearheaded 12 cross-channel campaigns, driving a 34% increase in qualified leads and reducing CPA by 18%." },
      { title: "Skills", text: "Strategic communications, cross-functional leadership, data-driven decisioning. Proficient in Excel (VLOOKUP, pivot tables), HubSpot CRM." },
      { title: "Achievement", text: "Grew organic social engagement by 156% in 6 months, managing a content calendar of 40+ weekly posts across 4 platforms." },
    ],
    afterFooter: "— Interview-ready. Sent straight to the recruiter.",
    tryAi: "Try the AI editor — it's free",
    // The Desk
    deskEyebrow: "No. 05 — The Desk",
    deskTitleParts: ["Your career, ", "filed", " and ready to send."],
    deskLead: "Save versions for every role. Manage, edit, score and export — all from one dashboard, designed to feel like a writer's desk rather than a software product.",
    deskStats: ["Templates", "Avg ATS", "Setup time"],
    deskCtaPrimary: "Start a new draft",
    deskCtaSecondary: "View dashboard",
    mockUrl: "The Desk · cv-with-ai.com/dashboard",
    mockGreeting: "Welcome back, Reader.",
    mockToday: "Mon · Today",
    mockStatLabels: ["Résumés", "Letters", "ATS score"],
    mockTableHeads: ["Title", "Modified", "Score"],
    mockDocs: [
      { title: "Product Manager CV", date: "Updated today", score: 92 as number | null },
      { title: "SaaS Founder Résumé", date: "Two days ago", score: 88 as number | null },
      { title: "Consulting Cover Letter", date: "Draft", score: null as number | null },
    ],
    mockInProgress: "in progress",
    mockFooter: "— A daily edition of you. —",
    // Principles (replaces fake testimonials)
    lettersEyebrow: "No. 06 — The Principles",
    lettersTitleParts: ["Built on a handful of ", "stubborn", " beliefs."],
    lettersLead: "Six principles that shaped every page of the press. None borrowed, none diluted.",
    principles: [
      { topic: "On typography", body: "Typography is the voice of a résumé. Fraunces and Geist Mono — each line spaced like editorial prose, not a corporate slide.", numeral: "I", col: "col-span-12 md:col-span-6 lg:col-span-5" },
      { topic: "On the AI", body: "AI should rewrite, not write. The editor refines what you meant — keeping your voice, sharpening the result.", numeral: "II", col: "col-span-12 md:col-span-6 lg:col-span-4" },
      { topic: "On templates", body: "100 templates, not a thousand variants of three. Each one a deliberate design choice, set with the same care as a magazine spread.", numeral: "III", col: "col-span-12 md:col-span-6 lg:col-span-3" },
      { topic: "On honesty", body: "ATS scoring without smoke. We tell you what's working, what's missing, and what we can't see — no green checkmark you didn't earn.", numeral: "IV", col: "col-span-12 md:col-span-6 lg:col-span-4" },
      { topic: "On craft", body: "Print-grade typesetting in the browser. Every kern, every ligature, exported at 300 dpi — a résumé deserves to look typeset.", numeral: "V", col: "col-span-12 md:col-span-6 lg:col-span-5" },
      { topic: "On focus", body: "One thing, done well. No tracking, no data resale, no diluting the press with features you didn't ask for.", numeral: "VI", col: "col-span-12 md:col-span-12 lg:col-span-3" },
    ],
    principlesFooter: "— Set in Fraunces & Geist · Built for ambitious careers —",
    // Footer / colophon
    colophonAbout: "A typeset newsroom for ambitious careers. Set in Fraunces & Geist, printed on a press of cream & ink.",
    footerSubscribeFree: "Subscribe — start free",
    col1: "The Paper",
    col1Links: [
      { label: "Builder", href: "/resume" },
      { label: "Templates", href: "/templates" },
      { label: "Cover letters", href: "/cover-letter" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    col2: "Subscription",
    col2Links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Sign in", href: "/signin" },
      { label: "Subscribe", href: "/signup" },
    ],
    col3: "Imprint",
    col3Links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Refund policy", href: "/refund" },
      { label: "Contact", href: "mailto:support@cv-with-ai.com" },
    ],
    rights: (year: number) => `© ${year} CV with AI. All rights reserved. Hand-set with care.`,
    issueLine: `${ISSUE_DATE} · Worldwide circulation`,
    // Pricing section
    pricingEyebrow: "No. 07 — Subscription",
    pricingTitleParts: ["Simple, ", "honest", " pricing."],
    pricingLead: "Start free. Upgrade only when you need the press behind you.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 30%",
    basic: "Basic",
    basicTagline: "The cub reporter.",
    basicPeriod: "forever",
    basicFeatures: ["1 CV + 1 cover letter", "All standard templates", "Live preview", "PDF export"],
    startFree: "Start free",
    pro: "Pro",
    proTagline: "The full press.",
    recommended: "Recommended",
    perMonth: "/month",
    perMonthBilled: "/mo · billed €25.20/year",
    proFeatures: [
      "Unlimited CVs & cover letters",
      "AI Editor — rewrite & optimise",
      "AI cover letter generator",
      "Résumé scoring (ATS)",
      "High-res PDF exports",
      "Priority editorial support",
    ],
    subscribePro: "Subscribe to Pro",
    pricingFineprint: "All prices in EUR. Cancel anytime. The free plan stays free, no card required.",
  },
  tr: {
    tagline: "— Geleceğini yazanlar için özenle dizildi —",
    geo: "Tüm dünyada · Baskı & Web",
    pressLabel: "Özgeçmiş Matbaası",
    estLine: "Kuruluş 2026 · Dünya genelinde tiraj",
    signIn: "Giriş yap",
    subscribe: "Abone ol →",
    menu: "Menü",
    close: "Kapat ×",
    toDark: "Karanlık tema",
    toLight: "Aydınlık tema",
    dailyEdition: "Günlük baskı · Her seferinde tek okura",
    nav: [
      { label: "Manşet", marker: "01", href: "#hero" },
      { label: "Antoloji", marker: "02", href: "#templates" },
      { label: "Araç Kutusu", marker: "03", href: "#features" },
      { label: "Saha Notları", marker: "04", href: "#before-after" },
      { label: "Masa", marker: "05", href: "#management" },
      { label: "İlkeler", marker: "06", href: "#principles" },
      { label: "Abonelik", marker: "07", href: "#pricing" },
    ],
    heroEyebrow: "No. 01 — Manşet",
    heroHeadParts: ["Özgeçmiş hazırlamanın ", "daha akıllı", " yolu."],
    heroLeadAccent: "Word'le boğuşmak artık tarihe karıştı.",
    heroLeadBody: " Baskı kalitesinde dizgi, satırlarınızı baştan kaleme alan yapay zekâ editör ve tek tıkla PDF çıktısı — sıradaki mülakata giden yol, bu sayfayı da dizen matbaadan geçiyor.",
    ctaPrimary: "Yeni özgeçmiş hazırla",
    ctaSecondary: "Şablonları keşfet",
    stats: [
      { num: "EN · TR", label: "dizilmiş diller" },
      { num: "A4", label: "baskıya hazır boyut" },
    ],
    statsTemplatesLabel: "baskıdaki şablon",
    byline: (year: number) => `İddialı profesyoneller için hazırlandı ve özenle dizildi — Dünya geneli · ${year}.`,
    plateCaption: "Levha I — Academic Classic, Fraunces & Geist ile dizildi",
    plateNumber: "No. 01",
    handsetExample: "— Elde dizilmiş örnek —",
    sheetSize: "A4 · 210 × 297 mm",
    marginalia: "Tasarım üzerine",
    marginaliaQuote: '"Fraunces ve Geist ile elde dizildi. Her satır, kurumsal bir slayt gibi değil, gazete metni gibi ölçülendi."',
    marginaliaSig: "— Editörden",
    pressNotes: "Matbaa üzerine",
    pressNotesQuote: '"Standart degradeler yok, SaaS klişeleri yok. Matbaa estetiği bilinçli bir tercih — her sayfa, bir dergi gibi dizildi."',
    pressNotesSig: "— Editörden",
    anthologyEyebrow: "No. 02 — Antoloji",
    anthologyTitleParts: ["Her ", "kariyer", " aşamasına göre tasarlandı."],
    anthologyLead: (n: number) => `${n} özenle dizilmiş şablon — yeni mezundan üst düzey yöneticiye kadar herkese.`,
    viewAll: (n: number) => `${n} şablonun tümünü gör`,
    setTemplate: "Bu şablonu seç →",
    plate: "Levha",
    toolkitEyebrow: "No. 03 — Araç Kutusu",
    toolkitTitleParts: ["", "Titizlik", " ve hız, bir arada."],
    toolkitLead: "Boş sayfadan baskıya hazır metne uzanan akıcı bir haber odası düzeni. Öğrenme eğrisi yok, pazarlama palavrası yok, mor degradeler hiç yok.",
    filedUnder: "Dosya: Yapay zekâ · Tipografi · Dışa aktarma · Canlı önizleme",
    f1Marker: "Bölüm № 01",
    f1Section: "Yapay zekâ masası",
    f1TitleParts: ["Yapay zekâ editör ", "müsveddenizi", " baştan yazar."],
    f1Body: "Tek tıkla zayıf maddeler, ATS dostu ve başarı odaklı cümlelere dönüşür. Yapay zekâ ilanı okur, otomatik elemeleri geçecek anahtar kelimeleri bulur ve metni bir işe alım yöneticisinin gerçekten okumak isteyeceği biçimde dizer.",
    beforeManuscript: "Önce · Müsvedde",
    beforeSample: '"Şirketin sosyal medya hesaplarını yönettim ve düzenli paylaşım yaptım."',
    afterEdit: "Sonra · Yapay zekâ düzeltisi",
    afterSamplePre: '"Sosyal medya etkileşimini ',
    afterSampleAccent: "%156",
    afterSamplePost: ' artırdım; 4 platformda altı ayda, haftada 40 paylaşımlık tempoyla."',
    f2Marker: "№ 02",
    f2Section: "Canlı baskı",
    f2TitleParts: ["Canlı ", "önizleme", " — tıpkı matbaa provası gibi."],
    f2Body: "Solda yazın, sağda sayfanın mürekkebe döküldüğünü izleyin. Ne diziyorsanız, dışa aktardığınız tam olarak o.",
    f3Marker: "№ 03",
    f3Section: "Yazışma",
    f3TitleParts: ["Kişiye özel ", "ön yazılar", ", saniyeler içinde."],
    f3Steps: ["İlanı yapıştırın", "Yapay zekâ taslağı yazsın", "Düzenleyin, imzalayın, gönderin."],
    f4Marker: "Bölüm № 04",
    f4Section: "Matbaa",
    f4TitleParts: ["Piksel piksel kusursuz ", "PDF", " — en sevdiğiniz derginin matbaasından çıkmış gibi."],
    f4Body: "Ekrandaki önizlemeyle harfi harfine örtüşen A4 PDF'ler. İster işe alımcıya gönderin ister doğrudan ATS sistemine besleyin; her harf, her aralık yerli yerinde.",
    pdfStats: [
      { value: "300", unit: "dpi", label: "Çözünürlük" },
      { value: "A4", unit: "210×297", label: "Boyut" },
      { value: "100%", unit: "vektör", label: "Netlik" },
    ],
    fieldEyebrow: "No. 04 — Saha Notları",
    fieldTitleParts: ["Tek bir düzeltinin ", "farkını", " görün."],
    fieldLead: "Tek tık. Aynı kelimeler, başarı odaklı bir metne dönüşüyor.",
    manuscriptLabel: "Müsvedde · Önce",
    manuscriptScore: "ATS · 34/100",
    manuscriptSections: [
      { title: "İş Deneyimi", text: "Pazarlama kampanyalarında çalıştım, ekibe çeşitli proje ve görevlerde destek oldum." },
      { title: "Yetkinlikler", text: "İletişim, takım çalışması ve problem çözmede iyiyim. Excel ve PowerPoint kullandım." },
      { title: "Başarı", text: "Sosyal medya hesaplarından ve düzenli içerik paylaşımından sorumluydum." },
    ],
    manuscriptFooter: "— Otomatik sistemlerin elemesi çok olası.",
    editedBy: "yapay zekâ düzeltti",
    afterLabel: "Sonra · Yapay zekâ düzeltisi",
    afterScore: "ATS · 92/100",
    afterSections: [
      { title: "İş Deneyimi", text: "Kanallar arası 12 kampanya yürüttüm; nitelikli müşteri adaylarını %34 artırırken edinme maliyetini %18 düşürdüm." },
      { title: "Yetkinlikler", text: "Stratejik iletişim, ekipler arası liderlik, veriye dayalı karar alma. Excel (VLOOKUP, pivot tablo) ve HubSpot CRM'de uzman." },
      { title: "Başarı", text: "Organik sosyal medya etkileşimini 6 ayda %156 büyüttüm; 4 platformda haftada 40+ paylaşımlık içerik takvimi yönettim." },
    ],
    afterFooter: "— Mülakata hazır. Doğrudan işe alımcıya gitti.",
    tryAi: "Yapay zekâ editörü ücretsiz deneyin",
    deskEyebrow: "No. 05 — Masa",
    deskTitleParts: ["Kariyeriniz ", "dosyalandı", ", göndermeye hazır."],
    deskLead: "Her pozisyon için ayrı sürüm kaydedin. Yönetin, düzenleyin, puanlayın, dışa aktarın — hepsi tek bir panoda. Bir yazılım arayüzünden çok bir yazar masası gibi.",
    deskStats: ["Şablon", "Ort. ATS", "Hazırlık"],
    deskCtaPrimary: "Yeni taslak başlat",
    deskCtaSecondary: "Panoyu aç",
    mockUrl: "Masa · cv-with-ai.com/dashboard",
    mockGreeting: "Tekrar hoş geldiniz, Okur.",
    mockToday: "Pzt · Bugün",
    mockStatLabels: ["Özgeçmiş", "Mektup", "ATS puanı"],
    mockTableHeads: ["Başlık", "Düzenlenme", "Puan"],
    mockDocs: [
      { title: "Product Manager CV", date: "Bugün güncellendi", score: 92 as number | null },
      { title: "SaaS Kurucu CV'si", date: "İki gün önce", score: 88 as number | null },
      { title: "Danışmanlık Ön Yazısı", date: "Taslak", score: null as number | null },
    ],
    mockInProgress: "hazırlanıyor",
    mockFooter: "— Sizin günlük baskınız. —",
    lettersEyebrow: "No. 06 — İlkeler",
    lettersTitleParts: ["Birkaç ", "inatçı", " ilke üzerine kuruldu."],
    lettersLead: "Matbaanın her sayfasını şekillendiren altı ilke. Ödünç alınmadı, sulandırılmadı.",
    principles: [
      { topic: "Tipografi üzerine", body: "Tipografi, bir özgeçmişin sesidir. Fraunces ve Geist Mono — her satır, kurumsal bir slayt gibi değil, gazete metni gibi ölçülendi.", numeral: "I", col: "col-span-12 md:col-span-6 lg:col-span-5" },
      { topic: "Yapay zekâ üzerine", body: "Yapay zekâ yazmamalı, yeniden yazmalı. Editör, demek istediğinizi inceltir — sesinizi korur, sonucu keskinleştirir.", numeral: "II", col: "col-span-12 md:col-span-6 lg:col-span-4" },
      { topic: "Şablonlar üzerine", body: "100 şablon; üçünün bin çeşidi değil. Her biri, bir dergi sayfası gibi özenle dizilmiş bilinçli bir tasarım kararı.", numeral: "III", col: "col-span-12 md:col-span-6 lg:col-span-3" },
      { topic: "Dürüstlük üzerine", body: "Dumansız ATS puanlama. Neyin işe yaradığını, neyin eksik olduğunu ve göremediklerimizi açıkça söyleriz — hak etmediğiniz yeşil bir tik yok.", numeral: "IV", col: "col-span-12 md:col-span-6 lg:col-span-4" },
      { topic: "Zanaat üzerine", body: "Tarayıcıda baskı kalitesinde dizgi. Her kerning, her bağ harfi, 300 dpi'da dışa aktarılır — bir özgeçmiş dizilmiş görünmeyi hak eder.", numeral: "V", col: "col-span-12 md:col-span-6 lg:col-span-5" },
      { topic: "Odak üzerine", body: "Tek bir şey, iyi yapılmış. Takip yok, veri satışı yok, istemediğiniz özelliklerle sulandırılmış bir matbaa yok.", numeral: "VI", col: "col-span-12 md:col-span-12 lg:col-span-3" },
    ],
    principlesFooter: "— Fraunces & Geist ile dizildi · İddialı kariyerler için —",
    colophonAbout: "İddialı kariyerler için dizilmiş bir haber odası. Fraunces & Geist ile, krem kâğıt ve mürekkep matbaasında basıldı.",
    footerSubscribeFree: "Abone ol — ücretsiz başla",
    col1: "Gazete",
    col1Links: [
      { label: "Oluşturucu", href: "/resume" },
      { label: "Şablonlar", href: "/templates" },
      { label: "Ön yazılar", href: "/cover-letter" },
      { label: "Pano", href: "/dashboard" },
    ],
    col2: "Abonelik",
    col2Links: [
      { label: "Fiyatlandırma", href: "/pricing" },
      { label: "Giriş", href: "/signin" },
      { label: "Abone ol", href: "/signup" },
    ],
    col3: "Künye",
    col3Links: [
      { label: "Gizlilik politikası", href: "/privacy" },
      { label: "Kullanım şartları", href: "/terms" },
      { label: "İade politikası", href: "/refund" },
      { label: "İletişim", href: "mailto:support@cv-with-ai.com" },
    ],
    rights: (year: number) => `© ${year} CV with AI. Tüm hakları saklıdır. Özenle dizilmiştir.`,
    issueLine: `${ISSUE_DATE} · Dünya genelinde tiraj`,
    pricingEyebrow: "No. 07 — Abonelik",
    pricingTitleParts: ["Basit ve ", "dürüst", " fiyatlandırma."],
    pricingLead: "Ücretsiz başlayın. Matbaanın tüm gücüne ihtiyaç duyduğunuzda yükseltin.",
    monthly: "Aylık",
    yearly: "Yıllık",
    save: "%30 indirim",
    basic: "Basic",
    basicTagline: "Çırak muhabir.",
    basicPeriod: "sonsuza dek",
    basicFeatures: ["1 özgeçmiş + 1 ön yazı", "Tüm standart şablonlar", "Canlı önizleme", "PDF dışa aktarma"],
    startFree: "Ücretsiz başla",
    pro: "Pro",
    proTagline: "Matbaanın tamamı.",
    recommended: "Önerilen",
    perMonth: "/ay",
    perMonthBilled: "/ay · yıllık €25,20 faturalanır",
    proFeatures: [
      "Sınırsız özgeçmiş ve ön yazı",
      "Yapay zekâ editör — yeniden yaz ve geliştir",
      "Yapay zekâ ile ön yazı oluşturma",
      "Özgeçmiş puanlama (ATS)",
      "Yüksek çözünürlüklü PDF çıktısı",
      "Öncelikli editör desteği",
    ],
    subscribePro: "Pro'ya abone ol",
    pricingFineprint: "Tüm fiyatlar Euro cinsindendir. İstediğiniz zaman iptal edebilirsiniz. Ücretsiz plan her zaman ücretsiz, kart gerekmez.",
  },
};

export default function Home() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const c = copy[lang === "tr" ? "tr" : "en"];
  const { dark, toggle: toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function selectTemplate(t: TemplateCard) {
    saveSelectedTemplate({ templateId: t.templateId, name: t.name, layout: t.layout, accent: t.accent, themeColor: t.themeColor });
    router.push("/resume");
  }

  const marqueeTemplates = [...ALL_TEMPLATES, ...ALL_TEMPLATES];

  return (
    <main className="min-h-screen overflow-x-hidden noise-paper text-ink-deep" style={{ fontFamily: "var(--sans)" }}>
      {/* ─────────── MASTHEAD ─────────── */}
      <header className="relative z-50 noise-paper">
        {/* Top thin date strip */}
        <div className="border-b border-ink-deep/15">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
            <span className="hidden md:inline">{ISSUE_DATE}</span>
            <span className="font-serif italic tracking-normal text-saffron normal-case">{c.tagline}</span>
            <span className="hidden md:inline">{c.geo}</span>
          </div>
        </div>

        {/* Big newspaper masthead */}
        <div className="border-b-[3px] border-ink-deep">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 pt-6 pb-4 md:px-12 md:pt-8 md:pb-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-serif text-[11px] italic text-ink-soft md:text-xs">{c.pressLabel}</p>
                <a href="#" className="block font-serif text-[44px] font-medium leading-[0.92] tracking-[-0.04em] text-ink-deep sm:text-[60px] md:text-[84px] lg:text-[104px]">
                  CV <em className="italic text-saffron">with</em> AI
                </a>
              </div>
              <div className="hidden flex-col items-end gap-2 pt-2 md:flex">
                <span className="font-serif text-xs italic text-ink-soft">{c.estLine}</span>
                <div className="flex items-center gap-2">
                  <ThemeToggle dark={dark} toggle={toggleTheme} label={dark ? c.toLight : c.toDark} className="flex h-[30px] w-[34px] items-center justify-center border border-ink-deep text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft" />
                  <button
                    onClick={() => setLang(lang === "en" ? "tr" : "en")}
                    className="border border-ink-deep px-3 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
                  >
                    {lang === "en" ? "TR" : "EN"}
                  </button>
                  <a href="/signin" className="border border-ink-deep px-4 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft">
                    {c.signIn}
                  </a>
                  <a href="/signup" className="bg-ink-deep px-4 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron">
                    {c.subscribe}
                  </a>
                </div>
              </div>
              <button
                className="md:hidden inline-flex h-10 w-10 items-center justify-center border border-ink-deep text-ink-deep"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <span className="relative block h-3.5 w-5">
                  <span className={`absolute left-0 block h-[2px] w-full bg-current transition-all ${mobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 block h-[2px] w-full bg-current transition-all ${mobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Nav strip */}
        <div className="border-b border-ink-deep/30">
          <div className="mx-auto hidden max-w-[1400px] items-center justify-between px-12 py-2.5 md:flex">
            <nav className="flex items-center gap-7">
              {c.nav.map((link) => (
                <a key={link.label} href={link.href} className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-deep transition hover:text-saffron">
                  <span className="font-serif text-[11px] italic text-saffron normal-case tracking-normal">{link.marker} /</span>
                  {link.label}
                </a>
              ))}
            </nav>
            <span className="font-serif text-xs italic text-ink-soft">{c.dailyEdition}</span>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] md:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileMenuOpen}>
        <div className={`absolute inset-0 bg-ink-deep/40 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)} />
        <nav className={`absolute inset-x-3 top-3 noise-paper border-2 border-ink-deep p-6 transition-all ${mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
          <div className="mb-4 flex items-center justify-between border-b border-ink-deep pb-3">
            <p className="font-serif text-2xl text-ink-deep">{c.menu}</p>
            <button className="font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep" onClick={() => setMobileMenuOpen(false)}>{c.close}</button>
          </div>
          <ul className="space-y-3">
            {c.nav.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-baseline gap-3 border-b border-ink-deep/20 py-2.5">
                  <span className="font-serif text-sm italic text-saffron">{link.marker}</span>
                  <span className="font-serif text-2xl text-ink-deep">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <ThemeToggle
              dark={dark}
              toggle={toggleTheme}
              label={dark ? c.toLight : c.toDark}
              withText
              text={dark ? c.toLight : c.toDark}
              className="flex flex-1 items-center justify-center gap-2 border border-ink-deep px-4 py-3 font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
            />
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className="border border-ink-deep px-4 py-3 font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
            >
              {lang === "en" ? "TR" : "EN"}
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <a href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex-1 border border-ink-deep px-4 py-3 text-center font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep">{c.signIn}</a>
            <a href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-ink-deep px-4 py-3 text-center font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft">{c.subscribe}</a>
          </div>
        </nav>
      </div>

      {/* ─────────── HERO ─────────── */}
      <section id="hero" className="relative noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 pt-10 pb-16 md:px-12 md:pt-16 md:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div className="flex min-w-0 flex-col justify-center">
              {/* Eyebrow with rule */}
              <div className="ink-reveal mb-7 flex items-center gap-4">
                <div className="h-px w-12 bg-ink-deep" />
                <p className="font-serif text-sm italic text-saffron">{c.heroEyebrow}</p>
                <div className="h-px flex-1 bg-ink-deep/30" />
              </div>

              <h1 className="ink-reveal headline-editorial text-[44px] sm:text-[72px] md:text-[104px] lg:text-[116px] break-words [overflow-wrap:anywhere]" style={{ animationDelay: "0.1s" }}>
                {c.heroHeadParts[0]}<em>{c.heroHeadParts[1]}</em>{c.heroHeadParts[2]}
              </h1>

              <p className="ink-reveal mt-9 max-w-xl font-serif text-[19px] leading-[1.45] text-ink-soft" style={{ animationDelay: "0.25s" }}>
                <span className="font-serif italic text-saffron">{c.heroLeadAccent}</span>{c.heroLeadBody}
              </p>

              {/* CTAs */}
              <div className="ink-reveal mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.4s" }}>
                <a href="/resume" className="btn-editorial group">
                  {c.ctaPrimary}
                  <span className="font-serif text-base italic">→</span>
                </a>
                <a href="/templates" className="btn-editorial btn-editorial-ghost">
                  {c.ctaSecondary}
                </a>
              </div>

              {/* Editorial stats strip */}
              <div className="ink-reveal mt-12 grid grid-cols-3 gap-0 border-y-2 border-ink-deep py-5" style={{ animationDelay: "0.55s" }}>
                {[
                  ...c.stats,
                  { num: String(ALL_TEMPLATES.length), label: c.statsTemplatesLabel },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex min-w-0 flex-col gap-1 px-2 sm:px-4 ${i > 0 ? "border-l border-ink-deep/30" : ""}`}>
                    <p className="font-serif text-[24px] leading-none text-ink-deep sm:text-[34px] md:text-[52px] break-words [overflow-wrap:anywhere]">{stat.num}</p>
                    <p className="font-serif text-[11px] italic text-ink-soft sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Byline */}
              <p className="byline mt-6">{c.byline(new Date().getFullYear())}</p>
            </div>

            {/* Right: framed preview */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-[460px]">
                <div className="mb-2 flex items-end justify-between">
                  <p className="font-serif text-xs italic text-ink-soft">{c.plateCaption}</p>
                  <p className="font-serif text-[10px] italic text-saffron">{c.plateNumber}</p>
                </div>
                <div className="thumb-frame p-3 border-2">
                  <HeroPreview />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-serif text-[11px] italic text-ink-soft">{c.handsetExample}</p>
                  <p className="font-serif text-[11px] italic text-ink-soft">{c.sheetSize}</p>
                </div>

                {/* margin notes */}
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-saffron pl-3">
                    <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-saffron">{c.marginalia}</p>
                    <p className="font-serif mt-1 text-sm italic text-ink-deep">{c.marginaliaQuote}</p>
                    <p className="mt-2 font-serif text-[11px] italic text-ink-soft">{c.marginaliaSig}</p>
                  </div>
                  <div className="border-l-2 border-moss pl-3">
                    <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-moss">{c.pressNotes}</p>
                    <p className="font-serif mt-1 text-sm italic text-ink-deep">{c.pressNotesQuote}</p>
                    <p className="mt-2 font-serif text-[11px] italic text-ink-soft">{c.pressNotesSig}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* big rule */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="rule-double" />
        </div>
      </section>

      {/* ─────────── ANTHOLOGY (Templates marquee, dark) ─────────── */}
      <LazyTemplateMarquee templates={marqueeTemplates} onSelect={selectTemplate} totalCount={ALL_TEMPLATES.length} c={c} />

      {/* ─────────── TOOLKIT (Features) ─────────── */}
      <section id="features" className="noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          {/* Section heading */}
          <div className="mb-14 grid gap-6 md:grid-cols-[2fr_3fr] md:items-end">
            <div>
              <p className="font-serif text-sm italic text-saffron">{c.toolkitEyebrow}</p>
              <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[72px]">
                {c.toolkitTitleParts[0]}<em>{c.toolkitTitleParts[1]}</em>{c.toolkitTitleParts[2]}
              </h2>
            </div>
            <div className="md:pl-12">
              <p className="font-serif text-lg italic leading-snug text-ink-soft">{c.toolkitLead}</p>
              <div className="mt-4 h-px w-full bg-ink-deep/30" />
              <p className="mt-3 font-serif text-xs italic text-ink-soft">{c.filedUnder}</p>
            </div>
          </div>

          {/* Editorial newspaper bento — 12-col grid */}
          <div className="grid grid-cols-12 gap-px bg-ink-deep border-2 border-ink-deep">
            {/* Feature 01 — AI Editor (big, 8 cols, taller) */}
            <article className="col-span-12 lg:col-span-8 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">{c.f1Marker}</span>
                <span className="smallcaps text-ink-soft">{c.f1Section}</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[40px] leading-[0.95] md:text-[56px]">
                {c.f1TitleParts[0]}<em>{c.f1TitleParts[1]}</em>{c.f1TitleParts[2]}
              </h3>
              <p className="font-serif dropcap mt-6 max-w-2xl text-[17px] leading-[1.5] text-ink-soft">{c.f1Body}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-oxblood/30 bg-oxblood/[0.05] p-4">
                  <p className="smallcaps text-oxblood">{c.beforeManuscript}</p>
                  <p className="mt-2 font-serif text-[15px] italic leading-snug text-ink-soft">{c.beforeSample}</p>
                </div>
                <div className="border border-moss/30 bg-moss/[0.05] p-4">
                  <p className="smallcaps text-moss">{c.afterEdit}</p>
                  <p className="mt-2 font-serif text-[15px] italic leading-snug text-ink-deep">
                    {c.afterSamplePre}<em className="not-italic text-saffron">{c.afterSampleAccent}</em>{c.afterSamplePost}
                  </p>
                </div>
              </div>
            </article>

            {/* Feature 02 — Live Preview (4 cols) */}
            <article className="col-span-12 sm:col-span-6 lg:col-span-4 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">{c.f2Marker}</span>
                <span className="smallcaps text-ink-soft">{c.f2Section}</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[28px] md:text-[34px]">
                {c.f2TitleParts[0]}<em>{c.f2TitleParts[1]}</em>{c.f2TitleParts[2]}
              </h3>
              <p className="font-serif mt-4 text-[15px] leading-[1.5] text-ink-soft">{c.f2Body}</p>
              <div className="mt-6 flex gap-2">
                <div className="flex-1 border border-rule-soft bg-paper p-3">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-3/4 bg-ink-deep/50" />
                    <div className="h-1.5 w-full bg-saffron/50" />
                    <div className="h-1.5 w-2/3 bg-ink-deep/30" />
                  </div>
                </div>
                <span className="self-center font-serif text-2xl italic text-saffron">→</span>
                <div className="flex-1 border-2 border-ink-deep bg-paper-soft p-3">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-1/2 bg-ink-deep" />
                    <div className="h-1 w-full bg-ink-deep/30" />
                    <div className="h-1 w-4/5 bg-ink-deep/30" />
                    <div className="h-1 w-3/5 bg-ink-deep/30" />
                  </div>
                </div>
              </div>
            </article>

            {/* Feature 03 — Cover letter */}
            <article className="col-span-12 sm:col-span-6 lg:col-span-4 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">{c.f3Marker}</span>
                <span className="smallcaps text-ink-soft">{c.f3Section}</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[28px] md:text-[34px]">
                {c.f3TitleParts[0]}<em>{c.f3TitleParts[1]}</em>{c.f3TitleParts[2]}
              </h3>
              <ol className="mt-6 space-y-3">
                {c.f3Steps.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-3 border-b border-ink-deep/15 pb-2.5">
                    <span className="font-serif text-base italic text-saffron">{(i + 1).toString().padStart(2, "0")}</span>
                    <span className="font-serif text-[15px] text-ink-deep">{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            {/* Feature 04 — PDF Export (big, 8 cols) */}
            <article className="col-span-12 lg:col-span-8 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">{c.f4Marker}</span>
                <span className="smallcaps text-ink-soft">{c.f4Section}</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[36px] md:text-[48px]">
                {c.f4TitleParts[0]}<em>{c.f4TitleParts[1]}</em>{c.f4TitleParts[2]}
              </h3>
              <p className="font-serif mt-5 max-w-2xl text-[16px] leading-[1.5] text-ink-soft">{c.f4Body}</p>
              <div className="mt-8 grid grid-cols-3 divide-x divide-ink-deep/20 border-y border-ink-deep">
                {c.pdfStats.map((stat) => (
                  <div key={stat.label} className="px-5 py-4 text-center">
                    <p className="font-serif text-[38px] leading-none text-ink-deep md:text-[48px]">{stat.value}</p>
                    <p className="font-serif text-[12px] italic text-saffron">{stat.unit}</p>
                    <p className="smallcaps mt-1 text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────── FIELD NOTES (Before / After) ─────────── */}
      <section id="before-after" className="relative noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-12 text-center">
            <p className="font-serif text-sm italic text-saffron">{c.fieldEyebrow}</p>
            <h2 className="headline-editorial mx-auto mt-3 max-w-3xl text-[44px] sm:text-[60px] md:text-[76px]">
              {c.fieldTitleParts[0]}<em>{c.fieldTitleParts[1]}</em>{c.fieldTitleParts[2]}
            </h2>
            <p className="byline mt-4">{c.fieldLead}</p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr]">
            {/* Manuscript */}
            <article className="border-2 border-oxblood/40 bg-oxblood/[0.04] p-7 md:p-10">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="smallcaps text-oxblood">{c.manuscriptLabel}</p>
                <p className="font-serif text-xs italic text-oxblood">{c.manuscriptScore}</p>
              </div>
              <div className="space-y-6">
                {c.manuscriptSections.map((item, i) => (
                  <div key={item.title} className={i > 0 ? "border-t border-oxblood/20 pt-5" : ""}>
                    <p className="font-serif text-[11px] italic text-oxblood">§{(i + 1).toString().padStart(2, "0")} — {item.title}</p>
                    <p className="font-serif mt-2 text-[16px] leading-[1.45] italic text-ink-soft">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="byline mt-6 text-oxblood">{c.manuscriptFooter}</p>
            </article>

            {/* Separator with arrow */}
            <div className="my-6 flex items-center justify-center lg:my-0 lg:flex-col lg:px-4">
              <div className="hidden h-px w-full bg-ink-deep lg:h-full lg:w-px" />
              <div className="bg-paper border-2 border-ink-deep px-5 py-3">
                <p className="font-serif text-base italic text-ink-deep">{c.editedBy} <em className="not-italic text-saffron">→</em></p>
              </div>
              <div className="hidden h-px w-full bg-ink-deep lg:h-full lg:w-px" />
            </div>

            {/* AI Edit */}
            <article className="border-2 border-moss/40 bg-moss/[0.04] p-7 md:p-10">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="smallcaps text-moss">{c.afterLabel}</p>
                <p className="font-serif text-xs italic text-moss">{c.afterScore}</p>
              </div>
              <div className="space-y-6">
                {c.afterSections.map((item, i) => (
                  <div key={item.title} className={i > 0 ? "border-t border-moss/20 pt-5" : ""}>
                    <p className="font-serif text-[11px] italic text-moss">§{(i + 1).toString().padStart(2, "0")} — {item.title}</p>
                    <p className="font-serif mt-2 text-[16px] leading-[1.45] text-ink-deep">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="byline mt-6 text-moss">{c.afterFooter}</p>
            </article>
          </div>

          <div className="mt-12 text-center">
            <a href="/resume" className="btn-editorial btn-editorial-saffron inline-flex">
              {c.tryAi}
              <span className="font-serif text-base italic">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── THE DESK (Dashboard preview) — dark ─────────── */}
      <section id="management" className="relative bg-paper-deep text-paper-soft">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(180,83,10,0.18),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(63,91,71,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="font-serif text-sm italic text-saffron-bright">{c.deskEyebrow}</p>
              <h2 className="headline-editorial mt-3 text-[44px] text-paper-soft sm:text-[60px] md:text-[80px]" style={{ color: "var(--paper-soft)" }}>
                {c.deskTitleParts[0]}<em style={{ color: "var(--saffron-bright)" }}>{c.deskTitleParts[1]}</em>{c.deskTitleParts[2]}
              </h2>
              <p className="font-serif mt-6 max-w-md text-[18px] italic leading-[1.45] text-paper-soft/75">{c.deskLead}</p>

              <div className="mt-8 grid grid-cols-3 divide-x divide-paper-soft/15 border-y border-paper-soft/25 py-4">
                {[
                  { value: String(ALL_TEMPLATES.length), label: c.deskStats[0] },
                  { value: "92%", label: c.deskStats[1] },
                  { value: "2 min", label: c.deskStats[2] },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex flex-col items-center gap-1 ${i > 0 ? "px-4" : "pr-4"}`}>
                    <p className="font-serif text-[38px] leading-none text-paper-soft">{stat.value}</p>
                    <p className="font-serif text-xs italic text-paper-soft/55">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/resume" className="btn-editorial-saffron btn-editorial">
                  {c.deskCtaPrimary}
                  <span className="font-serif text-base italic">→</span>
                </a>
                <a href="/dashboard" className="btn-editorial inline-flex border-paper-soft/40 bg-transparent text-paper-soft hover:bg-paper-soft hover:text-ink-deep">
                  {c.deskCtaSecondary}
                </a>
              </div>
            </div>

            {/* Dashboard editorial mockup */}
            <div className="relative">
              <div className="absolute -inset-4 border border-saffron/30" />
              <div className="relative border-2 border-paper-soft bg-paper p-6 text-ink-deep shadow-[12px_12px_0_0_rgba(180,83,10,0.5)]">
                {/* Mock masthead */}
                <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink-deep pb-3">
                  <div>
                    <p className="font-serif text-[10px] italic text-saffron">{c.mockUrl}</p>
                    <p className="font-serif text-2xl text-ink-deep">{c.mockGreeting}</p>
                  </div>
                  <p className="smallcaps text-ink-soft">{c.mockToday}</p>
                </div>

                {/* Stat row */}
                <div className="mb-5 grid grid-cols-3 divide-x divide-ink-deep/20 border border-ink-deep">
                  {[
                    { label: c.mockStatLabels[0], value: "3" },
                    { label: c.mockStatLabels[1], value: "2" },
                    { label: c.mockStatLabels[2], value: "92" },
                  ].map((s) => (
                    <div key={s.label} className="px-4 py-3">
                      <p className="smallcaps text-ink-soft">{s.label}</p>
                      <p className="font-serif text-3xl text-ink-deep">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Document table */}
                <div className="border border-ink-deep">
                  <div className="grid grid-cols-[1.6fr_1fr_auto] gap-4 border-b-2 border-ink-deep bg-paper-warm px-4 py-2">
                    <p className="smallcaps text-ink-soft">{c.mockTableHeads[0]}</p>
                    <p className="smallcaps text-ink-soft">{c.mockTableHeads[1]}</p>
                    <p className="smallcaps text-ink-soft">{c.mockTableHeads[2]}</p>
                  </div>
                  {c.mockDocs.map((doc, i, arr) => (
                    <div key={doc.title} className={`grid grid-cols-[1.6fr_1fr_auto] items-center gap-4 px-4 py-3 ${i < arr.length - 1 ? "border-b border-ink-deep/20" : ""}`}>
                      <p className="font-serif text-[17px] italic text-ink-deep">{doc.title}</p>
                      <p className="font-serif text-sm italic text-ink-soft">{doc.date}</p>
                      <p className="font-serif text-lg text-ink-deep">
                        {doc.score !== null ? <><em className="text-saffron not-italic">{doc.score}</em>/100</> : <span className="italic text-ink-soft">{c.mockInProgress}</span>}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="byline mt-4">{c.mockFooter}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── EDITORIAL PRINCIPLES ─────────── */}
      <section id="principles" className="noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-12 grid gap-6 md:grid-cols-[1.6fr_2.4fr] md:items-end">
            <div>
              <p className="font-serif text-sm italic text-saffron">{c.lettersEyebrow}</p>
              <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[76px]">
                {c.lettersTitleParts[0]}<em>{c.lettersTitleParts[1]}</em>{c.lettersTitleParts[2]}
              </h2>
            </div>
            <p className="font-serif text-lg italic leading-snug text-ink-soft md:pl-12">{c.lettersLead}</p>
          </div>

          {/* Magazine grid — editor's principles */}
          <div className="grid grid-cols-12 gap-px bg-ink-deep border-2 border-ink-deep">
            {c.principles.map((p, i) => (
              <article key={p.topic} className={`${p.col} noise-paper p-7 md:p-9 flex flex-col`}>
                <p className="font-serif text-[60px] leading-none text-saffron">§</p>
                <p className="font-serif mt-1 flex-1 text-[18px] italic leading-[1.35] text-ink-deep md:text-[20px]">
                  {p.body}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-ink-deep pt-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-ink-deep font-serif text-sm italic text-paper-soft">{p.numeral}</div>
                  <div>
                    <p className="font-serif text-[15px] text-ink-deep">{p.topic}</p>
                    <p className="font-serif text-xs italic text-ink-soft">No. {(i + 1).toString().padStart(2, "0")} — Editorial principle</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Closing editorial mark (replaces fake stars summary) */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-ink-deep/40" />
            <p className="font-serif text-lg italic text-ink-deep">{c.principlesFooter}</p>
            <div className="h-px flex-1 bg-ink-deep/40" />
          </div>
        </div>
      </section>

      {/* ─────────── SUBSCRIBE (Pricing) ─────────── */}
      <PricingSection c={c} />

      {/* ─────────── COLOPHON (Footer) ─────────── */}
      <footer className="border-t-[3px] border-ink-deep bg-paper noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <p className="font-serif text-[11px] italic text-ink-soft">{c.pressLabel}, {c.estLine.split(" · ")[0]}</p>
              <p className="font-serif text-[44px] leading-none text-ink-deep md:text-[60px]">
                CV <em className="text-saffron">with</em> AI
              </p>
              <p className="font-serif mt-4 max-w-sm text-[15px] italic leading-snug text-ink-soft">{c.colophonAbout}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href="/signup" className="btn-editorial">
                  {c.footerSubscribeFree}
                </a>
                <a href="/signin" className="btn-editorial btn-editorial-ghost">
                  {c.signIn}
                </a>
              </div>
            </div>

            <FooterCol title={c.col1} links={[...c.col1Links]} />
            <FooterCol title={c.col2} links={[...c.col2Links]} />
            <FooterCol title={c.col3} links={[...c.col3Links]} />
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-deep/30 pt-6 md:flex-row">
            <p className="font-serif text-xs italic text-ink-soft">{c.rights(new Date().getFullYear())}</p>
            <p className="font-serif text-xs italic text-ink-soft">{c.issueLine}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ThemeToggle({ dark, toggle, label, className = "", withText = false, text = "" }: { dark: boolean; toggle: () => void; label: string; className?: string; withText?: boolean; text?: string }) {
  return (
    <button onClick={toggle} aria-label={label} title={label} className={className} type="button">
      {dark ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.2v2.2M12 19.6v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.4 19.6l1.6-1.6M18 6l1.6-1.6" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
      {withText && <span>{text}</span>}
    </button>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-serif text-sm italic text-saffron">{title}</p>
      <div className="mt-2 h-px w-8 bg-ink-deep" />
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="font-serif text-[16px] text-ink-deep transition hover:italic hover:text-saffron">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────── Templates marquee (editorial style) ─────────── */
function LazyTemplateMarquee({ templates, onSelect, totalCount, c }: { templates: TemplateCard[]; onSelect: (t: TemplateCard) => void; totalCount: number; c: (typeof copy)["en"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="templates" className="relative bg-paper-deep py-20 text-paper-soft md:py-24">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_30%_30%,rgba(180,83,10,0.16),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(63,91,71,0.12),transparent_50%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-12 flex flex-col items-end gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-serif text-sm italic text-saffron-bright">{c.anthologyEyebrow}</p>
            <h2 className="headline-editorial mt-3 text-[44px] text-paper-soft sm:text-[60px] md:text-[76px]" style={{ color: "var(--paper-soft)" }}>
              {c.anthologyTitleParts[0]}<em style={{ color: "var(--saffron-bright)" }}>{c.anthologyTitleParts[1]}</em>{c.anthologyTitleParts[2]}
            </h2>
            <p className="font-serif mt-4 text-lg italic text-paper-soft/65">{c.anthologyLead(totalCount)}</p>
          </div>
          <a href="/templates" className="group inline-flex items-center gap-2 border border-paper-soft/40 px-5 py-3 font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep">
            {c.viewAll(totalCount)}
            <span className="font-serif text-base italic">→</span>
          </a>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden" style={{ minHeight: 340 }}>
        {visible ? (
          <>
            <div className="flex editorial-marquee gap-6 px-6 md:px-12" style={{ width: "max-content" }}>
              {templates.map((tmpl, i) => (
                <div key={`${tmpl.name}-${i}`} className="w-[180px] flex-shrink-0 cursor-pointer sm:w-[220px]" onClick={() => onSelect(tmpl)}>
                  <div className="group relative aspect-[1/1.38] overflow-hidden bg-paper-soft border border-paper-soft/30 transition-all duration-300 hover:border-saffron-bright">
                    <div className="absolute inset-0 overflow-hidden">
                      <div style={{ width: "210mm", minHeight: "297mm", transform: "scale(0.302)", transformOrigin: "top left" }}>
                        <TemplateRenderer resume={sampleResume} templateName={tmpl.name} />
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-deep/90 px-3 py-2 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="font-serif text-sm italic text-paper-soft">{tmpl.name}</p>
                      <p className="font-serif text-[10px] italic text-saffron-bright">{c.setTemplate}</p>
                    </div>
                  </div>
                  <p className="mt-2 font-serif text-[11px] italic text-paper-soft/55">{c.plate} {(i % 99 + 1).toString().padStart(2, "0")} · {tmpl.category}</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-paper-deep to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-paper-deep to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-paper-soft/20 border-t-saffron-bright" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── Hero preview (paper frame) ─────────── */
const A4_W = 793;

function HeroPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [scaledHeight, setScaledHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      if (cw > 0) setScale(cw / A4_W);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (scale <= 0) return;
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;
    const update = () => {
      const borderY = container.offsetHeight - container.clientHeight;
      setScaledHeight(Math.ceil(content.scrollHeight * scale) + borderY);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{
        height: scaledHeight > 0 ? scaledHeight : undefined,
        aspectRatio: scaledHeight > 0 ? undefined : "210 / 297",
      }}
    >
      {scale > 0 && (
        <div
          ref={contentRef}
          style={{
            width: A4_W,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TemplateRenderer resume={sampleResume} templateName="Academic Classic" />
        </div>
      )}
    </div>
  );
}

/* ─────────── Pricing (editorial style) ─────────── */
function PricingSection({ c }: { c: (typeof copy)["en"] }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="noise-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-12 text-center">
          <p className="font-serif text-sm italic text-saffron">{c.pricingEyebrow}</p>
          <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[76px]">
            {c.pricingTitleParts[0]}<em>{c.pricingTitleParts[1]}</em>{c.pricingTitleParts[2]}
          </h2>
          <p className="byline mt-4">{c.pricingLead}</p>

          <div className="mt-8 inline-flex items-center gap-0 border-2 border-ink-deep">
            <button
              className={`px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${!yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
              onClick={() => setYearly(false)}
              type="button"
            >
              {c.monthly}
            </button>
            <div className="h-8 w-px bg-ink-deep" />
            <button
              className={`px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
              onClick={() => setYearly(true)}
              type="button"
            >
              {c.yearly}
              <span className="ml-2 bg-saffron px-1.5 py-0.5 text-[9px] text-paper-soft">{c.save}</span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-0 border-2 border-ink-deep md:grid-cols-2">
          <PricingCard
            cta={c.startFree}
            href="/signup"
            features={[...c.basicFeatures]}
            name={c.basic}
            tagline={c.basicTagline}
            price="€0"
            period={c.basicPeriod}
            recommended={c.recommended}
          />
          <PricingCard
            cta={c.subscribePro}
            href="/signup?plan=pro"
            featured
            features={[...c.proFeatures]}
            name={c.pro}
            tagline={c.proTagline}
            price={yearly ? "€2.10" : "€3"}
            originalPrice={yearly ? "€4.20" : "€6"}
            period={yearly ? c.perMonthBilled : c.perMonth}
            recommended={c.recommended}
          />
        </div>

        <p className="mt-8 text-center font-serif text-xs italic text-ink-soft">{c.pricingFineprint}</p>
      </div>
    </section>
  );
}

function PricingCard({ cta, featured = false, features, href, name, tagline, price, originalPrice, period, recommended }: { cta: string; featured?: boolean; features: string[]; href: string; name: string; tagline: string; price: string; originalPrice?: string; period: string; recommended: string }) {
  return (
    <article className={`relative flex flex-col p-8 md:p-10 ${featured ? "bg-ink-deep text-paper-soft md:border-l-2 md:border-ink-deep" : "bg-paper-soft text-ink-deep border-b-2 border-ink-deep md:border-b-0 md:border-r-2"}`}>
      {featured && (
        <div className="absolute -top-px right-6 bg-saffron px-3 py-1 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft">
          {recommended}
        </div>
      )}
      <p className={`font-serif text-sm italic ${featured ? "text-saffron-bright" : "text-saffron"}`}>{tagline}</p>
      <h3 className={`headline-editorial mt-2 text-[44px] ${featured ? "text-paper-soft" : "text-ink-deep"}`} style={featured ? { color: "var(--paper-soft)" } : {}}>
        {name}
      </h3>

      <div className={`mt-5 flex items-baseline gap-2 border-y py-4 ${featured ? "border-paper-soft/25" : "border-ink-deep/25"}`}>
        {originalPrice && (
          <span className={`font-serif text-2xl italic line-through ${featured ? "text-paper-soft/40 decoration-saffron-bright" : "text-ink-quiet decoration-saffron"} decoration-2`}>
            {originalPrice}
          </span>
        )}
        <span className={`font-serif text-[56px] leading-none ${featured ? "text-paper-soft" : "text-ink-deep"}`}>{price}</span>
        <span className={`font-serif text-sm italic ${featured ? "text-paper-soft/60" : "text-ink-soft"}`}>{period || "/month"}</span>
      </div>

      <ul className={`my-8 flex-1 space-y-3 ${featured ? "text-paper-soft/85" : "text-ink-soft"}`}>
        {features.map((feature) => (
          <li key={feature} className={`flex items-baseline gap-3 border-b py-2 ${featured ? "border-paper-soft/15" : "border-ink-deep/12"}`}>
            <span className={`font-serif text-base italic ${featured ? "text-saffron-bright" : "text-saffron"}`}>✓</span>
            <span className="font-serif text-[16px]">{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={`mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] transition ${
          featured
            ? "bg-saffron text-paper-soft hover:bg-paper-soft hover:text-ink-deep"
            : "bg-ink-deep text-paper-soft hover:bg-saffron"
        }`}
      >
        {cta} <span className="font-serif text-base italic">→</span>
      </a>
    </article>
  );
}
