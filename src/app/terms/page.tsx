import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-ink md:text-4xl">Kullanım Şartları</h1>
        <p className="mt-2 text-sm text-muted">Son güncelleme: 22 Mayıs 2026</p>

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
              <p>
                <strong>Ücretsiz Plan:</strong> 1 adet kayıtlı CV, standart şablonlar ve canlı önizleme
                özelliklerini içerir. Ticari kullanım dahil olmak üzere ücretsizdir.
              </p>
              <p>
                <strong>Pro Plan:</strong> Sınırsız CV ve ön yazı, yapay zeka özellikleri, tüm premium
                şablonlar ve yüksek çözünürlüklü PDF dışa aktarma özelliklerini içerir. Aylık veya
                yıllık abonelik ile kullanılabilir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">5. Ödeme Koşulları</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Pro plan ücretleri Türk Lirası veya ABD Doları olarak tahsil edilir</li>
              <li>Abonelikler otomatik olarak yenilenir; iptal edilmedikçe dönem sonunda ücret tahsil edilir</li>
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
              e-posta yoluyla bildirilir. Değişiklik sonrası platformu kullanmaya devam etmeniz,
              yeni şartları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">10. Sorumluluk Sınırlaması</h2>
            <p className="mt-3">
              CV with AI, platformun kesintisiz veya hatasız çalışacağını garanti etmez. Platform
              &quot;olduğu gibi&quot; sunulmaktadır. Teknik aksaklıklar, veri kaybı veya üçüncü taraf
              hizmetlerinden kaynaklanan sorunlardan dolayı doğrudan veya dolaylı zararlardan
              sorumlu tutulamaz. Azami sorumluluk, son 12 ayda ödediğiniz toplam ücretle sınırlıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">11. Hesap Askıya Alma ve Fesih</h2>
            <p className="mt-3">
              Kullanım şartlarının ihlali durumunda CV with AI hesabınızı uyarı ile veya uyarı olmaksızın
              askıya alabilir veya sonlandırabilir. Hesap sonlandırma durumunda verileriniz 30 gün
              içinde silinir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">12. Uygulanacak Hukuk</h2>
            <p className="mt-3">
              Bu Kullanım Şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda
              İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">13. İletişim</h2>
            <p className="mt-3">
              Kullanım şartlarımız hakkında sorularınız için <strong>info@cv-with-ai.com</strong> adresinden
              bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
