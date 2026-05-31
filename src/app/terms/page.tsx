"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LegalMasthead } from "@/app/privacy/page";

export default function TermsPage() {
  const { lang, setLang } = useI18n();
  const tr = lang === "tr";
  const sections = tr ? sectionsTr : sectionsEn;

  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      <LegalMasthead lang={lang} setLang={setLang} subtitle={tr ? "— Kullanım şartları —" : "— Terms of service —"} />

      <article className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <header className="border-b-[3px] border-ink-deep pb-8">
          <p className="font-serif text-sm italic text-saffron">No. 09 — The House Rules</p>
          <h1 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[80px]">
            Terms of <em>service</em>.
          </h1>
          <p className="byline mt-4">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>
        </header>

        <p className="font-serif dropcap mt-10 text-[18px] leading-[1.55] text-ink-deep">
          {tr
            ? "Yayını okumak için birkaç temel kural. Platformu kullanarak bu şartları kabul etmiş sayılırsınız. Kısa, dürüst, hukuki açıdan eksiksiz."
            : "A few ground rules for using the press. By visiting this platform you agree to the terms below. Short, honest, and complete enough for the lawyers."}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <LegalSection key={s.title} marker={`§${(i + 1).toString().padStart(2, "0")}`} title={s.title}>
              {s.body}
            </LegalSection>
          ))}
        </div>

        <footer className="mt-16 border-t border-ink-deep/30 pt-6">
          <p className="byline">— {tr ? "The Resumé Press · Kullanım şartları" : "The Resumé Press · House rules"} —</p>
        </footer>
      </article>
    </main>
  );
}

function LegalSection({ marker, title, children }: { marker: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 border-b border-ink-deep pb-2">
        <span className="font-serif text-base italic text-saffron">{marker}</span>
        <h2 className="font-serif text-[24px] leading-tight text-ink-deep md:text-[28px]">{title}</h2>
      </div>
      <div className="mt-4 font-serif text-[16px] leading-[1.55] text-ink-soft">{children}</div>
    </section>
  );
}

const bulletList = (items: React.ReactNode[], sym = "·") => (
  <ul className="mt-3 list-none space-y-1">
    {items.map((t, i) => (
      <li key={i} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
        <span className="font-serif text-sm italic text-saffron">{sym}</span>
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

const sectionsTr = [
  { title: "Kabul ve kapsam", body: (
    <p>
      CV with AI platformunu (cv-with-ai.com) kullanarak bu Kullanım Şartları&apos;nı kabul etmiş olursunuz.
      Bu şartlar, platform üzerinden sunulan tüm hizmetleri kapsar. Şartları kabul etmiyorsanız platformu
      kullanmayınız.
    </p>
  )},
  { title: "Hizmet tanımı", body: (
    <>
      <p>CV with AI aşağıdaki hizmetleri sunmaktadır:</p>
      {bulletList([
        "Profesyonel CV (özgeçmiş) oluşturma ve düzenleme",
        "Hazır CV şablonları ile tasarım seçimi",
        "Yapay zeka destekli CV iyileştirme ve yeniden yazma",
        "Ön yazı (cover letter) oluşturma",
        "PDF formatında dışa aktarma",
        "Çoklu CV yönetimi (Pro plan)",
      ])}
    </>
  )},
  { title: "Hesap oluşturma ve güvenlik", body: bulletList([
    "Hesap oluşturmak için geçerli bir e-posta adresi gereklidir",
    "Hesap bilgilerinizin güvenliği sizin sorumluluğunuzdadır",
    "Şifrenizi başkalarıyla paylaşmamalı ve güvenli tutmalısınız",
    "Hesabınızda yetkisiz bir erişim fark ettiğinizde derhal bizimle iletişime geçmelisiniz",
    "Bir kişi yalnızca bir hesap oluşturabilir",
  ])},
  { title: "Ücretsiz ve Pro plan", body: (
    <div className="space-y-3">
      <p><em className="not-italic font-semibold text-ink-deep">Ücretsiz Plan.</em> 1 adet CV ve 1 adet ön yazı, standart şablonlar ve canlı önizleme.</p>
      <p><em className="not-italic font-semibold text-ink-deep">Pro Plan.</em> Sınırsız CV ve ön yazı, yapay zeka özellikleri, tüm premium şablonlar ve yüksek çözünürlüklü PDF dışa aktarma.</p>
    </div>
  )},
  { title: "Ödeme koşulları", body: bulletList([
    "Pro plan ücretleri Euro olarak tahsil edilir",
    "Abonelikler otomatik olarak yenilenmez; süre dolduğunda hesap ücretsiz plana geçer",
    "Fiyat değişiklikleri en az 30 gün önceden bildirilir",
    <>İade koşulları için <Link href="/refund" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">İade Koşulları</Link> sayfamızı inceleyiniz</>,
  ])},
  { title: "Kullanıcı yükümlülükleri", body: (
    <>
      <p>Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
      {bulletList([
        "Doğru ve güncel bilgiler sağlamak",
        "Platformu yasa dışı veya yanıltıcı amaçlarla kullanmamak",
        "Başkalarının kişisel bilgilerini izinsiz olarak platforma yüklememek",
        "Platformun teknik altyapısına zarar verecek eylemlerden kaçınmak",
        "Otomatik bot, scraper veya benzeri araçlarla platforma erişmemek",
        "Platformu tersine mühendislik, kopyalama veya yeniden dağıtım amacıyla kullanmamak",
      ])}
    </>
  )},
  { title: "Fikri mülkiyet", body: bulletList([
    "Platform tasarımı, kodu, şablonları ve markası CV with AI'a aittir",
    "CV'lerinizde yer alan içerik (metin, fotoğraf) tamamen size aittir",
    "Platform üzerinden oluşturduğunuz CV'leri dilediğiniz şekilde kullanabilirsiniz",
    "Şablonların tek başına (CV içeriği olmadan) kopyalanması veya dağıtılması yasaktır",
  ])},
  { title: "Yapay zeka hizmetleri", body: (
    <p>
      Yapay zeka destekli öneriler bilgilendirme amaçlıdır. AI tarafından üretilen içeriklerin doğruluğunu
      kontrol etmek kullanıcının sorumluluğundadır. CV with AI, yapay zeka çıktılarının eksiksiz veya hatasız
      olduğunu garanti etmez.
    </p>
  )},
  { title: "Hizmet değişiklikleri", body: (
    <p>
      CV with AI, platformun özelliklerini, fiyatlandırmasını veya bu kullanım şartlarını önceden bildirimde
      bulunarak değiştirme hakkını saklı tutar. Önemli değişiklikler e-posta yoluyla bildirilir.
    </p>
  )},
  { title: "Sorumluluk sınırlaması", body: (
    <p>
      CV with AI, platformun kesintisiz veya hatasız çalışacağını garanti etmez. Platform &quot;olduğu gibi&quot; sunulmaktadır.
      Azami sorumluluk, son 12 ayda ödediğiniz toplam ücretle sınırlıdır.
    </p>
  )},
  { title: "Uygulanacak hukuk", body: (
    <p>
      Bu Kullanım Şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve
      İcra Daireleri yetkilidir.
    </p>
  )},
  { title: "İletişim", body: (
    <p>
      Kullanım şartlarımız hakkında sorularınız için <em className="not-italic font-semibold text-saffron">info@cv-with-ai.com</em>
      &nbsp;adresinden bizimle iletişime geçebilirsiniz.
    </p>
  )},
];

const sectionsEn = [
  { title: "Acceptance and scope", body: (
    <p>
      By using the CV with AI platform (cv-with-ai.com), you agree to these Terms of Service. These terms cover all
      services offered through the platform. If you do not agree, please do not use the platform.
    </p>
  )},
  { title: "Service description", body: (
    <>
      <p>CV with AI provides the following services:</p>
      {bulletList([
        "Professional CV (resume) creation and editing",
        "Ready-made CV template selection",
        "AI-powered CV improvement and rewriting",
        "Cover letter generation",
        "PDF export",
        "Multiple CV management (Pro plan)",
      ])}
    </>
  )},
  { title: "Account creation and security", body: bulletList([
    "A valid email address is required to create an account",
    "You are responsible for the security of your account credentials",
    "Do not share your password with others",
    "Contact us immediately if you notice unauthorized access to your account",
    "Each person may only create one account",
  ])},
  { title: "Free and Pro plans", body: (
    <div className="space-y-3">
      <p><em className="not-italic font-semibold text-ink-deep">Free Plan.</em> 1 CV and 1 cover letter, standard templates, and live preview.</p>
      <p><em className="not-italic font-semibold text-ink-deep">Pro Plan.</em> Unlimited CVs and cover letters, AI features, all premium templates, and high-resolution PDF export.</p>
    </div>
  )},
  { title: "Payment terms", body: bulletList([
    "Pro plan fees are charged in Euros",
    "Subscriptions do not auto-renew; when expired, the account reverts to the free plan",
    "Price changes will be communicated at least 30 days in advance",
    <>See our <Link href="/refund" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">Refund Policy</Link> for details</>,
  ])},
  { title: "User obligations", body: (
    <>
      <p>By using the platform, you agree to:</p>
      {bulletList([
        "Provide accurate and up-to-date information",
        "Not use the platform for illegal or misleading purposes",
        "Not upload others' personal information without their consent",
        "Avoid actions that could harm the platform's infrastructure",
        "Not access the platform using automated bots, scrapers, or similar tools",
        "Not reverse-engineer, copy, or redistribute the platform",
      ])}
    </>
  )},
  { title: "Intellectual property", body: bulletList([
    "The platform design, code, templates, and brand belong to CV with AI",
    "Content in your CVs (text, photos) is entirely yours",
    "You may use CVs created through the platform in any way you choose",
    "Copying or distributing templates alone (without CV content) is prohibited",
  ])},
  { title: "AI services", body: (
    <p>
      AI-powered suggestions are for informational purposes. It is the user&apos;s responsibility to verify the
      accuracy of AI-generated content. CV with AI does not guarantee that AI outputs are complete or error-free.
    </p>
  )},
  { title: "Service changes", body: (
    <p>
      CV with AI reserves the right to modify the platform&apos;s features, pricing, or these terms of service
      with prior notice. Significant changes will be communicated via email.
    </p>
  )},
  { title: "Limitation of liability", body: (
    <p>
      CV with AI does not guarantee uninterrupted or error-free operation. The platform is provided &quot;as is&quot;.
      Maximum liability is limited to the total amount you paid in the last 12 months.
    </p>
  )},
  { title: "Governing law", body: (
    <p>
      These Terms of Service are governed by the laws of the Republic of Turkey. Istanbul Courts and Enforcement
      Offices have jurisdiction over disputes.
    </p>
  )},
  { title: "Contact", body: (
    <p>
      For questions about our terms of service, contact us at <em className="not-italic font-semibold text-saffron">info@cv-with-ai.com</em>.
    </p>
  )},
];
