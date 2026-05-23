/**
 * Multi-language labels for CV/resume section headers.
 * These are used in the rendered PDF/preview — not the UI.
 */

export type CvLang =
  | "en"
  | "tr"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "nl"
  | "pl"
  | "sv"
  | "ar"
  | "ja"
  | "zh"
  | "ko"
  | "ru";

export type CvLabels = {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  references: string;
  profile: string;
  contact: string;
  present: string;
};

const labels: Record<CvLang, CvLabels> = {
  en: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    references: "References",
    profile: "Profile",
    contact: "Contact",
    present: "Present",
  },
  tr: {
    summary: "Ozet",
    experience: "Deneyim",
    education: "Egitim",
    skills: "Beceriler",
    languages: "Diller",
    references: "Referanslar",
    profile: "Profil",
    contact: "Iletisim",
    present: "Devam Ediyor",
  },
  de: {
    summary: "Zusammenfassung",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Kenntnisse",
    languages: "Sprachen",
    references: "Referenzen",
    profile: "Profil",
    contact: "Kontakt",
    present: "Heute",
  },
  fr: {
    summary: "Resume",
    experience: "Experience Professionnelle",
    education: "Formation",
    skills: "Competences",
    languages: "Langues",
    references: "References",
    profile: "Profil",
    contact: "Contact",
    present: "Aujourd'hui",
  },
  es: {
    summary: "Resumen",
    experience: "Experiencia Profesional",
    education: "Educacion",
    skills: "Habilidades",
    languages: "Idiomas",
    references: "Referencias",
    profile: "Perfil",
    contact: "Contacto",
    present: "Actualidad",
  },
  it: {
    summary: "Riepilogo",
    experience: "Esperienza Professionale",
    education: "Istruzione",
    skills: "Competenze",
    languages: "Lingue",
    references: "Referenze",
    profile: "Profilo",
    contact: "Contatti",
    present: "Presente",
  },
  pt: {
    summary: "Resumo",
    experience: "Experiencia Profissional",
    education: "Formacao",
    skills: "Competencias",
    languages: "Idiomas",
    references: "Referencias",
    profile: "Perfil",
    contact: "Contacto",
    present: "Presente",
  },
  nl: {
    summary: "Samenvatting",
    experience: "Werkervaring",
    education: "Opleiding",
    skills: "Vaardigheden",
    languages: "Talen",
    references: "Referenties",
    profile: "Profiel",
    contact: "Contact",
    present: "Heden",
  },
  pl: {
    summary: "Podsumowanie",
    experience: "Doswiadczenie Zawodowe",
    education: "Wyksztalcenie",
    skills: "Umiejetnosci",
    languages: "Jezyki",
    references: "Referencje",
    profile: "Profil",
    contact: "Kontakt",
    present: "Obecnie",
  },
  sv: {
    summary: "Sammanfattning",
    experience: "Arbetslivserfarenhet",
    education: "Utbildning",
    skills: "Fardigheter",
    languages: "Sprak",
    references: "Referenser",
    profile: "Profil",
    contact: "Kontakt",
    present: "Nuvarande",
  },
  ar: {
    summary: "ملخص",
    experience: "الخبرة المهنية",
    education: "التعليم",
    skills: "المهارات",
    languages: "اللغات",
    references: "المراجع",
    profile: "الملف الشخصي",
    contact: "الاتصال",
    present: "حاليا",
  },
  ja: {
    summary: "概要",
    experience: "職歴",
    education: "学歴",
    skills: "スキル",
    languages: "言語",
    references: "参照",
    profile: "プロフィール",
    contact: "連絡先",
    present: "現在",
  },
  zh: {
    summary: "摘要",
    experience: "工作经验",
    education: "教育背景",
    skills: "技能",
    languages: "语言",
    references: "参考",
    profile: "个人简介",
    contact: "联系方式",
    present: "至今",
  },
  ko: {
    summary: "요약",
    experience: "경력",
    education: "학력",
    skills: "역량",
    languages: "언어",
    references: "추천인",
    profile: "프로필",
    contact: "연락처",
    present: "현재",
  },
  ru: {
    summary: "О себе",
    experience: "Опыт работы",
    education: "Образование",
    skills: "Навыки",
    languages: "Языки",
    references: "Рекомендации",
    profile: "Профиль",
    contact: "Контакты",
    present: "Настоящее время",
  },
};

/** Human-readable names for the language picker */
export const cvLangNames: Record<CvLang, string> = {
  en: "English",
  tr: "Turkce",
  de: "Deutsch",
  fr: "Francais",
  es: "Espanol",
  it: "Italiano",
  pt: "Portugues",
  nl: "Nederlands",
  pl: "Polski",
  sv: "Svenska",
  ar: "العربية",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ru: "Русский",
};

/** Country flag emojis for the picker */
export const cvLangFlags: Record<CvLang, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  it: "🇮🇹",
  pt: "🇵🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
  sv: "🇸🇪",
  ar: "🇸🇦",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ko: "🇰🇷",
  ru: "🇷🇺",
};

export function getCvLabels(lang: CvLang = "en"): CvLabels {
  return labels[lang] || labels.en;
}

export const cvLangList = Object.keys(labels) as CvLang[];
