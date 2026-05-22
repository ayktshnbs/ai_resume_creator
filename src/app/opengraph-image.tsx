import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CV with AI — Professional Resume Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -40,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            CV
          </div>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#111827" }}>
            CV with AI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#111827",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 800,
            marginBottom: 20,
          }}
        >
          Build ATS-Friendly Resumes{" "}
          <span style={{ color: "#6366f1" }}>in Minutes</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 600,
            marginBottom: 40,
          }}
        >
          AI-powered tools, 50+ templates, one-click PDF export
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg, #6366f1, #3b82f6)",
            borderRadius: 50,
            padding: "14px 36px",
            color: "white",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          Start Free — No Credit Card
        </div>
      </div>
    ),
    { ...size }
  );
}
