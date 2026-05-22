import Link from "next/link";

export default function RefundPage() {
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
        <h1 className="text-3xl font-bold text-ink md:text-4xl">İade ve İptal Koşulları</h1>
        <p className="mt-2 text-sm text-muted">Son güncelleme: 22 Mayıs 2026</p>

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
              <li>Ücretsiz plan limitleri dahilinde (1 kayıtlı CV, standart şablonlar) erişiminiz devam eder</li>
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
      </article>
    </main>
  );
}
