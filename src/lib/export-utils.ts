import html2canvas from "html2canvas-pro";

// A4 dimensions at 96 DPI (CSS pixels).
const A4_WIDTH_PX = 794;   // 210 mm
const A4_HEIGHT_PX = 1123; // 297 mm

// Atomic blocks that should not be split across page boundaries.
const ATOMIC_SELECTOR =
  "section, li, h1, h2, h3, h4, aside, [data-keep-together]";

// When a natural page cut falls inside an atomic block, snap up to the block's
// top — but only if that move loses less than this fraction of a page.
const MAX_SNAP_BACK_FRACTION = 0.25;

/**
 * Export an HTML element to a multi-page A4 PDF that faithfully matches the
 * on-screen template — identical typography, spacing, and colors.
 *
 * Strategy:
 *  1. Clone the element into an off-screen A4 host with light theme forced.
 *  2. Inside html2canvas's onclone, inline every readable parent stylesheet
 *     as <style> tags. In dev (and sometimes prod), the iframe's automatic
 *     loading of the compiled Tailwind/globals.css runs *after* the capture
 *     fires — every utility class (fonts, weights, colors, uppercase, the
 *     `* { box-sizing: border-box }` reset) then falls back to browser
 *     defaults. Inlining the rules makes them deterministic.
 *  3. Lock the template root to A4 width with box-sizing: border-box so the
 *     layout cannot drift even if a rule is missed.
 *  4. Wait for fonts in both the parent and the cloned-iframe document.
 *  5. Rasterize at 2× DPI.
 *  6. Slice the result into one canvas per PDF page, snapping each cut up to
 *     the nearest atomic-block boundary so paragraphs, bullets, and section
 *     headings never split mid-line.
 */
export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  options: {
    backgroundColor?: string;
    onBeforeCapture?: (clonedDoc: Document) => void;
  } = {}
) {
  const { backgroundColor = "#ffffff", onBeforeCapture } = options;

  // 1. Block on parent-document fonts and images so we clone a fully-laid-out tree.
  await document.fonts.ready;
  await Promise.all(
    Array.from(element.getElementsByTagName("img")).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
          } else {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }
        })
    )
  );

  // 2. Snapshot every readable parent stylesheet now. We re-inject these into
  //    html2canvas's iframe during onclone.
  const inlinedStylesheets = snapshotStylesheets();

  // 3. Build the off-screen export host at the exact A4 width.
  const offscreen = document.createElement("div");
  offscreen.style.position = "fixed";
  offscreen.style.left = "-99999px";
  offscreen.style.top = "0";
  offscreen.style.width = `${A4_WIDTH_PX}px`;
  offscreen.style.minHeight = `${A4_HEIGHT_PX}px`;
  offscreen.style.background = backgroundColor;
  offscreen.style.margin = "0";
  offscreen.style.padding = "0";
  offscreen.style.zIndex = "-1";
  offscreen.style.pointerEvents = "none";
  offscreen.classList.add("light");

  const clone = element.cloneNode(true) as HTMLElement;
  // The host wrapper carries no preview-only chrome.
  clone.style.transform = "none";
  clone.style.transformOrigin = "unset";
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.minWidth = `${A4_WIDTH_PX}px`;
  clone.style.maxWidth = "none";
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.position = "static";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.border = "none";
  clone.style.borderRadius = "0";
  clone.style.backgroundColor = backgroundColor;
  clone.style.display = "block";
  clone.style.visibility = "visible";
  clone.style.boxSizing = "border-box";

  // The first child is the template's own root (Onyx, Sterling, sidebar
  // layouts, LetterLayout, etc.). Pin it to A4 width with border-box so even
  // if the iframe drops Tailwind's preflight, units still compute right.
  const templateRoot = clone.firstElementChild as HTMLElement | null;
  if (templateRoot) {
    templateRoot.style.width = `${A4_WIDTH_PX}px`;
    templateRoot.style.minWidth = `${A4_WIDTH_PX}px`;
    templateRoot.style.maxWidth = `${A4_WIDTH_PX}px`;
    templateRoot.style.boxSizing = "border-box";
  }

  offscreen.appendChild(clone);
  document.body.appendChild(offscreen);

  // 4. Allow a paint frame so layout settles before html2canvas reads it.
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );

  // 5. Record atomic-block boundaries so we can snap page cuts to safe spots.
  const captureScale = 2;
  const breakPoints = computeBreakPoints(clone, captureScale);

  try {
    const canvas = await html2canvas(clone, {
      scale: captureScale,
      useCORS: true,
      backgroundColor,
      logging: false,
      allowTaint: true,
      windowWidth: A4_WIDTH_PX,
      width: A4_WIDTH_PX,
      onclone: async (clonedDoc) => {
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.documentElement.classList.add("light");
        clonedDoc.body.classList.remove("dark");
        clonedDoc.body.classList.add("light");

        injectStylesheets(clonedDoc, inlinedStylesheets);

        // Belt-and-braces: re-lock the cloned host dimensions inside the iframe.
        const cloneHost = clonedDoc.getElementById(element.id);
        const tplRoot = (cloneHost?.firstElementChild ?? null) as HTMLElement | null;
        if (cloneHost) {
          cloneHost.style.width = `${A4_WIDTH_PX}px`;
          cloneHost.style.boxSizing = "border-box";
        }
        if (tplRoot) {
          tplRoot.style.width = `${A4_WIDTH_PX}px`;
          tplRoot.style.minWidth = `${A4_WIDTH_PX}px`;
          tplRoot.style.maxWidth = `${A4_WIDTH_PX}px`;
          tplRoot.style.boxSizing = "border-box";
        }

        // Wait for the iframe's own FontFaceSet to settle.
        if (clonedDoc.fonts && typeof clonedDoc.fonts.ready?.then === "function") {
          try {
            await clonedDoc.fonts.ready;
          } catch {
            // Non-fatal — some browsers reject on errored faces.
          }
        }

        if (onBeforeCapture) onBeforeCapture(clonedDoc);
      },
    });

    // 6. Slice into PDF pages with safe page breaks.
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pdfWidthMm = pdf.internal.pageSize.getWidth();
    const pdfHeightMm = pdf.internal.pageSize.getHeight();

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const naturalPageHeightPx = (canvasW * pdfHeightMm) / pdfWidthMm;
    const slices = planPageSlices(canvasH, naturalPageHeightPx, breakPoints);

    for (let i = 0; i < slices.length; i++) {
      if (i > 0) pdf.addPage();
      const slice = slices[i];
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvasW;
      pageCanvas.height = Math.ceil(naturalPageHeightPx);
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) continue;

      // Solid white background under partial slices.
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        slice.top,
        canvasW,
        slice.height,
        0,
        0,
        canvasW,
        slice.height
      );

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidthMm,
        pdfHeightMm,
        undefined,
        "FAST"
      );
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    if (offscreen.parentNode) {
      offscreen.parentNode.removeChild(offscreen);
    }
  }
}

/* ── Stylesheet snapshot / injection ───────────────────────────────────── */

type StylesheetSnapshot = { css: string; href?: string };

function snapshotStylesheets(): StylesheetSnapshot[] {
  const out: StylesheetSnapshot[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      let css = "";
      for (const rule of Array.from(rules)) {
        css += rule.cssText + "\n";
      }
      if (css) out.push({ css });
    } catch {
      // Cross-origin sheet — re-link by URL inside the iframe.
      if (sheet.href) out.push({ css: "", href: sheet.href });
    }
  }
  return out;
}

function injectStylesheets(doc: Document, snapshots: StylesheetSnapshot[]) {
  for (const snap of snapshots) {
    if (snap.css) {
      const style = doc.createElement("style");
      style.setAttribute("data-export-inlined", "");
      style.textContent = snap.css;
      doc.head.appendChild(style);
    } else if (snap.href) {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = snap.href;
      link.setAttribute("data-export-inlined", "");
      doc.head.appendChild(link);
    }
  }
}

/* ── Safe page-break planning ──────────────────────────────────────────── */

function computeBreakPoints(host: HTMLElement, scale: number): Array<{ top: number; bottom: number }> {
  const hostRect = host.getBoundingClientRect();
  const atoms = host.querySelectorAll(ATOMIC_SELECTOR);
  const blocks: Array<{ top: number; bottom: number }> = [];
  atoms.forEach((el) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    if (r.height <= 0) return;
    blocks.push({
      top: Math.round((r.top - hostRect.top) * scale),
      bottom: Math.round((r.bottom - hostRect.top) * scale),
    });
  });
  blocks.sort((a, b) => a.top - b.top);
  return blocks;
}

/**
 * Plan one slice per output page. Each slice's bottom edge is snapped up to
 * the nearest atomic-block boundary so a section heading or bullet line is
 * never split between pages — unless snapping would lose more than
 * MAX_SNAP_BACK_FRACTION of a page (in which case we accept a hard cut to
 * keep page count reasonable).
 */
function planPageSlices(
  canvasH: number,
  pageHeightPx: number,
  blocks: Array<{ top: number; bottom: number }>
): Array<{ top: number; height: number }> {
  const slices: Array<{ top: number; height: number }> = [];
  let cursor = 0;
  let safety = 0;
  while (cursor < canvasH - 1 && safety++ < 50) {
    const naturalBottom = Math.min(canvasH, cursor + pageHeightPx);
    if (naturalBottom >= canvasH - 1) {
      slices.push({ top: cursor, height: canvasH - cursor });
      break;
    }
    // Find the lowest break Y at or above `naturalBottom` that doesn't
    // bisect an atomic block. We start with naturalBottom and walk down.
    let cutY = naturalBottom;
    const minCutY = cursor + pageHeightPx * (1 - MAX_SNAP_BACK_FRACTION);
    for (const block of blocks) {
      if (block.top >= naturalBottom) continue;
      if (block.bottom <= naturalBottom) continue;
      // naturalBottom is INSIDE this block — snap up to the block's top.
      if (block.top > cursor && block.top < cutY) {
        cutY = block.top;
      }
    }
    if (cutY < minCutY) cutY = naturalBottom; // snap-back too aggressive — keep hard cut
    if (cutY <= cursor) cutY = naturalBottom; // safety
    slices.push({ top: cursor, height: cutY - cursor });
    cursor = cutY;
  }
  if (slices.length === 0) slices.push({ top: 0, height: canvasH });
  return slices;
}
