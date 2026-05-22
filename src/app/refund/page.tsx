"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function RefundPage() {
  const { lang, setLang } = useI18n();
  const tr = lang === "tr";

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-outline/50 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link className="text-xl font-bold tracking-tight text-ink" href="/">CV with AI</Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "en" ? "tr" : "en")} className="rounded-xl px-3 py-2 text-sm font-bold text-muted transition hover:bg-surface-soft hover:text-ink">
              {tr ? "EN" : "TR"}
            </button>
            <Link className="text-sm font-bold text-primary hover:underline" href="/">{tr ? "Ana Sayfa" : "Home"}</Link>
          </div>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-16 md:px-10">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">{tr ? "İade ve İptal Koşulları" : "Refund and Cancellation Policy"}</h1>
        <p className="mt-2 text-sm text-muted">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>

        {tr ? (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. İade Politikası</h2>
              <p className="mt-3">
                CV with AI Pro planı dijital bir hizmet olup, satın alma işlemi tamamlandığında
                tüm Pro özelliklere anında erişim sağlanmaktadır. Bu nedenle, satın alma işlemi
                gerçekleştikten sonra <strong>iade yapılmamaktadır</strong>.
              </p>
              <p className="mt-3">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53. maddesi ve Mesafeli
                Sözleşmeler Yönetmeliği&apos;nin 15/ğ maddesi uyarınca, cayma hakkı süresi dolmadan
                önce tüketicinin onayı ile ifasına başlanan dijital içerik ve hizmetlerde cayma
                hakkı kullanılamaz. Satın alma sırasında bu husus onayınıza sunulmaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Abonelik Süresi ve Kullanım</h2>
              <p className="mt-3">
                Pro plan satın aldığınızda, seçtiğiniz plana göre belirlenen süre boyunca
                (aylık veya yıllık) tüm Pro özelliklerden yararlanırsınız:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Aylık plan:</strong> Satın alma tarihinden itibaren 30 gün boyunca aktif</li>
                <li><strong>Yıllık plan:</strong> Satın alma tarihinden itibaren 365 gün boyunca aktif</li>
              </ul>
              <p className="mt-3">
                Abonelik süreniz boyunca sınırsız CV ve ön yazı oluşturma, yapay zeka özellikleri,
                tüm premium şablonlar ve yüksek çözünürlüklü PDF dışa aktarma dahil tüm Pro
                özelliklerden faydalanabilirsiniz.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. Otomatik Yenileme Yoktur</h2>
              <p className="mt-3">
                CV with AI abonelikleri <strong>otomatik olarak yenilenmez</strong>. Abonelik
                süreniz dolduğunda Pro planınız sona erer ve hesabınız otomatik olarak ücretsiz
                plana geçer. Bir sonraki dönem için ücret tahsil edilmez. Pro özelliklere tekrar
                erişmek isterseniz yeni bir satın alma işlemi yapmanız gerekmektedir.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Süre Dolduğunda Ne Olur?</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Hesabınız ücretsiz plana düşürülür</li>
                <li>Daha önce oluşturduğunuz CV&apos;ler ve ön yazılar <strong>silinmez</strong></li>
                <li>Ücretsiz plan limitleri dahilinde (1 CV ve 1 ön yazı, standart şablonlar) erişiminiz devam eder</li>
                <li>Yapay zeka özellikleri ve PDF dışa aktarma gibi Pro özellikler devre dışı kalır</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Teknik Sorunlar</h2>
              <p className="mt-3">
                Ödeme işlemi sırasında teknik bir sorun yaşanması (çift ödeme, işlem hatası vb.)
                durumunda, durumu <strong>info@cv-with-ai.com</strong> adresine bildirmeniz halinde
                sorun en kısa sürede incelenip çözülecektir. Teknik kaynaklı mükerrer ödemeler
                iade edilir.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. İletişim</h2>
              <p className="mt-3">
                Aboneliğiniz ve ödeme işlemleriniz hakkında sorularınız için
                <strong> info@cv-with-ai.com</strong> adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. Refund Policy</h2>
              <p className="mt-3">
                The CV with AI Pro plan is a digital service that provides instant access to all Pro
                features upon purchase. Therefore, <strong>no refunds are issued</strong> after the
                purchase is completed.
              </p>
              <p className="mt-3">
                By completing your purchase, you acknowledge that you are gaining immediate access
                to digital content and agree that the right of withdrawal does not apply.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Subscription Duration and Usage</h2>
              <p className="mt-3">
                When you purchase a Pro plan, you get full access to all Pro features for the
                duration of your selected plan:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Monthly plan:</strong> Active for 30 days from the date of purchase</li>
                <li><strong>Yearly plan:</strong> Active for 365 days from the date of purchase</li>
              </ul>
              <p className="mt-3">
                During your subscription period, you can enjoy unlimited CVs and cover letters,
                AI features, all premium templates, and high-resolution PDF exports.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. No Auto-Renewal</h2>
              <p className="mt-3">
                CV with AI subscriptions <strong>do not auto-renew</strong>. When your subscription
                period ends, your Pro plan expires and your account automatically reverts to the
                free tier. No charges are made for the next period. If you wish to regain access
                to Pro features, you will need to make a new purchase.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. What Happens When Your Plan Expires?</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Your account is downgraded to the free plan</li>
                <li>Previously created CVs and cover letters are <strong>not deleted</strong></li>
                <li>You retain access within free plan limits (1 CV and 1 cover letter, standard templates)</li>
                <li>Pro features such as AI tools and PDF export are disabled</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Technical Issues</h2>
              <p className="mt-3">
                If a technical issue occurs during payment (duplicate charge, transaction error, etc.),
                please contact us at <strong>info@cv-with-ai.com</strong> and the issue will be
                resolved promptly. Duplicate charges caused by technical errors will be refunded.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. Contact</h2>
              <p className="mt-3">
                For questions about your subscription and payments, contact us
                at <strong>info@cv-with-ai.com</strong>.
              </p>
            </section>
          </div>
        )}
      </article>
    </main>
  );
}
