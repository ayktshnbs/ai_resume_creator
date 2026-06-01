"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LegalMasthead } from "@/app/privacy/page";

export default function TermsPage() {
  const { lang, setLang } = useI18n();
  const tr = lang === "tr";
  const sections = tr ? sectionsTr : sectionsEn;

  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      <LegalMasthead lang={lang} setLang={setLang} subtitle={tr ? "— Kullanım şartları —" : "— Terms of service —"} />

      <article className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <header className="border-b-[3px] border-ink-deep pb-8">
          <p className="font-serif text-sm italic text-saffron">No. 09 — The House Rules</p>
          <h1 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[80px]">
            Terms of <em>service</em>.
          </h1>
          <p className="byline mt-4">{tr ? "Son güncelleme: 1 Haziran 2026" : "Last updated: June 1, 2026"}</p>
        </header>

        <p className="font-serif mt-10 text-[18px] leading-[1.55] text-ink-deep">
          {tr
            ? "Yayını okumak için birkaç temel kural. Bu Kullanım Şartları, sizinle CV with AI arasındaki yasal sözleşmeyi düzenler. Platformu kullanarak bu şartları kabul etmiş sayılırsınız. Lütfen dikkatle okuyun; haklarınızı ve yükümlülüklerinizi etkiler."
            : "A few ground rules for using the press. These Terms of Service set out the legal contract between you and CV with AI. By accessing the platform, you agree to be bound by them. Please read carefully — they affect your rights and obligations."}
        </p>

        <div className="mt-8 border-2 border-ink-deep bg-paper-warm/40 p-5 font-serif text-[14px] leading-[1.55] text-ink-deep">
          <p>
            <em className="not-italic font-semibold text-oxblood">{tr ? "Önemli not." : "Important notice."}</em>{" "}
            {tr
              ? "§ 20 ve § 21, bireysel tahkim ve toplu dava feragatini içerir; uyuşmazlıklarınızı nasıl çözeceğinizi etkiler. Türkiye'de veya AB'de ikamet eden tüketicilerin yerel mevzuat uyarınca ek hakları saklıdır."
              : "Sections 20 and 21 contain binding individual arbitration and a class-action waiver — they affect how disputes between us are resolved. If you reside in Turkey or the EU, your statutory consumer rights remain unaffected."}
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <LegalSection key={s.title} marker={`§${(i + 1).toString().padStart(2, "0")}`} title={s.title}>
              {s.body}
            </LegalSection>
          ))}
        </div>

        <footer className="mt-16 border-t border-ink-deep/30 pt-6">
          <p className="byline">— {tr ? "The Resumé Press · Kullanım şartları" : "The Resumé Press · House rules"} —</p>
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

/* ─────────── Turkish ─────────── */

const sectionsTr = [
  { title: "Kabul ve kapsam", body: (
    <>
      <p>
        Bu Kullanım Şartları (&quot;Şartlar&quot;), CV with AI (&quot;biz&quot;, &quot;Sağlayıcı&quot;) ile platforma erişen ya
        da platformu kullanan her kullanıcı (&quot;siz&quot;, &quot;Kullanıcı&quot;) arasındaki yasal sözleşmeyi düzenler.
        Şartlar; cv-with-ai.com web sitesini, mobil uygulamaları, indirilebilir yazılımları, sağladığımız
        içerikleri ve bunların üzerinden sunulan tüm araç ile hizmetleri (hepsi birlikte &quot;Hizmet&quot;) kapsar.
      </p>
      <p className="mt-3">
        Hizmet&apos;e erişerek ya da Hizmet&apos;i kullanarak bu Şartları ve Gizlilik Politikası&apos;nı okuduğunuzu, anladığınızı
        ve bunlarla bağlı kalmayı kabul ettiğinizi beyan etmiş olursunuz. Şartları kabul etmiyorsanız Hizmet&apos;i
        kullanmayı derhâl bırakmalısınız.
      </p>
      <p className="mt-3">
        Hizmet, en az 16 yaşında ya da kendi yargı bölgenizdeki dijital onay yaşının üstünde olan kullanıcılar
        içindir. Hizmet&apos;i kullanarak yasal olarak bağlayıcı bir sözleşme yapma yetkisine sahip olduğunuzu
        beyan edersiniz.
      </p>
    </>
  )},
  { title: "Gizlilik", body: (
    <p>
      Gizliliğiniz bizim için önemlidir. Hangi kişisel verileri topladığımız, nasıl işlediğimiz ve haklarınızın
      neler olduğu hakkında ayrıntılı bilgi için lütfen{" "}
      <Link href="/privacy" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
        Gizlilik Politikası
      </Link>{" "}
      sayfamızı inceleyiniz. Gizlilik Politikası bu Şartlar&apos;a referansla dahil edilmiştir. Hizmet&apos;i kullanarak
      Gizlilik Politikası&apos;nda anlatılan veri uygulamalarına onay vermiş olursunuz.
    </p>
  )},
  { title: "Şartlarda ve Hizmet'te değişiklikler", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">Şartlar.</em> Bu Şartları herhangi bir zamanda
        güncel sürümü siteye yayımlayarak değiştirebiliriz. Önemli değişiklikler, hesabınıza bağlı e-posta
        adresine bildirim göndererek veya panonuzda görünür bir uyarı ile duyurulur. Güncelleme sonrası
        Hizmet&apos;i kullanmaya devam etmeniz, yeni Şartlar&apos;ı kabul ettiğiniz anlamına gelir. Güncel sürümü kabul
        etmiyorsanız Hizmet&apos;i kullanmayı bırakmanız gerekir.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Hizmet.</em> Hizmet&apos;in özelliklerinde, içeriğinde
        veya arayüzünde önceden bildirimde bulunmaksızın değişiklik yapma hakkımız saklıdır. Hizmet&apos;in tamamını
        ya da bir bölümünü dilediğimiz zaman askıya alabilir veya sonlandırabiliriz. Bu tür değişikliklerden
        memnun değilseniz tek çareniz Hizmet&apos;i kullanmayı bırakmaktır.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Ücretli abonelikler.</em> Aboneliğiniz aktif iken
        fiyat değişikliği veya kapsamda önemli bir değişiklik yapacaksak, değişiklik bir sonraki ödeme döneminden
        en az 30 gün önce e-posta yoluyla bildirilir. Değişikliği kabul etmiyorsanız §11 uyarınca aboneliğinizi
        iptal edebilirsiniz.
      </p>
    </>
  )},
  { title: "Hizmet tanımı", body: (
    <>
      <p>CV with AI, profesyonel kariyer belgeleri hazırlamak için tasarlanmış bir platformdur. Sunduğumuz başlıca özellikler:</p>
      {bulletList([
        "Profesyonel CV (özgeçmiş) oluşturma, düzenleme ve yönetme araçları",
        "100&apos;den fazla CV ve ön yazı şablonu",
        "Yapay zekâ destekli yeniden yazım, özet iyileştirme ve içerik önerileri",
        "ATS (başvuru takip sistemi) puanlama ve analiz",
        "Yüksek çözünürlüklü PDF çıktısı",
        "LinkedIn ve PDF dosyalarından içe aktarma",
        "Cihazlar arası bulut senkronizasyonu (yalnızca Pro)",
        "Kayıtlı kullanıcılar için belge depolama",
      ])}
      <p className="mt-3">
        Bazı özellikler tüm bölgelerde veya tüm cihazlarda kullanılamayabilir. Özellikleri, fiyatlandırmayı ve
        ürün kapsamını dilediğimiz zaman ekleyebilir, değiştirebilir veya kaldırabiliriz.
      </p>
    </>
  )},
  { title: "Kullanıcı tipleri", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">a) Ziyaretçiler.</em> Hesap oluşturmadan herkese
        açık sayfaları görüntüleyebilir, bir CV taslağına başlayabilirsiniz. Çalışmalarınız tarayıcınızda yerel
        olarak saklanır; cihaza özeldir ve cihaz değişiminde kaybolabilir. Belge dışa aktarma ve ileri özellikler
        ziyaretçilere kapalıdır.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">b) Kayıtlı Kullanıcılar.</em> Geçerli bir e-posta
        adresiyle ya da Google gibi üçüncü taraf kimlik doğrulama sağlayıcısıyla hesap oluşturabilirsiniz.
        Kayıtlı Kullanıcılar belgelerini bulutta saklayabilir, düzenleyebilir; ücretsiz plan dahilinde 1 CV ve
        1 ön yazı dışa aktarabilir.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">c) Aboneler (Pro).</em> Pro aboneliği satın alan
        kullanıcılar sınırsız CV ve ön yazı, yapay zekâ özellikleri, premium şablonlar ve yüksek çözünürlüklü PDF
        çıktısı dahil tüm Pro özelliklerinden yararlanır. Sunulan özelliklerin ve fiyatların güncel ayrıntıları{" "}
        <Link href="/pricing" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          Fiyatlandırma
        </Link>{" "}
        sayfasında yer alır.
      </p>
    </>
  )},
  { title: "Hesap güvenliği ve kayıt bilgileri", body: (
    <>
      <p>Hesap oluştururken ve Hizmet&apos;i kullanırken aşağıdaki yükümlülükleri kabul edersiniz:</p>
      {bulletList([
        "Doğru, güncel ve eksiksiz kayıt bilgileri sağlamak",
        "Şifrenizi gizli tutmak ve başkalarıyla paylaşmamak",
        "Hesabınızda yetkisiz erişim fark ettiğinizde derhâl bizimle iletişime geçmek (support@cv-with-ai.com)",
        "Hesabınız altında yapılan tüm işlemlerden sorumlu olmak",
        "Bir kişinin en fazla bir hesap açması",
        "Yalnızca kendi adınıza hesap oluşturmak (başkası adına yetki almadan hesap açmamak)",
      ])}
      <p className="mt-3">
        Kayıt bilgilerinizin gerçeğe aykırı, hatalı veya güncel olmadığına ilişkin makul şüphe oluşması, bu
        Şartlar&apos;ın ihlali veya Hizmet&apos;e ya da diğer kullanıcılara zarar verebilecek kullanım hâllerinde hesabınızı
        askıya alma, kullanıcı adınızı değiştirmenizi isteme veya hesabınızı kapatma hakkımız saklıdır.
      </p>
    </>
  )},
  { title: "İçeriğiniz ve bize tanıdığınız lisans", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">Sahiplik sizde kalır.</em> Hizmet üzerinden
        sağladığınız tüm içeriklerin (özgeçmiş bilgileri, iş geçmişi, eğitim bilgileri, beceriler, profil fotoğrafı,
        ön yazı metni dahil her türlü &quot;Kullanıcı İçeriği&quot;) sahibi sizsiniz.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Bize verdiğiniz lisans.</em> Kullanıcı İçeriği&apos;ni
        Hizmet&apos;e sağlayarak; CV with AI&apos;ya, münhasıran Hizmet&apos;i sunmak, sürdürmek, geliştirmek, talep ettiğiniz
        çıktıları üretmek ve yasal yükümlülüklere uymak için, dünya çapında, telifsiz, alt lisanslanabilir, münhasır
        olmayan bir lisans vermiş olursunuz. Bu lisans, içeriğinizi sildiğinizde veya hesabınızı kapattığınızda
        sona erer; yasal saklama yükümlülükleri ve makul iş kayıtları (örn. ödeme kayıtları) bunun istisnasıdır.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Beyanlarınız.</em> Kullanıcı İçeriği&apos;nin sahibi
        olduğunuzu veya kullanma hakkına sahip bulunduğunuzu, içeriğin herhangi bir üçüncü tarafın haklarını
        ihlal etmediğini ve yürürlükteki yasalara uygun olduğunu beyan ve garanti edersiniz.
      </p>
    </>
  )},
  { title: "Kabul edilebilir kullanım politikası", body: (
    <>
      <p>Hizmet&apos;i kullanırken aşağıdaki kurallara uymayı kabul edersiniz. Aşağıdaki eylemler yasaktır:</p>
      {bulletList([
        "Hizmet&apos;i hukuka aykırı, hileli veya yanıltıcı amaçlarla kullanmak",
        "Üçüncü tarafların fikri mülkiyet, gizlilik ya da diğer haklarını ihlal eden içerik yüklemek",
        "Hakaret içeren, taciz edici, müstehcen, ayrımcı veya tehdit edici içerik yayımlamak",
        "Başkalarının kişisel verilerini izinsiz olarak platforma yüklemek",
        "Başka bir kişiyi veya kurumu temsil ediyormuş gibi davranmak ya da kimliği yanıltacak bilgiler sağlamak",
        "Bot, scraper, crawler veya benzeri otomatik araçlarla Hizmet&apos;e izinsiz erişmek",
        "Tersine mühendislik yapmak, Hizmet&apos;in kaynak kodunu çıkarmaya veya kopyalamaya çalışmak",
        "Hizmet&apos;in güvenlik açıklarını izinsiz olarak araştırmak veya test etmek",
        "Hizmet&apos;in normal işleyişine müdahale etmek, sistemi aşırı yüklemek veya hizmet kesintisine yol açmak",
        "Hız sınırlarını, erişim kontrollerini veya ücretli özellik kısıtlamalarını atlatmaya çalışmak",
        "Hizmet&apos;i, bir rakip ürün yaratmak ya da rekabet etmek için kullanmak",
        "Hizmet&apos;i veya çıktılarını yeniden satmak, alt lisanslamak ya da ticari olarak yeniden dağıtmak",
      ])}
      <p className="mt-3">
        Politikanın ihlali, içeriğin kaldırılması, hesabın askıya alınması veya iade yapılmaksızın aboneliğin
        sonlandırılması ile sonuçlanabilir. Şüpheli ihlalleri ilgili kolluk birimlerine bildirme hakkımız saklıdır.
      </p>
    </>
  )},
  { title: "Yapay zekâ ve otomatik araçlar", body: (
    <>
      <p>
        Hizmet; özet yeniden yazımı, madde geliştirme, ön yazı oluşturma ve ATS puanlama gibi özellikleri sunmak
        için yapay zekâ ve makine öğrenimi araçları (üçüncü taraf modeller dahil) kullanır.
      </p>
      <p className="mt-3">
        Aşağıdaki hususları kabul edersiniz:
      </p>
      {bulletList([
        "Yapay zekâ tarafından üretilen içerik bir öneridir; hata, eksiklik veya yanlışlık içerebilir.",
        "Çıktıyı yayımlamadan veya başvuruda kullanmadan önce gözden geçirmek sizin sorumluluğunuzdadır.",
        "Yapay zekâ önerileri profesyonel kariyer, hukuk veya istihdam danışmanlığı yerine geçmez.",
        "Hizmet; mülakat çağrısı, iş teklifi ya da belirli bir ATS başarı oranı gibi sonuçları garanti etmez.",
        "Bakım, üçüncü taraf kesintileri veya teknik sorunlar nedeniyle yapay zekâ özellikleri geçici olarak kullanılamayabilir.",
        "Yapay zekâ özelliklerini dilediğimiz zaman değiştirme, sınırlandırma ya da kaldırma hakkımız saklıdır.",
      ])}
      <p className="mt-3">
        Yapay zekâ araçlarına gönderilen Kullanıcı İçeriği yalnızca talep ettiğiniz özelliği sunmak için işlenir.
        Açık onayınız olmadan içeriğiniz harici yapay zekâ modellerinin eğitiminde kullanılmaz.
      </p>
    </>
  )},
  { title: "Ödemeler ve abonelikler", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">Ücretsiz plan.</em> Basic plan ücretsizdir; ödeme
        bilgisi gerektirmez. Bir CV ve bir ön yazı oluşturup dışa aktarmanıza, standart şablonları kullanmanıza
        olanak tanır.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Pro plan.</em> Pro abonelik, aylık veya yıllık
        olarak Euro cinsinden faturalandırılır. Güncel fiyatlandırma{" "}
        <Link href="/pricing" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          Fiyatlandırma
        </Link>{" "}
        sayfasında yer alır. Ödeme işlemleri ödeme altyapı sağlayıcımız Stripe Payments Europe Ltd. tarafından
        yürütülür; ödeme bilgileriniz bizde saklanmaz.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Otomatik yenileme.</em> Pro abonelikler, siz iptal
        edene kadar her dönem sonunda kayıtlı ödeme yönteminiz üzerinden otomatik olarak yenilenir. Yenileme;
        seçtiğiniz dönem süresiyle (aylık veya yıllık) ve yenileme anındaki geçerli fiyat üzerinden gerçekleşir.
        Yenilemeyi durdurmak için ödeme döneminizin bitiminden önce aboneliğinizi iptal etmeniz gerekir.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Vergiler.</em> Görüntülenen fiyatlar Euro
        cinsindendir ve KDV gibi geçerli vergileri içermeyebilir. Yasal olarak gerekli olduğu durumlarda vergiler
        ödeme aşamasında eklenir. Döviz kuru farkları, kart sağlayıcı ücretleri veya yabancı işlem komisyonları
        kart sağlayıcınız tarafından belirlenir ve sorumluluğumuz dışındadır.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Başarısız ödemeler.</em> Yenileme tarihinde
        ödemenin alınamaması durumunda, Stripe makul aralıklarla tekrar deneyebilir. Birkaç başarısız denemenin
        ardından Pro özellikleri askıya alınır ve hesabınız Ücretsiz plana indirilir.
      </p>
    </>
  )},
  { title: "İptal ve iade", body: (
    <>
      <p>
        Aboneliğinizi dilediğiniz zaman hesap ayarlarınızdan veya Stripe müşteri portalı üzerinden iptal
        edebilirsiniz. İptal ettiğinizde Pro özellikleri, halihazırda ödediğiniz dönemin sonuna kadar etkin
        kalmaya devam eder; bir sonraki dönem için ücret alınmaz.
      </p>
      <p className="mt-3">
        Pro plan, satın alma anında erişim sağlanan dijital bir hizmet olduğundan, 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun&apos;un 53. maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/ğ maddesi uyarınca
        cayma hakkı kapsamı dışındadır. Detaylar için{" "}
        <Link href="/refund" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          İade Politikası
        </Link>{" "}
        sayfasını inceleyiniz.
      </p>
      <p className="mt-3">
        Mükerrer ödeme, ödeme hatası veya tarafımıza atfedilebilir bir teknik sorun nedeniyle yapılan
        haksız tahsilatlar talep üzerine iade edilir. İade taleplerinizi support@cv-with-ai.com adresine
        iletebilirsiniz.
      </p>
    </>
  )},
  { title: "Promosyonlar ve indirimler", body: (
    <p>
      Zaman zaman tanıtım amaçlı indirimler, deneme süreleri veya özel teklifler sunabiliriz. Bu kampanyalara
      ek koşullar uygulanabilir (kampanya süresi, kullanım koşulları, yenileme fiyatı vb.). Promosyon koşulları,
      teklifin sunulduğu sayfada açıkça belirtilir. Tanıtım indirimleri yalnızca ilk fatura döneminde geçerlidir;
      sonraki yenilemeler tam fiyat üzerinden gerçekleşir.
    </p>
  )},
  { title: "Fikri mülkiyet", body: (
    <>
      <p>
        Kullanıcı İçeriği dışında Hizmet&apos;teki tüm tasarımlar, kodlar, şablonlar, marka unsurları, logolar,
        görseller, metinler, yazılım ve diğer materyaller (&quot;Materyaller&quot;) CV with AI&apos;a veya lisans verenlerine
        aittir ve telif hakkı, marka, ticari sır ve diğer fikri mülkiyet kanunlarıyla korunmaktadır.
      </p>
      <p className="mt-3">
        Hizmet&apos;i kullanmanız size yalnızca kişisel ve ticari olmayan amaçla, devredilemez ve münhasır olmayan bir
        kullanım hakkı verir. Materyalleri önceden yazılı izin almaksızın kopyalayamaz, çoğaltamaz, yeniden
        yayımlayamaz, dağıtamaz, satamaz veya yeni eserler oluşturmak için kullanamazsınız. Şablonların tek başına
        (CV içeriği olmadan) kopyalanması veya dağıtılması yasaktır.
      </p>
      <p className="mt-3">
        Hizmet üzerinden oluşturduğunuz CV ve ön yazı dosyalarını iş başvuruları ve benzeri kişisel amaçlarla
        özgürce kullanabilirsiniz. CV&apos;lerinizin içinde yer alan kişisel içerik (metin, fotoğraf) tamamen size
        aittir.
      </p>
    </>
  )},
  { title: "Materyallerin kullanımı", body: (
    <p>
      Hizmet&apos;te görüntülenen materyalleri ve içerikleri yalnızca kişisel, ticari olmayan amaçlarla
      indirebilir, kopyalayabilir veya görüntüleyebilirsiniz. Bu izin, tüm telif hakkı ve mülkiyet bildirimlerini
      korumanıza bağlıdır. Hizmet üzerindeki herhangi bir yazılımı tersine mühendisliğe tabi tutmak, derlenmiş
      kodu çözmek veya parçalarına ayırmak yasaktır. Daha fazla bilgi için Kabul Edilebilir Kullanım Politikamızı
      (§8) inceleyiniz.
    </p>
  )},
  { title: "Üçüncü taraf hizmetler ve bağlantılar", body: (
    <>
      <p>
        Hizmet; Google (kimlik doğrulama), Stripe (ödeme), e-posta sağlayıcıları, barındırma ortakları ve yapay
        zekâ API sağlayıcıları gibi üçüncü taraf hizmetlerle entegre çalışabilir veya bu hizmetlere bağlantılar
        içerebilir. Bu üçüncü tarafların gizlilik politikaları ve kullanım koşulları kendi bağlayıcı sözleşmelerine
        tabidir; kullanmadan önce ilgili belgeleri incelemenizi öneririz.
      </p>
      <p className="mt-3">
        Üçüncü taraf web sitelerine veya hizmetlerine yönlendiren bağlantıların varlığı, bunları onayladığımız
        anlamına gelmez. Üçüncü taraf hizmetlerinin doğruluğu, güvenliği veya kullanılabilirliği konusunda
        sorumluluk kabul etmiyoruz. Üçüncü taraflarla yaptığınız her türlü işlem yalnızca sizinle ilgili tarafı
        bağlar.
      </p>
    </>
  )},
  { title: "Garanti reddi", body: (
    <>
      <p>
        Hizmet, &quot;OLDUĞU GİBİ&quot; ve &quot;MEVCUT OLDUĞU ŞEKİLDE&quot; sunulmaktadır. Yürürlükteki yasaların izin verdiği azami
        ölçüde, ticari elverişlilik, belirli bir amaca uygunluk ve ihlal etmeme dahil ancak bunlarla sınırlı
        olmamak üzere, açık veya zımni tüm garantileri reddederiz.
      </p>
      <p className="mt-3">
        Hizmet&apos;in kesintisiz, hatasız, güvenli veya virüssüz olduğunu; sonuçların ihtiyaçlarınızı karşılayacağını;
        veya AI çıktılarının doğru, eksiksiz ya da güvenilir olduğunu garanti etmiyoruz. Hizmet kullanımı kendi
        sorumluluğunuzdadır.
      </p>
    </>
  )},
  { title: "Sorumluluk sınırlaması", body: (
    <>
      <p>
        Yürürlükteki yasaların izin verdiği azami ölçüde, CV with AI ve bağlı şirketleri, yetkilileri,
        çalışanları ve temsilcileri; Hizmet&apos;in kullanımı veya kullanılamamasından doğan dolaylı, arızi, özel,
        cezai veya sonuçsal zararlardan (kâr, veri veya itibar kaybı dahil) sorumlu tutulamaz.
      </p>
      <p className="mt-3">
        Yürürlükteki yasalar çerçevesinde, herhangi bir taleple ilgili toplam azami sorumluluğumuz; talebe konu
        olayın ortaya çıktığı andan önceki 12 ay içinde Hizmet karşılığında bize ödediğiniz toplam tutarla
        sınırlıdır. Ücretsiz plan kullanıcıları için bu sınır 50 Euro&apos;dur.
      </p>
      <p className="mt-3">
        Yürürlükteki yasa, ağır ihmal, kasıt veya ölüm/bedensel zarara ilişkin sorumluluğun sınırlanmasına izin
        vermiyorsa, bu sınırlamalar söz konusu durumlar için geçerli olmaz.
      </p>
    </>
  )},
  { title: "Tazmin", body: (
    <p>
      Yürürlükteki yasalar çerçevesinde, bu Şartlar&apos;ı ihlaliniz, Hizmet&apos;e yüklediğiniz Kullanıcı İçeriği veya
      hesabınızın kullanımından kaynaklanan ya da bunlarla ilgili her türlü talep, dava, masraf, zarar ve
      avukatlık ücretine karşı CV with AI&apos;yı ve bağlı tüzel kişilerini, çalışanlarını, yetkililerini ve
      temsilcilerini tazmin etmeyi ve zarardan korumayı kabul edersiniz.
    </p>
  )},
  { title: "Soruşturma ve uygulama", body: (
    <p>
      Bu Şartlar&apos;ın ihlalinden şüphelenilmesi durumunda araştırma yapma; hesabınızı askıya alma; içeriğinizi
      kaldırma; ve gerektiğinde kolluk birimlerine bilgi sunma hakkımız saklıdır. Hizmet&apos;i kullanmaya devam ederek
      bu Şartlar&apos;ın uygulanmasına yönelik yapacağımız makul soruşturma ve eylemlere onay verirsiniz.
    </p>
  )},
  { title: "Geçerli hukuk ve yargı yeri", body: (
    <>
      <p>
        Bu Şartlar, Türkiye Cumhuriyeti kanunlarına tabidir ve bu kanunlar uyarınca yorumlanır. §20&apos;de
        belirtilen tahkim hükümleri saklı kalmak kaydıyla, bu Şartlar&apos;dan kaynaklanan veya bunlarla bağlantılı
        uyuşmazlıklarda İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleri münhasır yetkilidir.
      </p>
      <p className="mt-3">
        Türkiye&apos;de ikamet eden tüketiciler, parasal sınırların altında kalan uyuşmazlıklarını ikamet ettikleri
        yerin Tüketici Hakem Heyeti&apos;ne taşıma hakkına sahiptir. AB&apos;de ikamet eden tüketiciler, ec.europa.eu/consumers/odr
        adresindeki AB Online Uyuşmazlık Çözüm Platformu&apos;nu kullanabilir.
      </p>
    </>
  )},
  { title: "Uyuşmazlık çözümü ve tahkim", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-oxblood">Lütfen dikkatlice okuyun — bu bölüm yasal
        haklarınızı etkiler.</em>
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">a) Resmi olmayan çözüm.</em> Bir uyuşmazlık veya
        talep iletmek isterseniz, önce support@cv-with-ai.com adresine yazılı bildirim göndererek meseleyi 60 gün
        içinde dostane şekilde çözmeye çalışmamızı kabul edersiniz. Tahkim veya dava başlatmadan önce bu
        bildirimi göndermek zorunludur.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">b) Bireysel tahkim.</em> Yürürlükteki yasaların
        izin verdiği ölçüde, taraflar bu Şartlar&apos;dan kaynaklanan veya bunlarla bağlantılı uyuşmazlıkları —
        küçük tüketici talepleri ve aşağıdaki istisnalar hariç — İstanbul Tahkim Merkezi (İSTAC) Tahkim Kuralları
        uyarınca tek hakemli, bağlayıcı ve nihai tahkim yoluyla çözmeyi kabul eder. Tahkim dili Türkçedir;
        tahkim yeri İstanbul&apos;dur.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">c) İstisnalar.</em> Aşağıdaki uyuşmazlıklar tahkim
        kapsamı dışındadır ve yetkili mahkemede çözülür: (i) küçük talep mahkemesinin yargı yetkisindeki bireysel
        talepler; (ii) yalnızca ihtiyati tedbir (geçici hukuki koruma) talep edilen davalar; (iii) fikri mülkiyet
        uyuşmazlıkları.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">d) Toplu dava feragati.</em> Yürürlükteki yasaların
        izin verdiği ölçüde, taraflar her türlü uyuşmazlığı yalnızca bireysel olarak ileri sürmeyi; toplu dava,
        grup tahkimi veya temsil davası olarak ileri sürmemeyi kabul eder. Hakem, birden fazla kişinin taleplerini
        birleştiremez. Bu feragat hükmü, yerel yasalar uyarınca geçerli olmadığı ölçüde uygulanmaz.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">e) Tahkimden vazgeçme hakkı.</em> Bu maddenin
        ilk kabulünden itibaren 30 gün içinde, yazılı bildirim göndererek tahkim ve toplu dava feragati
        hükümlerine bağlı kalmamayı tercih edebilirsiniz. Vazgeçme bildirimi support@cv-with-ai.com adresine
        gönderilmelidir.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">f) Tüketici hakları saklıdır.</em> Türkiye&apos;de
        veya AB&apos;de ikamet eden tüketicilerin yerel mevzuat uyarınca sahip olduğu zorunlu haklara halel gelmez.
        Bu Şartlar&apos;daki tahkim hükümleri, tüketici mevzuatı tarafından açıkça yasaklanan ölçüde uygulanmaz.
      </p>
    </>
  )},
  { title: "AB ve Birleşik Krallık tüketici hakları", body: (
    <>
      <p>
        Avrupa Birliği veya Birleşik Krallık&apos;ta ikamet eden tüketici iseniz, GDPR/UK GDPR ve ulusal tüketici
        koruma mevzuatından kaynaklanan haklarınız saklıdır. Bu haklar arasında:
      </p>
      {bulletList([
        "Veri erişim, düzeltme, silme ve taşınabilirlik hakları",
        "Otomatik karar verme ve profillemeye itiraz etme hakkı",
        "AB Online Uyuşmazlık Çözüm Platformu&apos;na (ec.europa.eu/consumers/odr) başvurma hakkı",
        "Yerel tüketici koruma kurumlarına şikayet etme hakkı",
      ])}
      <p className="mt-3">
        AB Tüketici Hakları Direktifi uyarınca dijital içerik satın alımlarında 14 günlük cayma hakkına
        sahipsiniz. Ancak Pro aboneliği satın alma sırasında, Hizmet&apos;e anında erişim talep ettiğinizi ve cayma
        hakkınızdan feragat ettiğinizi açıkça onaylarsınız; bu onay sonrası cayma hakkı kullanılamaz.
      </p>
    </>
  )},
  { title: "Elektronik iletişim", body: (
    <p>
      Hizmet&apos;i kullanarak sizinle elektronik yollarla (e-posta, panonuzdaki bildirimler, sistem mesajları)
      iletişim kurmamıza onay vermiş olursunuz. Tarafımızca elektronik olarak iletilen tüm bildirimler, şartlar,
      sözleşmeler ve diğer iletişimler; yazılı olarak iletilmiş gibi yasal bağlayıcılığa sahiptir. Bu hüküm,
      yürürlükteki yasalardan kaynaklanan haklarınızı etkilemez.
    </p>
  )},
  { title: "Genel hükümler", body: (
    <>
      <p>
        Bu Şartların herhangi bir hükmünün geçersiz veya uygulanamaz bulunması durumunda, diğer hükümlerin
        geçerliliği etkilenmez; geçersiz hüküm, en yakın geçerli yorumla yer değiştirir.
      </p>
      <p className="mt-3">
        Bu Şartlar; sizin ile aramızdaki konuyla ilgili tüm anlaşmayı temsil eder ve aynı konudaki tüm
        önceki anlaşmaların yerine geçer. Bu Şartlar&apos;ı herhangi bir hak veya yükümlülüğümüz konusunda
        kullanmamamız, söz konusu haktan feragat ettiğimiz anlamına gelmez. Şartlar&apos;ı, kendi takdirimize bağlı
        olarak bir kuruluş birleşmesi veya devir hâlinde devredebiliriz; siz haklarınızı bizim önceden yazılı
        onayımız olmadan devredemezsiniz.
      </p>
    </>
  )},
  { title: "İletişim", body: (
    <p>
      Bu Kullanım Şartları hakkında sorularınız, talepleriniz veya yasal bildirimler için
      bizimle <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em> adresinden
      iletişime geçebilirsiniz. Önceki Şartlar sürümünün bir kopyasını istemek için aynı adrese yazabilirsiniz.
    </p>
  )},
];

/* ─────────── English ─────────── */

const sectionsEn = [
  { title: "Acceptance and scope", body: (
    <>
      <p>
        These Terms of Service (the &quot;Terms&quot;) set forth the legal contract between CV with AI (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot;
        or the &quot;Provider&quot;) and each individual or entity (&quot;you,&quot; &quot;User,&quot; or &quot;your&quot;) regarding access to and
        use of the website at cv-with-ai.com, our mobile applications, downloadable software, materials, and any
        services provided through them (collectively, the &quot;Service&quot;).
      </p>
      <p className="mt-3">
        By accessing or using any part of the Service, you confirm that you have read, understood, and agree to be
        bound by these Terms and our Privacy Policy. If you do not agree, please stop using the Service immediately.
      </p>
      <p className="mt-3">
        The Service is intended for users aged 16 or older, or the minimum age of digital consent in your
        jurisdiction, whichever is higher. By using the Service, you represent that you have the legal capacity
        to enter into a binding contract.
      </p>
    </>
  )},
  { title: "Privacy", body: (
    <p>
      Your privacy matters to us. Please review our{" "}
      <Link href="/privacy" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
        Privacy Policy
      </Link>{" "}
      for full details on what personal data we collect, how we process it, and your rights. The Privacy Policy
      is incorporated by reference into these Terms. By using the Service, you consent to the data practices
      described in the Privacy Policy.
    </p>
  )},
  { title: "Modifications to the terms and the service", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">Terms.</em> We may update these Terms at any time
        by posting the revised version on the Site. Material changes will be communicated by email to the address
        on file or by a visible notice on the dashboard. Your continued use of the Service after such changes
        constitutes acceptance of the updated Terms. If you do not agree, you must discontinue use of the Service.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Service.</em> We reserve the right to modify, add,
        suspend, or discontinue features of the Service at any time without prior notice. If you object to any
        change, your sole remedy is to stop using the Service.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Paid subscriptions.</em> If you are an active
        Subscriber and we change the price or substantially change the features included in your plan, we will
        notify you by email at least 30 days before the change takes effect on your next billing date. You may
        cancel under §11 if you do not agree.
      </p>
    </>
  )},
  { title: "Service description", body: (
    <>
      <p>CV with AI is a platform for building professional career documents. We provide:</p>
      {bulletList([
        "Professional CV (résumé) creation, editing, and management tools",
        "A library of 100+ CV and cover letter templates",
        "AI-powered rewriting, summary refinement, and content suggestions",
        "ATS (applicant tracking system) scoring and analysis",
        "High-resolution PDF export",
        "Import from LinkedIn and existing PDF/DOCX files",
        "Cross-device cloud sync (Pro only)",
        "Document storage for registered users",
      ])}
      <p className="mt-3">
        Some features may not be available in all locations or on all devices. We may add, modify, or
        discontinue features, pricing, or product scope at any time.
      </p>
    </>
  )},
  { title: "User accounts: visitors, registered users, subscribers", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">a) Visitors.</em> You may browse public pages and
        start a CV draft without an account. Drafts are saved locally in your browser, are tied to that device,
        and may be lost if you switch devices. Document export and advanced features are unavailable to visitors.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">b) Registered Users.</em> You may create an
        account using a valid email address or via a third-party authentication provider such as Google.
        Registered Users can save and edit documents in the cloud, and may export 1 CV and 1 cover letter under
        the free plan.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">c) Subscribers (Pro).</em> Users who purchase a
        Pro subscription gain access to unlimited CVs and cover letters, AI features, premium templates, and
        high-resolution PDF export. The current features and pricing are listed on the{" "}
        <Link href="/pricing" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          Pricing
        </Link>{" "}
        page.
      </p>
    </>
  )},
  { title: "Account security and registration", body: (
    <>
      <p>When creating an account and using the Service, you agree to:</p>
      {bulletList([
        "Provide accurate, current, and complete registration information",
        "Keep your password confidential and not share it",
        "Notify us immediately of any unauthorized access at support@cv-with-ai.com",
        "Take responsibility for all activity under your account",
        "Maintain only one account per person",
        "Register only for yourself (not on behalf of another person without authorization)",
      ])}
      <p className="mt-3">
        We reserve the right to suspend or terminate your account, request a username change, or refuse service
        if we have reasonable grounds to believe that registration information is untrue, that these Terms have
        been violated, or that your use could harm the Service or other users.
      </p>
    </>
  )},
  { title: "Your content and license to us", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">You keep ownership.</em> You retain ownership of
        all content you provide through the Service (your &quot;User Content&quot;), including your résumé data, work
        history, education, skills, profile photo, cover letter text, and any other information you submit.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">License you grant us.</em> By providing User
        Content through the Service, you grant CV with AI a worldwide, royalty-free, non-exclusive,
        sublicensable license to host, store, copy, transmit, display, and process your User Content solely to:
        (i) operate, maintain, and improve the Service; (ii) generate the AI-assisted suggestions you request;
        (iii) produce the exports and outputs you ask for; and (iv) comply with legal obligations. This license
        ends when you delete your content or close your account, except where retention is required by law or for
        reasonable business records (e.g. payment history).
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Your representations.</em> You represent and
        warrant that you own or have the right to use your User Content, that it does not infringe the rights of
        any third party, and that it complies with applicable laws.
      </p>
    </>
  )},
  { title: "Acceptable use policy", body: (
    <>
      <p>By using the Service, you agree that you will NOT:</p>
      {bulletList([
        "Use the Service for any unlawful, fraudulent, or misleading purpose",
        "Upload content that infringes the intellectual property, privacy, or other rights of third parties",
        "Upload defamatory, harassing, obscene, hateful, discriminatory, or threatening content",
        "Upload another person&apos;s personal data without their consent",
        "Impersonate any person or entity or misrepresent your affiliation",
        "Access the Service via bots, scrapers, crawlers, or other automated means without authorization",
        "Reverse engineer, decompile, disassemble, or attempt to extract the source code of the Service",
        "Probe, scan, or test the Service&apos;s security or vulnerabilities without authorization",
        "Interfere with, overload, or disrupt the Service&apos;s normal operation",
        "Attempt to circumvent rate limits, access controls, or paid feature restrictions",
        "Use the Service to build, train, or operate a competing product",
        "Resell, sublicense, or commercially redistribute the Service or its outputs",
      ])}
      <p className="mt-3">
        Violations may result in content removal, account suspension, or termination of subscription without
        refund. We reserve the right to cooperate with law enforcement and report suspicious activity.
      </p>
    </>
  )},
  { title: "AI and machine learning services", body: (
    <>
      <p>
        The Service uses artificial intelligence and machine learning tools — including third-party AI
        models — to deliver features such as summary rewriting, bullet refinement, cover letter generation,
        and ATS scoring.
      </p>
      <p className="mt-3">You acknowledge and agree that:</p>
      {bulletList([
        "AI-generated content is a suggestion and may contain errors, omissions, or inaccuracies.",
        "It is your responsibility to review AI output before publishing it or using it in an application.",
        "AI suggestions do not constitute professional career, legal, or employment advice.",
        "The Service does not guarantee interview invitations, job offers, or any specific ATS pass-through rate.",
        "AI features may be temporarily unavailable due to maintenance, third-party outages, or technical issues.",
        "We may modify, limit, or discontinue AI features at any time at our discretion.",
      ])}
      <p className="mt-3">
        User Content sent to AI tools is processed only to deliver the feature you requested. We do not use your
        User Content to train external AI models without your explicit consent.
      </p>
    </>
  )},
  { title: "Payments and subscriptions", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-ink-deep">Free plan.</em> The Basic plan is free and
        requires no payment information. It allows you to build and export 1 résumé and 1 cover letter using
        standard templates.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Pro plan.</em> The Pro subscription is billed
        monthly or annually in Euros. Current pricing is shown on the{" "}
        <Link href="/pricing" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          Pricing
        </Link>{" "}
        page. Payments are processed by our third-party payment provider, Stripe Payments Europe Ltd.; your
        card details are not stored on our servers.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Auto-renewal.</em> Pro subscriptions renew
        automatically at the end of each billing period (monthly or annually) using the payment method on file,
        until you cancel. Renewal occurs at the then-current price for the selected term. To stop renewal, you
        must cancel before the end of your current billing period.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Taxes and fees.</em> Prices displayed are in Euros
        and may not include applicable taxes such as VAT, where required by law. Applicable taxes will be added
        at checkout. Foreign exchange fees, card issuer charges, or international transaction fees are set by
        your card provider and are outside our control.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">Failed payments.</em> If renewal fails, Stripe
        may retry the charge at reasonable intervals. After repeated failures, Pro features will be suspended
        and the account will be downgraded to the Free plan.
      </p>
    </>
  )},
  { title: "Cancellations and refunds", body: (
    <>
      <p>
        You may cancel your subscription at any time from your account settings or through the Stripe customer
        portal. After cancellation, Pro features remain active until the end of the period you have already
        paid for; you will not be charged again for the next period.
      </p>
      <p className="mt-3">
        Pro is a digital service with immediate access. Because access begins as soon as you subscribe, refunds
        are not issued after purchase. By subscribing, you expressly consent to immediate execution and
        acknowledge that the right of withdrawal does not apply. See our{" "}
        <Link href="/refund" className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep">
          Refund Policy
        </Link>{" "}
        for full details.
      </p>
      <p className="mt-3">
        Duplicate charges, payment errors, or technical issues attributable to us will be refunded upon request.
        Contact support@cv-with-ai.com for refund inquiries.
      </p>
    </>
  )},
  { title: "Promotional offers and discounts", body: (
    <p>
      We may offer promotional discounts, trials, or special offers from time to time. Promotional terms
      (duration, eligibility, renewal price) are described on the offer page. Unless otherwise stated,
      promotional discounts apply only to the first billing period; subsequent renewals are charged at the
      regular rate.
    </p>
  )},
  { title: "Intellectual property", body: (
    <>
      <p>
        Other than your User Content, all designs, code, templates, logos, brand elements, images, text,
        software, and other materials available through the Service (collectively, &quot;Materials&quot;) are owned by
        CV with AI or its licensors and are protected by copyright, trademark, trade secret, and other
        intellectual property laws.
      </p>
      <p className="mt-3">
        Your use of the Service grants you only a personal, non-commercial, non-transferable, non-exclusive
        right to access and use the Materials as needed to use the Service. You may not copy, reproduce,
        republish, distribute, sell, or create derivative works based on the Materials without our prior
        written permission. Copying or distributing templates alone (without CV content) is prohibited.
      </p>
      <p className="mt-3">
        You may freely use CVs and cover letters you create through the Service for personal job applications
        and similar purposes. Content within your CV (text, photos) belongs entirely to you.
      </p>
    </>
  )},
  { title: "Use of materials", body: (
    <p>
      You may download, copy, or display Materials and content for personal, non-commercial use only, provided
      you keep all copyright and proprietary notices intact. You may not decompile, reverse-engineer, or
      disassemble any software accessed through the Service. See our Acceptable Use Policy (§8) for further
      restrictions.
    </p>
  )},
  { title: "Third-party services and links", body: (
    <>
      <p>
        The Service integrates with or links to third-party services, such as Google (authentication),
        Stripe (payments), hosting providers, email infrastructure, and AI API providers. These third-party
        services are governed by their own terms and privacy policies, which we recommend you review before
        using.
      </p>
      <p className="mt-3">
        Links to third-party websites or services do not imply endorsement. We are not responsible for the
        availability, accuracy, security, or content of third-party services. Any transactions with third
        parties are solely between you and the third party.
      </p>
    </>
  )},
  { title: "Disclaimer of warranties", body: (
    <>
      <p>
        The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind. To the maximum
        extent permitted by law, we disclaim all warranties, express or implied, including but not limited to
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>
      <p className="mt-3">
        We do not warrant that the Service will be uninterrupted, error-free, secure, or virus-free; that the
        results will meet your expectations; or that AI outputs are accurate, complete, or reliable. Use of the
        Service is at your own risk.
      </p>
    </>
  )},
  { title: "Limitation of liability", body: (
    <>
      <p>
        To the maximum extent permitted by law, CV with AI and its affiliates, officers, employees, and agents
        shall not be liable for any indirect, incidental, special, punitive, or consequential damages
        (including loss of profits, data, or goodwill) arising from your use of or inability to use the Service.
      </p>
      <p className="mt-3">
        Our total aggregate liability for any claim shall not exceed the amount you paid us for the Service
        during the 12 months before the event giving rise to the claim. For free plan users, this limit is
        capped at EUR 50.
      </p>
      <p className="mt-3">
        These limitations do not apply where applicable law prohibits the limitation of liability for gross
        negligence, intentional misconduct, or death/personal injury.
      </p>
    </>
  )},
  { title: "Indemnity", body: (
    <p>
      To the extent permitted by applicable law, you agree to indemnify and hold harmless CV with AI and its
      officers, directors, employees, agents, and affiliates from any claims, demands, liabilities, costs, or
      expenses (including reasonable legal fees) arising out of or related to your breach of these Terms, your
      User Content, or your use of your account.
    </p>
  )},
  { title: "Investigations and enforcement", body: (
    <p>
      We reserve the right to investigate suspected violations of these Terms; to suspend or terminate accounts;
      to remove User Content; and to cooperate with law enforcement authorities or court orders. By continuing
      to use the Service, you consent to reasonable enforcement actions and investigations conducted in
      accordance with these Terms.
    </p>
  )},
  { title: "Governing law and jurisdiction", body: (
    <>
      <p>
        These Terms are governed by and construed under the laws of the Republic of Turkey. Subject to the
        arbitration provisions in §20, the Istanbul Central (Çağlayan) Courts and Enforcement Offices have
        exclusive jurisdiction over any disputes arising out of or related to these Terms.
      </p>
      <p className="mt-3">
        Consumers residing in Turkey may bring small-claims disputes to their local Consumer Arbitration
        Committee (Tüketici Hakem Heyeti) under applicable monetary limits. Consumers residing in the EU may
        use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr.
      </p>
    </>
  )},
  { title: "Dispute resolution and arbitration", body: (
    <>
      <p>
        <em className="not-italic font-semibold text-oxblood">Please read carefully — this section affects
        your legal rights.</em>
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">a) Informal resolution.</em> Before initiating
        arbitration or litigation, you agree to send a written notice describing the dispute to
        support@cv-with-ai.com and to attempt to resolve the matter in good faith over a 60-day period. This
        informal resolution process is a condition precedent to any formal proceeding.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">b) Binding individual arbitration.</em> To the
        extent permitted by law, the parties agree to resolve any dispute arising out of or related to these
        Terms — other than small consumer claims and the exceptions below — by final, binding individual
        arbitration administered by the Istanbul Arbitration Centre (ISTAC) under its Arbitration Rules.
        Arbitration shall be conducted in Turkish or English (at the claimant&apos;s election) by a single arbitrator,
        with the seat of arbitration in Istanbul.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">c) Exceptions.</em> The following disputes are
        excluded from arbitration and may be resolved in a court of competent jurisdiction: (i) individual
        claims within the jurisdictional limits of a small-claims court; (ii) actions seeking only injunctive
        relief; (iii) intellectual property disputes.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">d) Class action waiver.</em> To the extent
        permitted by law, the parties agree to bring any dispute only on an individual basis and not as part of
        any class, consolidated, or representative action. An arbitrator may not consolidate claims of multiple
        persons. This waiver is severable if found unenforceable under applicable law.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">e) Right to opt out.</em> You may opt out of the
        arbitration and class-action waiver by sending written notice to support@cv-with-ai.com within 30 days of
        first accepting these Terms.
      </p>
      <p className="mt-3">
        <em className="not-italic font-semibold text-ink-deep">f) Consumer protections preserved.</em>
        Mandatory consumer rights of residents in Turkey or the EU under local consumer protection law are
        not affected. The arbitration provisions in these Terms do not apply to the extent they are prohibited
        by applicable consumer legislation.
      </p>
    </>
  )},
  { title: "EU and UK consumer rights", body: (
    <>
      <p>
        If you are a consumer residing in the European Union or the United Kingdom, your statutory rights under
        GDPR/UK GDPR and national consumer protection law are preserved. These include:
      </p>
      {bulletList([
        "Rights of access, rectification, erasure, and data portability",
        "The right to object to automated decision-making and profiling",
        "The right to use the EU Online Dispute Resolution platform (ec.europa.eu/consumers/odr)",
        "The right to lodge a complaint with your local consumer protection authority",
      ])}
      <p className="mt-3">
        Under the EU Consumer Rights Directive, you have a 14-day right of withdrawal for digital content
        purchases. However, when purchasing a Pro subscription, you explicitly consent to immediate execution
        and acknowledge that the right of withdrawal no longer applies after such consent.
      </p>
    </>
  )},
  { title: "Electronic communications", body: (
    <p>
      By using the Service, you consent to receive communications from us electronically (via email,
      dashboard notices, and in-product messages). All notices, terms, agreements, and other communications
      sent electronically have the same legal effect as if they were in writing. This does not affect your
      statutory rights.
    </p>
  )},
  { title: "General provisions", body: (
    <>
      <p>
        If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
        will remain in effect, and the invalid provision will be replaced by a valid one most closely matching
        the intent of the original.
      </p>
      <p className="mt-3">
        These Terms represent the entire agreement between you and us on this subject and supersede any prior
        agreements. Our failure to enforce a right or provision is not a waiver of that right. We may assign
        these Terms at our discretion, including in connection with a merger or acquisition; you may not
        assign your rights without our prior written consent.
      </p>
    </>
  )},
  { title: "Contact", body: (
    <p>
      For questions about these Terms, requests, or legal notices, contact us at{" "}
      <em className="not-italic font-semibold text-saffron">support@cv-with-ai.com</em>. To request a copy of a
      previous version of the Terms, write to the same address.
    </p>
  )},
];
