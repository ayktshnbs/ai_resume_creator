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
        "Owned the merchant onboarding roadmap end-to-end; reduced time-to-first-payment by 47% and lifted activation conversion from 58% to 81%.",
        "Led a cross-functional team of 9 engineers, 2 designers, and 3 data scientists shipping 14 experiments per quarter through a rigorous A/B testing program.",
        "Authored the company-wide pricing experimentation framework that became the standard playbook for packaging validation prior to launch.",
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
        "Launched Plaid's identity verification product from 0→1, reaching $7M ARR within 14 months of GA.",
        "Partnered with compliance and risk to expand bank coverage across the US, Canada, and UK.",
        "Defined the OKR cadence for the Consumer Platform organization; the framework was adopted org-wide the following fiscal year."
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
        "Shipped the Timeline view feature, which drove a 22% increase in annual contract upgrades within 6 months of launch.",
        "Built and ran the in-product feedback program, turning qualitative input into a prioritized quarterly roadmap."
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
  certificates: [
    {
      id: "cert-1",
      name: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      issueDate: "2023-02",
      expiryDate: "2025-02",
      credentialUrl: "https://www.scrumalliance.org/community/profile/amitchell",
    },
    {
      id: "cert-2",
      name: "Google Project Management Certificate",
      issuer: "Google · Coursera",
      issueDate: "2022-08",
      expiryDate: "",
      credentialUrl: "",
    },
  ],
  references: []
};

/**
 * Format a single date string for display in a résumé.
 * - "YYYY-MM"     → "Mar 2024"           (from the month picker)
 * - "YYYY-MM-DD"  → "Mar 2024"           (from the date picker)
 * - anything else → returned as-is        (legacy free-text dates like "Mar 2022")
 *
 * Empty input returns an empty string so callers can decide how to label it.
 */
export function formatResumeDate(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return trimmed;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return trimmed;
  }
  // Use a stable English locale here so the rendered CV PDF is consistent
  // across users regardless of their browser locale. Templates that need
  // localised month names should call Intl directly with their own locale.
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function formatDateRange(start: string, end: string, current: boolean) {
  const startLabel = formatResumeDate(start) || "Start";
  const endLabel = current ? "Present" : formatResumeDate(end) || "End";
  return `${startLabel} — ${endLabel}`;
}

export function getFullName(resume: { firstName: string; lastName: string }) {
  return `${resume.firstName} ${resume.lastName}`.trim();
}
