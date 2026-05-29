"use client";

/**
 * Ambient background for authenticated app pages.
 *
 * Design goals (vs the earlier 6-blob version):
 *   • Be felt, not noticed — three calm color glows instead of six animated ones.
 *   • Add structural depth via a soft dot-grid + a mesh gradient, so empty
 *     space behind editors has texture without competing for attention.
 *   • Keep GPU work down — fewer large blurs, slower animation, no overlaid
 *     mesh on top of moving elements.
 *   • Sit behind the desktop sidebar (lg:left-72) and full-bleed on mobile.
 *   • Tune for both light and dark themes via `--surface`/`--ink` tokens so it
 *     reads correctly across the app's two color modes.
 */
export function AuroraBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden lg:left-72"
      aria-hidden
    >
      {/* Base wash — slightly different from --body-bg so the page reads as
          layered, not flat. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(ellipse 50% 45% at 85% 90%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(ellipse 45% 40% at 70% 15%, rgba(168,85,247,0.07), transparent 65%)"
        }}
      />

      {/* Three calm aurora glows — slow drift, smaller radius than before. */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          left: "-8%",
          top: "-12%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%)"
        }}
      />
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          right: "-6%",
          top: "30%",
          width: 360,
          height: 360,
          background:
            "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0) 70%)"
        }}
      />
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          left: "35%",
          bottom: "-10%",
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0) 70%)"
        }}
      />

      {/* Soft dot grid — gives the empty space behind editors visual texture
          without distracting from content. Faded to nothing at the edges so
          the corner glows feel like they emanate from the page. */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 75% at 50% 50%, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 75% at 50% 50%, black 30%, transparent 90%)"
        }}
      />

      {/* Thin top-edge vignette so the sidebar's right border doesn't read
          as a hard cut against the bright glow behind it. */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface/40 to-transparent" />
    </div>
  );
}
