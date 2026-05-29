"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

const translations = {
  // Sidebar
  "nav.dashboard": { en: "Dashboard", tr: "Kontrol Paneli" },
  "nav.resume": { en: "Resume Builder", tr: "CV Oluşturucu" },
  "nav.templates": { en: "CV Templates", tr: "CV Şablonları" },
  "nav.coverLetter": { en: "Cover Letters", tr: "Ön Yazılar" },
  "nav.signIn": { en: "Sign In", tr: "Giriş Yap" },
  "nav.signOut": { en: "Sign Out", tr: "Çıkış Yap" },
  "nav.darkMode": { en: "Dark Mode", tr: "Karanlık Mod" },
  "nav.lightMode": { en: "Light Mode", tr: "Aydınlık Mod" },

  // Dashboard
  "dashboard.title": { en: "Elevate Your Professional Narrative", tr: "Profesyonel Hikayenizi Yükseltin" },
  "dashboard.subtitle": { en: "Your executive workspace for high-impact resumes and strategic career documents.", tr: "Etkili CV'ler ve stratejik kariyer belgeleri için çalışma alanınız." },
  "dashboard.upgrade": { en: "Upgrade to Pro", tr: "Pro'ya Yükselt" },
  "dashboard.freePlan": { en: "Free Plan", tr: "Ücretsiz Plan" },
  "dashboard.docsUsed": { en: "documents used", tr: "belge kullanıldı" },
  "dashboard.upgradeDesc": { en: "Upgrade to Pro for unlimited resumes, cover letters, and AI-powered features.", tr: "Sınırsız CV, ön yazı ve yapay zeka destekli özellikler için Pro'ya yükseltin." },
  "dashboard.newDoc": { en: "New Professional Document", tr: "Yeni Profesyonel Belge" },
  "dashboard.newDocDesc": { en: "Draft a results-driven resume from scratch or use AI-powered optimization to refine your expertise for the market.", tr: "Sıfırdan sonuç odaklı bir CV oluşturun veya yapay zeka optimizasyonunu kullanın." },
  "dashboard.launchBuilder": { en: "Launch Builder", tr: "Oluşturucuyu Başlat" },
  "dashboard.portfolio": { en: "Portfolio Overview", tr: "Portföy Özeti" },
  "dashboard.documents": { en: "Documents", tr: "Belgeler" },
  "dashboard.resumes": { en: "resumes", tr: "CV" },
  "dashboard.coverLetters": { en: "cover letters", tr: "ön yazı" },
  "dashboard.execPortfolio": { en: "Executive Portfolio", tr: "Profesyonel Portföy" },
  "dashboard.viewDesigns": { en: "View designs", tr: "Tasarımları gör" },
  "dashboard.noDocs": { en: "No documents yet", tr: "Henüz belge yok" },
  "dashboard.createResume": { en: "Create new resume", tr: "Yeni CV oluştur" },
  "dashboard.startDesc": { en: "Begin by creating a new professional resume or selecting a high-fidelity template.", tr: "Yeni bir profesyonel CV oluşturarak veya şablon seçerek başlayın." },
  "dashboard.newResume": { en: "New Resume", tr: "Yeni CV" },
  "dashboard.browseDesigns": { en: "Browse designs", tr: "Tasarımlara göz at" },
  "dashboard.browseDesc": { en: "Explore our gallery of ATS-optimized layouts tailored for various career stages.", tr: "Çeşitli kariyer aşamalarına göre optimize edilmiş şablonlarımızı keşfedin." },

  // Resume Builder
  "resume.title": { en: "New Resume", tr: "Yeni CV" },
  "resume.autosave": { en: "Autosaves locally and syncs to your account when signed in.", tr: "Otomatik olarak kaydedilir ve giriş yaptığınızda hesabınızla senkronize olur." },
  "resume.aiOptimize": { en: "AI-Powered Optimization", tr: "Yapay Zeka Optimizasyonu" },
  "resume.upgradeAi": { en: "Upgrade for AI Features", tr: "Yapay Zeka İçin Yükselt" },
  "resume.profileDetails": { en: "Profile Details", tr: "Profil Bilgileri" },
  "resume.execSummary": { en: "Executive Summary", tr: "Profesyonel Özet" },
  "resume.summaryHint": { en: "A compelling summary captures recruiter attention in seconds.", tr: "Etkileyici bir özet, işe alım uzmanının dikkatini saniyeler içinde çeker." },
  "resume.aiRefineSummary": { en: "AI-Refine Summary", tr: "Yapay Zeka ile İyileştir" },
  "resume.profHistory": { en: "Professional History", tr: "İş Deneyimi" },
  "resume.addRole": { en: "Add Professional Role", tr: "İş Deneyimi Ekle" },
  "resume.academics": { en: "Academic Credentials", tr: "Eğitim Bilgileri" },
  "resume.addEducation": { en: "Add Education Entry", tr: "Eğitim Ekle" },
  "resume.skills": { en: "Core Competencies", tr: "Temel Yetkinlikler" },
  "resume.addSkill": { en: "Add Competency", tr: "Yetkinlik Ekle" },
  "resume.languages": { en: "Languages", tr: "Diller" },
  "resume.addLanguage": { en: "Add", tr: "Ekle" },
  "resume.references": { en: "Reference Materials", tr: "Referans Materyalleri" },
  "resume.addReference": { en: "Add Reference", tr: "Referans Ekle" },
  "resume.share": { en: "Share", tr: "Paylaş" },
  "resume.exportPdf": { en: "Export PDF", tr: "PDF İndir" },
  "resume.exportPdfPro": { en: "Export PDF (Pro)", tr: "PDF İndir (Pro)" },
  "resume.experienceItem": { en: "Experience Item", tr: "Deneyim" },
  "resume.delete": { en: "Delete", tr: "Sil" },
  "resume.roleTitle": { en: "Role Title", tr: "Pozisyon" },
  "resume.company": { en: "Company", tr: "Şirket" },
  "resume.location": { en: "Location", tr: "Konum" },
  "resume.startDate": { en: "Start Date", tr: "Başlangıç Tarihi" },
  "resume.endDate": { en: "End Date", tr: "Bitiş Tarihi" },
  "resume.currentRole": { en: "Current role", tr: "Mevcut pozisyon" },
  "resume.bulletPoints": { en: "Bullet Points", tr: "Maddeler" },
  "resume.aiRefineAchievement": { en: "AI-Refine Achievement", tr: "Yapay Zeka ile İyileştir" },
  "resume.addBullet": { en: "Add Bullet", tr: "Madde Ekle" },
  "resume.school": { en: "School", tr: "Okul" },
  "resume.degree": { en: "Degree", tr: "Bölüm" },
  "resume.firstName": { en: "First Name", tr: "Ad" },
  "resume.lastName": { en: "Last Name", tr: "Soyad" },
  "resume.jobTitle": { en: "Executive Title", tr: "Meslek Ünvanı" },
  "resume.email": { en: "Professional Email", tr: "Profesyonel E-posta" },
  "resume.phone": { en: "Contact Number", tr: "İletişim Numarası" },
  "resume.website": { en: "Professional Portfolio / LinkedIn", tr: "Profesyonel Portföy / LinkedIn" },
  "resume.clearAll": { en: "Clear All", tr: "Tümünü Temizle" },
  "resume.upload": { en: "Upload Reference", tr: "Referans Yükle" },
  "resume.educationItem": { en: "Education Item", tr: "Eğitim" },
  "resume.optimizing": { en: "Optimizing...", tr: "Optimize ediliyor..." },
  "resume.refining": { en: "Refining...", tr: "İyileştiriliyor..." },
  "resume.exporting": { en: "Exporting...", tr: "Dışa aktarılıyor..." },
  "resume.profilePhoto": { en: "Profile Photo", tr: "Profil Fotoğrafı" },
  "resume.uploadHeadshot": { en: "Upload a professional headshot.", tr: "Profesyonel bir fotoğraf yükleyin." },
  "resume.removePhoto": { en: "Remove Photo", tr: "Fotoğrafı Kaldır" },
  "resume.currentLocation": { en: "Current Location", tr: "Mevcut Konum" },

  // Cover Letter
  "coverLetter.gallery": { en: "Cover Letter Gallery", tr: "Ön Yazı Galerisi" },
  "coverLetter.title": { en: "Cover Letter Templates", tr: "Ön Yazı Şablonları" },
  "coverLetter.subtitle": { en: "Choose a professionally designed layout. AI fills it with your resume data — ready to send in seconds.", tr: "Profesyonel bir tasarım seçin. Yapay zeka CV verilerinizle doldurur — saniyeler içinde göndermeye hazır." },
  "coverLetter.aiPowered": { en: "AI-powered.", tr: "Yapay zeka destekli." },
  "coverLetter.aiDesc": { en: "Pulls from your saved resume automatically.", tr: "Kayıtlı CV'nizden otomatik olarak çeker." },
  "coverLetter.aiUpgradeDesc": { en: "Upgrade to Pro to generate cover letters with AI.", tr: "Yapay zeka ile ön yazı oluşturmak için Pro'ya yükseltin." },
  "coverLetter.useTemplate": { en: "Use Template", tr: "Şablonu Kullan" },
  "coverLetter.proFeature": { en: "Pro Feature", tr: "Pro Özelliği" },
  "coverLetter.proDesc": { en: "AI-powered cover letter generation is available for Pro users. Upgrade to create personalized cover letters from your resume data.", tr: "Yapay zeka destekli ön yazı oluşturma Pro kullanıcılar için mevcuttur. CV verilerinizden kişiselleştirilmiş ön yazılar oluşturmak için yükseltin." },
  "coverLetter.upgradePro": { en: "Upgrade to Pro", tr: "Pro'ya Yükselt" },
  "coverLetter.generated": { en: "Generated Cover Letter", tr: "Oluşturulan Ön Yazı" },
  "coverLetter.copyText": { en: "Copy Text", tr: "Metni Kopyala" },

  // Templates
  "templates.badge": { en: "CV Template Gallery", tr: "CV Şablon Galerisi" },
  "templates.title": { en: "Choose a Template", tr: "Bir Şablon Seçin" },
  "templates.useTemplate": { en: "Use Template", tr: "Şablonu Kullan" },
  "templates.tip": { en: "Tip:", tr: "İpucu:" },
  "templates.tipText": { en: "Pick a style now — you can edit content after choosing.", tr: "Şimdi bir stil seçin — içeriği seçtikten sonra düzenleyebilirsiniz." },

  // Auth
  "auth.signIn": { en: "Sign in to your account", tr: "Hesabınıza giriş yapın" },
  "auth.signUp": { en: "Create your account", tr: "Hesabınızı oluşturun" },
  "auth.email": { en: "Email", tr: "E-posta" },
  "auth.password": { en: "Password", tr: "Şifre" },
  "auth.name": { en: "Full Name", tr: "Ad Soyad" },
  "auth.signInBtn": { en: "Sign In", tr: "Giriş Yap" },
  "auth.signUpBtn": { en: "Sign Up", tr: "Kayıt Ol" },
  "auth.googleSignIn": { en: "Sign in with Google", tr: "Google ile giriş yap" },
  "auth.forgotPassword": { en: "Forgot password?", tr: "Şifremi unuttum?" },
  "auth.noAccount": { en: "Don't have an account?", tr: "Hesabınız yok mu?" },
  "auth.hasAccount": { en: "Already have an account?", tr: "Zaten hesabınız var mı?" },
  "auth.signingIn": { en: "Signing in...", tr: "Giriş yapılıyor..." },
  "auth.creating": { en: "Creating account...", tr: "Hesap oluşturuluyor..." },
  "auth.welcomeBack": { en: "Welcome back", tr: "Tekrar hoş geldiniz" },
  "auth.createAccount": { en: "Create account", tr: "Hesap oluştur" },
  "auth.signInContinue": { en: "Sign in to continue building your resume.", tr: "CV'nizi oluşturmaya devam etmek için giriş yapın." },
  "auth.confirmPassword": { en: "Confirm password", tr: "Şifreyi onayla" },
  "auth.rememberMe": { en: "Remember me", tr: "Beni hatırla" },
  "auth.createOne": { en: "Create one", tr: "Hesap oluştur" },
  "auth.googleSignUp": { en: "Sign up with Google", tr: "Google ile kayıt ol" },

  // Auth gates
  "gate.signInResume": { en: "Sign in to build your resume", tr: "CV oluşturmak için giriş yapın" },
  "gate.signInResumeDesc": { en: "Create an account or sign in to start building your professional resume with our AI-powered tools.", tr: "Yapay zeka destekli araçlarımızla profesyonel CV'nizi oluşturmaya başlamak için giriş yapın." },
  "gate.signInCover": { en: "Sign in to create cover letters", tr: "Ön yazı oluşturmak için giriş yapın" },
  "gate.signInCoverDesc": { en: "Create an account or sign in to generate professional cover letters with AI.", tr: "Yapay zeka ile profesyonel ön yazılar oluşturmak için giriş yapın." },
  "gate.signInDashboard": { en: "Sign in to your dashboard", tr: "Kontrol panelinize giriş yapın" },
  "gate.signInDashboardDesc": { en: "Create an account or sign in to access your resume workspace and manage your documents.", tr: "CV çalışma alanınıza erişmek ve belgelerinizi yönetmek için giriş yapın." },
  "gate.signInTemplates": { en: "Sign in to browse templates", tr: "Şablonlara göz atmak için giriş yapın" },
  "gate.signInTemplatesDesc": { en: "Create an account or sign in to choose from 100 professionally designed resume templates.", tr: "100 profesyonel CV şablonu arasından seçim yapmak için giriş yapın." },
  "gate.freeTrialUsed": { en: "You've used your free resume. Sign in or create an account to continue building resumes.", tr: "Ücretsiz CV hakkınızı kullandınız. CV oluşturmaya devam etmek için giriş yapın veya hesap oluşturun." },
  "gate.freeTrialUsedCL": { en: "You've used your free cover letter. Sign in or create an account to continue.", tr: "Ücretsiz ön yazı hakkınızı kullandınız. Devam etmek için giriş yapın veya hesap oluşturun." },
  "gate.upgradeResume": { en: "Upgrade to create more resumes", tr: "Daha fazla CV oluşturmak için yükseltin" },
  "gate.upgradeResumeDesc": { en: "You've used your free resume. Upgrade to Pro to create unlimited resumes with AI-powered optimization.", tr: "Ücretsiz CV hakkınızı kullandınız. Yapay zeka destekli optimizasyonla sınırsız CV oluşturmak için Pro'ya yükseltin." },
  "common.close": { en: "Close", tr: "Kapat" },
  "common.maybeLater": { en: "Maybe later", tr: "Belki sonra" },

  // Forgot / Reset password
  "forgot.title": { en: "Reset your password", tr: "Şifrenizi sıfırlayın" },
  "forgot.desc": { en: "Enter your email and we'll send you a reset link.", tr: "E-postanızı girin, size sıfırlama bağlantısı gönderelim." },
  "forgot.send": { en: "Send Reset Link", tr: "Sıfırlama Bağlantısı Gönder" },
  "forgot.sending": { en: "Sending...", tr: "Gönderiliyor..." },
  "forgot.sent": { en: "If an account exists with that email, we've sent a password reset link.", tr: "Bu e-posta ile bir hesap varsa, şifre sıfırlama bağlantısı gönderdik." },
  "forgot.backToSignIn": { en: "Back to Sign In", tr: "Girişe Dön" },
  "reset.title": { en: "Set new password", tr: "Yeni şifre belirleyin" },
  "reset.newPassword": { en: "New Password", tr: "Yeni Şifre" },
  "reset.confirm": { en: "Confirm Password", tr: "Şifreyi Onayla" },
  "reset.btn": { en: "Reset Password", tr: "Şifreyi Sıfırla" },
  "reset.resetting": { en: "Resetting...", tr: "Sıfırlanıyor..." },

  // AI Helper
  "ai.analyzeResume": { en: "Audit Resume", tr: "CV'yi Analiz Et" },
  "ai.suggestSkills": { en: "Optimize Competencies", tr: "Yetkinlikleri Optimize Et" },
  "ai.generateCover": { en: "Draft Cover Letter", tr: "Ön Yazı Oluştur" },
  "ai.analyzing": { en: "Auditing...", tr: "Analiz ediliyor..." },
  "ai.suggesting": { en: "Optimizing...", tr: "Optimize ediliyor..." },
  "ai.generating": { en: "Drafting...", tr: "Oluşturuluyor..." },
  "ai.optimizing": { en: "Optimizing...", tr: "Optimize ediliyor..." },
  "ai.refining": { en: "Refining...", tr: "İyileştiriliyor..." },
  "ai.addAll": { en: "Integrate All Competencies", tr: "Tüm Yetkinlikleri Ekle" },
  "ai.helper": { en: "AI Helper", tr: "Yapay Zeka Yardımcısı" },

  // Common
  "common.resume": { en: "resume", tr: "CV" },
  "common.coverLetter": { en: "cover letter", tr: "ön yazı" },
  "common.workspace": { en: "Resume workspace", tr: "CV çalışma alanı" },
  "common.previous": { en: "Previous", tr: "Önceki" },
  "common.next": { en: "Next", tr: "Sonraki" },
  "common.continue": { en: "Continue", tr: "Devam" },
  "common.finish": { en: "Finish & Review", tr: "Bitir ve İncele" },
  "common.optional": { en: "Optional", tr: "İsteğe bağlı" },

  // Resume builder — wizard
  "builder.progress": { en: "Progress", tr: "İlerleme" },
  "builder.preview": { en: "Preview", tr: "Önizleme" },
  "builder.viewPreview": { en: "View preview", tr: "Önizlemeyi gör" },
  "builder.hidePreview": { en: "Hide preview", tr: "Önizlemeyi gizle" },

  "step.import": { en: "Import", tr: "İçe Aktar" },
  "step.import.title": { en: "Start with what you already have", tr: "Var olanla başlayın" },
  "step.import.desc": { en: "Upload an old CV, paste from LinkedIn, or skip this step to start from scratch.", tr: "Eski bir CV yükleyin, LinkedIn'den yapıştırın veya sıfırdan başlayın." },
  "step.import.tip": { en: "AI extracts your name, history, skills, and education in a few seconds — saves 20+ minutes of typing.", tr: "Yapay zeka adınızı, geçmişinizi ve yetkinliklerinizi saniyeler içinde çıkarır — 20+ dakika kazandırır." },

  "step.profile": { en: "Profile", tr: "Profil" },
  "step.profile.title": { en: "Your professional identity", tr: "Profesyonel kimliğiniz" },
  "step.profile.desc": { en: "The header information every recruiter sees first. Keep it precise and current.", tr: "İşe alım uzmanlarının ilk gördüğü bilgiler. Net ve güncel tutun." },
  "step.profile.tip": { en: "Use a headshot taken in the last 2 years with neutral background. Avoid group photos or sunglasses.", tr: "Son 2 yıl içinde, sade arka planlı bir fotoğraf kullanın. Grup fotoğrafı veya güneş gözlüğü olmasın." },

  "step.summary": { en: "Summary", tr: "Özet" },
  "step.summary.title": { en: "Your two-sentence elevator pitch", tr: "İki cümlelik tanıtım yazınız" },
  "step.summary.desc": { en: "A tight summary tells recruiters in 5 seconds why you fit. AI can polish it.", tr: "İyi bir özet 5 saniyede neden uygun olduğunuzu anlatır. Yapay zeka cilalayabilir." },
  "step.summary.tip": { en: "Lead with your strongest result (\"Shipped X to Y users\") — vague summaries get skimmed.", tr: "En güçlü sonucunuzla başlayın (\"X'i Y kullanıcıya ulaştırdım\") — belirsiz özetler atlanır." },

  "step.experience": { en: "Experience", tr: "Deneyim" },
  "step.experience.title": { en: "Your professional history", tr: "İş deneyiminiz" },
  "step.experience.desc": { en: "Most recent role first. Each bullet should start with a strong verb and end with a measurable outcome.", tr: "En son pozisyonunuz başta. Her madde güçlü bir fiille başlasın ve ölçülebilir bir sonuçla bitsin." },
  "step.experience.tip": { en: "Numbers beat adjectives. \"Cut p95 latency 38%\" lands better than \"improved performance significantly.\"", tr: "Sayılar sıfatlardan iyidir. \"P95 gecikmeyi %38 azalttım\" \"performansı çok iyileştirdim\"den daha güçlüdür." },

  "step.education": { en: "Education", tr: "Eğitim" },
  "step.education.title": { en: "Academic background", tr: "Akademik geçmiş" },
  "step.education.desc": { en: "Degrees, certifications, and notable coursework that matter for the roles you want.", tr: "Hedeflediğiniz roller için önemli derece ve sertifikalar." },
  "step.education.tip": { en: "Only list a GPA if it's 3.5+ and you're within 3 years of graduating. Otherwise skip it.", tr: "GPA'yı yalnızca 3.5+ ise ve mezuniyetinizden 3 yıl geçmediyse ekleyin. Aksi halde atlayın." },

  "step.skills": { en: "Skills", tr: "Yetkinlikler" },
  "step.skills.title": { en: "Core competencies", tr: "Temel yetkinlikler" },
  "step.skills.desc": { en: "10–20 keywords that match the roles you're targeting. ATS systems scan for these first.", tr: "Hedeflediğiniz rollere uygun 10-20 anahtar kelime. ATS sistemleri önce bunları tarar." },
  "step.skills.tip": { en: "Mix hard skills (tools, frameworks) with role-specific soft skills. Skip the generic ones like \"teamwork.\"", tr: "Teknik becerilerle (araç, framework) role özgü soft skill'leri birleştirin. \"Takım çalışması\" gibi geneller olmasın." },

  "step.languages": { en: "Languages", tr: "Diller" },
  "step.languages.title": { en: "Languages you work in", tr: "Çalıştığınız diller" },
  "step.languages.desc": { en: "Spoken or written. Optional — add when relevant for the role.", tr: "Konuşma veya yazma. İsteğe bağlı — rol için önemliyse ekleyin." },
  "step.languages.tip": { en: "Use clear proficiency labels like Native / Fluent / Conversational. Avoid vague \"intermediate.\"", tr: "Native / Fluent / Conversational gibi net seviyeler kullanın. \"Orta\" gibi belirsiz olmasın." },

  "step.review": { en: "Review", tr: "İncele" },
  "step.review.title": { en: "Final check before export", tr: "Dışa aktarmadan önce son kontrol" },
  "step.review.desc": { en: "Confirm every section is complete and export your polished resume.", tr: "Her bölümün eksiksiz olduğunu doğrulayın ve CV'nizi dışa aktarın." },
  "step.review.tip": { en: "Run \"Audit Resume\" for an AI-powered score with strengths, gaps, and recommendations.", tr: "AI destekli puan, güçlü yönler ve eksikler için \"CV'yi Analiz Et\" çalıştırın." },
  "step.review.complete": { en: "Complete", tr: "Tamam" },
  "step.review.incomplete": { en: "Needs attention", tr: "İlgi bekliyor" },
  "step.review.jumpTo": { en: "Edit", tr: "Düzenle" },
  "step.review.exportReady": { en: "Your resume is ready to export.", tr: "CV'niz dışa aktarmaya hazır." },
  "step.review.finishFirst": { en: "Finish remaining sections for the strongest result.", tr: "En iyi sonuç için kalan bölümleri tamamlayın." },
} as const;

type TranslationKey = keyof typeof translations;

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations[key]?.en || key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "tr" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  function t(key: TranslationKey): string {
    return translations[key]?.[lang] || translations[key]?.en || key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
