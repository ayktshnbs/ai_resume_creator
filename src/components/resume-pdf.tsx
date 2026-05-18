import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { ResumeData, SelectedTemplate, ExperienceItem, EducationItem } from "@/types/resume";

// Register fonts if needed. Using standard ones for now.
// For a real app, you'd probably want to load custom fonts to match the UI.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  photoSidebar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    color: "#6b7280",
    fontSize: 9,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 3,
    marginBottom: 10,
    color: "#1a1a1a",
  },
  content: {
    lineHeight: 1.6,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  role: {
    fontWeight: "bold",
  },
  company: {
    fontWeight: "normal",
    color: "#6b7280",
  },
  date: {
    color: "#6b7280",
    fontSize: 9,
  },
  location: {
    color: "#6b7280",
    fontSize: 9,
    marginBottom: 4,
  },
  bulletList: {
    marginLeft: 15,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skillBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 8,
    fontWeight: "bold",
    color: "#374151",
  },
  // Two Column Layout
  twoColumnContainer: {
    flexDirection: "row",
    gap: 20,
  },
  leftColumn: {
    width: "30%",
    borderRight: 1,
    borderRightColor: "#e5e7eb",
    paddingRight: 15,
  },
  rightColumn: {
    width: "70%",
  },
  sidebarSection: {
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
});

const getAccentColor = (accent: string) => {
  const colors: Record<string, string> = {
    primary: "#6366f1",
    primaryBright: "#4f46e5",
    secondary: "#ec4899",
    ink: "#111827",
    success: "#10b981",
    warning: "#f59e0b",
  };
  return colors[accent] || colors.primary;
};

export const ResumePDF = ({ data, template }: { data: ResumeData; template: SelectedTemplate }) => {
  const accentColor = getAccentColor(template.accent);
  const isTwoColumn = template.layout === "twoColumn";
  const isCompact = template.layout === "compact";
  const isClassic = template.layout === "classic";

  const fontStyle = isClassic ? "Times-Roman" : "Helvetica";

  const fullName = `${data.firstName} ${data.lastName}`.trim() || "Your Name";
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean);

  const photoStyle = {
    transform: `scale(${(data.photoScale ?? 100) / 100})`,
    marginLeft: `${50 - (data.photoX ?? 50)}%`,
    marginTop: `${50 - (data.photoY ?? 50)}%`,
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: template.accent === "ink" ? "#1a1a1a" : accentColor, fontFamily: fontStyle }]}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );

  const Experience = ({ experiences }: { experiences: ExperienceItem[] }) => (
    <View style={{ gap: 10 }}>
      {experiences.map((exp) => (
        <View key={exp.id} style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={[styles.role, { fontFamily: fontStyle }]}>
              {exp.role || "Role Title"} <Text style={[styles.company, { fontFamily: fontStyle }]}>| {exp.company || "Company"}</Text>
            </Text>
            <Text style={[styles.date, { fontFamily: fontStyle }]}>
              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </Text>
          </View>
          {exp.location && <Text style={[styles.location, { fontFamily: fontStyle }]}>{exp.location}</Text>}
          <View style={styles.bulletList}>
            {exp.bullets.filter(Boolean).map((bullet, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={[styles.bulletDot, { fontFamily: fontStyle }]}>•</Text>
                <Text style={[styles.bulletText, { fontFamily: fontStyle }]}>{bullet}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const Education = ({ education }: { education: EducationItem[] }) => (
    <View style={{ gap: 8 }}>
      {education.map((edu) => (
        <View key={edu.id}>
          <View style={styles.experienceHeader}>
            <Text style={[styles.role, { fontFamily: fontStyle }]}>{edu.school || "School"}</Text>
            <Text style={[styles.date, { fontFamily: fontStyle }]}>
              {edu.startDate} - {edu.endDate}
            </Text>
          </View>
          <Text style={[styles.location, { fontFamily: fontStyle }]}>
            {[edu.degree, edu.location].filter(Boolean).join(" / ")}
          </Text>
        </View>
      ))}
    </View>
  );

  const Skills = ({ skills, small }: { skills: string[]; small?: boolean }) => (
    <View style={styles.skillsContainer}>
      {skills.map((skill) => (
        <Text key={skill} style={[styles.skillBadge, small && { fontSize: 7 }, { fontFamily: fontStyle }]}>
          {skill}
        </Text>
      ))}
    </View>
  );

  if (isTwoColumn) {
    return (
      <Document>
        <Page size="A4" style={[styles.page, { fontFamily: fontStyle }]}>
          <View style={styles.twoColumnContainer}>
            <View style={styles.leftColumn}>
              {data.photoUrl && (
                <View style={[styles.photoSidebar, { overflow: "hidden" }]}>
                  <Image src={data.photoUrl} style={[styles.photoSidebar, photoStyle, { marginBottom: 0 }]} />
                </View>
              )}
              <Text style={styles.name}>{fullName}</Text>
              <Text style={[styles.title, { color: accentColor }]}>{data.title || "Professional Title"}</Text>
              
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Contact</Text>
                {contact.map((item) => (
                  <Text key={item} style={{ fontSize: 8, color: "#6b7280", marginBottom: 2 }}>{item}</Text>
                ))}
              </View>

              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Skills</Text>
                <Skills skills={data.skills} small />
              </View>
            </View>

            <View style={styles.rightColumn}>
              <Section title="Summary">
                <Text>{data.summary || "Professional summary..."}</Text>
              </Section>
              
              <Section title="Experience">
                <Experience experiences={data.experiences} />
              </Section>

              <Section title="Education">
                <Education education={data.education} />
              </Section>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={[styles.page, isCompact && { padding: 30 }, { fontFamily: fontStyle }]}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={[styles.title, { color: accentColor }]}>{data.title || "Professional Title"}</Text>
            <View style={styles.contactRow}>
              {contact.map((item, i) => (
                <Text key={item}>{item}{i < contact.length - 1 ? "  •  " : ""}</Text>
              ))}
            </View>
          </View>
          {data.photoUrl && (
            <View style={[styles.photo, { overflow: "hidden" }]}>
              <Image src={data.photoUrl} style={[styles.photo, photoStyle]} />
            </View>
          )}
        </View>

        <Section title="Summary">
          <Text>{data.summary || "Professional summary..."}</Text>
        </Section>

        <Section title="Experience">
          <Experience experiences={data.experiences} />
        </Section>

        <Section title="Education">
          <Education education={data.education} />
        </Section>

        <Section title="Skills">
          <Skills skills={data.skills} />
        </Section>
      </Page>
    </Document>
  );
};
