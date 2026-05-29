import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";
import { throttle } from "@/lib/usage/throttle";

type RequestBody = {
  resumeData?: ResumeData;
  targetRole?: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";
/** Upper bound on the resume payload we'll send to the model (bounds token cost). */
const MAX_RESUME_CHARS = 80_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const resume = body.resumeData;

    if (!resume) {
      return NextResponse.json({ error: "Missing resumeData." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ resumeData: mockImproveResume(resume) });
    }

    // Bound the input so a single request can't run up an unbounded token bill.
    if (JSON.stringify(resume).length > MAX_RESUME_CHARS) {
      return NextResponse.json({ error: "Resume is too large to optimize." }, { status: 413 });
    }

    // Rate-limit the OpenAI-backed path so the endpoint can't be scripted to
    // drain the API budget. Cost-free paths above (mock) are intentionally exempt.
    const gate = await throttle("ai");
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many AI requests. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: MODEL,
      temperature: 0.25,
      input: `You are a world-class resume strategist who has helped thousands of professionals land roles at top companies.

YOUR TASK: Transform this resume into an elite, ATS-optimized document that commands attention.

RULES — NEVER BREAK THESE:
- Keep ALL facts truthful. Never invent employers, schools, dates, or fabricate metrics.
- If the user provided approximate numbers, you may keep them. Never add numbers that weren't implied.
- Preserve the original JSON structure exactly — same fields, same types.

OPTIMIZATION STRATEGY:

1. PROFESSIONAL SUMMARY (2-4 punchy sentences):
   - Lead with years of experience + core domain expertise
   - Include 2-3 high-value keywords recruiters search for
   - End with a value proposition — what makes this person a hire, not just an applicant
   - Avoid generic filler like "passionate" or "team player" — be specific

2. EXPERIENCE BULLETS (each one):
   - Start with a powerful action verb (Led, Architected, Spearheaded, Delivered, Optimized, Reduced, Scaled)
   - Follow the CAR formula: Challenge → Action → Result
   - If the original bullet mentions a result, quantify or amplify it
   - If no result is stated, add impact language: "resulting in improved...", "enabling the team to..."
   - Each bullet should be 1-2 lines max — dense with value, zero fluff
   - Vary your action verbs — never repeat the same verb twice in one role

3. SKILLS:
   - Reorder so the most in-demand, role-relevant skills appear first
   - Remove vague skills like "Microsoft Office" unless relevant to the role
   - Add industry-standard terminology if the user's skills imply them (e.g., "React" implies "SPA development")

4. EDUCATION:
   - Keep as-is unless formatting can be improved

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"resumeData":{...complete resume object with all original fields...}}

Resume to optimize:
${JSON.stringify(resume, null, 2)}
`
    });

    const parsed = parseJson(response.output_text || "");

    if (!parsed || typeof parsed !== "object" || !("resumeData" in parsed)) {
      return NextResponse.json({ improvedText: response.output_text || "" });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    // Log the detail server-side; return a generic message so we don't leak
    // internal/provider error strings to the client.
    console.error("[AI improve-resume] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Couldn't optimize the resume right now." }, { status: 500 });
  }
}

function parseJson(text: string) {
  try {
    return JSON.parse(text) as { resumeData?: ResumeData };
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as { resumeData?: ResumeData };
    } catch {
      return null;
    }
  }
}

function mockImproveResume(resume: ResumeData): ResumeData {
  return {
    ...resume,
    summary:
      resume.summary?.trim() ||
      "Results-driven professional with strong communication, organization, and problem-solving skills. Experienced in coordinating priorities, improving workflows, and supporting measurable outcomes.",
    experiences: resume.experiences.map((experience) => ({
      ...experience,
      bullets: experience.bullets.map((bullet) =>
        bullet.trim()
          ? `Improved ${bullet.replace(/[.!]$/g, "")} through structured execution, clear communication, and outcome-focused follow-up.`
          : "Delivered measurable support by improving processes, coordinating tasks, and maintaining reliable documentation."
      )
    }))
  };
}
