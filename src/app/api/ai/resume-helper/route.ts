import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";

type ResumeHelperAction =
  | "improve_summary"
  | "improve_bullet"
  | "suggest_skills"
  | "generate_cover_letter"
  | "analyze_resume";

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
  userApiKey?: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

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

  const base = `
You are an expert resume writer.
Return only valid JSON. Do not use markdown.
Target role: ${targetRole}

Resume data:
${JSON.stringify(resume, null, 2)}
`;

  if (action === "improve_summary") {
    return `${base}
Rewrite this professional summary into a concise, ATS-friendly summary.
Keep it truthful. Use 2-4 sentences.
Text:
${text}

Return:
{"resultText":"..."}`;
  }

  if (action === "improve_bullet") {
    return `${base}
Rewrite this experience bullet into one achievement-focused bullet.
Start with a strong action verb. Add measurable language where appropriate, but do not invent exact numbers.
Bullet:
${text}

Return:
{"resultText":"..."}`;
  }

  if (action === "suggest_skills") {
    return `${base}
Suggest 10-14 relevant resume skills based on the resume and target role.
Avoid duplicates.

Return:
{"skills":["skill 1","skill 2"]}`;
  }

  if (action === "generate_cover_letter") {
    return `${base}
Generate a professional cover letter for this candidate.
Use 4 paragraphs. Keep it adaptable, confident, and natural.

Return:
{"resultText":"..."}`;
  }

  return `${base}
Analyze this CV for ATS and recruiter clarity.
Score from 0 to 100.
Return:
{"analysis":{"score":85,"strengths":["..."],"gaps":["..."],"recommendations":["..."],"summary":"..."}}`;
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

function mockResponse(action: ResumeHelperAction, body: RequestBody): { resultText?: string; skills?: string[]; analysis?: ResumeAnalysis } {
  const resume = safeResume(body.resumeData);
  const name = `${resume.firstName} ${resume.lastName}`.trim() || "This candidate";
  const role = body.targetRole || resume.title || "the target role";

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
