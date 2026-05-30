"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";

type Lang = "en" | "tr";

const copy = {
  en: {
    badge: "Pricing",
    title: "Simple, honest pricing.",
    subtitle:
      "Start for free, upgrade when you need the competitive edge. No hidden fees, cancel anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 30%",
    perMonth: "/month",
    perMonthBilled: (yearTotal: string) => `/mo — billed ${yearTotal}/year`,
    free: "Free",
    pro: "Pro",
    recommended: "Recommended",
    startFree: "Start free",
    getPro: "Get started with Pro",
    everythingBasic: "Everything in Free, plus",
    home: "Home",
    compareTitle: "Compare plans",
    compareSub: "Every feature side-by-side so you know exactly what's included.",
    faqTitle: "Frequently asked questions",
    ctaTitle: "Ready to build a resume that gets interviews?",
    ctaSub: "Join 50,000+ professionals already using CV with AI.",
    ctaButton: "Get started — it's free",
    discountBadge: "50% OFF · LIMITED",
  },
  tr: {
    badge: "Fiyatlandırma",
    title: "Basit, dürüst fiyatlandırma.",
    subtitle:
      "Ücretsiz başlayın, rekabet avantajına ihtiyaç duyduğunuzda yükseltin. Gizli ücret yok, istediğiniz zaman iptal edin.",
    monthly: "Aylık",
    yearly: "Yıllık",
    save: "%30 İndirim",
    perMonth: "/ay",
    perMonthBilled: (yearTotal: string) => `/ay — yıllık ${yearTotal} faturalanır`,
    free: "Ücretsiz",
    pro: "Pro",
    recommended: "Önerilen",
    startFree: "Ücretsiz başla",
    getPro: "Pro ile başla",
    everythingBasic: "Ücretsiz plandaki her şey, artı",
    home: "Ana Sayfa",
    compareTitle: "Planları karşılaştırın",
    compareSub: "Her özellik yan yana — neyin dahil olduğunu tam olarak bilin.",
    faqTitle: "Sıkça sorulan sorular",
    ctaTitle: "Mülakata çağrılan bir CV oluşturmaya hazır mısınız?",
    ctaSub: "Halihazırda CV with AI kullanan 50.000+ profesyonele katılın.",
    ctaButton: "Hemen başla — ücretsiz",
    discountBadge: "%50 İNDİRİM · SINIRLI",
  },
} as const;

type PlanFeature = { en: string; tr: string };

const freeFeatures: PlanFeature[] = [
  { en: "1 resume + 1 cover letter", tr: "1 CV + 1 ön yazı" },
  { en: "70+ standard templates", tr: "70+ standart şablon" },
  { en: "Live preview while editing", tr: "Düzenlerken canlı önizleme" },
  { en: "Standard PDF export (A4)", tr: "Standart PDF dışa aktarma (A4)" },
  { en: "LinkedIn & PDF import", tr: "LinkedIn ve PDF içe aktarma" },
  { en: "Local autosave", tr: "Yerel otomatik kayıt" },
];

const proFeatures: PlanFeature[] = [
  { en: "Unlimited resumes & cover letters", tr: "Sınırsız CV ve ön yazı" },
  { en: "All 100 templates — including executive & creative tiers", tr: "100 şablonun tümü — executive ve creative dahil" },
  { en: "AI rewrite for summaries & bullets", tr: "Özet ve madde işaretleri için yapay zekâ ile yeniden yazım" },
  { en: "AI cover letter generator", tr: "Yapay zekâ ile ön yazı oluşturucu" },
  { en: "Resume analysis & ATS scoring", tr: "CV analizi ve ATS puanlaması" },
  { en: "High-resolution PDF export (300 DPI)", tr: "Yüksek çözünürlüklü PDF dışa aktarma (300 DPI)" },
  { en: "Cloud sync across devices", tr: "Cihazlar arası bulut senkronizasyonu" },
  { en: "Priority email support", tr: "Öncelikli e-posta desteği" },
];

type ComparisonRow = {
  label: PlanFeature;
  free: PlanFeature | boolean;
  pro: PlanFeature | boolean;
};

const comparison: ComparisonRow[] = [
  {
    label: { en: "Resumes", tr: "CV sayısı" },
    free: { en: "1 export", tr: "1 dışa aktarma" },
    pro: { en: "Unlimited", tr: "Sınırsız" },
  },
  {
    label: { en: "Cover letters", tr: "Ön yazı" },
    free: { en: "1 export", tr: "1 dışa aktarma" },
    pro: { en: "Unlimited", tr: "Sınırsız" },
  },
  {
    label: { en: "Standard templates", tr: "Standart şablonlar" },
    free: { en: "70+", tr: "70+" },
    pro: { en: "All 100", tr: "Tümü 100" },
  },
  {
    label: { en: "Executive & creative templates", tr: "Executive & creative şablonlar" },
    free: false,
    pro: true,
  },
  {
    label: { en: "AI rewrite (summary & bullets)", tr: "Yapay zekâ ile yeniden yazım" },
    free: false,
    pro: true,
  },
  {
    label: { en: "AI cover letter generator", tr: "Yapay zekâ ile ön yazı" },
    free: false,
    pro: true,
  },
  {
    label: { en: "ATS scoring & analysis", tr: "ATS puanlama ve analiz" },
    free: false,
    pro: true,
  },
  {
    label: { en: "PDF resolution", tr: "PDF çözünürlüğü" },
    free: { en: "Standard", tr: "Standart" },
    pro: { en: "High-res (300 DPI)", tr: "Yüksek (300 DPI)" },
  },
  {
    label: { en: "Cloud sync", tr: "Bulut senkronizasyonu" },
    free: false,
    pro: true,
  },
  {
    label: { en: "Email support", tr: "E-posta desteği" },
    free: { en: "Standard", tr: "Standart" },
    pro: { en: "Priority", tr: "Öncelikli" },
  },
];

type Faq = { q: PlanFeature; a: PlanFeature };

const faqs: Faq[] = [
  {
    q: {
      en: "Can I really start for free?",
      tr: "Gerçekten ücretsiz başlayabilir miyim?",
    },
    a: {
      en: "Yes — no credit card required. The Free plan lets you build and export one resume and one cover letter using 70+ standard templates. You only need Pro if you want unlimited exports, AI rewrites, or premium templates.",
      tr: "Evet — kredi kartı gerekmez. Ücretsiz plan, 70+ standart şablon kullanarak bir CV ve bir ön yazı oluşturup dışa aktarmanıza olanak tanır. Sınırsız dışa aktarma, yapay zekâ ile yeniden yazım veya premium şablonlar istiyorsanız Pro'ya ihtiyacınız var.",
    },
  },
  {
    q: {
      en: "When am I charged? Can I cancel?",
      tr: "Ne zaman ücretlendirilirim? İptal edebilir miyim?",
    },
    a: {
      en: "Pro is billed monthly or yearly, starting the day you upgrade. You can cancel anytime from your dashboard — your Pro features stay active until the end of the period you've already paid for.",
      tr: "Pro, yükseltme yaptığınız gün başlamak üzere aylık veya yıllık olarak faturalandırılır. İstediğiniz zaman panonuzdan iptal edebilirsiniz — Pro özellikleriniz ödemiş olduğunuz dönem sonuna kadar aktif kalır.",
    },
  },
  {
    q: {
      en: "What's the difference between standard and premium templates?",
      tr: "Standart ve premium şablonlar arasındaki fark nedir?",
    },
    a: {
      en: "Standard templates (70 designs) cover modern, classic, and minimal styles — fully ATS-friendly and suitable for most roles. Premium templates (30 designs) add executive layouts for senior leadership and creative layouts for designers and brand roles.",
      tr: "Standart şablonlar (70 tasarım) modern, klasik ve minimal stilleri kapsar — tamamen ATS uyumlu ve çoğu pozisyon için uygundur. Premium şablonlar (30 tasarım) üst düzey liderlik için executive ve tasarımcı/marka rolleri için creative düzenler ekler.",
    },
  },
  {
    q: {
      en: "Are my drafts safe if I don't sign up?",
      tr: "Kayıt olmazsam taslaklarım güvende mi?",
    },
    a: {
      en: "Drafts are autosaved locally in your browser, so you can come back later without losing work. To sync across devices and back up to the cloud, create a free account.",
      tr: "Taslaklar, tarayıcınızda yerel olarak otomatik kaydedilir, böylece çalışmanızı kaybetmeden daha sonra geri dönebilirsiniz. Cihazlar arasında senkronize etmek ve buluta yedeklemek için ücretsiz hesap oluşturun.",
    },
  },
  {
    q: {
      en: "Do you offer refunds?",
      tr: "İade yapıyor musunuz?",
    },
    a: {
      en: "Pro is a digital service with immediate access, so refunds aren't offered after purchase. Cancel anytime to stop future billing. Full details on the Refund Policy page.",
      tr: "Pro, anında erişim sağlanan dijital bir hizmettir, bu nedenle satın alma sonrası iade yapılmaz. Gelecekteki faturalandırmayı durdurmak için istediğiniz zaman iptal edebilirsiniz. Tüm ayrıntılar İade Politikası sayfasındadır.",
    },
  },
  {
    q: {
      en: "Will my data be used to train AI?",
      tr: "Verilerim yapay zekâ eğitimi için kullanılır mı?",
    },
    a: {
      en: "No. Your resume content is processed only to provide the features you request (AI rewrite, cover letter generation, ATS scoring). It is never used to train external models. See the Privacy Policy for full details.",
      tr: "Hayır. CV içeriğiniz yalnızca talep ettiğiniz özellikleri (yapay zekâ ile yeniden yazım, ön yazı oluşturma, ATS puanlama) sağlamak için işlenir. Dış modelleri eğitmek için asla kullanılmaz. Ayrıntılar Gizlilik Politikası'ndadır.",
    },
  },
];

export default function PricingPage() {
  const { lang, setLang } = useI18n();
  const l: Lang = lang === "tr" ? "tr" : "en";
  const c = copy[l];
  const [yearly, setYearly] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f9fafb]" data-theme="light">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb]/40 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#111827]" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-xs font-extrabold text-white shadow-lg shadow-[#6366f1]/25">
              CV
            </span>
            <span className="bg-gradient-to-r from-[#111827] to-[#6366f1] bg-clip-text text-transparent">
              CV with AI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(l === "en" ? "tr" : "en")}
              className="rounded-full border border-[#e5e7eb]/60 bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280] transition hover:text-[#111827]"
            >
              {l === "en" ? "TR" : "EN"}
            </button>
            <Link className="rounded-full px-4 py-2 text-sm font-bold text-[#4b5563] hover:text-[#111827]" href="/">
              {c.home}
            </Link>
            <Link
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition hover:brightness-105 active:scale-[0.97] sm:inline-flex"
              href="/signup"
            >
              {c.startFree}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-20">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#6366f1]/[0.06] blur-[120px]" />
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5">
            <svg className="h-3.5 w-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">{c.badge}</span>
          </div>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-[#111827] sm:text-5xl md:text-6xl">
            {c.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#6b7280]">{c.subtitle}</p>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb]/60 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
            <button
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${!yearly ? "bg-[#111827] text-white shadow-sm" : "text-[#6b7280]"}`}
              onClick={() => setYearly(false)}
              type="button"
            >
              {c.monthly}
            </button>
            <button
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition ${yearly ? "bg-[#111827] text-white shadow-sm" : "text-[#6b7280]"}`}
              onClick={() => setYearly(true)}
              type="button"
            >
              {c.yearly}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${yearly ? "bg-white/20 text-white" : "bg-[#6366f1]/10 text-[#6366f1]"}`}>
                {c.save}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="relative pb-20">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 md:grid-cols-2 md:px-8">
          {/* Free */}
          <article className="relative flex flex-col rounded-3xl border border-[#e5e7eb]/40 bg-white p-8 shadow-ambient">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#111827]">{c.free}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-[#111827]">€0</span>
                <span className="text-sm font-medium text-[#6b7280]">{c.perMonth}</span>
              </div>
              <p className="mt-3 text-sm text-[#6b7280]">
                {l === "tr"
                  ? "Standart şablonlarla ilk CV'nizi oluşturmak için ideal."
                  : "Perfect for getting your first resume out using standard templates."}
              </p>
            </div>
            <ul className="mb-10 flex-1 space-y-3.5 text-sm text-[#374151]">
              {freeFeatures.map((f) => (
                <li key={f.en} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/10 text-[#6366f1]">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span>{f[l]}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full rounded-2xl bg-[#f3f4f6] px-6 py-4 text-center text-sm font-bold text-[#111827] transition hover:bg-[#e5e7eb]"
            >
              {c.startFree}
            </Link>
          </article>

          {/* Pro */}
          <article className="relative flex flex-col rounded-3xl border-2 border-[#6366f1] bg-white p-8 shadow-[0_24px_80px_-12px_rgba(99,102,241,0.35)] ring-4 ring-[#6366f1]/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {c.recommended}
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="bg-gradient-to-r from-[#111827] to-[#6366f1] bg-clip-text text-xl font-bold text-transparent">{c.pro}</h2>
                <span className="rounded-full bg-gradient-to-r from-[#ef4444] to-[#f97316] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                  {c.discountBadge}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#9ca3af] line-through decoration-[#ef4444]/70 decoration-2">
                  {yearly ? "€4.20" : "€6"}
                </span>
                <span className="text-5xl font-extrabold text-[#111827]">{yearly ? "€2.10" : "€3"}</span>
                <span className="text-sm font-medium text-[#6b7280]">
                  {yearly ? c.perMonthBilled("€25.20") : c.perMonth}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#6b7280]">
                {l === "tr"
                  ? "Mülakatları kazanmak için yapay zekâ ve sınırsız dışa aktarma."
                  : "Unlimited exports plus AI to actually win interviews."}
              </p>
            </div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#6366f1]">{c.everythingBasic}</p>
            <ul className="mb-10 flex-1 space-y-3.5 text-sm text-[#374151]">
              {proFeatures.map((f) => (
                <li key={f.en} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-white">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span>{f[l]}</span>
                </li>
              ))}
            </ul>
            <PaymentButton
              price={yearly ? "25.20" : "3"}
              className="block w-full rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 transition hover:brightness-105 active:scale-[0.98]"
            >
              {c.getPro}
            </PaymentButton>
          </article>
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">{c.compareTitle}</h2>
            <p className="mt-4 text-base text-[#6b7280]">{c.compareSub}</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#e5e7eb]/60 bg-white shadow-ambient">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="w-1/2 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    {l === "tr" ? "Özellik" : "Feature"}
                  </th>
                  <th className="w-1/4 px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    {c.free}
                  </th>
                  <th className="w-1/4 px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-[#6366f1]">
                    {c.pro}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={row.label.en}
                    className={`border-t border-[#e5e7eb]/40 ${i % 2 === 1 ? "bg-[#fafbff]/40" : ""}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#111827]">{row.label[l]}</td>
                    <td className="px-6 py-4 text-center text-sm text-[#6b7280]">
                      <CellValue value={row.free} lang={l} />
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-[#111827]">
                      <CellValue value={row.pro} lang={l} highlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">{c.faqTitle}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FaqItem key={faq.q.en} q={faq.q[l]} a={faq.a[l]} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[#6366f1]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-[#3b82f6]/10 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{c.ctaTitle}</h2>
          <p className="mt-4 text-lg text-white/60">{c.ctaSub}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#6366f1]/30 transition hover:brightness-105 active:scale-[0.98]"
            >
              {c.ctaButton}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              href="/templates"
              className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
              {l === "tr" ? "Şablonları gör" : "Browse templates"}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5e7eb]/40 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-xs text-[#6b7280] md:flex-row md:justify-between md:px-8">
          <p>© 2026 CV with AI</p>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <Link className="hover:text-primary" href="/privacy">{l === "tr" ? "Gizlilik" : "Privacy"}</Link>
            <Link className="hover:text-primary" href="/terms">{l === "tr" ? "Şartlar" : "Terms"}</Link>
            <Link className="hover:text-primary" href="/refund">{l === "tr" ? "İade" : "Refund"}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function CellValue({
  value,
  lang,
  highlight = false,
}: {
  value: PlanFeature | boolean;
  lang: Lang;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          highlight
            ? "bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-white"
            : "bg-[#6366f1]/10 text-[#6366f1]"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ) : (
      <span className="text-[#d1d5db]">—</span>
    );
  }
  return <span>{value[lang]}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border bg-white transition-all ${
        open ? "border-[#6366f1]/40 shadow-ambient" : "border-[#e5e7eb]/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-bold text-[#111827]">{q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] transition ${
            open ? "rotate-45 bg-[#6366f1]/10 text-[#6366f1]" : ""
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm leading-7 text-[#6b7280]">
          {a}
        </div>
      )}
    </div>
  );
}
