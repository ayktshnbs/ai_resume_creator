import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-outline/50 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link className="text-xl font-bold tracking-tight text-ink" href="/">
            CV with AI
          </Link>
          <Link className="text-sm font-bold text-primary hover:underline" href="/">Ana Sayfa</Link>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-16 md:px-10">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">Gizlilik Politikası</h1>
        <p className="mt-2 text-sm text-muted">Son güncelleme: 22 Mayıs 2026</p>

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
      </article>
    </main>
  );
}
