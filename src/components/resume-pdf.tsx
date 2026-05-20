import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { ResumeData, SelectedTemplate, ExperienceItem, EducationItem } from "@/types/resume";

const getAccentColor = (template: SelectedTemplate) => {
  if (template.themeColor) return template.themeColor;
  const templateDefaults: Record<string, string> = {
    "Modern Minimalist": "#0058bc",
    "Professional Serif": "#0058bc",
    "Creative Tech": "#2563eb",
    "Lumina Compact": "#0d9488",
    "Startup Operator": "#4648d4",
    "Graduate Clean": "#111827",
    "Executive Impact": "#0b3d5a",
    "Academic Classic": "#6b5235",
    "Obsidian Dark": "#22d3ee",
    "Helix Modern": "#6366f1",
  };
  return templateDefaults[template.name] || "#2563eb";
};

const GRAY = "#475569";
const LIGHT_GRAY = "#94a3b8";
const BORDER = "#d1d5db";
const DARK = "#0f172a";

export const ResumePDF = ({ data, template }: { data: ResumeData; template: SelectedTemplate }) => {
  const accentColor = getAccentColor(template);
  const useSerif = template.fontFamily === "serif";
  const fontFamily = useSerif ? "Times-Roman" : "Helvetica";
  const fontBold = useSerif ? "Times-Bold" : "Helvetica-Bold";
  const fontItalic = useSerif ? "Times-Italic" : "Helvetica-Oblique";
  const f = { fontFamily, fontBold, fontItalic };

  const fullName = `${data.firstName} ${data.lastName}`.trim() || "Your Name";
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean);

  const props = { data, accent: accentColor, f, fullName, contact };

  const renderContent = () => {
    // 1. Handcrafted named templates
    switch (template.name) {
      case "Modern Minimalist": return <OnyxLayout {...props} />;
      case "Professional Serif": return <SterlingLayout {...props} />;
      case "Creative Tech": return <AtlasLayout {...props} />;
      case "Lumina Compact": return <VertexLayout {...props} />;
      case "Startup Operator": return <AuroraLayout {...props} />;
      case "Graduate Clean": return <MeridianLayout {...props} />;
      case "Executive Impact": return <BeaconLayout {...props} />;
      case "Academic Classic": return <QuillLayout {...props} />;
      case "Obsidian Dark": return <ObsidianLayout {...props} />;
      case "Helix Modern": return <HelixLayout {...props} />;
    }

    // 2. Parametric styles
    switch (template.parametricStyle) {
      case "sidebar-dark": return <AtlasLayout {...props} />;
      case "sidebar-light": return <AuroraLayout {...props} />;
      case "band-top": return <BeaconLayout {...props} />;
      case "compact-dense": return <VertexLayout {...props} />;
      case "timeline": return <HelixLayout {...props} />;
      case "centered": return <QuillLayout {...props} />;
      case "accent-bar": return <OnyxLayout {...props} />;
      case "clean": return <DefaultLayout {...props} />;
    }

    // 3. Fallback
    return <DefaultLayout {...props} layout={template.layout} />;
  };

  return (
    <Document title={`${fullName} - Resume`}>
      {renderContent()}
    </Document>
  );
};

/* ══════════════════════════════════════
   SHARED UTILS
   ══════════════════════════════════════ */

const formatDateRange = (start?: string, end?: string, current?: boolean) => {
  const s = start?.trim() || "Start";
  const e = current ? "Present" : end?.trim() || "End";
  return `${s} — ${e}`;
};

const Bullets = ({ items, color, f }: { items: string[]; color: string; f: any }) => (
  <View style={{ marginTop: 4, paddingLeft: 10 }}>
    {items.filter(Boolean).map((b, i) => (
      <View key={i} style={{ flexDirection: "row", marginBottom: 2 }}>
        <Text style={{ width: 8, color, fontSize: 8 }}>•</Text>
        <Text style={{ flex: 1, fontSize: 9.5, lineHeight: 1.5, color: "#1e293b", fontFamily: f.fontFamily }}>{b}</Text>
      </View>
    ))}
  </View>
);

/* ══════════════════════════════════════
   ONYX — MODERN MINIMALIST (Boxed index)
   ══════════════════════════════════════ */
const OnyxLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "18mm 20mm", fontFamily: f.fontFamily, color: DARK, backgroundColor: "#ffffff" },
    header: { marginBottom: 30, paddingLeft: 10, borderLeft: `3 solid ${accent}` },
    name: { fontSize: 32, fontFamily: f.fontBold, textTransform: "uppercase", lineHeight: 1 },
    title: { fontSize: 14, fontFamily: f.fontBold, color: accent, marginTop: 4, letterSpacing: 1 },
    contact: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10, fontSize: 9.5, color: GRAY },
    section: { marginTop: 20 },
    sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
    index: { width: 18, height: 18, backgroundColor: accent + "1a", color: accent, fontSize: 9, fontFamily: f.fontBold, textAlign: "center", paddingTop: 4, borderRadius: 2 },
    sectionTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", letterSpacing: 2 },
    divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
    expItem: { marginBottom: 15 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    expMain: { flex: 1 },
    role: { fontSize: 11, fontFamily: f.fontBold, textTransform: "uppercase" },
    company: { color: accent, fontFamily: f.fontBold },
    date: { fontSize: 9, fontFamily: f.fontBold, color: GRAY, backgroundColor: "#f1f5f9", padding: "2 6", borderRadius: 2 },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={S.contact}>
          {contact.map((c: string) => <Text key={c}>{c}</Text>)}
        </View>
      </View>

      {data.summary && (
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.index}>01</Text>
            <Text style={S.sectionTitle}>Overview</Text>
            <View style={S.divider} />
          </View>
          <View style={{ paddingLeft: 28 }}>
            <Text style={{ fontSize: 9.5, lineHeight: 1.6 }}>{data.summary}</Text>
          </View>
        </View>
      )}

      <View style={S.section}>
        <View style={S.sectionHeader}>
          <Text style={S.index}>02</Text>
          <Text style={S.sectionTitle}>Experience</Text>
          <View style={S.divider} />
        </View>
        <View style={{ paddingLeft: 28 }}>
          {data.experiences.map((exp: any) => (
            <View key={exp.id} style={S.expItem}>
              <View style={S.expHeader}>
                <View style={S.expMain}>
                  <Text style={S.role}>{exp.role || "Role"} <Text style={S.company}> @ {exp.company || "Company"}</Text></Text>
                </View>
                <Text style={S.date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <Bullets items={exp.bullets} color={accent} f={f} />
            </View>
          ))}
        </View>
      </View>

      {data.education.length > 0 && (
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.index}>03</Text>
            <Text style={S.sectionTitle}>Education</Text>
            <View style={S.divider} />
          </View>
          <View style={{ paddingLeft: 28 }}>
            {data.education.map((edu: any) => (
              <View key={edu.id} style={{ marginBottom: 10 }}>
                <Text style={S.role}>{edu.school || "School"}</Text>
                <Text style={{ fontSize: 9.5, color: GRAY }}>{edu.degree || "Degree"} {edu.location ? ` — ${edu.location}` : ""}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};

/* ══════════════════════════════════════
   STERLING — PROFESSIONAL SERIF (Vertical Line)
   ══════════════════════════════════════ */
const SterlingLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "20mm 22mm", fontFamily: f.fontFamily, color: "#1f2937", backgroundColor: "#ffffff" },
    header: { marginBottom: 25 },
    name: { fontSize: 28, fontFamily: f.fontBold, textTransform: "uppercase", letterSpacing: 1 },
    title: { fontSize: 12, fontFamily: f.fontBold, italic: true, color: accent, marginTop: 4 },
    contact: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 10, fontSize: 9.5, color: GRAY },
    body: { flexDirection: "row", gap: 25 },
    dividerLine: { width: 1.5, backgroundColor: "#f3f4f6", alignSelf: "stretch", borderRadius: 10 },
    main: { flex: 1 },
    sectionTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, marginBottom: 10, letterSpacing: 1.5 },
    expItem: { marginBottom: 18 },
    role: { fontSize: 12, fontFamily: f.fontBold, color: "#0f172a" },
    company: { fontSize: 10, italic: true, color: accent, marginTop: 2, fontFamily: f.fontBold },
    date: { fontSize: 9.5, italic: true, color: GRAY },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={S.contact}>
          {contact.map((c: string, i: number) => (
            <View key={c} style={{ flexDirection: "row", alignItems: "center" }}>
              {i > 0 && <Text style={{ color: BORDER, marginRight: 15 }}>/</Text>}
              <Text>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={S.body}>
        <View style={S.dividerLine} />
        <View style={S.main}>
          {data.summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={S.sectionTitle}>Profile</Text>
              <Text style={{ fontSize: 9.5, lineHeight: 1.7 }}>{data.summary}</Text>
            </View>
          )}
          <View>
            <Text style={S.sectionTitle}>Professional Experience</Text>
            {data.experiences.map((exp: any) => (
              <View key={exp.id} style={S.expItem}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={S.role}>{exp.role || "Role"}</Text>
                  <Text style={S.date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                <Text style={S.company}>{exp.company || "Company"}{exp.location ? ` — ${exp.location}` : ""}</Text>
                <Bullets items={exp.bullets} color={accent} f={f} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   ATLAS — CREATIVE TECH (Dark Sidebar)
   ══════════════════════════════════════ */
const AtlasLayout = ({ data, accent, f, fullName }: any) => {
  const S = StyleSheet.create({
    page: { flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: "72mm", backgroundColor: "#0f172a", color: "#ffffff", padding: "20mm 12mm" },
    main: { flex: 1, padding: "20mm 18mm", color: DARK },
    name: { fontSize: 24, fontFamily: f.fontBold, lineHeight: 1.1 },
    accentBar: { height: 3, width: 40, backgroundColor: accent, marginVertical: 8 },
    sidebarTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, marginBottom: 12, letterSpacing: 2 },
    sideContactLabel: { fontSize: 8, fontFamily: f.fontBold, textTransform: "uppercase", color: LIGHT_GRAY, marginTop: 8 },
    sideText: { fontSize: 9, color: "#ffffff", marginBottom: 4 },
    skillBadge: { padding: "2 6", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 8, marginBottom: 4, marginRight: 4 },
    mainSection: { marginBottom: 25 },
    mainHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
    hash: { color: accent, fontFamily: f.fontBold, fontSize: 11 },
    mainTitle: { fontSize: 11, fontFamily: f.fontBold, textTransform: "uppercase", letterSpacing: 2 },
    expItem: { position: "relative", paddingLeft: 15, marginBottom: 15 },
    dot: { position: "absolute", left: 0, top: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: accent },
    line: { position: "absolute", left: 2.5, top: 10, bottom: -10, width: 1, backgroundColor: "#e2e8f0" },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.sidebar}>
        <Text style={S.name}>{fullName}</Text>
        <View style={S.accentBar} />
        <Text style={{ fontSize: 10, opacity: 0.8 }}>{data.title || "Professional Title"}</Text>

        <View style={{ marginTop: 25 }}>
          <Text style={S.sidebarTitle}>// Contact</Text>
          {data.email && <View><Text style={S.sideContactLabel}>Email</Text><Text style={S.sideText}>{data.email}</Text></View>}
          {data.phone && <View><Text style={S.sideContactLabel}>Phone</Text><Text style={S.sideText}>{data.phone}</Text></View>}
        </View>

        {data.skills.length > 0 && (
          <View style={{ marginTop: 25 }}>
            <Text style={S.sidebarTitle}>// Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data.skills.map((s: string) => <Text key={s} style={S.skillBadge}>{s}</Text>)}
            </View>
          </View>
        )}
      </View>

      <View style={S.main}>
        {data.summary && (
          <View style={S.mainSection}>
            <View style={S.mainHeader}><Text style={S.hash}>#</Text><Text style={S.mainTitle}>Profile</Text></View>
            <Text style={{ fontSize: 10, lineHeight: 1.6 }}>{data.summary}</Text>
          </View>
        )}
        <View style={S.mainSection}>
          <View style={S.mainHeader}><Text style={S.hash}>#</Text><Text style={S.mainTitle}>Experience</Text></View>
          {data.experiences.map((exp: any) => (
            <View key={exp.id} style={S.expItem}>
              <View style={S.dot} /><View style={S.line} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"}</Text>
                <Text style={{ fontSize: 9, color: GRAY }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <Text style={{ fontSize: 10, color: accent, fontFamily: f.fontBold }}>{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</Text>
              <Bullets items={exp.bullets} color={GRAY} f={f} />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   AURORA — STARTUP OPERATOR (Light Sidebar)
   ══════════════════════════════════════ */
const AuroraLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { backgroundColor: "#ffffff", fontFamily: f.fontFamily },
    header: { backgroundColor: "#f1f5f9", padding: "16mm 20mm", borderBottom: "1 solid #e2e8f0" },
    name: { fontSize: 30, fontFamily: f.fontBold, color: DARK },
    title: { fontSize: 13, fontFamily: f.fontBold, color: accent, marginTop: 4 },
    body: { flexDirection: "row", padding: "16mm 20mm", gap: 35 },
    sidebar: { width: "60mm" },
    main: { flex: 1 },
    sectionTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, letterSpacing: 2, marginBottom: 4 },
    rule: { height: 2, width: 25, backgroundColor: accent, marginBottom: 10 },
    card: { border: "1 solid #e2e8f0", borderRadius: 6, padding: 10, marginBottom: 12 },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={{ flexDirection: "row", gap: 15, marginTop: 10, fontSize: 9, color: GRAY }}>
          {contact.map((c: string) => <Text key={c}>{c}</Text>)}
        </View>
      </View>
      <View style={S.body}>
        <View style={S.sidebar}>
          <Text style={S.sectionTitle}>About</Text><View style={S.rule} />
          <Text style={{ fontSize: 9.5, lineHeight: 1.6 }}>{data.summary}</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={S.sectionTitle}>Skills</Text><View style={S.rule} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {data.skills.map((s: string) => <Text key={s} style={{ fontSize: 8.5, border: "1 solid #e2e8f0", padding: "2 5" }}>{s}</Text>)}
            </View>
          </View>
        </View>
        <View style={S.main}>
          <Text style={S.sectionTitle}>Experience</Text><View style={S.rule} />
          {data.experiences.map((exp: any) => (
            <View key={exp.id} style={S.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"}</Text>
                <Text style={{ fontSize: 9, color: accent, fontFamily: f.fontBold }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <Text style={{ fontSize: 10, color: GRAY, marginTop: 2 }}>{exp.company || "Company"}</Text>
              <Bullets items={exp.bullets} color={accent} f={f} />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   VERTEX — LUMINA COMPACT (Grid)
   ══════════════════════════════════════ */
const VertexLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "16mm 18mm", fontFamily: f.fontFamily, color: DARK },
    header: { borderBottom: `2 solid ${accent}`, pb: 10, mb: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    body: { flexDirection: "row", gap: 20 },
    main: { flex: 1 },
    side: { width: "55mm" },
    sectionTitle: { fontSize: 9.5, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, letterSpacing: 2, marginBottom: 8 },
  });
  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <View>
          <Text style={{ fontSize: 24, fontFamily: f.fontBold }}>{fullName}</Text>
          <Text style={{ fontSize: 11, fontFamily: f.fontBold, color: accent, textTransform: "uppercase", marginTop: 2 }}>{data.title || "Professional Title"}</Text>
        </View>
        <View style={{ textAlign: "right", fontSize: 9, color: GRAY }}>
          {contact.map((c: string) => <Text key={c}>{c}</Text>)}
        </View>
      </View>
      <View style={S.body}>
        <View style={S.main}>
          <Text style={S.sectionTitle}>Experience</Text>
          {data.experiences.map((exp: any) => (
            <View key={exp.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"} <Text style={{ color: accent }}>· {exp.company || "Company"}</Text></Text>
                <Text style={{ fontSize: 9, color: GRAY }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <Bullets items={exp.bullets} color={accent} f={f} />
            </View>
          ))}
        </View>
        <View style={S.side}>
          <Text style={S.sectionTitle}>Education</Text>
          {data.education.map((edu: any) => (
            <View key={edu.id} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: f.fontBold }}>{edu.school || "School"}</Text>
              <Text style={{ fontSize: 9, color: GRAY }}>{edu.degree || "Degree"}</Text>
            </View>
          ))}
          <View style={{ marginTop: 15 }}>
            <Text style={S.sectionTitle}>Skills</Text>
            <View style={{ paddingLeft: 8 }}>
              {data.skills.map((s: string) => <Text key={s} style={{ fontSize: 9, marginBottom: 2 }}>• {s}</Text>)}
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   OBSIDIAN — DARK MODE
   ══════════════════════════════════════ */
const ObsidianLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "20mm 22mm", backgroundColor: "#0b0d12", color: "#ffffff", fontFamily: f.fontFamily },
    header: { flexDirection: "row", justifyContent: "space-between", borderBottom: "1 solid rgba(255,255,255,0.1)", pb: 20, mb: 25 },
    name: { fontSize: 32, fontFamily: f.fontBold, letterSpacing: -0.5 },
    label: { fontSize: 9, textTransform: "uppercase", color: accent, letterSpacing: 3, marginBottom: 5 },
    sideContact: { textAlign: "right", fontSize: 9, color: "#cbd5e1", lineHeight: 1.5 },
    sectionTitle: { fontSize: 10, textTransform: "uppercase", color: LIGHT_GRAY, letterSpacing: 2, marginBottom: 10 },
    expItem: { pl: 15, position: "relative", marginBottom: 20 },
    dot: { position: "absolute", left: 0, top: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: accent },
    role: { fontSize: 12, fontFamily: f.fontBold, color: "#ffffff" },
    company: { color: accent, fontSize: 10, fontFamily: f.fontBold, marginTop: 2 },
    date: { fontSize: 9, color: LIGHT_GRAY, textTransform: "uppercase" },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <View>
          <Text style={S.label}>Curriculum Vitae</Text>
          <Text style={S.name}>{fullName}</Text>
          <Text style={{ fontSize: 12, color: LIGHT_GRAY, marginTop: 4 }}>{data.title || "Professional Title"}</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {contact.map((c: string) => <Text key={c} style={S.sideContact}>{c}</Text>)}
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={S.sectionTitle}>Summary</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#e2e8f0" }}>{data.summary}</Text>
      </View>

      <View>
        <Text style={S.sectionTitle}>Experience</Text>
        {data.experiences.map((exp: any) => (
          <View key={exp.id} style={S.expItem}>
            <View style={S.dot} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={S.role}>{exp.role || "Role"}</Text>
              <Text style={S.date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
            </View>
            <Text style={S.company}>{exp.company || "Company"}</Text>
            <Bullets items={exp.bullets} color={accent} f={f} />
          </View>
        ))}
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   BEACON — EXECUTIVE IMPACT (Band Top)
   ══════════════════════════════════════ */
const BeaconLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { backgroundColor: "#ffffff", fontFamily: f.fontFamily },
    header: { backgroundColor: accent, color: "#ffffff", padding: "18mm 22mm 14mm 22mm" },
    name: { fontSize: 32, fontFamily: f.fontBold },
    title: { fontSize: 12, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginTop: 4 },
    contactGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 15, gap: 20 },
    contactItem: { fontSize: 9.5, opacity: 0.9 },
    main: { padding: "14mm 22mm" },
    sectionTitle: { fontSize: 11, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, letterSpacing: 2 },
    accentRule: { height: 2, width: 35, backgroundColor: accent, marginVertical: 8 },
    expItem: { borderLeft: `3 solid ${accent}`, paddingLeft: 15, marginBottom: 15 },
    role: { fontSize: 12, fontFamily: f.fontBold, color: accent },
    company: { fontSize: 10.5, fontFamily: f.fontBold, color: DARK, marginTop: 2 },
    date: { fontSize: 9, color: GRAY, textTransform: "uppercase", fontFamily: f.fontBold },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={S.contactGrid}>
          {contact.map((c: string) => <Text key={c} style={S.contactItem}>{c}</Text>)}
        </View>
      </View>

      <View style={S.main}>
        {data.summary && (
          <View style={{ marginBottom: 20 }}>
            <Text style={S.sectionTitle}>Executive Summary</Text>
            <View style={S.accentRule} />
            <Text style={{ fontSize: 10, lineHeight: 1.7 }}>{data.summary}</Text>
          </View>
        )}
        <View>
          <Text style={S.sectionTitle}>Experience</Text>
          <View style={S.accentRule} />
          {data.experiences.map((exp: any) => (
            <View key={exp.id} style={S.expItem}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={S.role}>{exp.role || "Role"}</Text>
                <Text style={S.date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <Text style={S.company}>{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</Text>
              <Bullets items={exp.bullets} color={accent} f={f} />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   QUILL — ACADEMIC CLASSIC (Centered)
   ══════════════════════════════════════ */
const QuillLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "22mm 24mm", fontFamily: f.fontFamily, color: "#1f2937", backgroundColor: "#ffffff" },
    header: { textAlign: "center", marginBottom: 30 },
    label: { fontSize: 9, textTransform: "uppercase", color: accent, letterSpacing: 4, marginBottom: 8 },
    name: { fontSize: 34, fontFamily: f.fontFamily, fontWeight: "normal" },
    title: { fontSize: 12, italic: true, color: GRAY, marginTop: 8 },
    contact: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 15, fontSize: 9, textTransform: "uppercase" },
    section: { marginTop: 25 },
    sectionHeader: { textAlign: "center", marginBottom: 15 },
    sectionTitle: { fontSize: 11, textTransform: "uppercase", color: accent, letterSpacing: 4 },
    ornament: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4 },
    line: { width: 60, height: 0.5, backgroundColor: accent, opacity: 0.3 },
    expItem: { marginBottom: 15 },
    role: { fontSize: 12, fontFamily: f.fontBold },
    company: { fontSize: 11, italic: true, color: GRAY, marginTop: 2 },
  });

  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.label}>Curriculum Vitae</Text>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={S.contact}>
          {contact.map((c: string, i: number) => (
            <View key={c} style={{ flexDirection: "row", alignItems: "center" }}>
              {i > 0 && <Text style={{ color: accent, opacity: 0.3, marginRight: 20 }}>◆</Text>}
              <Text>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      {data.summary && (
        <Text style={{ fontSize: 10.5, lineHeight: 1.7, textAlign: "justify", marginBottom: 10 }}>{data.summary}</Text>
      )}

      <View style={S.section}>
        <View style={S.sectionHeader}>
          <Text style={S.sectionTitle}>Professional Experience</Text>
          <View style={S.ornament}><View style={S.line} /><Text style={{ fontSize: 8, color: accent }}>❦</Text><View style={S.line} /></View>
        </View>
        {data.experiences.map((exp: any) => (
          <View key={exp.id} style={S.expItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={S.role}>{exp.role || "Role"}</Text>
              <Text style={{ fontSize: 10, italic: true, color: GRAY }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
            </View>
            <Text style={S.company}>{exp.company || "Company"}</Text>
            <Bullets items={exp.bullets} color={GRAY} f={f} />
          </View>
        ))}
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   MERIDIAN — GRADUATE CLEAN
   ══════════════════════════════════════ */
const MeridianLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: "22mm 24mm", fontFamily: f.fontFamily, color: DARK },
    header: { borderBottom: "1 solid #000", pb: 15, mb: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    sectionTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 10 },
    expGrid: { flexDirection: "row", gap: 20, marginBottom: 15 },
    dateCol: { width: "30mm", fontSize: 9, color: GRAY, textTransform: "uppercase" },
  });
  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <View><Text style={{ fontSize: 32, fontFamily: f.fontBold }}>{fullName}</Text><Text style={{ fontSize: 12, color: "#374151" }}>{data.title || "Professional Title"}</Text></View>
        <View style={{ textAlign: "right", fontSize: 9, color: GRAY }}>{contact.map((c: string) => <Text key={c}>{c}</Text>)}</View>
      </View>
      <View style={{ marginBottom: 20 }}><Text style={S.sectionTitle}>Summary</Text><Text style={{ fontSize: 10, lineHeight: 1.7 }}>{data.summary}</Text></View>
      <View>
        <Text style={S.sectionTitle}>Experience</Text>
        {data.experiences.map((exp: any) => (
          <View key={exp.id} style={S.expGrid}>
            <Text style={S.dateCol}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"}</Text>
              <Text style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>{exp.company || "Company"}</Text>
              <Bullets items={exp.bullets} color="#000" f={f} />
            </View>
          </View>
        ))}
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   HELIX — HELIX MODERN (Initial Circle)
   ══════════════════════════════════════ */
const HelixLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: "70mm", backgroundColor: accent, color: "#ffffff", padding: "18mm 12mm" },
    main: { flex: 1, padding: "20mm 18mm", backgroundColor: "#fafaff" },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 15, textAlign: "center", paddingTop: 18, fontSize: 20, fontFamily: f.fontBold },
    sidebarTitle: { fontSize: 10, fontFamily: f.fontBold, textTransform: "uppercase", color: "#ffffff", marginBottom: 8, borderBottom: "1 solid rgba(255,255,255,0.3)", pb: 2 },
    card: { backgroundColor: "#ffffff", border: "1 solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 12 },
  });
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase();
  return (
    <Page size="A4" style={S.page}>
      <View style={S.sidebar}>
        <View style={S.avatar}><Text>{initials}</Text></View>
        <Text style={{ fontSize: 20, fontFamily: f.fontBold }}>{fullName}</Text>
        <Text style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>{data.title || "Professional Title"}</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={S.sidebarTitle}>Contact</Text>
          {contact.map((c: string) => <Text key={c} style={{ fontSize: 9, marginBottom: 4 }}>{c}</Text>)}
        </View>
      </View>
      <View style={S.main}>
        <Text style={{ fontSize: 11, fontFamily: f.fontBold, color: accent, textTransform: "uppercase", marginBottom: 10 }}>Experience</Text>
        {data.experiences.map((exp: any) => (
          <View key={exp.id} style={S.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"}</Text>
              <Text style={{ fontSize: 8, color: accent, textTransform: "uppercase" }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
            </View>
            <Text style={{ fontSize: 10, color: accent, fontFamily: f.fontBold, marginTop: 2 }}>{exp.company || "Company"}</Text>
            <Bullets items={exp.bullets} color={GRAY} f={f} />
          </View>
        ))}
      </View>
    </Page>
  );
};

/* ══════════════════════════════════════
   DEFAULT FALLBACK
   ══════════════════════════════════════ */
const DefaultLayout = ({ data, accent, f, fullName, contact }: any) => {
  const S = StyleSheet.create({
    page: { padding: 42, fontFamily: f.fontFamily, color: DARK },
    header: { borderBottom: `2 solid ${accent}`, pb: 15, mb: 20 },
    name: { fontSize: 28, fontFamily: f.fontBold },
    title: { fontSize: 12, color: accent, fontFamily: f.fontBold, marginTop: 4 },
  });
  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.name}>{fullName}</Text>
        <Text style={S.title}>{data.title || "Professional Title"}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 10, fontSize: 9, color: GRAY }}>
          {contact.map((c: string) => <Text key={c}>{c}</Text>)}
        </View>
      </View>
      <View>
        {data.summary && <View style={{ marginBottom: 20 }}><Text style={{ fontSize: 10, lineHeight: 1.6 }}>{data.summary}</Text></View>}
        <Text style={{ fontSize: 11, fontFamily: f.fontBold, textTransform: "uppercase", color: accent, marginBottom: 10 }}>Experience</Text>
        {data.experiences.map((exp: any) => (
          <View key={exp.id} style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11, fontFamily: f.fontBold }}>{exp.role || "Role"} | {exp.company || "Company"}</Text>
              <Text style={{ fontSize: 9, color: GRAY }}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
            </View>
            <Bullets items={exp.bullets} color={accent} f={f} />
          </View>
        ))}
      </View>
    </Page>
  );
};
