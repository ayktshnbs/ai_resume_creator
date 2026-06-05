import { NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";
import { checkProStatus } from "@/lib/pro/check-pro";

type ResumeHelperAction =
  | "improve_summary"
  | "improve_bullet"
  | "suggest_skills"
  | "generate_cover_letter"
  | "analyze_resume"
  | "extract_from_reference";

type ResumeAnalysis = {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  summary: string;
};

type RequestBody = {
  action?: ResumeHelperAction;
  resumeData?: ResumeData;
  text?: string;
  targetRole?: string;
  jobDescription?: string;
};

/**
 * `extract_from_reference` powers the PDF / LinkedIn import flow — which is a
 * free-tier feature per the pricing page — so it must stay open. Every other
 * action is a paid AI helper and requires Pro.
 */
const PRO_ONLY_ACTIONS: ReadonlySet<ResumeHelperAction> = new Set([
  "improve_summary",
  "improve_bullet",
  "suggest_skills",
  "generate_cover_letter",
  "analyze_resume",
]);

// AI is intentionally NOT wired to a live model right now — Pro users get the
// deterministic mock-improve so they see the button do something, but we pay
// zero tokens. To enable real Anthropic calls later, restore the import + call
// path from src/lib/ai/anthropic.ts (kept dormant in the repo).
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const action = body.action;

    if (!action) {
      return NextResponse.json({ error: "Missing action." }, { status: 400 });
    }

    if (PRO_ONLY_ACTIONS.has(action)) {
      const pro = await checkProStatus();
      if (!pro.isPro) {
        return NextResponse.json(
          { error: "Pro subscription required to use AI helpers." },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(mockResponse(action, body));
  } catch (error) {
    console.error("[AI] resume-helper failed:", error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : "Unknown AI error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function safeResume(resume?: ResumeData): ResumeData {
  return {
    firstName: resume?.firstName || "",
    lastName: resume?.lastName || "",
    title: resume?.title || "",
    email: resume?.email || "",
    phone: resume?.phone || "",
    location: resume?.location || "",
    website: resume?.website || "",
    summary: resume?.summary || "",
    experiences: resume?.experiences || [],
    education: resume?.education || [],
    skills: resume?.skills || [],
    languages: resume?.languages || [],
    certificates: resume?.certificates || [],
    references: []
  };
}

function mockResponse(action: ResumeHelperAction, body: RequestBody): { resultText?: string; skills?: string[]; analysis?: ResumeAnalysis; resumeData?: Partial<ResumeData> } {
  const resume = safeResume(body.resumeData);
  const name = `${resume.firstName} ${resume.lastName}`.trim() || "This candidate";
  const role = body.targetRole || resume.title || "the target role";

  if (action === "extract_from_reference") {
    return { resumeData: mockExtract(body.text || "") };
  }

  if (action === "improve_summary") {
    return {
      resultText:
        body.text?.trim()
          ? `${body.text.trim()} Demonstrates clear communication, ownership, and measurable impact while aligning experience with ${role}.`
          : `${name} is a results-driven professional focused on ${role}, combining practical experience, strong communication, and measurable execution.`
    };
  }

  if (action === "improve_bullet") {
    return {
      resultText: body.text?.trim()
        ? `Improved ${body.text.trim().replace(/[.!]$/g, "")} by applying structured execution, stakeholder communication, and outcome-focused delivery.`
        : "Delivered measurable improvements by coordinating priorities, improving processes, and supporting business outcomes."
    };
  }

  if (action === "suggest_skills") {
    return {
      skills: [
        "Strategic planning",
        "Stakeholder communication",
        "Process improvement",
        "Project coordination",
        "Data analysis",
        "Customer experience",
        "Problem solving",
        "Documentation",
        "Team collaboration",
        "Operational reporting"
      ]
    };
  }

  if (action === "generate_cover_letter") {
    return {
      resultText: `I am writing to express my interest in the ${role} position. My background has helped me build strong communication, organization, and problem-solving skills that can support your team's goals.

In my previous experience, I have focused on understanding needs, improving workflows, and delivering reliable results. I am especially motivated by roles where I can combine practical execution with clear, professional communication.

I would welcome the opportunity to discuss how my experience can contribute to your organization.`
    };
  }

  return {
    analysis: {
      score: 78,
      strengths: ["Clear structure", "Relevant sections are present", "Skills can be scanned quickly"],
      gaps: ["Add more measurable achievements", "Strengthen the professional summary", "Tailor keywords to a specific job posting"],
      recommendations: ["Use action verbs in each bullet", "Add numbers where truthful", "Keep the CV to one or two pages"],
      summary: "This CV is a solid draft. It will become stronger with more specific achievements and targeted keywords."
    }
  };
}

/**
 * Fold accents AND the Turkish dotted/dotless I to ASCII for case-insensitive
 * matching. JS lowercases "DENEYİM" to "deneyi̇m" (with a combining dot), so a
 * plain /deneyim/i never matches — which meant Turkish section headers
 * (DENEYİM, EĞİTİM, DİLLER) and language names (İngilizce) silently failed and
 * Turkish CVs imported as completely empty. We only fold for *matching*; the
 * original text is still used for the extracted values.
 */
function asciiFold(s: string): string {
  return s
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function mockExtract(text: string): Partial<ResumeData> {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<ResumeData> = {};

  // --- Contact info ---
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (emailMatch) result.email = emailMatch[0];

  const phoneMatch = text.match(/\(?\+?\d[\d\s().-]{6,15}\d/);
  if (phoneMatch) {
    let phone = phoneMatch[0].trim();
    // Fix unbalanced parentheses
    if (phone.includes(")") && !phone.includes("(")) phone = "(" + phone;
    result.phone = phone;
  }

  const urlMatch = text.match(/(?:https?:\/\/|www\.)[^\s,)]+/);
  if (urlMatch) result.website = urlMatch[0];

  // --- Name (first non-contact, non-label line) ---
  for (const line of lines.slice(0, 5)) {
    if (line.includes("@") || /^[\d+(\s]/.test(line) || /https?:/.test(line)) continue;
    if (/^(address|email|phone|gender|date of birth|nationality|location)/i.test(line)) continue;
    if (line.charCodeAt(0) < 32) continue; // control char prefix
    const nameParts = line.split(/\s+/).filter((p) => p.length > 0 && p.length < 30);
    if (nameParts.length >= 2 && nameParts.length <= 5) {
      result.firstName = nameParts[0];
      result.lastName = nameParts.slice(1).join(" ");
      break;
    }
  }

  // --- Detect sections by header patterns ---
  type Section = "title" | "summary" | "experience" | "education" | "skills" | "languages" | "unknown";
  // NOTE: patterns are matched against asciiFold(line), so Turkish words are
  // written in their ASCII-folded form (ozet, is deneyim, egitim, diller).
  const sectionHeaders: { pattern: RegExp; section: Section }[] = [
    { pattern: /^(professional\s+)?summary|^profile|^about\s*me|^about$|^objective|^ozet|^profil|^hakkimda|^personal\s+(statement|profile)/i, section: "summary" },
    { pattern: /^(work\s+)?experience|^employment|^career|^professional\s+(history|experience)|^is\s+deneyim|^deneyim|^tecrube|^work\s+history|^relevant\s+experience/i, section: "experience" },
    { pattern: /^education|^academic|^egitim|^ogrenim|^qualifications|^certific/i, section: "education" },
    { pattern: /^(technical\s+|core\s+)?skills?|^competenc|^technologies|^tech\s*\.?\s*stack|^beceriler|^yetenekler|^yetkinlikler|^areas?\s+of\s+expertise|^tools?\s*(and|&)|^expertise/i, section: "skills" },
    { pattern: /^languages?|^diller|^yabanci\s+dil/i, section: "languages" },
  ];

  const datePattern = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|present|current|ongoing|devam|halen|\d{4})\b/i;

  // Known language names — shared by the section guard and the languages
  // extractor so a long, comma-separated "English, Spanish, French" line is
  // recognised as a language line instead of being kicked to "unknown".
  // Matched against asciiFold(...), so Turkish names are in ASCII-folded form
  // (turkce, fransizca, ingilizce, …).
  const LANG_NAMES = /\b(english|turkish|german|french|spanish|italian|arabic|russian|chinese|mandarin|cantonese|japanese|korean|portuguese|dutch|swedish|norwegian|danish|finnish|polish|czech|greek|hindi|urdu|persian|farsi|hebrew|hungarian|romanian|bulgarian|croatian|serbian|slovak|slovenian|ukrainian|indonesian|malay|thai|vietnamese|bengali|swahili|tamil|telugu|marathi|gujarati|punjabi|azerbaijani|kazakh|georgian|armenian|turkce|almanca|fransizca|ispanyolca|ingilizce|arapca|rusca|cince|japonca|korece|lehce|fince|danca|azerice)\b/i;

  // Gather lines per section
  const sectionLines: Record<Section, string[]> = { title: [], summary: [], experience: [], education: [], skills: [], languages: [], unknown: [] };
  let currentSection: Section = "unknown";
  let headerCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const foldedLine = asciiFold(line);
    let matched = false;
    for (const { pattern, section } of sectionHeaders) {
      if (pattern.test(foldedLine) && line.length < 60) {
        currentSection = section;
        matched = true;
        headerCount++;
        break;
      }
    }
    if (!matched) {
      // If we're in "languages" section but the line clearly isn't a language,
      // it means a new section started without a recognized header — push to "unknown"
      // so it doesn't pollute languages.
      if (currentSection === "languages") {
        // Keep the line in the languages section if it names a known language
        // (covers long comma-separated lists), otherwise fall back to the
        // length/keyword heuristic so a new unlabelled section doesn't leak in.
        const looksLikeLang =
          LANG_NAMES.test(foldedLine) ||
          (line.length < 50 && !/\d{4}|city:|country:|activities|responsibilities|managed|handled|coordinated/i.test(line));
        if (!looksLikeLang) {
          currentSection = "unknown";
        }
      }
      sectionLines[currentSection].push(line);
    }
  }

  // --- Title (a short professional title line, not address/contact/personal) ---
  const headerLines = sectionLines.unknown.slice(0, 8);
  for (const line of headerLines) {
    if (line === `${result.firstName} ${result.lastName}`) continue;
    if (line.includes("@") || /^\+?\d/.test(line) || /https?:/.test(line)) continue;
    // Skip personal info lines (address, gender, nationality, date of birth, etc.)
    if (/address|gender|male|female|nationality|date of birth|doğum|cinsiyet|uyruk|adres|sokak|mah\.|no:|email|phone/i.test(line)) continue;
    // Skip lines with control characters or whitespace-only
    if (line.charCodeAt(0) < 32 || /^\s*$/.test(line)) continue;
    if (line.length > 5 && line.length < 80) {
      result.title = line;
      break;
    }
  }

  // --- Summary ---
  if (sectionLines.summary.length > 0) {
    // Filter out lines that look like section headers that leaked in
    const summaryText = sectionLines.summary
      .filter((l) => l.length > 15 || !/^[A-Z\s]{3,}$/.test(l))
      .join(" ")
      .replace(/\s+[A-Z]{4,}$/g, "") // Remove trailing all-caps fragment (section header bleed)
      .trim()
      .slice(0, 600);
    if (summaryText.length > 10) result.summary = summaryText;
  }

  // --- Skills ---
  if (sectionLines.skills.length > 0) {
    const skills: string[] = [];
    for (const line of sectionLines.skills) {
      const items = line.split(/[,;|•·—–\\/]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
      for (const item of items) {
        // Filter out URLs, fragments, project names, and full sentences
        if (/https?:|www\.|github\.com/i.test(item)) continue;
        if (/^\s*(and|or|the|a|an|in|of|to|for|with)\s/i.test(item) && item.length < 15) continue;
        if (/^(projects?|green\s+harvest|cinemania)$/i.test(item)) continue;
        if (item.split(/\s+/).length > 5) continue; // Skip full sentences
        if (/\.\s*$/.test(item) && item.length > 30) continue; // Skip sentences ending with period
        skills.push(item);
      }
    }
    if (skills.length > 0) result.skills = [...new Set(skills)];
  }

  // --- Languages ---
  if (sectionLines.languages.length > 0) {
    // EN + TR proficiency levels (matched against asciiFold(seg)).
    const profLevels = /\b(native|fluent|advanced|intermediate|beginner|basic|proficient|conversational|mother\s*tongue|elementary|a1|a2|b1|b2|c1|c2|anadil|ileri|orta|baslangic|akici|temel|cok\s*iyi|iyi)\b/i;

    const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    // Restore proper native spelling for Turkish names/levels that asciiFold
    // flattened (so a TR user sees "İngilizce (İleri)", not "Ingilizce (Ileri)").
    const DISPLAY: Record<string, string> = {
      ingilizce: "İngilizce", turkce: "Türkçe", fransizca: "Fransızca", ispanyolca: "İspanyolca",
      arapca: "Arapça", rusca: "Rusça", cince: "Çince", lehce: "Lehçe",
      ileri: "İleri", anadil: "Anadil", orta: "Orta", baslangic: "Başlangıç", akici: "Akıcı",
    };
    const display = (folded: string) => DISPLAY[folded.toLowerCase()] || titleCase(folded);
    const langs: string[] = [];
    for (const line of sectionLines.languages) {
      // Split comma / semicolon / pipe / bullet separated lists so every
      // language on a single line is captured — e.g.
      // "English (Native), Spanish (Fluent), French (Intermediate)".
      const segments = line.split(/[,;|•·]/).map((s) => s.trim()).filter(Boolean);
      const parts = segments.length > 0 ? segments : [line];
      for (const seg of parts) {
        const folded = asciiFold(seg);
        const langMatch = folded.match(LANG_NAMES);
        if (!langMatch) continue;
        const langName = display(langMatch[1]);
        const levelMatch = folded.match(profLevels);
        langs.push(levelMatch ? `${langName} (${display(levelMatch[1])})` : langName);
      }
    }
    if (langs.length > 0) {
      // De-dupe case-insensitively, preserving first occurrence/order.
      const seen = new Set<string>();
      result.languages = langs.filter((l) => {
        const key = l.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
  }

  // --- Experience: smarter parsing ---
  if (sectionLines.experience.length > 0) {
    type ExpEntry = { id: string; role: string; company: string; location: string; startDate: string; endDate: string; current: boolean; bullets: string[] };
    const experiences: ExpEntry[] = [];
    let cur: ExpEntry | null = null;

    // Detect if a line is a bullet (starts with number, bullet char, or dash)
    const isBulletLine = (l: string) => /^[\d]+[\s.)]+/.test(l) || /^[•\-–—*▪►◦‣◦]\s*/.test(l);
    // Strip bullet prefix
    const cleanBullet = (l: string) => l.replace(/^[\d]+[\s.)]+/, "").replace(/^[•\-–—*▪►◦‣◦]\s*/, "").trim();

    // Normalize all dash-like characters to regular hyphen for easier matching
    const normDash = (s: string) => s.replace(/[‐-―−�]/g, "-");

    // Extract date range — supports multiple formats:
    // "Jun 2022 - Dec 2025", "2018 - 2020", "[ 01/12/2016 – 01/07/2017 ]", "[13-06-2022 - CURRENT"
    const extractDates = (l: string) => {
      const n = normDash(l);
      // Europass bracket format: [ DD/MM/YYYY - DD/MM/YYYY ] or [DD-MM-YYYY - CURRENT]
      const euro = n.match(/\[?\s*(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})\s*-+\s*(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}|present|current|ongoing|devam|halen)\s*\]?/i);
      if (euro) {
        return { start: euro[1], end: euro[2], isCurrent: /present|current|ongoing|devam|halen/i.test(euro[2]) };
      }
      // Standard: "Jun 2022 - Dec 2025" or "2018 - 2020"
      const std = n.match(/\(?\s*(\w{3,9}\.?\s+\d{4}|\d{4})\s*-+\s*(\w{3,9}\.?\s+\d{4}|\d{4}|present|current|ongoing|devam|halen)\s*\)?/i);
      if (std) return { start: std[1], end: std[2], isCurrent: /present|current|ongoing|devam|halen/i.test(std[2]) };
      // Single year in parens: "(2019)"
      const y = n.match(/\((\d{4})\)/);
      if (y) return { start: y[1], end: "", isCurrent: false };
      return null;
    };

    // Strip date portion from line (all formats)
    const stripDates = (l: string) => {
      let s = normDash(l);
      // Europass DD/MM/YYYY – DD/MM/YYYY
      s = s.replace(/\[?\s*\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}\s*-+\s*(?:\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}|present|current|ongoing|devam|halen)\s*\]?/i, "");
      // "Mon YYYY - Mon YYYY" / "Mon YYYY - present"
      s = s.replace(/\(?\s*\w{3,9}\.?\s+\d{4}\s*-+\s*(?:\w{3,9}\.?\s+\d{4}|\d{4}|present|current|ongoing|devam|halen)\s*\)?/i, "");
      // "YYYY - YYYY" / "YYYY - present" (bare year range, often parenthesised).
      // Previously unhandled, so year-only ranges leaked into the company name.
      s = s.replace(/\(?\s*\d{4}\s*-+\s*(?:\d{4}|present|current|ongoing|devam|halen)\s*\)?/i, "");
      // single "(YYYY)"
      s = s.replace(/\(\d{4}\)/, "");
      return s.replace(/\s{2,}/g, " ").trim();
    };

    const tidy = (s: string) => s.replace(/[|·]/g, " ").replace(/\s{2,}/g, " ").trim();

    // "Senior Engineer - Acme Corp" / "Designer | Studio X" / "PM at Google"
    // → { role, company }. A blank role with everything crammed into company
    // is the single most common bad import, so split on a clear separator when
    // one exists; otherwise keep the whole string as the company. Both sides
    // must contain a letter so a stray dash inside a leftover date range
    // (e.g. "Acme 2018 - 2020") can never be mistaken for a role separator.
    const hasLetter = /[a-zA-ZçğıöşüÇĞİÖŞÜ]/;
    const splitRoleCompany = (s: string): { role: string; company: string } => {
      const m = s.match(/^(.{2,60}?)\s+(?:[-–—|·@]|at)\s+(.{2,})$/i);
      if (m && hasLetter.test(m[1]) && hasLetter.test(m[2]) && !/^\d/.test(m[2].trim())) {
        return { role: tidy(m[1]), company: tidy(m[2]) };
      }
      return { role: "", company: tidy(s) };
    };

    for (const line of sectionLines.experience) {
      // Skip empty / very short
      if (line.length < 3) continue;

      // Skip Europass noise lines
      if (/^(main\s+activities|city:|country:|replace\s+with)/i.test(line)) continue;

      // If it's a bullet, add to current entry
      if (isBulletLine(line) && cur) {
        const b = cleanBullet(line);
        if (b.length > 3) cur.bullets.push(b);
        continue;
      }

      // Check for date in line — likely a header line (company or role with date)
      const dates = extractDates(line);
      const hasDate = dates !== null;
      const isShort = line.length < 100;

      if (hasDate && isShort) {
        const cleanedRaw = stripDates(line);
        const cleaned = tidy(cleanedRaw);

        if (!cur || cur.bullets.length > 0 || cur.company) {
          // Start new entry — this line is "ROLE - COMPANY (dates)" or just
          // "COMPANY (dates)". Split a clear "Role <sep> Company" so the role
          // field isn't left blank with everything dumped into company.
          if (cur) experiences.push(cur);
          const { role: splitRole, company: splitCompany } = splitRoleCompany(cleanedRaw);
          cur = {
            id: `exp_${experiences.length + 1}`,
            role: splitRole,
            company: splitCompany || cleaned || "",
            location: "",
            startDate: dates.start,
            endDate: dates.end,
            current: dates.isCurrent,
            bullets: []
          };
        } else {
          // cur exists but has no company yet — this line might be the role+date
          // and the previous line was the company
          cur.startDate = dates.start;
          cur.endDate = dates.end;
          cur.current = dates.isCurrent;
          if (!cur.role && cleaned) cur.role = cleaned;
        }
        continue;
      }

      // Non-bullet, no-date line
      if (isShort && cur && !isBulletLine(line)) {
        // Try to fill role or company
        if (!cur.role) {
          cur.role = line;
        } else if (!cur.company) {
          cur.company = line;
        } else if (!cur.location && line.length < 50) {
          cur.location = line;
        } else {
          // Treat as a bullet without marker
          if (line.length > 10) cur.bullets.push(line);
        }
        continue;
      }

      // Long line without a date and no current entry — might be a standalone title
      if (!cur && isShort && /[A-ZÇĞİÖŞÜa-z]/.test(line[0])) {
        cur = {
          id: `exp_${experiences.length + 1}`,
          role: "",
          company: line,
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: []
        };
      } else if (cur) {
        // Fallback: treat as bullet
        const b = cleanBullet(line);
        if (b.length > 3) cur.bullets.push(b);
      }
    }
    if (cur) experiences.push(cur);

    // Post-process: if role looks like company and vice versa, swap
    for (const exp of experiences) {
      // If role is ALL CAPS and company is mixed case, swap (company names are often all-caps in CVs)
      if (exp.role && exp.company && exp.role === exp.role.toUpperCase() && exp.company !== exp.company.toUpperCase()) {
        const tmp = exp.role;
        exp.role = exp.company;
        exp.company = tmp;
      }
      // If company is empty but role has content, keep as is
      // Clean trailing/leading punctuation
      exp.role = exp.role.replace(/^[,;|·\s]+|[,;|·\s]+$/g, "").trim();
      exp.company = exp.company.replace(/^[,;|·\s]+|[,;|·\s]+$/g, "").trim();
    }

    if (experiences.length > 0) result.experiences = experiences;
  }

  // --- Education ---
  if (sectionLines.education.length > 0) {
    type EduEntry = { id: string; school: string; degree: string; location: string; startDate: string; endDate: string };
    const education: EduEntry[] = [];
    let cur: EduEntry | null = null;

    const extractEduDates = (l: string) => {
      // Europass: [ DD/MM/YYYY – DD/MM/YYYY ] or 14/10/2018 – 23/12/2018
      const euro = l.match(/\[?\s*(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})\s*[-–—]+\s*(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}|present|current|devam)\s*\]?/i);
      if (euro) return { start: euro[1], end: euro[2] };
      // Standard: 2018 - 2022
      const m = l.match(/\(?\s*(\d{4})\s*[-–—]+\s*(\d{4}|present|current|devam|halen)\s*\)?/i);
      if (m) return { start: m[1], end: m[2] };
      const y = l.match(/\((\d{4})\)/);
      if (y) return { start: y[1], end: "" };
      return null;
    };
    const stripEduDates = (l: string) =>
      l.replace(/\[?\s*\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}\s*[-–—]+\s*(?:\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}|present|current|devam)\s*\]?/i, "")
       .replace(/\(?\s*\d{4}\s*[-–—]+\s*(?:\d{4}|present|current|devam|halen)\s*\)?/i, "")
       .replace(/\(\d{4}\)/, "")
       .replace(/\s{2,}/g, " ").trim();

    for (const line of sectionLines.education) {
      if (line.length < 3) continue;
      const dates = extractEduDates(line);
      const isShort = line.length < 120;
      const cleaned = dates ? stripEduDates(line) : line;

      if (dates && isShort) {
        if (cur) education.push(cur);
        cur = { id: `edu_${education.length + 1}`, school: cleaned || "", degree: "", location: "", startDate: dates.start, endDate: dates.end };
      } else if (isShort && /[A-ZÇĞİÖŞÜa-z]/.test(line[0]) && !line.startsWith("•") && !line.startsWith("-")) {
        if (!cur) {
          cur = { id: `edu_${education.length + 1}`, school: cleaned, degree: "", location: "", startDate: "", endDate: "" };
        } else if (!cur.degree) {
          cur.degree = cleaned;
        } else if (!cur.location && cleaned.length < 50) {
          cur.location = cleaned;
        }
      }
    }
    if (cur) education.push(cur);
    if (education.length > 0) result.education = education;
  }

  return result;
}
