import type { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

/**
 * Robustly exports an HTML element to a PDF with multiple pages if needed.
 * Solves common issues with scaling, dark mode, and font loading.
 */
export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  options: {
    scale?: number;
    backgroundColor?: string;
    onBeforeCapture?: (clonedDoc: Document) => void;
  } = {}
) {
  const { scale = 2, backgroundColor = "#ffffff", onBeforeCapture } = options;

  // 1. Wait for fonts and images
  await document.fonts.ready;
  
  // Give a small buffer for complex layouts and icon fonts
  await new Promise((resolve) => setTimeout(resolve, 250));

  const images = Array.from(element.getElementsByTagName("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve(null);
          else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        })
    )
  );

  // 2. Capture with html2canvas-pro
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor,
    logging: false,
    allowTaint: true,
    onclone: (clonedDoc, clonedElement) => {
      // Force light mode on the clone
      clonedDoc.documentElement.classList.remove("dark");
      clonedDoc.documentElement.classList.add("light");
      clonedDoc.body.classList.remove("dark");
      clonedDoc.body.classList.add("light");

      // Remove transform/scale from the cloned element to get 1:1 dimensions
      clonedElement.style.transform = "none";
      clonedElement.style.transformOrigin = "unset";
      clonedElement.style.position = "relative";
      clonedElement.style.left = "0";
      clonedElement.style.top = "0";
      clonedElement.style.margin = "0";
      clonedElement.style.display = "block";
      clonedElement.style.visibility = "visible";

      // Ensure background is explicitly white for the captured area
      clonedElement.style.backgroundColor = "#ffffff";

      if (onBeforeCapture) {
        onBeforeCapture(clonedDoc);
      }
    },
  });

  // 3. Generate PDF with multi-page support
  const { jsPDF } = await import("jspdf");
  const imgData = canvas.toDataURL("image/jpeg", 0.95); // JPEG is often smaller than PNG for PDFs
  
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Calculate the scaled dimensions in the PDF
  const imgWidth = pdfWidth;
  const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
  
  let heightLeft = imgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
  heightLeft -= pdfHeight;

  // Add more pages if needed
  while (heightLeft >= 1) { // 1mm threshold to avoid empty pages from rounding errors
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
