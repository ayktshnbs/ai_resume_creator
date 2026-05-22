"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-ink md:text-4xl">{tr ? "Gizlilik Politikası" : "Privacy Policy"}</h1>
        <p className="mt-2 text-sm text-muted">{tr ? "Son güncelleme: 22 Mayıs 2026" : "Last updated: May 22, 2026"}</p>

        {tr ? (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. Genel Bilgi</h2>
              <p className="mt-3">
                CV with AI (&quot;biz&quot;, &quot;Platform&quot;) olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
                Bu Gizlilik Politikası, cv-with-ai.com web sitesi üzerinden toplanan, işlenen ve saklanan kişisel verileriniz
                hakkında sizi bilgilendirmek amacıyla hazırlanmıştır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                kapsamında veri sorumlusu olarak hareket etmekteyiz.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Toplanan Veriler</h2>
              <p className="mt-3">Platformumuz aşağıdaki kişisel verileri toplayabilir:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Kimlik bilgileri:</strong> Ad, soyad, e-posta adresi</li>
                <li><strong>Hesap bilgileri:</strong> Şifre (şifrelenmiş olarak), Google hesap bağlantısı</li>
                <li><strong>Özgeçmiş verileri:</strong> İş deneyimleri, eğitim bilgileri, beceriler, iletişim bilgileri ve CV&apos;nize eklediğiniz diğer bilgiler</li>
                <li><strong>Ödeme bilgileri:</strong> Ödeme işlemleri üçüncü parti ödeme sağlayıcısı aracılığıyla gerçekleştirilir; kredi kartı bilgileriniz tarafımızca saklanmaz</li>
                <li><strong>Kullanım verileri:</strong> Tarayıcı türü, IP adresi, oturum bilgileri, sayfa görüntüleme istatistikleri</li>
                <li><strong>Fotoğraf:</strong> CV&apos;nize eklemeyi tercih ettiğiniz profil fotoğrafı</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. Verilerin Kullanım Amaçları</h2>
              <p className="mt-3">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Hesap oluşturma ve yönetimi</li>
                <li>CV ve ön yazı oluşturma, düzenleme ve dışa aktarma hizmetlerinin sunulması</li>
                <li>Yapay zeka destekli CV iyileştirme önerilerinin sağlanması</li>
                <li>Ödeme işlemlerinin gerçekleştirilmesi ve abonelik yönetimi</li>
                <li>Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
                <li>Hizmet kalitesinin artırılması ve kullanıcı deneyiminin iyileştirilmesi</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Verilerin Paylaşılması</h2>
              <p className="mt-3">
                Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımız
                (ödeme altyapısı, hosting, yapay zeka API sağlayıcıları) yalnızca hizmetin sunulması için gerekli olan
                verilere erişebilir ve bu veriler gizlilik sözleşmeleri ile korunmaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Veri Saklama ve Güvenlik</h2>
              <p className="mt-3">
                Verileriniz şifrelenmiş veritabanlarında saklanmaktadır. Şifreler bcrypt algoritması ile hash&apos;lenir.
                SSL/TLS şifreleme ile veri iletimi güvence altına alınır. Verileriniz hesabınız aktif olduğu sürece
                saklanır; hesap silme talebiniz üzerine 30 gün içinde tüm kişisel verileriniz kalıcı olarak silinir.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. Çerezler (Cookies)</h2>
              <p className="mt-3">
                Platformumuz oturum yönetimi ve tema tercihi için zorunlu çerezler kullanmaktadır.
                Bu çerezler hizmetin düzgün çalışması için gereklidir. Analitik veya reklam amaçlı
                üçüncü parti çerez kullanılmamaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">7. KVKK Kapsamında Haklarınız</h2>
              <p className="mt-3">6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">8. İletişim</h2>
              <p className="mt-3">
                Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki talepleriniz için
                bizimle <strong>info@cv-with-ai.com</strong> adresinden iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
            <section>
              <h2 className="text-xl font-bold text-ink">1. Overview</h2>
              <p className="mt-3">
                At CV with AI (&quot;we&quot;, &quot;Platform&quot;), we take the protection of your personal data seriously.
                This Privacy Policy explains what data we collect, how we process it, and how it is stored
                through the cv-with-ai.com website.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Data We Collect</h2>
              <p className="mt-3">Our platform may collect the following personal data:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Identity information:</strong> First name, last name, email address</li>
                <li><strong>Account information:</strong> Password (encrypted), Google account connection</li>
                <li><strong>Resume data:</strong> Work experience, education, skills, contact details, and other information you add to your CV</li>
                <li><strong>Payment information:</strong> Payments are processed through a third-party provider; your credit card details are never stored by us</li>
                <li><strong>Usage data:</strong> Browser type, IP address, session data, page view statistics</li>
                <li><strong>Photo:</strong> Profile photo you choose to add to your CV</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. How We Use Your Data</h2>
              <p className="mt-3">Your personal data is processed for the following purposes:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Account creation and management</li>
                <li>Providing CV and cover letter creation, editing, and export services</li>
                <li>Delivering AI-powered CV improvement suggestions</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Ensuring platform security and preventing misuse</li>
                <li>Improving service quality and user experience</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Data Sharing</h2>
              <p className="mt-3">
                Your personal data is not shared with third parties except as required by law. Our service providers
                (payment infrastructure, hosting, AI API providers) only access the data necessary to deliver the
                service and are bound by confidentiality agreements.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Data Storage and Security</h2>
              <p className="mt-3">
                Your data is stored in encrypted databases. Passwords are hashed using the bcrypt algorithm.
                Data transmission is secured with SSL/TLS encryption. Your data is retained as long as your
                account is active; upon request for account deletion, all personal data is permanently removed
                within 30 days.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. Cookies</h2>
              <p className="mt-3">
                Our platform uses essential cookies for session management and theme preferences.
                These cookies are necessary for the service to function properly. No third-party
                analytics or advertising cookies are used.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">7. Your Rights</h2>
              <p className="mt-3">You have the following rights regarding your personal data:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Request whether your personal data is being processed</li>
                <li>Request information about how it is processed</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to automated processing that produces adverse results</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">8. Contact</h2>
              <p className="mt-3">
                For questions about our privacy policy or to exercise your data rights, contact us
                at <strong>info@cv-with-ai.com</strong>.
              </p>
            </section>
          </div>
        )}
      </article>
    </main>
  );
}
