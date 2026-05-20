import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { ResumeData, SelectedTemplate, ExperienceItem, EducationItem } from "@/types/resume";

const getAccentColor = (template: { accent: string; themeColor?: string }) => {
  if (template.themeColor) return template.themeColor;
  const colors: Record<string, string> = {
    primary: "#6366f1",
    primaryBright: "#4f46e5",
    secondary: "#ec4899",
    ink: "#111827",
    success: "#10b981",
    warning: "#f59e0b",
  };
  return colors[template.accent] || colors.primary;
};

type PdfStyle = "clean" | "sidebar-dark" | "sidebar-light" | "centered" | "compact-dense" | "accent-bar" | "band-top" | "timeline";

const TEMPLATE_STYLE_MAP: Record<string, PdfStyle> = {
  "Modern Minimalist": "clean",
  "Professional Serif": "centered",
  "Creative Tech": "sidebar-light",
  "Lumina Compact": "compact-dense",
  "Startup Operator": "sidebar-light",
  "Graduate Clean": "clean",
  "Executive Impact": "centered",
  "Academic Classic": "clean",
  "Obsidian Dark": "sidebar-dark",
  "Helix Modern": "clean",
  Nova: "clean", Frost: "clean", Slate: "clean", Ember: "clean",
  Sage: "clean", Teal: "clean", Coral: "clean", Azure: "clean",
  Iron: "sidebar-dark", Midnight: "sidebar-dark", Forest: "sidebar-dark",
  Crimson: "sidebar-dark", Plum: "sidebar-dark", Ocean: "sidebar-dark",
  Coast: "sidebar-light", Prism: "sidebar-light", Meadow: "sidebar-light",
  Copper: "sidebar-light", Blush: "sidebar-light", Storm: "sidebar-light",
  Parchment: "centered", Chronicle: "centered", Heritage: "centered",
  Regal: "centered", Ivory: "centered",
  Flux: "compact-dense", Swift: "compact-dense", Dash: "compact-dense", Pulse: "compact-dense",
  Stripe: "accent-bar", Edge: "accent-bar", Rail: "accent-bar", Shard: "accent-bar",
  Signal: "band-top", Zen: "band-top", Futura: "band-top", Crest: "band-top",
  Journey: "timeline", Pathway: "timeline", Milestone: "timeline",
};

const SIDEBAR_BG_MAP: Record<string, string> = {
  Iron: "#1e293b", Midnight: "#0f172a", Forest: "#14532d",
  Crimson: "#1c1917", Plum: "#1e1b4b", Ocean: "#0c4a6e",
  "Obsidian Dark": "#0f172a",
};

function getPdfStyle(name: string): PdfStyle {
  return TEMPLATE_STYLE_MAP[name] || "clean";
}

const GRAY = "#6b7280";
const BORDER = "#e5e7eb";
const DARK = "#111827";

function base(fontBold: string, accentColor: string) {
  return StyleSheet.create({
    section: { marginBottom: 14 },
    sectionTitle: {
      fontSize: 9, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1.2,
      color: accentColor, borderBottom: `1 solid ${accentColor}`, paddingBottom: 2, marginBottom: 8,
    },
    sectionTitleClassic: {
      fontSize: 9, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1.2,
      color: DARK, borderBottom: `0.5 solid ${BORDER}`, paddingBottom: 2, marginBottom: 8,
    },
    experienceItem: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    role: { fontFamily: fontBold, fontSize: 10 },
    company: { color: GRAY },
    date: { color: GRAY, fontSize: 8.5 },
    location: { color: GRAY, fontSize: 8.5, marginBottom: 3 },
    bullet: { flexDirection: "row", marginBottom: 2 },
    bulletDot: { width: 10, color: accentColor },
    bulletText: { flex: 1, lineHeight: 1.5 },
    eduItem: { marginBottom: 8 },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillBadge: {
      backgroundColor: accentColor + "18", paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 10, fontSize: 8, fontFamily: fontBold, color: accentColor,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, color: GRAY, fontSize: 8.5 },
    contactRowCentered: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, color: GRAY, fontSize: 8.5 },
    photo: { width: 68, height: 68, borderRadius: 6, marginLeft: 16 },
  });
}

export const ResumePDF = ({ data, template }: { data: ResumeData; template: SelectedTemplate }) => {
  const accentColor = getAccentColor(template);
  const pdfStyle = getPdfStyle(template.name);
  const useSerif = pdfStyle === "centered" || template.fontFamily === "serif";
  const fontFamily = useSerif ? "Times-Roman" : "Helvetica";
  const fontBold = useSerif ? "Times-Bold" : "Helvetica-Bold";

  const S = base(fontBold, accentColor);
  const fullName = `${data.firstName} ${data.lastName}`.trim() || "Your Name";
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean);

  const SectionTitle = ({ title, classic }: { title: string; classic?: boolean }) => (
    <Text style={classic ? S.sectionTitleClassic : S.sectionTitle}>{title}</Text>
  );
};

  const ExperienceBlock = ({ experiences }: { experiences: ExperienceItem[] }) => (
    <View>
      {experiences.map((exp) => (
        <View key={exp.id} style={S.experienceItem}>
          <View style={S.expHeader}>
            <Text style={S.role}>
              {exp.role || "Role"}{" "}
              <Text style={[S.company, { fontFamily }]}>| {exp.company || "Company"}</Text>
            </Text>
            <Text style={S.date}>
              {exp.startDate || "—"} – {exp.current ? "Present" : exp.endDate || "—"}
            </Text>
          </View>
          {exp.location ? <Text style={S.location}>{exp.location}</Text> : null}
          <View style={{ marginLeft: 8 }}>
            {exp.bullets.filter(Boolean).map((b, i) => (
              <View key={i} style={S.bullet}>
                <Text style={[S.bulletDot, { fontFamily }]}>•</Text>
                <Text style={[S.bulletText, { fontFamily }]}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const TimelineExperienceBlock = ({ experiences }: { experiences: ExperienceItem[] }) => (
    <View>
      {experiences.map((exp, idx) => (
        <View key={exp.id} style={{ flexDirection: "row", marginBottom: 10 }}>
          <View style={{ width: 16, alignItems: "center", marginRight: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: accentColor, backgroundColor: "#fff" }} />
            {idx < experiences.length - 1 && (
              <View style={{ width: 1, flex: 1, backgroundColor: accentColor + "30", marginTop: 2 }} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={S.expHeader}>
              <Text style={S.role}>
                {exp.role || "Role"}{" "}
                <Text style={[S.company, { fontFamily }]}>| {exp.company || "Company"}</Text>
              </Text>
              <Text style={S.date}>
                {exp.startDate || "—"} – {exp.current ? "Present" : exp.endDate || "—"}
              </Text>
            </View>
            {exp.location ? <Text style={S.location}>{exp.location}</Text> : null}
            <View style={{ marginLeft: 8 }}>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <View key={i} style={S.bullet}>
                  <Text style={[S.bulletDot, { fontFamily }]}>•</Text>
                  <Text style={[S.bulletText, { fontFamily }]}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const EducationBlock = ({ education }: { education: EducationItem[] }) => (
    <View>
      {education.map((edu) => (
        <View key={edu.id} style={S.eduItem}>
          <View style={S.expHeader}>
            <Text style={S.role}>{edu.school || "School"}</Text>
            <Text style={S.date}>{edu.startDate} – {edu.endDate}</Text>
          </View>
          <Text style={[S.location, { fontFamily }]}>
            {[edu.degree, edu.location].filter(Boolean).join(" / ")}
          </Text>
        </View>
      ))}
    </View>
  );

  const SkillsBlock = ({ skills, small }: { skills: string[]; small?: boolean }) => (
    <View style={S.skillsWrap}>
      {skills.map((s) => (
        <Text key={s} style={small ? [S.skillBadge, { fontSize: 7 }] : S.skillBadge}>{s}</Text>
      ))}
    </View>
  );

  /* ── Sidebar Dark ── */
  if (pdfStyle === "sidebar-dark") {
    const sidebarBg = SIDEBAR_BG_MAP[template.name] || "#0f172a";
    return (
      <Document>
        <Page size="A4" style={{ fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", minHeight: "100%" }}>
            <View style={{ width: "30%", backgroundColor: sidebarBg, padding: 28 }}>
              {data.photoUrl && <Image src={data.photoUrl} style={{ width: 68, height: 68, borderRadius: 6, marginBottom: 14 }} />}
              <Text style={{ fontSize: 18, fontFamily: fontBold, color: "#fff", marginBottom: 4 }}>{fullName}</Text>
              <View style={{ height: 3, width: 36, backgroundColor: accentColor, marginBottom: 8 }} />
              <Text style={{ fontSize: 9, color: accentColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
                {data.title || "Professional Title"}
              </Text>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Contact</Text>
                <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
                {contact.map((c) => <Text key={c} style={{ fontSize: 8, color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>{c}</Text>)}
              </View>
              {data.skills.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Skills</Text>
                  <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3 }}>
                    {data.skills.map((s) => (
                      <Text key={s} style={{ fontSize: 7, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, color: "#fff" }}>{s}</Text>
                    ))}
                  </View>
                </View>
              )}
              {data.education.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Education</Text>
                  <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
                  {data.education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 8.5, fontFamily: fontBold, color: "#fff" }}>{edu.school}</Text>
                      <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>{edu.degree}</Text>
                      <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.5)" }}>{edu.startDate} – {edu.endDate}</Text>
                    </View>
                  ))}
                </View>
              )}
              {data.languages && data.languages.length > 0 && (
                <View>
                  <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Languages</Text>
                  <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
                  {data.languages.map((l) => <Text key={l} style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{l}</Text>)}
                </View>
              )}
            </View>
            <View style={{ flex: 1, padding: 28 }}>
              {data.summary ? (
                <View style={S.section}>
                  <SectionTitle title="Profile" />
                  <Text style={{ lineHeight: 1.6, fontSize: 9.5, fontFamily }}>{data.summary}</Text>
                </View>
              ) : null}
              <View style={S.section}>
                <SectionTitle title="Experience" />
                <ExperienceBlock experiences={data.experiences} />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  /* ── Sidebar Light ── */
  if (pdfStyle === "sidebar-light") {
    return (
      <Document>
        <Page size="A4" style={{ fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", minHeight: "100%" }}>
            <View style={{ width: "30%", backgroundColor: "#f8fafc", padding: 28, borderRight: `1 solid ${BORDER}` }}>
              {data.photoUrl && <Image src={data.photoUrl} style={{ width: 68, height: 68, borderRadius: 6, marginBottom: 14 }} />}
              <Text style={{ fontSize: 18, fontFamily: fontBold, color: DARK, marginBottom: 4 }}>{fullName}</Text>
              <View style={{ height: 2, width: 36, backgroundColor: accentColor, marginBottom: 8 }} />
              <Text style={{ fontSize: 9, color: accentColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
                {data.title || "Professional Title"}
              </Text>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: accentColor, marginBottom: 6 }}>Contact</Text>
                {contact.map((c) => <Text key={c} style={{ fontSize: 8, color: GRAY, marginBottom: 3 }}>{c}</Text>)}
              </View>
              {data.skills.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: accentColor, marginBottom: 6 }}>Skills</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3 }}>
                    {data.skills.map((s) => (
                      <Text key={s} style={{ fontSize: 7, backgroundColor: accentColor + "15", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, color: accentColor }}>{s}</Text>
                    ))}
                  </View>
                </View>
              )}
              {data.education.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 7, fontFamily: fontBold, textTransform: "uppercase", letterSpacing: 1, color: accentColor, marginBottom: 6 }}>Education</Text>
                  {data.education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 8.5, fontFamily: fontBold, color: DARK }}>{edu.school}</Text>
                      <Text style={{ fontSize: 8, color: GRAY }}>{edu.degree}</Text>
                      <Text style={{ fontSize: 7, color: GRAY }}>{edu.startDate} – {edu.endDate}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={{ flex: 1, padding: 28 }}>
              {data.summary ? (
                <View style={S.section}>
                  <SectionTitle title="Summary" />
                  <Text style={{ lineHeight: 1.6, fontSize: 9.5, fontFamily }}>{data.summary}</Text>
                </View>
              ) : null}
              <View style={S.section}>
                <SectionTitle title="Experience" />
                <ExperienceBlock experiences={data.experiences} />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  /* ── Band Top ── */
  if (pdfStyle === "band-top") {
    return (
      <Document>
        <Page size="A4" style={{ fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ backgroundColor: accentColor, padding: 28, paddingBottom: 22 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={{ fontSize: 26, fontFamily: fontBold, color: "#fff", marginBottom: 4 }}>{fullName}</Text>
                <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1 }}>
                  {data.title || "Professional Title"}
                </Text>
              </View>
              {data.photoUrl && <Image src={data.photoUrl} style={{ width: 60, height: 60, borderRadius: 6 }} />}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {contact.map((c, i) => (
                <Text key={c} style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>
                  {c}{i < contact.length - 1 ? "  ·  " : ""}
                </Text>
              ))}
            </View>
          </View>
          <View style={{ padding: 28 }}>
            {data.summary ? (
              <View style={S.section}>
                <SectionTitle title="Summary" />
                <Text style={{ lineHeight: 1.6, fontFamily }}>{data.summary}</Text>
              </View>
            ) : null}
            <View style={S.section}>
              <SectionTitle title="Experience" />
              <ExperienceBlock experiences={data.experiences} />
            </View>
            <View style={S.section}>
              <SectionTitle title="Education" />
              <EducationBlock education={data.education} />
            </View>
            {data.skills.length > 0 && (
              <View style={S.section}>
                <SectionTitle title="Skills" />
                <SkillsBlock skills={data.skills} />
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  }

  /* ── Accent Bar ── */
  if (pdfStyle === "accent-bar") {
    const BarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <View style={{ width: 3, backgroundColor: accentColor + "30", borderRadius: 2 }} />
        <View style={{ flex: 1 }}>
          <SectionTitle title={title} />
          {children}
        </View>
      </View>
    );
    return (
      <Document>
        <Page size="A4" style={{ padding: 42, fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20, paddingBottom: 18, borderBottom: `1.5 solid ${accentColor}` }}>
            <View style={{ width: 3, backgroundColor: accentColor, borderRadius: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 26, fontFamily: fontBold, marginBottom: 3 }}>{fullName}</Text>
              <Text style={{ fontSize: 12, fontFamily: fontBold, color: accentColor, marginBottom: 8 }}>
                {data.title || "Professional Title"}
              </Text>
              <View style={S.contactRow}>
                {contact.map((c, i) => (
                  <Text key={c}>{c}{i < contact.length - 1 ? "  ·  " : ""}</Text>
                ))}
              </View>
            </View>
            {data.photoUrl && <Image src={data.photoUrl} style={S.photo} />}
          </View>
          {data.summary ? (
            <BarSection title="Summary">
              <Text style={{ lineHeight: 1.6, fontFamily }}>{data.summary}</Text>
            </BarSection>
          ) : null}
          <BarSection title="Experience">
            <ExperienceBlock experiences={data.experiences} />
          </BarSection>
          <BarSection title="Education">
            <EducationBlock education={data.education} />
          </BarSection>
          {data.skills.length > 0 && (
            <BarSection title="Skills">
              <SkillsBlock skills={data.skills} />
            </BarSection>
          )}
        </Page>
      </Document>
    );
  }

  /* ── Timeline ── */
  if (pdfStyle === "timeline") {
    return (
      <Document>
        <Page size="A4" style={{ padding: 42, fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 26, fontFamily: fontBold, marginBottom: 3 }}>{fullName}</Text>
            <Text style={{ fontSize: 12, fontFamily: fontBold, color: accentColor, marginBottom: 8 }}>
              {data.title || "Professional Title"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ height: 0.5, flex: 1, backgroundColor: accentColor + "40" }} />
              <View style={S.contactRow}>
                {contact.map((c, i) => (
                  <Text key={c}>{c}{i < contact.length - 1 ? "  ·  " : ""}</Text>
                ))}
              </View>
              <View style={{ height: 0.5, flex: 1, backgroundColor: accentColor + "40" }} />
            </View>
          </View>
          {data.summary ? (
            <View style={S.section}>
              <SectionTitle title="Summary" />
              <Text style={{ lineHeight: 1.6, fontFamily }}>{data.summary}</Text>
            </View>
          ) : null}
          <View style={S.section}>
            <SectionTitle title="Experience" />
            <TimelineExperienceBlock experiences={data.experiences} />
          </View>
          <View style={S.section}>
            <SectionTitle title="Education" />
            <EducationBlock education={data.education} />
          </View>
          {data.skills.length > 0 && (
            <View style={S.section}>
              <SectionTitle title="Skills" />
              <SkillsBlock skills={data.skills} />
            </View>
          )}
        </Page>
      </Document>
    );
  }

  /* ── Centered / Classic ── */
  if (pdfStyle === "centered") {
    return (
      <Document>
        <Page size="A4" style={{ padding: 42, fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `0.5 solid ${BORDER}` }}>
            <Text style={{ fontSize: 24, fontFamily: fontBold, marginBottom: 4, textAlign: "center" }}>{fullName}</Text>
            <Text style={{ fontSize: 11, fontFamily: fontBold, color: accentColor, textAlign: "center", marginBottom: 10 }}>
              {data.title || "Professional Title"}
            </Text>
            <View style={{ height: 2, width: 60, backgroundColor: accentColor, marginVertical: 6 }} />
            <View style={S.contactRowCentered}>
              {contact.map((c, i) => (
                <Text key={c}>{c}{i < contact.length - 1 ? "  ·  " : ""}</Text>
              ))}
            </View>
          </View>
          {data.summary ? (
            <View style={S.section}>
              <SectionTitle title="Profile" classic />
              <Text style={{ lineHeight: 1.7, fontFamily, textAlign: "justify" }}>{data.summary}</Text>
            </View>
          ) : null}
          <View style={S.section}>
            <SectionTitle title="Experience" classic />
            <ExperienceBlock experiences={data.experiences} />
          </View>
          <View style={S.section}>
            <SectionTitle title="Education" classic />
            <EducationBlock education={data.education} />
          </View>
          {data.skills.length > 0 && (
            <View style={S.section}>
              <SectionTitle title="Skills" classic />
              <SkillsBlock skills={data.skills} />
            </View>
          )}
        </Page>
      </Document>
    );
  }

  /* ── Compact ── */
  if (pdfStyle === "compact-dense") {
    return (
      <Document>
        <Page size="A4" style={{ padding: 30, fontFamily, fontSize: 9.5, color: DARK, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 14, borderBottom: `0.5 solid ${BORDER}` }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 3, backgroundColor: accentColor, borderRadius: 2, marginRight: 10, alignSelf: "stretch" }} />
              <View>
                <Text style={{ fontSize: 20, fontFamily: fontBold, marginBottom: 3 }}>{fullName}</Text>
                <Text style={{ fontSize: 12, fontFamily: fontBold, color: accentColor, marginBottom: 8 }}>
                  {data.title || "Professional Title"}
                </Text>
              </View>
            </View>
            {data.photoUrl && <Image src={data.photoUrl} style={S.photo} />}
          </View>
          <View style={S.contactRow}>
            {contact.map((c, i) => (
              <Text key={c}>{c}{i < contact.length - 1 ? "  ·  " : ""}</Text>
            ))}
          </View>
          <View style={{ marginTop: 14 }}>
            {data.summary ? (
              <View style={S.section}>
                <SectionTitle title="Summary" />
                <Text style={{ lineHeight: 1.5, fontFamily }}>{data.summary}</Text>
              </View>
            ) : null}
            <View style={S.section}>
              <SectionTitle title="Experience" />
              <ExperienceBlock experiences={data.experiences} />
            </View>
            <View style={S.section}>
              <SectionTitle title="Education" />
              <EducationBlock education={data.education} />
            </View>
            {data.skills.length > 0 && (
              <View style={S.section}>
                <SectionTitle title="Skills" />
                <SkillsBlock skills={data.skills} />
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  }

  /* ── Default: Clean single-column ── */
  return (
    <Document>
      <Page size="A4" style={{ padding: 42, fontFamily, fontSize: 10, color: DARK, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 18, borderBottom: `1.5 solid ${accentColor}` }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 26, fontFamily: fontBold, marginBottom: 3 }}>{fullName}</Text>
            <Text style={{ fontSize: 12, fontFamily: fontBold, color: accentColor, marginBottom: 8 }}>
              {data.title || "Professional Title"}
            </Text>
            <View style={S.contactRow}>
              {contact.map((c, i) => (
                <Text key={c}>{c}{i < contact.length - 1 ? "  ·  " : ""}</Text>
              ))}
            </View>
          </View>
          {data.photoUrl && <Image src={data.photoUrl} style={S.photo} />}
        </View>
        {data.summary ? (
          <View style={S.section}>
            <SectionTitle title="Summary" />
            <Text style={{ lineHeight: 1.6, fontFamily }}>{data.summary}</Text>
          </View>
        ) : null}
        <View style={S.section}>
          <SectionTitle title="Experience" />
          <ExperienceBlock experiences={data.experiences} />
        </View>
        <View style={S.section}>
          <SectionTitle title="Education" />
          <EducationBlock education={data.education} />
        </View>
        {data.skills.length > 0 && (
          <View style={S.section}>
            <SectionTitle title="Skills" />
            <SkillsBlock skills={data.skills} />
          </View>
        )}
      </Page>
    </Document>
  );
};
