import Link from "next/link";

export const metadata = {
  title: "Abonelik ve İptal Politikası | CV With AI",
  description:
    "CV With AI abonelik, otomatik yenileme ve kullanım koşulları.",
};

const LAST_UPDATED = "22 Mayıs 2026";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-outline/50 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link className="text-xl font-bold tracking-tight text-ink" href="/">
            <span className="text-primary">CV</span> With AI
          </Link>

          <Link
            className="text-sm font-bold text-primary hover:underline"
            href="/"
          >
            Ana Sayfa
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-16 md:px-10">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">
          Abonelik ve İptal Politikası
        </h1>

        <p className="mt-2 text-sm text-muted">
          Son güncelleme: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink/80">
          <section>
            <h2 className="text-xl font-bold text-ink">
              1. Abonelik Süresi
            </h2>

            <p className="mt-3">
              CV With AI üzerinden satın alınan abonelikler, satın alınan paket
              süresi boyunca aktif kalır.
            </p>

            <p className="mt-3">
              Kullanıcı, aktif abonelik süresi boyunca Pro özelliklerden,
              oluşturduğu içeriklerden ve platform hizmetlerinden yararlanmaya
              devam edebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">
              2. Otomatik Yenileme ve İptal
            </h2>

            <p className="mt-3">
              Kullanıcı aboneliğini istediği zaman iptal edebilir.
            </p>

            <p className="mt-3">
              İptal işlemi yalnızca otomatik yenilemeyi durdurur.
            </p>

            <p className="mt-3">
              Mevcut abonelik süresi sona erene kadar Pro erişimi devam eder.
            </p>

            <p className="mt-3">
              Kullanım süresi sona erdiğinde abonelik otomatik olarak
              yenilenmez ve hesap ücretsiz plana geçirilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">
              3. Ücret İadesi Politikası
            </h2>

            <p className="mt-3">
              Satın alınan dijital abonelikler ve hizmetler için ücret iadesi
              yapılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">
              4. Hizmet Kullanımı
            </h2>

            <p className="mt-3">
              Kullanıcı, platformu yürürlükteki yasalara ve kullanım koşullarına
              uygun şekilde kullanmayı kabul eder.
            </p>

            <p className="mt-3">
              Platform kurallarının ihlal edilmesi durumunda hesap erişimi
              geçici veya kalıcı olarak sınırlandırılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">
              5. İletişim
            </h2>

            <p className="mt-3">
              Sorularınız için bizimle aşağıdaki e-posta adresi üzerinden
              iletişime geçebilirsiniz:
            </p>

            <p className="mt-4">
              <a
                href="mailto:info@cv-with-ai.com"
                className="font-semibold text-primary hover:underline"
              >
                info@cv-with-ai.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}