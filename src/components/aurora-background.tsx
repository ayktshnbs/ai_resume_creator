"use client";

/**
 * Animated aurora gradient background with floating blobs.
 * Drop this anywhere as a child of a `relative overflow-hidden` container.
 * Uses CSS animations from globals.css — no JS runtime cost.
 */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Primary blue blob — top-left */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          left: "-5%",
          top: "-10%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
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
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)",
        }}
      />
      {/* Cyan blob — center */}
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          left: "30%",
          top: "30%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)",
        }}
      />
      {/* Purple blob — bottom-right */}
      <div
        className="aurora-blob aurora-blob-4"
        style={{
          right: "10%",
          bottom: "-5%",
          width: 480,
          height: 480,
          background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 70%)",
        }}
      />
      {/* Warm accent — bottom-left */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          left: "-10%",
          bottom: "10%",
          width: 350,
          height: 350,
          background: "radial-gradient(circle, rgba(244,114,182,0.15) 0%, rgba(244,114,182,0) 70%)",
          animationDelay: "4s",
        }}
      />
      {/* Subtle mesh overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
