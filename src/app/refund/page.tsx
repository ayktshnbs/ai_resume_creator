import Link from "next/link";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-outline/50 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link className="text-xl font-bold tracking-tight text-ink" href="/">
            <span className="text-primary">AI</span> CV Builder
          </Link>
          <Link className="text-sm font-bold text-primary hover:underline" href="/">Ana Sayfa</Link>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-16 md:px-10">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">İade Koşulları</h1>
        <p className="mt-2 text-sm text-muted">Son güncelleme: 22 Mayıs 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
          <section>
            <h2 className="text-xl font-bold text-ink">1. Genel İade Politikası</h2>
            <p className="mt-3">
              CVForge AI olarak müşteri memnuniyetini ön planda tutuyoruz. Pro abonelik planımız için
              aşağıda belirtilen koşullar dahilinde iade hakkı sunmaktayız.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">2. İade Hakkı Süresi</h2>
            <p className="mt-3">
              Pro aboneliğinizi satın aldıktan sonra <strong>14 gün</strong> içinde iade talebinde bulunabilirsiniz.
              Bu süre, 6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un mesafeli sözleşmelere ilişkin
              cayma hakkı düzenlemesiyle uyumludur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">3. İade Koşulları</h2>
            <p className="mt-3">İade talebinizin kabul edilebilmesi için:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Satın alma tarihinden itibaren 14 gün içinde talepte bulunulmalıdır</li>
              <li>İade talebi <strong>info@cv-with-ai.com</strong> adresine yazılı olarak iletilmelidir</li>
              <li>Talep, hesabınıza kayıtlı e-posta adresinden gönderilmelidir</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">4. İade Süreci</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>İade talebiniz en geç <strong>3 iş günü</strong> içinde değerlendirilir</li>
              <li>Onaylanan iadeler, ödemenin yapıldığı yönteme <strong>10 iş günü</strong> içinde iade edilir</li>
              <li>İade sonrası Pro aboneliğiniz iptal edilir ve hesabınız ücretsiz plana düşürülür</li>
              <li>İade işlemi sırasında oluşturduğunuz CV&apos;ler ve ön yazılar silinmez; ücretsiz plan limitleri dahilinde erişiminiz devam eder</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">5. İade Yapılmayan Durumlar</h2>
            <p className="mt-3">Aşağıdaki durumlarda iade talebi kabul edilmez:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>14 günlük cayma süresi dolduktan sonra yapılan talepler</li>
              <li>Hizmetin esaslı şekilde kullanılması (birden fazla PDF dışa aktarma, AI özelliklerinin kapsamlı kullanımı)</li>
              <li>Platform kurallarının ihlali nedeniyle hesabın askıya alınması durumunda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">6. Yıllık Abonelik İadeleri</h2>
            <p className="mt-3">
              Yıllık plan satın alan kullanıcılar için de 14 günlük cayma hakkı geçerlidir.
              14 gün sonrasında yıllık abonelik için kısmi iade yapılmaz; abonelik dönem sonuna
              kadar aktif kalır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">7. Abonelik İptali</h2>
            <p className="mt-3">
              İade talep etmeksizin aboneliğinizi istediğiniz zaman iptal edebilirsiniz.
              İptal sonrası mevcut dönem sonuna kadar Pro özelliklerine erişiminiz devam eder.
              Otomatik yenileme durdurulur ve bir sonraki dönemde ücret tahsil edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">8. İletişim</h2>
            <p className="mt-3">
              İade talepleriniz ve sorularınız için <strong>info@cv-with-ai.com</strong> adresinden
              bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
