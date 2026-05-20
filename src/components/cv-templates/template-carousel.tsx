"use client";

import { OnyxPreview } from "./onyx-preview";
import { SterlingPreview } from "./sterling-preview";
import { AtlasPreview } from "./atlas-preview";
import { AuroraPreview } from "./aurora-preview";
import { MeridianPreview } from "./meridian-preview";
import { BeaconPreview } from "./beacon-preview";
import { QuillPreview } from "./quill-preview";
import { VertexPreview } from "./vertex-preview";
import { ObsidianPreview } from "./obsidian-preview";
import { HelixPreview } from "./helix-preview";
import { parametricTemplates } from "./parametric-template";
import { sampleResume } from "./sample-data";

const handcrafted = [
  OnyxPreview,
  SterlingPreview,
  AtlasPreview,
  VertexPreview,
  AuroraPreview,
  MeridianPreview,
  BeaconPreview,
  QuillPreview,
  ObsidianPreview,
  HelixPreview,
];

const parametric = [
  "Nova", "Iron", "Coast", "Parchment", "Signal",
  "Frost", "Midnight", "Prism", "Stripe", "Journey",
  "Ember", "Forest", "Meadow", "Flux", "Zen",
].map((name) => parametricTemplates[name]).filter(Boolean);

const previews = [...handcrafted, ...parametric];

export function TemplateCarousel() {
  const marqueeItems = [...previews, ...previews, ...previews];

  return (
    <div className="relative overflow-hidden bg-[#0a0a0c] py-24 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[50%] w-[30%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-10 mb-16 text-center md:text-left">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Cinematic Designs
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Premium <span className="text-white/40">Visuals for</span>
          <br />
          Professional <span className="gradient-text">Impact</span>.
        </h2>
      </div>

      <div className="group relative flex overflow-hidden py-10 [perspective:2000px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent" />

        <div className="flex shrink-0 animate-marquee gap-8 px-4 group-hover:[animation-play-state:paused]">
          {marqueeItems.map((Comp, idx) => (
            <div
              key={idx}
              className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
              style={{ width: 280, height: 396 }}
            >
              <div
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  transform: "scale(0.355)",
                  transformOrigin: "top left"
                }}
              >
                <Comp resume={sampleResume} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
