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
  try {
    const body = (await request.json()) as RequestBody;
    const action = body.action;

    if (!action) {
      return NextResponse.json({ error: "Missing action." }, { status: 400 });
    }

    const effectiveKey = body.userApiKey || process.env.OPENAI_API_KEY;

    if (!effectiveKey) {
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
    const parsed = parseJson(output);

    if (parsed) {
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ resultText: output });
  } catch (error) {
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
- 4 paragraphs, each with a clear purpose:
  1. HOOK: Open with a confident, specific statement about why this role excites them.${jobDesc ? " Reference the company name and role from the job description." : " Reference the role and hint at their strongest qualification."} No generic "I am writing to apply..."
  2. VALUE PROOF: Highlight 2-3 concrete achievements from their resume that directly map to ${jobDesc ? "the requirements in the job description" : `what a "${targetRole}" needs`}. Use specific examples with context.
  3. CULTURAL FIT: ${jobDesc ? "Reference specific values, mission, or culture mentioned in the job posting." : `Show understanding of what companies hiring for "${targetRole}" typically value.`} Connect the candidate's approach/philosophy to those values.
  4. CLOSE: Confident but not arrogant. Express enthusiasm for discussing further. Include a forward-looking statement.
- Tone: Professional yet human — avoid corporate robot language
- Length: 250-350 words total
- Never fabricate experiences — only reference what's in the resume
- Address to "Dear Hiring Manager" unless a specific name is available in the job description

Return:
{"resultText":"...full cover letter text..."}`;
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
      resultText: `Dear Hiring Manager,

I am writing to express my interest in the ${role} position. My background has helped me build strong communication, organization, and problem-solving skills that can support your team's goals.

In my previous experience, I have focused on understanding needs, improving workflows, and delivering reliable results. I am especially motivated by roles where I can combine practical execution with clear, professional communication.

I would welcome the opportunity to discuss how my experience can contribute to your organization.

Sincerely,
${name}`
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
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<ResumeData> = {};

  // --- Contact info ---
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (emailMatch) result.email = emailMatch[0];

  const phoneMatch = text.match(/\+?[\d\s().-]{7,15}/);
  if (phoneMatch) result.phone = phoneMatch[0].trim();

  const urlMatch = text.match(/(?:https?:\/\/|www\.)[^\s,)]+/);
  if (urlMatch) result.website = urlMatch[0];

  // --- Name (first non-contact line) ---
  for (const line of lines.slice(0, 3)) {
    if (line.includes("@") || /^[\d+(\s]/.test(line) || /https?:/.test(line)) continue;
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
    { pattern: /^(professional\s+)?summary|^profile|^about(\s+me)?|^objective/i, section: "summary" },
    { pattern: /^(work\s+)?experience|^employment|^career|^professional\s+history|^iş\s+deneyim/i, section: "experience" },
    { pattern: /^education|^academic|^eğitim|^qualifications/i, section: "education" },
    { pattern: /^(technical\s+|core\s+)?skills?|^competenc|^technologies|^tech\s+stack|^beceriler|^areas?\s+of\s+expertise/i, section: "skills" },
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
      sectionLines[currentSection].push(line);
    }
  }

  // --- Title (second non-contact line in header area or first short line) ---
  const headerLines = sectionLines.unknown.slice(0, 5);
  for (const line of headerLines) {
    if (line === `${result.firstName} ${result.lastName}`) continue;
    if (line.includes("@") || /^\+?\d/.test(line) || /https?:/.test(line)) continue;
    if (line.length > 5 && line.length < 80) {
      result.title = line;
      break;
    }
  }

  // --- Summary ---
  if (sectionLines.summary.length > 0) {
    result.summary = sectionLines.summary.join(" ").slice(0, 600);
  }

  // --- Skills ---
  if (sectionLines.skills.length > 0) {
    const skills: string[] = [];
    for (const line of sectionLines.skills) {
      const items = line.split(/[,;|•·—–\-]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
      skills.push(...items);
    }
    if (skills.length > 0) result.skills = [...new Set(skills)];
  }

  // --- Languages ---
  if (sectionLines.languages.length > 0) {
    const langs: string[] = [];
    for (const line of sectionLines.languages) {
      const items = line.split(/[,;|•·—–\-]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
      langs.push(...items);
    }
    if (langs.length > 0) result.languages = [...new Set(langs)];
  }

  // --- Experience: group by date-containing lines ---
  if (sectionLines.experience.length > 0) {
    const experiences: { id: string; role: string; company: string; location: string; startDate: string; endDate: string; current: boolean; bullets: string[] }[] = [];
    let current: typeof experiences[0] | null = null;

    for (const line of sectionLines.experience) {
      const hasDate = datePattern.test(line);
      const isShort = line.length < 90;
      const looksLikeHeader = (hasDate && isShort) || (!line.startsWith("•") && !line.startsWith("-") && !line.startsWith("–") && isShort && line.length > 3 && /[A-ZÇĞİÖŞÜ]/.test(line[0]));

      if (looksLikeHeader && (!current || current.bullets.length > 0 || hasDate)) {
        // Parse dates from the line
        const dateStr = line.match(/(\w+\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*(\w+\.?\s+\d{4}|\d{4}|present|current|ongoing|devam|halen)/i);
        const yearOnly = line.match(/\b(20\d{2}|19\d{2})\s*[-–—]\s*(20\d{2}|19\d{2}|present|current)/i);

        if (current) experiences.push(current);
        current = {
          id: `exp_${experiences.length + 1}`,
          role: "",
          company: "",
          location: "",
          startDate: dateStr?.[1] || yearOnly?.[1] || "",
          endDate: dateStr?.[2] || yearOnly?.[2] || "",
          current: /present|current|ongoing|devam|halen/i.test(line),
          bullets: []
        };

        // Separate role/company from dates
        const cleanLine = line.replace(/\s*[-–—|·]\s*(\w+\.?\s+\d{4}|\d{4}).*/i, "").trim();
        const parts = cleanLine.split(/\s*[-–—|·,@]\s*/);
        if (parts.length >= 2) {
          current.role = parts[0].trim();
          current.company = parts[1].trim();
          if (parts.length >= 3) current.location = parts[2].trim();
        } else if (cleanLine.length > 0) {
          current.role = cleanLine;
        }
      } else if (current) {
        // If previous line was a header with no company yet, this might be the company
        if (!current.company && current.bullets.length === 0 && line.length < 80 && !line.startsWith("•") && !line.startsWith("-")) {
          current.company = line.replace(/\s*[-–—|·]\s*$/, "").trim();
        } else {
          const bullet = line.replace(/^[•\-–—*]\s*/, "").trim();
          if (bullet.length > 3) current.bullets.push(bullet);
        }
      }
    }
    if (current) experiences.push(current);
    if (experiences.length > 0) result.experiences = experiences;
  }

  // --- Education ---
  if (sectionLines.education.length > 0) {
    const education: { id: string; school: string; degree: string; location: string; startDate: string; endDate: string }[] = [];
    let current: typeof education[0] | null = null;

    for (const line of sectionLines.education) {
      const hasDate = datePattern.test(line);
      const isShort = line.length < 120;

      if (isShort && /[A-ZÇĞİÖŞÜ]/.test(line[0]) && !line.startsWith("•") && !line.startsWith("-")) {
        const dateStr = line.match(/(\d{4})\s*[-–—]\s*(\d{4}|present|current|devam)/i);

        if (current && (hasDate || current.degree)) {
          education.push(current);
          current = null;
        }
        if (!current) {
          current = { id: `edu_${education.length + 1}`, school: "", degree: "", location: "", startDate: dateStr?.[1] || "", endDate: dateStr?.[2] || "" };
        }

        const cleanLine = line.replace(/\s*[-–—|]\s*\d{4}.*/i, "").trim();
        if (!current.school) {
          current.school = cleanLine;
        } else if (!current.degree) {
          current.degree = cleanLine;
        }
      } else if (current && line.length < 100) {
        if (!current.degree) {
          current.degree = line.replace(/^[•\-–—*]\s*/, "").trim();
        }
      }
    }
    if (current) education.push(current);
    if (education.length > 0) result.education = education;
  }

  return result;
}
