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

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (emailMatch) result.email = emailMatch[0];

  const phoneMatch = text.match(/\+?[\d\s().-]{7,}/);
  if (phoneMatch) result.phone = phoneMatch[0].trim();

  const urlMatch = text.match(/https?:\/\/[^\s,]+/);
  if (urlMatch) result.website = urlMatch[0];

  if (lines.length > 0 && !lines[0].includes("@")) {
    const nameParts = lines[0].split(/\s+/);
    if (nameParts.length >= 2 && nameParts[0].length < 30) {
      result.firstName = nameParts[0];
      result.lastName = nameParts.slice(1).join(" ");
    }
  }

  if (lines.length > 1 && lines[1].length < 80 && !lines[1].includes("@")) {
    result.title = lines[1];
  }

  const skills: string[] = [];
  let inSkills = false;
  for (const line of lines) {
    if (/^skills?\b/i.test(line)) { inSkills = true; continue; }
    if (/^(experience|education|summary|profile|work|projects)/i.test(line)) { inSkills = false; continue; }
    if (inSkills) {
      const items = line.split(/[,;|•·]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
      skills.push(...items);
    }
  }
  if (skills.length > 0) result.skills = skills;

  return result;
}
