import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";

type RequestBody = {
  resumeData?: ResumeData;
  targetRole?: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

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

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: MODEL,
      temperature: 0.25,
      input: `
You are an expert CV editor.
Improve the resume while keeping all facts truthful.
Do not invent employers, schools, dates, or exact numbers.
Return only valid JSON in this exact shape:
{"resumeData":{...complete resume object...}}

Resume:
${JSON.stringify(resume, null, 2)}
`
    });

    const parsed = parseJson(response.output_text || "");

    if (!parsed || typeof parsed !== "object" || !("resumeData" in parsed)) {
      return NextResponse.json({ improvedText: response.output_text || "" });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI error.";
    return NextResponse.json({ error: message }, { status: 500 });
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
