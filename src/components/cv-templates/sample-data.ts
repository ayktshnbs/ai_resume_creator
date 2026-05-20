import type { ResumeData } from "@/types/resume";

const _svg = '<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" fill="#6366f1"/><circle cx="40" cy="29" r="14" fill="rgba(255,255,255,0.9)"/><path d="M10 80 Q10 54 40 54 Q70 54 70 80Z" fill="rgba(255,255,255,0.85)"/></svg>';
export const SAMPLE_PHOTO = `data:image/svg+xml,${encodeURIComponent(_svg)}`;

export const sampleResume: ResumeData = {
  firstName: "Alexandra",
  lastName: "Mitchell",
  photoUrl: SAMPLE_PHOTO,
  title: "Senior Product Manager",
  email: "[email protected]",
  phone: "(415) 555-0184",
  location: "San Francisco, CA",
  website: "linkedin.com/in/amitchell",
  summary:
    "Senior product leader with 9+ years scaling SaaS and fintech platforms from early-stage to IPO. Combines analytical rigor with strong design intuition to ship products that move metrics that matter — driving $40M+ in incremental ARR across three companies. Trusted partner to engineering, design, and go-to-market teams.",
  experiences: [
    {
      id: "exp-1",
      role: "Senior Product Manager, Growth",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "Mar 2022",
      endDate: "",
      current: true,
      bullets: [
        "Owned the merchant onboarding roadmap end-to-end; reduced time-to-first-payment by 47% and lifted activation conversion from 58% to 81% across 120K+ new accounts.",
        "Led a cross-functional team of 9 engineers, 2 designers, and 3 data scientists shipping 14 experiments per quarter through a rigorous A/B testing program.",
        "Authored the company-wide pricing experimentation framework now used by 6 product teams to validate packaging changes prior to launch.",
        "Drove $18M of incremental annualized revenue in FY24 through checkout optimization and dynamic merchant pricing tiers."
      ]
    },
    {
      id: "exp-2",
      role: "Product Manager",
      company: "Plaid",
      location: "San Francisco, CA",
      startDate: "Jul 2019",
      endDate: "Feb 2022",
      current: false,
      bullets: [
        "Launched Plaid's identity verification product from 0→1, reaching $7M ARR and 220 active customers within 14 months of GA.",
        "Partnered with compliance and risk to expand bank coverage from 11K to 18K institutions across the US, Canada, and UK.",
        "Defined the OKR cadence for the Consumer Platform org (40+ people); model adopted org-wide the following fiscal year."
      ]
    },
    {
      id: "exp-3",
      role: "Associate Product Manager",
      company: "Asana",
      location: "San Francisco, CA",
      startDate: "Aug 2017",
      endDate: "Jun 2019",
      current: false,
      bullets: [
        "Shipped the Timeline view feature, used by 65% of paying customers within 6 months and credited in 22% of annual contract upgrades.",
        "Built and ran the in-product feedback program, processing 4K+ pieces of qualitative input per quarter into a prioritized roadmap."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "Stanford Graduate School of Business",
      degree: "MBA, Concentration in Technology Strategy",
      location: "Stanford, CA",
      startDate: "2015",
      endDate: "2017"
    },
    {
      id: "edu-2",
      school: "University of California, Berkeley",
      degree: "BS, Electrical Engineering & Computer Science",
      location: "Berkeley, CA",
      startDate: "2009",
      endDate: "2013"
    }
  ],
  skills: [
    "Product strategy",
    "Roadmapping",
    "Experimentation & A/B testing",
    "SQL & data analysis",
    "User research",
    "Pricing & packaging",
    "Go-to-market",
    "Cross-functional leadership",
    "OKRs",
    "Stakeholder management",
    "Figma",
    "Jira & Linear"
  ],
  languages: ["English (Native)", "Mandarin (Conversational)"],
  references: []
};

export function formatDateRange(start: string, end: string, current: boolean) {
  const startLabel = start.trim() || "Start";
  const endLabel = current ? "Present" : end.trim() || "End";
  return `${startLabel} — ${endLabel}`;
}

export function getFullName(resume: { firstName: string; lastName: string }) {
  return `${resume.firstName} ${resume.lastName}`.trim();
}
