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
  "gate.signInTemplatesDesc": { en: "Create an account or sign in to choose from 50+ professionally designed resume templates.", tr: "50'den fazla profesyonel CV şablonu arasından seçim yapmak için giriş yapın." },

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
