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
        <h1 className="text-3xl font-bold text-ink md:text-4xl">İade ve Kullanım Koşulları</h1>
        <p className="mt-2 text-sm text-muted">Son güncelleme: 22 Mayıs 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
          <section>
            <h2 className="text-xl font-bold text-ink">1. Genel Politika</h2>
            <p className="mt-3">
              AI CV Builder olarak müşteri memnuniyetini ön planda tutuyoruz. Platformumuzda sunulan hizmetler dijital içerik niteliğinde olup, kullanım hakları ve iade süreçleri aşağıda belirtilen koşullara tabidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">2. Kullanım Hakkı ve Yenileme</h2>
            <p className="mt-3">
              Satın aldığınız paket veya ürün için <strong>otomatik yenileme yapılmaz</strong>. Kullanıcı, satın aldığı ürünü kullanım süresi veya hakkı dolana kadar dilediği gibi kullanmaya devam eder. Ay sonunda veya kullanım dönemi bitiminde kartınızdan otomatik olarak hiçbir ücret tahsil edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">3. İade Koşulları</h2>
            <p className="mt-3">Dijital hizmet söz konusu olduğundan, iade taleplerinin kabul edilebilmesi için aşağıdaki şartların sağlanması gerekmektedir:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Satın alma tarihinden itibaren <strong>14 gün</strong> içinde talepte bulunulmalıdır.</li>
              <li>Hizmetin esaslı şekilde kullanılmamış olması (PDF dışa aktarma, yapay zeka özelliklerinin yoğun kullanımı vb. işlemler yapılmamış olmalıdır).</li>
              <li>İade talebi <a href="mailto:info@cv-with-ai.com" className="text-primary font-medium hover:underline">info@cv-with-ai.com</a> adresine, hesabınıza kayıtlı e-posta üzerinden yazılı olarak iletilmelidir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">4. İade Süreci</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>İade talebiniz ulaştıktan sonra en geç <strong>3 iş günü</strong> içinde değerlendirilir.</li>
              <li>Onaylanan iadeler, ödemenin yapıldığı yönteme <strong>10 iş günü</strong> içinde geri yansıtılır.</li>
              <li>İade gerçekleştiğinde Pro özelliklere erişiminiz durdurulur ve hesabınız ücretsiz plana geçirilir.</li>
              <li>Oluşturduğunuz CV&apos;ler sistemde saklanmaya devam eder, ücretsiz plan limitleri dahilinde erişebilirsiniz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">5. İletişim</h2>
            <p className="mt-3">
              Kullanım haklarınız veya iade süreçleriyle ilgili her türlü sorunuz için <a href="mailto:info@cv-with-ai.com" className="text-primary font-medium hover:underline">info@cv-with-ai.com</a> adresinden bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}