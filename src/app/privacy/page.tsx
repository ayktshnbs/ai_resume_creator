"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { lang, setLang } = useI18n();
  const tr = lang === "tr";

  const sections = tr ? sectionsTr : sectionsEn;

  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      <LegalMasthead lang={lang} setLang={setLang} subtitle={tr ? "— Gizlilik politikası —" : "— Privacy policy —"} />

      <article className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <header className="border-b-[3px] border-ink-deep pb-8">
          <p className="font-serif text-sm italic text-saffron">No. 08 — The Imprint</p>
          <h1 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[80px]">
            Privacy <em>policy</em>.
          </h1>
          <p className="byline mt-4">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>
        </header>

        <p className="font-serif dropcap mt-10 text-[18px] leading-[1.55] text-ink-deep">
          {tr
            ? "Verileriniz, mürekkep gibi — bizim sorumluluğumuz altında, saygıyla muamele edilir. Bu sayfada hangi verileri topladığımızı, ne için kullandığımızı ve haklarınızı düz bir dille anlatıyoruz."
            : "Your data is like ink — handled with care, under our responsibility. This page explains what we collect, why we use it, and the rights you keep — in plain language, the way we'd write any front-page story."}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <LegalSection key={s.title} marker={`§${(i + 1).toString().padStart(2, "0")}`} title={s.title}>
              {s.body}
            </LegalSection>
          ))}
        </div>

        <footer className="mt-16 border-t border-ink-deep/30 pt-6">
          <p className="byline">
            — {tr ? "The Resumé Press · İmtiyaz sahibi" : "The Resumé Press · Imprint"} —
          </p>
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

export function LegalMasthead({ lang, setLang, subtitle }: { lang: string; setLang: (l: "en" | "tr") => void; subtitle: string }) {
  const tr = lang === "tr";
  return (
    <header className="border-b border-ink-deep/15">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
        <Link href="/" className="hover:text-saffron">← {tr ? "Ana sayfa" : "Back to the Press"}</Link>
        <span className="font-serif italic normal-case tracking-normal text-saffron">{subtitle}</span>
        <button onClick={() => setLang(lang === "en" ? "tr" : "en")} className="font-edit font-bold hover:text-saffron">
          {tr ? "EN" : "TR"}
        </button>
      </div>
      <div className="mx-auto flex max-w-[1400px] items-baseline justify-between border-b-2 border-ink-deep px-6 py-3 md:px-12">
        <Link href="/" className="block">
          <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
          <p className="font-serif text-3xl text-ink-deep">
            CV <em className="italic text-saffron">with</em> AI
          </p>
        </Link>
        <p className="hidden font-serif text-xs italic text-ink-soft md:block">VOL. MMXXVI · NO. 01</p>
      </div>
    </header>
  );
}

const sectionsTr = [
  { title: "Genel bilgi", body: (
    <p>
      CV with AI (&quot;biz&quot;, &quot;Platform&quot;) olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
      Bu Gizlilik Politikası, cv-with-ai.com web sitesi üzerinden toplanan, işlenen ve saklanan kişisel verileriniz
      hakkında sizi bilgilendirmek amacıyla hazırlanmıştır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
      kapsamında veri sorumlusu olarak hareket etmekteyiz.
    </p>
  )},
  { title: "Toplanan veriler", body: (
    <>
      <p>Platformumuz aşağıdaki kişisel verileri toplayabilir:</p>
      <ul className="mt-3 list-none space-y-2">
        {[
          ["Kimlik bilgileri", "Ad, soyad, e-posta adresi"],
          ["Hesap bilgileri", "Şifre (şifrelenmiş olarak), Google hesap bağlantısı"],
          ["Özgeçmiş verileri", "İş deneyimleri, eğitim bilgileri, beceriler, iletişim bilgileri ve CV'nize eklediğiniz diğer bilgiler"],
          ["Ödeme bilgileri", "Ödeme işlemleri üçüncü parti ödeme sağlayıcısı aracılığıyla gerçekleştirilir; kredi kartı bilgileriniz tarafımızca saklanmaz"],
          ["Kullanım verileri", "Tarayıcı türü, IP adresi, oturum bilgileri, sayfa görüntüleme istatistikleri"],
          ["Fotoğraf", "CV'nize eklemeyi tercih ettiğiniz profil fotoğrafı"],
        ].map(([k, v]) => (
          <li key={k} className="flex items-baseline gap-3 border-b border-ink-deep/15 pb-2">
            <span className="font-serif text-sm italic text-saffron">·</span>
            <span><em className="not-italic font-semibold text-ink-deep">{k}.</em> {v}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "Verilerin kullanım amaçları", body: (
    <>
      <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
      <ul className="mt-3 list-none space-y-1">
        {[
          "Hesap oluşturma ve yönetimi",
          "CV ve ön yazı oluşturma, düzenleme ve dışa aktarma hizmetlerinin sunulması",
          "Yapay zeka destekli CV iyileştirme önerilerinin sağlanması",
          "Ödeme işlemlerinin gerçekleştirilmesi ve abonelik yönetimi",
          "Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi",
          "Hizmet kalitesinin artırılması ve kullanıcı deneyiminin iyileştirilmesi",
        ].map((t) => (
          <li key={t} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
            <span className="font-serif text-sm italic text-saffron">→</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "Verilerin paylaşılması", body: (
    <p>
      Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımız
      (ödeme altyapısı, hosting, yapay zeka API sağlayıcıları) yalnızca hizmetin sunulması için gerekli olan
      verilere erişebilir ve bu veriler gizlilik sözleşmeleri ile korunmaktadır.
    </p>
  )},
  { title: "Veri saklama ve güvenlik", body: (
    <p>
      Verileriniz şifrelenmiş veritabanlarında saklanmaktadır. Şifreler bcrypt algoritması ile hash&apos;lenir.
      SSL/TLS şifreleme ile veri iletimi güvence altına alınır. Verileriniz hesabınız aktif olduğu sürece
      saklanır; hesap silme talebiniz üzerine 30 gün içinde tüm kişisel verileriniz kalıcı olarak silinir.
    </p>
  )},
  { title: "Çerezler", body: (
    <p>
      Platformumuz oturum yönetimi ve tema tercihi için zorunlu çerezler kullanmaktadır.
      Bu çerezler hizmetin düzgün çalışması için gereklidir. Analitik veya reklam amaçlı
      üçüncü parti çerez kullanılmamaktadır.
    </p>
  )},
  { title: "KVKK kapsamında haklarınız", body: (
    <>
      <p>6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
      <ul className="mt-3 list-none space-y-1">
        {[
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
          "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
          "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
        ].map((t) => (
          <li key={t} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
            <span className="font-serif text-sm italic text-saffron">·</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "İletişim", body: (
    <p>
      Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki talepleriniz için
      bizimle <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em> adresinden iletişime geçebilirsiniz.
    </p>
  )},
];

const sectionsEn = [
  { title: "Overview", body: (
    <p>
      At CV with AI (&quot;we&quot;, &quot;Platform&quot;), we take the protection of your personal data seriously.
      This Privacy Policy explains what data we collect, how we process it, and how it is stored
      through the cv-with-ai.com website.
    </p>
  )},
  { title: "Data we collect", body: (
    <>
      <p>Our platform may collect the following personal data:</p>
      <ul className="mt-3 list-none space-y-2">
        {[
          ["Identity information", "First name, last name, email address"],
          ["Account information", "Password (encrypted), Google account connection"],
          ["Resume data", "Work experience, education, skills, contact details, and other information you add to your CV"],
          ["Payment information", "Payments are processed through a third-party provider; your credit card details are never stored by us"],
          ["Usage data", "Browser type, IP address, session data, page view statistics"],
          ["Photo", "Profile photo you choose to add to your CV"],
        ].map(([k, v]) => (
          <li key={k} className="flex items-baseline gap-3 border-b border-ink-deep/15 pb-2">
            <span className="font-serif text-sm italic text-saffron">·</span>
            <span><em className="not-italic font-semibold text-ink-deep">{k}.</em> {v}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "How we use your data", body: (
    <>
      <p>Your personal data is processed for the following purposes:</p>
      <ul className="mt-3 list-none space-y-1">
        {[
          "Account creation and management",
          "Providing CV and cover letter creation, editing, and export services",
          "Delivering AI-powered CV improvement suggestions",
          "Processing payments and managing subscriptions",
          "Ensuring platform security and preventing misuse",
          "Improving service quality and user experience",
        ].map((t) => (
          <li key={t} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
            <span className="font-serif text-sm italic text-saffron">→</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "Data sharing", body: (
    <p>
      Your personal data is not shared with third parties except as required by law. Our service providers
      (payment infrastructure, hosting, AI API providers) only access the data necessary to deliver the
      service and are bound by confidentiality agreements.
    </p>
  )},
  { title: "Data storage and security", body: (
    <p>
      Your data is stored in encrypted databases. Passwords are hashed using the bcrypt algorithm.
      Data transmission is secured with SSL/TLS encryption. Your data is retained as long as your
      account is active; upon request for account deletion, all personal data is permanently removed
      within 30 days.
    </p>
  )},
  { title: "Cookies", body: (
    <p>
      Our platform uses essential cookies for session management and theme preferences.
      These cookies are necessary for the service to function properly. No third-party
      analytics or advertising cookies are used.
    </p>
  )},
  { title: "Your rights", body: (
    <>
      <p>You have the following rights regarding your personal data:</p>
      <ul className="mt-3 list-none space-y-1">
        {[
          "Request whether your personal data is being processed",
          "Request information about how it is processed",
          "Request correction of inaccurate or incomplete data",
          "Request deletion of your personal data",
          "Object to automated processing that produces adverse results",
        ].map((t) => (
          <li key={t} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
            <span className="font-serif text-sm italic text-saffron">·</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </>
  )},
  { title: "Contact", body: (
    <p>
      For questions about our privacy policy or to exercise your data rights, contact us
      at <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em>.
    </p>
  )},
];
