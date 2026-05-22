"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-ink md:text-4xl">{tr ? "Kullanım Şartları" : "Terms of Service"}</h1>
        <p className="mt-2 text-sm text-muted">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>

        {tr ? (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. Kabul ve Kapsam</h2>
              <p className="mt-3">
                CV with AI platformunu (cv-with-ai.com) kullanarak bu Kullanım Şartları&apos;nı kabul etmiş olursunuz.
                Bu şartlar, platform üzerinden sunulan tüm hizmetleri kapsar. Şartları kabul etmiyorsanız
                platformu kullanmayınız.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Hizmet Tanımı</h2>
              <p className="mt-3">CV with AI aşağıdaki hizmetleri sunmaktadır:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Profesyonel CV (özgeçmiş) oluşturma ve düzenleme</li>
                <li>Hazır CV şablonları ile tasarım seçimi</li>
                <li>Yapay zeka destekli CV iyileştirme ve yeniden yazma</li>
                <li>Ön yazı (cover letter) oluşturma</li>
                <li>PDF formatında dışa aktarma</li>
                <li>Çoklu CV yönetimi (Pro plan)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. Hesap Oluşturma ve Güvenlik</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Hesap oluşturmak için geçerli bir e-posta adresi gereklidir</li>
                <li>Hesap bilgilerinizin güvenliği sizin sorumluluğunuzdadır</li>
                <li>Şifrenizi başkalarıyla paylaşmamalı ve güvenli tutmalısınız</li>
                <li>Hesabınızda yetkisiz bir erişim fark ettiğinizde derhal bizimle iletişime geçmelisiniz</li>
                <li>Bir kişi yalnızca bir hesap oluşturabilir</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Ücretsiz ve Pro Plan</h2>
              <div className="mt-3 space-y-3">
                <p><strong>Ücretsiz Plan:</strong> 1 adet CV ve 1 adet ön yazı, standart şablonlar ve canlı önizleme özelliklerini içerir.</p>
                <p><strong>Pro Plan:</strong> Sınırsız CV ve ön yazı, yapay zeka özellikleri, tüm premium şablonlar ve yüksek çözünürlüklü PDF dışa aktarma özelliklerini içerir.</p>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Ödeme Koşulları</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Pro plan ücretleri Euro olarak tahsil edilir</li>
                <li>Abonelikler otomatik olarak yenilenmez; süre dolduğunda hesap ücretsiz plana geçer</li>
                <li>Fiyat değişiklikleri en az 30 gün önceden bildirilir</li>
                <li>İade koşulları için <Link href="/refund" className="font-bold text-primary hover:underline">İade Koşulları</Link> sayfamızı inceleyiniz</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. Kullanıcı Yükümlülükleri</h2>
              <p className="mt-3">Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Platformu yasa dışı veya yanıltıcı amaçlarla kullanmamak</li>
                <li>Başkalarının kişisel bilgilerini izinsiz olarak platforma yüklememek</li>
                <li>Platformun teknik altyapısına zarar verecek eylemlerden kaçınmak</li>
                <li>Otomatik bot, scraper veya benzeri araçlarla platforma erişmemek</li>
                <li>Platformu tersine mühendislik, kopyalama veya yeniden dağıtım amacıyla kullanmamak</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">7. Fikri Mülkiyet</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Platform tasarımı, kodu, şablonları ve markası CV with AI&apos;a aittir</li>
                <li>CV&apos;lerinizde yer alan içerik (metin, fotoğraf) tamamen size aittir</li>
                <li>Platform üzerinden oluşturduğunuz CV&apos;leri dilediğiniz şekilde kullanabilirsiniz</li>
                <li>Şablonların tek başına (CV içeriği olmadan) kopyalanması veya dağıtılması yasaktır</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">8. Yapay Zeka Hizmetleri</h2>
              <p className="mt-3">
                Yapay zeka destekli öneriler bilgilendirme amaçlıdır. AI tarafından üretilen içeriklerin
                doğruluğunu kontrol etmek kullanıcının sorumluluğundadır. CV with AI, yapay zeka çıktılarının
                eksiksiz veya hatasız olduğunu garanti etmez.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">9. Hizmet Değişiklikleri</h2>
              <p className="mt-3">
                CV with AI, platformun özelliklerini, fiyatlandırmasını veya bu kullanım şartlarını
                önceden bildirimde bulunarak değiştirme hakkını saklı tutar. Önemli değişiklikler
                e-posta yoluyla bildirilir.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">10. Sorumluluk Sınırlaması</h2>
              <p className="mt-3">
                CV with AI, platformun kesintisiz veya hatasız çalışacağını garanti etmez. Platform
                &quot;olduğu gibi&quot; sunulmaktadır. Azami sorumluluk, son 12 ayda ödediğiniz toplam ücretle sınırlıdır.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">11. Uygulanacak Hukuk</h2>
              <p className="mt-3">
                Bu Kullanım Şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda
                İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">12. İletişim</h2>
              <p className="mt-3">
                Kullanım şartlarımız hakkında sorularınız için <strong>info@cv-with-ai.com</strong> adresinden
                bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. Acceptance and Scope</h2>
              <p className="mt-3">
                By using the CV with AI platform (cv-with-ai.com), you agree to these Terms of Service.
                These terms cover all services offered through the platform. If you do not agree, please
                do not use the platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Service Description</h2>
              <p className="mt-3">CV with AI provides the following services:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Professional CV (resume) creation and editing</li>
                <li>Ready-made CV template selection</li>
                <li>AI-powered CV improvement and rewriting</li>
                <li>Cover letter generation</li>
                <li>PDF export</li>
                <li>Multiple CV management (Pro plan)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. Account Creation and Security</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>A valid email address is required to create an account</li>
                <li>You are responsible for the security of your account credentials</li>
                <li>Do not share your password with others</li>
                <li>Contact us immediately if you notice unauthorized access to your account</li>
                <li>Each person may only create one account</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Free and Pro Plans</h2>
              <div className="mt-3 space-y-3">
                <p><strong>Free Plan:</strong> Includes 1 CV and 1 cover letter, standard templates, and live preview.</p>
                <p><strong>Pro Plan:</strong> Includes unlimited CVs and cover letters, AI features, all premium templates, and high-resolution PDF export.</p>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Payment Terms</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Pro plan fees are charged in Euros</li>
                <li>Subscriptions do not auto-renew; when expired, the account reverts to the free plan</li>
                <li>Price changes will be communicated at least 30 days in advance</li>
                <li>See our <Link href="/refund" className="font-bold text-primary hover:underline">Refund Policy</Link> for details</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. User Obligations</h2>
              <p className="mt-3">By using the platform, you agree to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Provide accurate and up-to-date information</li>
                <li>Not use the platform for illegal or misleading purposes</li>
                <li>Not upload others&apos; personal information without their consent</li>
                <li>Avoid actions that could harm the platform&apos;s infrastructure</li>
                <li>Not access the platform using automated bots, scrapers, or similar tools</li>
                <li>Not reverse-engineer, copy, or redistribute the platform</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">7. Intellectual Property</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>The platform design, code, templates, and brand belong to CV with AI</li>
                <li>Content in your CVs (text, photos) is entirely yours</li>
                <li>You may use CVs created through the platform in any way you choose</li>
                <li>Copying or distributing templates alone (without CV content) is prohibited</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">8. AI Services</h2>
              <p className="mt-3">
                AI-powered suggestions are for informational purposes. It is the user&apos;s responsibility
                to verify the accuracy of AI-generated content. CV with AI does not guarantee that AI
                outputs are complete or error-free.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">9. Service Changes</h2>
              <p className="mt-3">
                CV with AI reserves the right to modify the platform&apos;s features, pricing, or these terms
                of service with prior notice. Significant changes will be communicated via email.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">10. Limitation of Liability</h2>
              <p className="mt-3">
                CV with AI does not guarantee uninterrupted or error-free operation. The platform is
                provided &quot;as is&quot;. Maximum liability is limited to the total amount you paid in the
                last 12 months.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">11. Governing Law</h2>
              <p className="mt-3">
                These Terms of Service are governed by the laws of the Republic of Turkey.
                Istanbul Courts and Enforcement Offices have jurisdiction over disputes.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">12. Contact</h2>
              <p className="mt-3">
                For questions about our terms of service, contact us at <strong>info@cv-with-ai.com</strong>.
              </p>
            </section>
          </div>
        )}
      </article>
    </main>
  );
}
