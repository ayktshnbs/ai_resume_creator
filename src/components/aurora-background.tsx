"use client";

/**
 * Animated aurora gradient background with floating blobs.
 * Renders as a fixed viewport layer so blobs stay visible while scrolling.
 * Uses CSS animations from globals.css — no JS runtime cost.
 */
export function AuroraBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden lg:left-72"
      aria-hidden
    >
      {/* Primary blue blob — top-left */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          left: "-5%",
          top: "-10%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0) 70%)",
        }}
      />
      {/* Indigo blob — top-right */}
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          right: "-8%",
          top: "5%",
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)",
        }}
      />
      {/* Cyan blob — center */}
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          left: "30%",
          top: "40%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(6,182,212,0) 70%)",
        }}
      />
      {/* Purple blob — bottom-right */}
      <div
        className="aurora-blob aurora-blob-4"
        style={{
          right: "10%",
          bottom: "5%",
          width: 480,
          height: 480,
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0) 70%)",
        }}
      />
      {/* Warm accent — bottom-left */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          left: "-10%",
          bottom: "15%",
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle, rgba(244,114,182,0.3) 0%, rgba(244,114,182,0) 70%)",
          animationDelay: "4s",
        }}
      />
      {/* Extra mid-page blob for scroll visibility */}
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          left: "55%",
          top: "55%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
          animationDelay: "6s",
        }}
      />
      {/* Subtle mesh overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
