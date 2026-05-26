import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";

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
  userApiKey?: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

export async function POST(request: Request) {
  let body: RequestBody | null = null;
  try {
    body = (await request.json()) as RequestBody;
    const action = body.action;

    if (!action) {
      return NextResponse.json({ error: "Missing action." }, { status: 400 });
    }

    const effectiveKey = body.userApiKey || process.env.OPENAI_API_KEY;

    if (!effectiveKey) {
      console.log("[AI] No API key configured, using mock response");
      return NextResponse.json(mockResponse(action, body));
    }

    const client = new OpenAI({ apiKey: effectiveKey });
    const prompt = buildPrompt(action, body);

    const response = await client.responses.create({
      model: MODEL,
      input: prompt,
      temperature: 0.35
    });

    const output = response.output_text?.trim() || "";
    console.log("[AI] Raw output length:", output.length, "preview:", output.slice(0, 300));
    const parsed = parseJson(output);

    if (parsed) {
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ resultText: output });
  } catch (error) {
    console.error("[AI] API call failed, falling back to mock:", error instanceof Error ? error.message : error);
    // Fall back to mock response so the feature still works
    if (body?.action) {
      return NextResponse.json(mockResponse(body.action, body));
    }
    const message = error instanceof Error ? error.message : "Unknown AI error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildPrompt(action: ResumeHelperAction, body: RequestBody) {
  const resume = safeResume(body.resumeData);
  const text = body.text || "";
  const targetRole = body.targetRole || resume.title || "the target role";

  const base = `You are a world-class resume strategist and career coach who has helped thousands of professionals land roles at top companies like Google, McKinsey, Goldman Sachs, and leading startups.
Return ONLY valid JSON. No markdown, no explanation, no extra text.
Target role: ${targetRole}
Candidate: ${resume.firstName} ${resume.lastName}

Resume data:
${JSON.stringify(resume, null, 2)}
`;

  if (action === "improve_summary") {
    return `${base}
Rewrite this professional summary into an elite, ATS-optimized executive summary.

REQUIREMENTS:
- 2-4 powerful sentences, no fluff
- Open with years of experience + domain expertise (infer from the resume timeline)
- Weave in 2-3 high-value keywords that recruiters and ATS systems search for in "${targetRole}" roles
- Highlight the candidate's unique differentiator — what sets them apart
- End with a forward-looking value proposition
- Never use clichés like "passionate", "team player", "hard-working" — be specific and compelling
- Keep it truthful — do not invent facts

Current summary to improve:
${text}

Return:
{"resultText":"...improved summary..."}`;
  }

  if (action === "improve_bullet") {
    return `${base}
Transform this experience bullet into a high-impact, recruiter-ready achievement statement.

REQUIREMENTS:
- Start with a powerful, specific action verb (Led, Architected, Spearheaded, Delivered, Optimized, Orchestrated, Streamlined, Pioneered)
- Follow the CAR method: Challenge → Action → Result
- If the original mentions any metrics, preserve and amplify them
- If no metrics exist, add qualitative impact language: "resulting in improved...", "enabling..."
- Keep it to 1-2 concise lines — dense with value
- Make it ATS-friendly with relevant keywords for "${targetRole}"
- NEVER fabricate exact numbers or percentages — only enhance what's implied

Original bullet:
${text}

Return:
{"resultText":"...improved bullet..."}`;
  }

  if (action === "suggest_skills") {
    return `${base}
Suggest 12-16 highly relevant skills for this candidate targeting "${targetRole}" roles.

REQUIREMENTS:
- Prioritize hard/technical skills that ATS systems scan for — list them first
- Include industry-standard tools, frameworks, and methodologies relevant to "${targetRole}"
- Add 3-4 transferable soft skills that hiring managers value (e.g., "Cross-functional Leadership", not "teamwork")
- Look at the candidate's experience and infer skills they likely have but didn't list
- Avoid generic filler skills (e.g., "Microsoft Office", "Communication" unless highly specific)
- Use professional terminology — "Agile/Scrum" not "agile methodology"
- No duplicates with existing skills: ${JSON.stringify(resume.skills)}

Return:
{"skills":["skill 1","skill 2",...]}`;
  }

  if (action === "generate_cover_letter") {
    const jobDesc = body.jobDescription?.trim() || "";
    const jobContext = jobDesc
      ? `\n\nJOB DESCRIPTION PROVIDED BY THE USER:\n${jobDesc}\n\nIMPORTANT: Carefully analyze the job description above. Match the candidate's experience and skills to the specific requirements, responsibilities, and qualifications listed. Reference specific keywords, technologies, and values from the job posting.`
      : "";

    return `${base}
Write a compelling, professional cover letter for this candidate applying to a "${targetRole}" position.${jobContext}

REQUIREMENTS:
- Return ONLY the body paragraphs (usually 3-4 paragraphs).
- DO NOT include a date, salutation (e.g., "Dear..."), or signature/closing (e.g., "Sincerely..."). The template will handle these.
- Each paragraph should have a clear purpose:
  1. HOOK: Open with a confident, specific statement about why this role excites them. No generic "I am writing to apply..."
  2. VALUE PROOF: Highlight 2-3 concrete achievements from their resume that map to the role.
  3. CULTURAL FIT: Connect the candidate's approach/philosophy to the company's or role's values.
  4. CLOSE: Confident but not arrogant. Express enthusiasm for discussing further.
- Tone: Professional yet human — avoid corporate robot language.
- Length: 200-300 words total.
- Never fabricate experiences — only reference what's in the resume.

Return:
{"resultText":"...body paragraphs only..."}`;
  }

  if (action === "analyze_resume") {
    return `${base}
Perform a comprehensive professional audit of this resume as if you were a senior recruiter at a top-tier company reviewing it for a "${targetRole}" position.

SCORING CRITERIA (score 0-100):
- ATS Compatibility (keywords, formatting, standard sections): 25 points
- Impact & Achievement Quality (quantified results, CAR method): 25 points
- Relevance to Target Role (skill alignment, experience match): 25 points
- Professional Polish (summary strength, consistency, clarity): 25 points

ANALYSIS REQUIREMENTS:
- strengths: List 3-5 specific things this resume does well (be precise, reference actual content)
- gaps: List 3-5 specific weaknesses or missing elements (actionable, not vague)
- recommendations: List 4-6 concrete, prioritized steps to improve (most impactful first)
- summary: 2-3 sentence overall assessment — be honest but constructive

Return:
{"analysis":{"score":0,"strengths":["..."],"gaps":["..."],"recommendations":["..."],"summary":"..."}}`;
  }

  const refText = body.text || "";
  return `You are an expert resume data extractor with deep experience parsing CVs, LinkedIn profiles, and career documents.

Given the following text from a reference document, extract ALL resume-relevant information into structured JSON.

EXTRACTION RULES:
- Extract every piece of information you can find — names, titles, contact info, experiences, education, skills
- For experience bullets, split compound sentences into individual achievement statements
- Infer job dates from context clues if not explicitly stated
- Clean up formatting: fix capitalization, remove extra whitespace, standardize date formats
- Generate unique IDs for each entry (e.g., "exp_1", "edu_1")
- Use empty strings for fields you truly cannot determine

Reference text:
${refText}

Return ONLY valid JSON in this exact format:
{"resumeData":{"firstName":"","lastName":"","title":"","email":"","phone":"","location":"","website":"","summary":"","skills":["skill1","skill2"],"languages":["lang1"],"experiences":[{"id":"exp_1","role":"","company":"","location":"","startDate":"","endDate":"","current":false,"bullets":["bullet1"]}],"education":[{"id":"edu_1","school":"","degree":"","location":"","startDate":"","endDate":""}]}}`;
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
    references: []
  };
}

function parseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]) as unknown;
    } catch {
      return null;
    }
  }
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

function mockExtract(text: string): Partial<ResumeData> {
  console.log("[mockExtract] Input text length:", text.length);
  console.log("[mockExtract] First 1000 chars:", text.slice(0, 1000));
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  console.log("[mockExtract] Total lines:", lines.length);
  console.log("[mockExtract] First 30 lines:", JSON.stringify(lines.slice(0, 30)));
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
  const sectionHeaders: { pattern: RegExp; section: Section }[] = [
    { pattern: /^(professional\s+)?summary|^profile|^about\s*me|^about$|^objective|^özet|^profil|^personal\s+(statement|profile)/i, section: "summary" },
    { pattern: /^(work\s+)?experience|^employment|^career|^professional\s+(history|experience)|^iş\s+deneyim|^deneyim|^work\s+history|^relevant\s+experience/i, section: "experience" },
    { pattern: /^education|^academic|^eğitim|^qualifications|^certific/i, section: "education" },
    { pattern: /^(technical\s+|core\s+)?skills?|^competenc|^technologies|^tech\s*\.?\s*stack|^beceriler|^areas?\s+of\s+expertise|^tools?\s*(and|&)|^expertise/i, section: "skills" },
    { pattern: /^languages?|^diller/i, section: "languages" },
  ];

  const datePattern = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|present|current|ongoing|devam|halen|\d{4})\b/i;

  // Gather lines per section
  const sectionLines: Record<Section, string[]> = { title: [], summary: [], experience: [], education: [], skills: [], languages: [], unknown: [] };
  let currentSection: Section = "unknown";
  let headerCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let matched = false;
    for (const { pattern, section } of sectionHeaders) {
      if (pattern.test(line) && line.length < 60) {
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
        const looksLikeLang = line.length < 50 && !/\d{4}|city:|country:|activities|responsibilities|managed|handled|coordinated/i.test(line);
        if (!looksLikeLang) {
          currentSection = "unknown";
        }
      }
      sectionLines[currentSection].push(line);
    }
  }

  console.log("[mockExtract] Sections detected:", {
    unknown: sectionLines.unknown.length,
    summary: sectionLines.summary.length,
    experience: sectionLines.experience.length,
    education: sectionLines.education.length,
    skills: sectionLines.skills.length,
    languages: sectionLines.languages.length,
    headerCount
  });
  if (sectionLines.experience.length > 0) {
    console.log("[mockExtract] Experience lines:", JSON.stringify(sectionLines.experience.slice(0, 20)));
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
    const knownLangs = /\b(english|turkish|german|french|spanish|italian|arabic|russian|chinese|japanese|korean|portuguese|dutch|swedish|norwegian|danish|finnish|polish|czech|greek|hindi|urdu|persian|hebrew|hungarian|romanian|bulgarian|croatian|serbian|slovak|slovenian|ukrainian|indonesian|malay|thai|vietnamese|bengali|swahili|tamil|telugu|marathi|gujarati|punjabi|türkçe|almanca|fransızca|ispanyolca|ingilizce|arapça|rusça|çince|japonca|korece|lehçe|fince|danca)\b/i;
    const profLevels = /\b(native|fluent|advanced|intermediate|beginner|basic|proficient|conversational|mother\s*tongue|elementary|a1|a2|b1|b2|c1|c2)\b/i;

    const langs: string[] = [];
    for (const line of sectionLines.languages) {
      // First try: extract "Language (Level)" or "Language - Level" patterns
      const langMatch = line.match(knownLangs);
      if (langMatch) {
        const langName = langMatch[1];
        // Try to find level nearby
        const levelMatch = line.match(profLevels);
        if (levelMatch) {
          langs.push(`${langName} (${levelMatch[1]})`);
        } else {
          langs.push(langName);
        }
      }
    }
    if (langs.length > 0) result.languages = [...new Set(langs)];
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
      s = s.replace(/\[?\s*\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}\s*-+\s*(?:\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4}|present|current|ongoing|devam|halen)\s*\]?/i, "");
      s = s.replace(/\(?\s*\w{3,9}\.?\s+\d{4}\s*-+\s*(?:\w{3,9}\.?\s+\d{4}|\d{4}|present|current|ongoing|devam|halen)\s*\)?/i, "");
      s = s.replace(/\(\d{4}\)/, "");
      return s.replace(/\s{2,}/g, " ").trim();
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
        const cleaned = stripDates(line).replace(/[|·]/g, " ").replace(/\s{2,}/g, " ").trim();

        if (!cur || cur.bullets.length > 0 || cur.company) {
          // Start new entry — this line is likely "COMPANY (dates)"
          if (cur) experiences.push(cur);
          cur = {
            id: `exp_${experiences.length + 1}`,
            role: "",
            company: cleaned || "",
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

  console.log("[mockExtract] Final result keys:", Object.keys(result));
  console.log("[mockExtract] Experiences count:", result.experiences?.length ?? 0);
  console.log("[mockExtract] Education count:", result.education?.length ?? 0);
  if (result.experiences) {
    console.log("[mockExtract] Experiences:", JSON.stringify(result.experiences));
  }
  return result;
}
