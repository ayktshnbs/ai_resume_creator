"use client";

import { useI18n } from "@/lib/i18n";
import { LegalMasthead } from "@/app/privacy/page";

export default function RefundPage() {
  const { lang, setLang } = useI18n();
  const tr = lang === "tr";
  const sections = tr ? sectionsTr : sectionsEn;

  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      <LegalMasthead lang={lang} setLang={setLang} subtitle={tr ? "— İade & iptal —" : "— Refund & cancellation —"} />

      <article className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <header className="border-b-[3px] border-ink-deep pb-8">
          <p className="font-serif text-sm italic text-saffron">No. 10 — The Ledger</p>
          <h1 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[80px]">
            Refund &amp; <em>cancellation</em>.
          </h1>
          <p className="byline mt-4">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>
        </header>

        <p className="font-serif mt-10 text-[18px] leading-[1.55] text-ink-deep">
          {tr
            ? "Abonelik, fatura, iade — kısa açıklamayla. Pro plan dijital bir hizmet, satın aldığınız anda erişim açılıyor; o yüzden iade politikamız belirgin."
            : "Subscription, billing, refunds — in plain prose. The Pro plan is a digital service: access opens the moment you subscribe, so our refund stance is straightforward."}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <LegalSection key={s.title} marker={`§${(i + 1).toString().padStart(2, "0")}`} title={s.title}>
              {s.body}
            </LegalSection>
          ))}
        </div>

        <footer className="mt-16 border-t border-ink-deep/30 pt-6">
          <p className="byline">— {tr ? "The Resumé Press · Mali kayıtlar" : "The Resumé Press · The Ledger"} —</p>
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
  { title: "İade politikası", body: (
    <>
      <p>
        CV with AI Pro planı dijital bir hizmet olup, satın alma işlemi tamamlandığında tüm Pro özelliklere
        anında erişim sağlanmaktadır. Bu nedenle, satın alma işlemi gerçekleştikten sonra
        <em className="not-italic font-semibold text-oxblood"> iade yapılmamaktadır.</em>
      </p>
      <p className="mt-3">
        6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53. maddesi ve Mesafeli Sözleşmeler
        Yönetmeliği&apos;nin 15/ğ maddesi uyarınca, cayma hakkı süresi dolmadan önce tüketicinin onayı ile
        ifasına başlanan dijital içerik ve hizmetlerde cayma hakkı kullanılamaz.
      </p>
    </>
  )},
  { title: "Abonelik süresi ve kullanım", body: (
    <>
      <p>Pro plan satın aldığınızda, seçtiğiniz plana göre belirlenen süre boyunca tüm Pro özelliklerden yararlanırsınız:</p>
      {bulletList([
        <><em className="not-italic font-semibold text-ink-deep">Aylık plan.</em> Satın alma tarihinden itibaren 30 gün</>,
        <><em className="not-italic font-semibold text-ink-deep">Yıllık plan.</em> Satın alma tarihinden itibaren 365 gün</>,
      ])}
      <p className="mt-3">
        Abonelik süreniz boyunca sınırsız CV ve ön yazı oluşturma, yapay zeka özellikleri, tüm premium şablonlar
        ve yüksek çözünürlüklü PDF dışa aktarma dahil tüm Pro özelliklerden faydalanabilirsiniz.
      </p>
    </>
  )},
  { title: "Otomatik yenileme", body: (
    <>
      <p>
        Pro abonelikler, seçtiğiniz fatura dönemi sonunda (aylık veya yıllık) kayıtlı ödeme yönteminiz
        üzerinden <em className="not-italic font-semibold text-ink-deep">otomatik olarak yenilenir.</em> Yenileme,
        o anda geçerli olan fiyat üzerinden gerçekleştirilir. Yenileme öncesinde e-posta ile hatırlatma
        gönderilir.
      </p>
      <p className="mt-3">
        Otomatik yenilemeyi durdurmak için, mevcut fatura döneminin bitiminden önce hesap ayarlarınızdan veya
        Stripe müşteri portalı üzerinden aboneliğinizi iptal etmeniz yeterlidir. İptal sonrası Pro özellikleri,
        ödediğiniz dönemin sonuna kadar açık kalır.
      </p>
    </>
  )},
  { title: "İptal sonrası ne olur?", body: bulletList([
    "Mevcut dönemin sonuna kadar Pro özellikleri kullanılabilir kalır",
    "Bir sonraki dönem için ücret tahsil edilmez",
    "Dönem sonunda hesabınız ücretsiz plana düşürülür",
    "Daha önce oluşturduğunuz CV'ler ve ön yazılar silinmez",
    "Yapay zekâ özellikleri ve yüksek çözünürlüklü PDF gibi Pro özellikler devre dışı kalır",
  ])},
  { title: "Teknik sorunlar", body: (
    <p>
      Ödeme işlemi sırasında teknik bir sorun yaşanması (çift ödeme, işlem hatası vb.) durumunda,
      durumu <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em> adresine bildirmeniz
      halinde sorun en kısa sürede incelenip çözülecektir. Teknik kaynaklı mükerrer ödemeler iade edilir.
    </p>
  )},
  { title: "İletişim", body: (
    <p>
      Aboneliğiniz ve ödeme işlemleriniz hakkında sorularınız için
      <em className="not-italic font-semibold text-saffron"> support@cv-with-ai.com</em> adresinden bizimle iletişime geçebilirsiniz.
    </p>
  )},
];

const sectionsEn = [
  { title: "Refund policy", body: (
    <>
      <p>
        The CV with AI Pro plan is a digital service that provides instant access to all Pro features upon
        purchase. Therefore, <em className="not-italic font-semibold text-oxblood">no refunds are issued</em> after the purchase is completed.
      </p>
      <p className="mt-3">
        By completing your purchase, you acknowledge that you are gaining immediate access to digital content and
        agree that the right of withdrawal does not apply.
      </p>
    </>
  )},
  { title: "Subscription duration and usage", body: (
    <>
      <p>When you purchase a Pro plan, you get full access to all Pro features for the duration of your selected plan:</p>
      {bulletList([
        <><em className="not-italic font-semibold text-ink-deep">Monthly plan.</em> Active for 30 days from the date of purchase</>,
        <><em className="not-italic font-semibold text-ink-deep">Yearly plan.</em> Active for 365 days from the date of purchase</>,
      ])}
      <p className="mt-3">
        During your subscription period, you can enjoy unlimited CVs and cover letters, AI features, all premium
        templates, and high-resolution PDF exports.
      </p>
    </>
  )},
  { title: "Auto-renewal", body: (
    <>
      <p>
        Pro subscriptions <em className="not-italic font-semibold text-ink-deep">renew automatically</em> at the
        end of your billing period (monthly or annually) using the payment method on file. Renewal occurs at
        the then-current price. A reminder email is sent before each renewal.
      </p>
      <p className="mt-3">
        To stop auto-renewal, cancel your subscription from your account settings or through the Stripe
        customer portal before the end of your current billing period. After cancellation, Pro features remain
        active until the end of the period you have already paid for.
      </p>
    </>
  )},
  { title: "What happens after cancellation?", body: bulletList([
    "Pro features stay active until the end of the current period",
    "No charge is made for the next period",
    "At the end of the period, your account is downgraded to the free plan",
    "Previously created CVs and cover letters are not deleted",
    "Pro features such as AI tools and high-resolution PDF export are disabled",
  ])},
  { title: "Technical issues", body: (
    <p>
      If a technical issue occurs during payment (duplicate charge, transaction error, etc.), please contact us
      at <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em> and the issue will be
      resolved promptly. Duplicate charges caused by technical errors will be refunded.
    </p>
  )},
  { title: "Contact", body: (
    <p>
      For questions about your subscription and payments, contact us at
      <em className="not-italic font-semibold text-saffron"> support@cv-with-ai.com</em>.
    </p>
  )},
];
