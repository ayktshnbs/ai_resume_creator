"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";

type Lang = "en" | "tr";

const copy = {
  en: {
    badge: "No. 07 — Subscription",
    title: "Simple, honest pricing.",
    subtitle:
      "Start for free, upgrade only when you need the press behind you. No hidden fees, cancel anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 30%",
    perMonth: "/month",
    perMonthBilled: (yearTotal: string) => `/mo — billed ${yearTotal}/year`,
    free: "Basic",
    pro: "Pro",
    freeTagline: "The cub reporter.",
    proTagline: "The full press.",
    recommended: "Recommended",
    startFree: "Start free",
    getPro: "Subscribe to Pro",
    everythingBasic: "Everything in Basic, plus",
    home: "Home",
    compareTitle: "Compare the plans",
    compareSub: "Every feature side-by-side so you know exactly what's included.",
    faqTitle: "Letters to the editor",
    faqSub: "Frequently asked, plainly answered.",
    ctaTitle: "Ready to build a résumé that gets interviews?",
    ctaSub: "Join 50,000+ professionals already on The Desk.",
    ctaButton: "Get started — it's free",
    discountBadge: "50% OFF · LIMITED",
  },
  tr: {
    badge: "No. 07 — Abonelik",
    title: "Basit, dürüst fiyatlandırma.",
    subtitle:
      "Ücretsiz başlayın; yalnızca matbaanın tüm gücüne ihtiyaç duyduğunuzda yükseltin. Gizli ücret yok, istediğiniz zaman iptal edebilirsiniz.",
    monthly: "Aylık",
    yearly: "Yıllık",
    save: "%30 indirim",
    perMonth: "/ay",
    perMonthBilled: (yearTotal: string) => `/ay — yıllık ${yearTotal} faturalanır`,
    free: "Basic",
    pro: "Pro",
    freeTagline: "Çırak muhabir.",
    proTagline: "Matbaanın tamamı.",
    recommended: "Önerilen",
    startFree: "Ücretsiz başla",
    getPro: "Pro'ya abone ol",
    everythingBasic: "Basic'teki her şey ve daha fazlası",
    home: "Ana sayfa",
    compareTitle: "Planları karşılaştırın",
    compareSub: "Her özellik yan yana — neyin dahil olduğunu tam olarak görün.",
    faqTitle: "Editöre mektuplar",
    faqSub: "Sık sorulan sorular, açık yanıtlar.",
    ctaTitle: "Mülakata çağrılan bir CV hazırlamaya hazır mısınız?",
    ctaSub: "The Desk'teki 50.000+ profesyonele siz de katılın.",
    ctaButton: "Hemen başla — ücretsiz",
    discountBadge: "%50 İNDİRİM · SINIRLI",
  },
} as const;

type PlanFeature = { en: string; tr: string };

const freeFeatures: PlanFeature[] = [
  { en: "1 résumé + 1 cover letter", tr: "1 CV + 1 ön yazı" },
  { en: "70+ standard templates", tr: "70+ standart şablon" },
  { en: "Live preview while editing", tr: "Düzenlerken canlı önizleme" },
  { en: "Standard PDF export (A4)", tr: "Standart PDF çıktısı (A4)" },
  { en: "LinkedIn & PDF import", tr: "LinkedIn ve PDF içe aktarma" },
  { en: "Local autosave", tr: "Tarayıcıda otomatik kayıt" },
];

const proFeatures: PlanFeature[] = [
  { en: "Unlimited résumés & cover letters", tr: "Sınırsız CV ve ön yazı" },
  { en: "All 100 templates — executive & creative tiers", tr: "100 şablonun tümü — yönetici ve yaratıcı kademeler" },
  { en: "AI Editor — rewrite summaries & bullets", tr: "Yapay zekâ editör — özet ve maddeleri yeniden yazar" },
  { en: "AI cover letter generator", tr: "Yapay zekâ ile ön yazı oluşturma" },
  { en: "Résumé scoring (ATS)", tr: "CV puanlaması (ATS)" },
  { en: "High-resolution PDF export (300 DPI)", tr: "Yüksek çözünürlüklü PDF çıktısı (300 DPI)" },
  { en: "Cloud sync across devices", tr: "Cihazlar arası bulut senkronizasyonu" },
  { en: "Priority editorial support", tr: "Öncelikli editör desteği" },
];

type ComparisonRow = {
  label: PlanFeature;
  free: PlanFeature | boolean;
  pro: PlanFeature | boolean;
};

const comparison: ComparisonRow[] = [
  { label: { en: "Résumés", tr: "CV sayısı" }, free: { en: "1 export", tr: "1 çıktı" }, pro: { en: "Unlimited", tr: "Sınırsız" } },
  { label: { en: "Cover letters", tr: "Ön yazı" }, free: { en: "1 export", tr: "1 çıktı" }, pro: { en: "Unlimited", tr: "Sınırsız" } },
  { label: { en: "Standard templates", tr: "Standart şablonlar" }, free: { en: "70+", tr: "70+" }, pro: { en: "All 100", tr: "Tümü (100)" } },
  { label: { en: "Executive & creative templates", tr: "Yönetici ve yaratıcı şablonlar" }, free: false, pro: true },
  { label: { en: "AI rewrite (summary & bullets)", tr: "Yapay zekâ ile yeniden yazım" }, free: false, pro: true },
  { label: { en: "AI cover letter generator", tr: "Yapay zekâ ile ön yazı" }, free: false, pro: true },
  { label: { en: "ATS scoring & analysis", tr: "ATS puanlama ve analiz" }, free: false, pro: true },
  { label: { en: "PDF resolution", tr: "PDF çözünürlüğü" }, free: { en: "Standard", tr: "Standart" }, pro: { en: "High-res (300 DPI)", tr: "Yüksek (300 DPI)" } },
  { label: { en: "Cloud sync", tr: "Bulut senkronizasyonu" }, free: false, pro: true },
  { label: { en: "Email support", tr: "E-posta desteği" }, free: { en: "Standard", tr: "Standart" }, pro: { en: "Priority", tr: "Öncelikli" } },
];

type Faq = { q: PlanFeature; a: PlanFeature };

const faqs: Faq[] = [
  {
    q: { en: "Can I really start for free?", tr: "Gerçekten ücretsiz başlayabilir miyim?" },
    a: {
      en: "Yes — no credit card required. The Basic plan lets you build and export one résumé and one cover letter using 70+ standard templates. You only need Pro if you want unlimited exports, AI rewrites, or premium templates.",
      tr: "Evet — kredi kartı gerekmez. Basic plan, 70+ standart şablonla bir CV ve bir ön yazı hazırlayıp dışa aktarmanıza olanak tanır. Sınırsız çıktı, yapay zekâ ile yeniden yazım veya premium şablonlar istiyorsanız Pro'ya geçmeniz gerekir.",
    },
  },
  {
    q: { en: "When am I charged? Can I cancel?", tr: "Ne zaman ücret alınır? İptal edebilir miyim?" },
    a: {
      en: "Pro is billed monthly or yearly on the day you subscribe and renews automatically until you cancel. You can cancel anytime from your dashboard or the Stripe customer portal — Pro features stay active until the end of the period you've already paid for, and no charge is made for the next period.",
      tr: "Pro, abone olduğunuz günden itibaren aylık veya yıllık olarak faturalandırılır ve siz iptal edene kadar otomatik olarak yenilenir. Panonuzdan veya Stripe müşteri portalından istediğiniz zaman iptal edebilirsiniz — Pro özellikleri ödediğiniz dönemin sonuna kadar açık kalır ve bir sonraki dönem için ücret tahsil edilmez.",
    },
  },
  {
    q: { en: "What's the difference between standard and premium templates?", tr: "Standart ve premium şablonlar arasındaki fark nedir?" },
    a: {
      en: "Standard templates (70 designs) cover modern, classic and minimal styles — fully ATS-friendly. Premium templates (30 designs) add executive layouts for senior leadership and creative layouts for designers.",
      tr: "Standart şablonlar (70 tasarım) modern, klasik ve minimal stilleri kapsar — tamamen ATS uyumludur. Premium şablonlar (30 tasarım) üst düzey yöneticiler için yönetici düzenleri ve tasarımcılar için yaratıcı düzenler sunar.",
    },
  },
  {
    q: { en: "Are my drafts safe if I don't sign up?", tr: "Kayıt olmazsam taslaklarım güvende mi?" },
    a: {
      en: "Drafts autosave locally in your browser, so you can come back later without losing work. To sync across devices and back up to the cloud, create a free account.",
      tr: "Taslaklar tarayıcınızda otomatik olarak kaydedilir; çalışmanızı kaybetmeden daha sonra kaldığınız yerden devam edebilirsiniz. Cihazlar arası senkronizasyon ve bulut yedeklemesi için ücretsiz bir hesap oluşturun.",
    },
  },
  {
    q: { en: "Do you offer refunds?", tr: "İade yapıyor musunuz?" },
    a: {
      en: "Pro is a digital service with immediate access, so refunds aren't offered after purchase. Cancel anytime to stop future billing. Full details on the Refund Policy page.",
      tr: "Pro, anında erişim sağlanan dijital bir hizmettir; bu nedenle satın alma sonrası iade yapılmaz. Sonraki dönem faturalandırmasını durdurmak için istediğiniz zaman iptal edebilirsiniz. Detaylar İade Politikası sayfasında.",
    },
  },
  {
    q: { en: "Will my data be used to train AI?", tr: "Verilerim yapay zekâ eğitimi için kullanılır mı?" },
    a: {
      en: "No. Your résumé content is processed only to deliver the features you request (AI rewrite, cover letter generation, ATS scoring). It is never used to train external models.",
      tr: "Hayır. CV içeriğiniz yalnızca talep ettiğiniz özellikleri (yapay zekâ ile yeniden yazım, ön yazı oluşturma, ATS puanlama) sunmak için işlenir. Hiçbir zaman dış modellerin eğitimi için kullanılmaz.",
    },
  },
];

export default function PricingPage() {
  const { lang, setLang } = useI18n();
  const l: Lang = lang === "tr" ? "tr" : "en";
  const c = copy[l];
  const [yearly, setYearly] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden noise-paper text-ink-deep">
      {/* Editorial masthead */}
      <header className="relative z-40">
        <div className="border-b border-ink-deep/15">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
            <Link href="/" className="hover:text-saffron">← {c.home}</Link>
            <span className="font-serif italic normal-case tracking-normal text-saffron">— Subscription rates —</span>
            <button onClick={() => setLang(l === "en" ? "tr" : "en")} className="font-edit font-bold hover:text-saffron">
              {l === "en" ? "TR" : "EN"}
            </button>
          </div>
        </div>
        <div className="border-b-[3px] border-ink-deep">
          <div className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-4 md:px-12">
            <Link href="/" className="block">
              <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
              <p className="font-serif text-3xl text-ink-deep md:text-4xl">
                CV <em className="italic text-saffron">with</em> AI
              </p>
            </Link>
            <Link href="/signup" className="hidden bg-ink-deep px-5 py-2.5 font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron sm:inline-flex">
              {c.startFree} →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="font-serif text-sm italic text-saffron">{c.badge}</p>
        <h1 className="headline-editorial mx-auto mt-3 max-w-3xl text-[48px] sm:text-[72px] md:text-[96px]">
          Simple, <em>honest</em><br />pricing.
        </h1>
        <p className="font-serif mx-auto mt-6 max-w-xl text-lg italic leading-snug text-ink-soft">{c.subtitle}</p>

        <div className="mt-10 inline-flex items-center border-2 border-ink-deep">
          <button
            className={`px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${!yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
            onClick={() => setYearly(false)}
            type="button"
          >
            {c.monthly}
          </button>
          <div className="h-8 w-px bg-ink-deep" />
          <button
            className={`flex items-center gap-2 px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
            onClick={() => setYearly(true)}
            type="button"
          >
            {c.yearly}
            <span className={`px-1.5 py-0.5 text-[9px] ${yearly ? "bg-saffron text-paper-soft" : "bg-saffron text-paper-soft"}`}>
              {c.save}
            </span>
          </button>
        </div>
      </section>

      {/* Plan cards */}
      <section className="mx-auto max-w-5xl px-6 pb-20 md:px-12">
        <div className="grid border-2 border-ink-deep md:grid-cols-2">
          {/* Basic */}
          <article className="flex flex-col border-b-2 border-ink-deep bg-paper-soft p-8 md:border-b-0 md:border-r-2 md:p-10">
            <p className="font-serif text-sm italic text-saffron">{c.freeTagline}</p>
            <h2 className="headline-editorial mt-2 text-[44px] text-ink-deep">{c.free}</h2>

            <div className="mt-5 flex items-baseline gap-2 border-y border-ink-deep/25 py-4">
              <span className="font-serif text-[56px] leading-none text-ink-deep">€0</span>
              <span className="font-serif text-sm italic text-ink-soft">forever</span>
            </div>

            <p className="font-serif mt-4 text-sm italic text-ink-soft">
              {l === "tr" ? "Standart şablonlarla ilk CV'nizi hazırlamak için ideal." : "Perfect for getting your first résumé out using standard templates."}
            </p>

            <ul className="my-8 flex-1 space-y-2 text-ink-soft">
              {freeFeatures.map((f) => (
                <li key={f.en} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-2">
                  <span className="font-serif text-base italic text-saffron">✓</span>
                  <span className="font-serif text-[16px]">{f[l]}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-ink-deep px-6 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] text-paper-soft transition hover:bg-saffron"
            >
              {c.startFree} <span className="font-serif text-base italic">→</span>
            </Link>
          </article>

          {/* Pro */}
          <article className="relative flex flex-col bg-ink-deep p-8 text-paper-soft md:p-10">
            <div className="absolute -top-px right-6 bg-saffron px-3 py-1 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft">
              {c.recommended}
            </div>
            <p className="font-serif text-sm italic text-saffron-bright">{c.proTagline}</p>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="headline-editorial text-[44px]" style={{ color: "var(--paper-soft)" }}>{c.pro}</h2>
              <span className="bg-saffron px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-paper-soft">
                {c.discountBadge}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2 border-y border-paper-soft/25 py-4">
              <span className="font-serif text-2xl italic text-paper-soft/40 line-through decoration-saffron-bright decoration-2">
                {yearly ? "€4.20" : "€6"}
              </span>
              <span className="font-serif text-[56px] leading-none text-paper-soft">{yearly ? "€2.10" : "€3"}</span>
              <span className="font-serif text-sm italic text-paper-soft/60">{yearly ? c.perMonthBilled("€25.20") : c.perMonth}</span>
            </div>

            <p className="font-serif mt-4 text-sm italic text-paper-soft/65">
              {l === "tr" ? "Sınırsız çıktı ve yapay zekâ editörü — mülakatı gerçekten kazanmak için." : "Unlimited exports plus the AI editor — to actually win interviews."}
            </p>

            <p className="mt-5 font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-saffron-bright">
              {c.everythingBasic}
            </p>
            <ul className="my-6 flex-1 space-y-2 text-paper-soft/85">
              {proFeatures.map((f) => (
                <li key={f.en} className="flex items-baseline gap-3 border-b border-paper-soft/15 py-2">
                  <span className="font-serif text-base italic text-saffron-bright">✓</span>
                  <span className="font-serif text-[16px]">{f[l]}</span>
                </li>
              ))}
            </ul>

            <PaymentButton
              price={yearly ? "25.20" : "3"}
              plan={yearly ? "yearly" : "monthly"}
              className="inline-flex items-center justify-center gap-2 bg-saffron px-6 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep"
            >
              {c.getPro} <span className="font-serif text-base italic">→</span>
            </PaymentButton>
          </article>
        </div>

        <p className="mt-6 text-center font-serif text-xs italic text-ink-soft">
          All prices in EUR. Cancel anytime. The Basic plan stays free, no card required.
        </p>
      </section>

      {/* Comparison table */}
      <section className="border-y-2 border-ink-deep bg-paper-soft py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <p className="font-serif text-sm italic text-saffron">— A side-by-side reading —</p>
            <h2 className="headline-editorial mt-2 text-[40px] md:text-[60px]">{c.compareTitle}</h2>
            <p className="font-serif mt-3 text-base italic text-ink-soft">{c.compareSub}</p>
          </div>

          <div className="border-2 border-ink-deep">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-ink-deep bg-paper-warm">
                  <th className="w-1/2 px-6 py-3 text-left font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                    {l === "tr" ? "Özellik" : "Feature"}
                  </th>
                  <th className="w-1/4 px-6 py-3 text-center font-serif text-sm italic text-ink-soft">
                    {c.free}
                  </th>
                  <th className="w-1/4 px-6 py-3 text-center font-serif text-sm italic text-saffron">
                    {c.pro}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.label.en} className={`border-t border-ink-deep/20 ${i % 2 === 1 ? "bg-paper-warm/40" : ""}`}>
                    <td className="px-6 py-3 font-serif text-[15px] text-ink-deep">{row.label[l]}</td>
                    <td className="px-6 py-3 text-center font-serif text-sm text-ink-soft">
                      <CellValue value={row.free} lang={l} />
                    </td>
                    <td className="px-6 py-3 text-center font-serif text-sm font-semibold text-ink-deep">
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
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <div className="mb-10 text-center">
            <p className="font-serif text-sm italic text-saffron">No. 06 — Letters</p>
            <h2 className="headline-editorial mt-2 text-[40px] md:text-[60px]">{c.faqTitle}</h2>
            <p className="font-serif mt-2 text-base italic text-ink-soft">{c.faqSub}</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q.en} marker={(i + 1).toString().padStart(2, "0")} q={faq.q[l]} a={faq.a[l]} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t-2 border-ink-deep bg-paper-deep py-20 text-paper-soft">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="font-serif text-sm italic text-saffron-bright">— The final word —</p>
          <h2 className="headline-editorial mt-3 text-[40px] md:text-[64px]" style={{ color: "var(--paper-soft)" }}>
            {c.ctaTitle.split(" ").slice(0, -2).join(" ")}{" "}
            <em style={{ color: "var(--saffron-bright)" }}>
              {c.ctaTitle.split(" ").slice(-2).join(" ")}
            </em>
          </h2>
          <p className="font-serif mt-4 text-lg italic text-paper-soft/65">{c.ctaSub}</p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-saffron px-8 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep"
            >
              {c.ctaButton} <span className="font-serif text-base italic">→</span>
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center border-2 border-paper-soft/40 px-8 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep"
            >
              {l === "tr" ? "Şablonları gör" : "Browse the anthology"}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-ink-deep bg-paper py-10 noise-paper">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-6 font-serif text-xs italic text-ink-soft md:flex-row md:justify-between md:px-12">
          <p>© 2026 CV with AI · The Resumé Press</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="hover:text-saffron" href="/privacy">{l === "tr" ? "Gizlilik" : "Privacy"}</Link>
            <Link className="hover:text-saffron" href="/terms">{l === "tr" ? "Şartlar" : "Terms"}</Link>
            <Link className="hover:text-saffron" href="/refund">{l === "tr" ? "İade" : "Refund"}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function CellValue({ value, lang, highlight = false }: { value: PlanFeature | boolean; lang: Lang; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className={`font-serif text-base italic ${highlight ? "text-saffron" : "text-saffron"}`}>✓</span>
    ) : (
      <span className="text-ink-quiet">—</span>
    );
  }
  return <span className={highlight ? "font-semibold text-ink-deep" : ""}>{value[lang]}</span>;
}

function FaqItem({ marker, q, a }: { marker: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-2 transition-all ${open ? "border-ink-deep" : "border-ink-deep/30"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-baseline justify-between gap-4 px-6 py-5 text-left transition ${open ? "bg-paper-warm" : "bg-paper-soft"}`}
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-3">
          <span className="font-serif text-base italic text-saffron">{marker}</span>
          <span className="font-serif text-[18px] text-ink-deep">{q}</span>
        </span>
        <span className={`font-serif text-2xl italic text-saffron transition ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="border-t border-ink-deep/30 bg-paper-soft px-6 py-5">
          <p className="font-serif text-[15px] italic leading-snug text-ink-soft">{a}</p>
        </div>
      )}
    </div>
  );
}
