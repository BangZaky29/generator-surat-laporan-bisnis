
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const exportToPDF = (elementId: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      reject('Element not found');
      return;
    }

    // 1. Create a Full Screen Loading Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: #ffffff;
      z-index: 99999; /* Highest priority */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
    `;
    
    overlay.innerHTML = `
      <svg class="animate-spin" style="width: 50px; height: 50px; color: #4f46e5; margin-bottom: 20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div style="font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-bottom: 8px;">Sedang Menyusun PDF...</div>
      <div style="font-size: 0.9rem; color: #64748b;">Mohon tunggu, dokumen sedang diproses.</div>
    `;
    document.body.appendChild(overlay);

    // 2. Clone the element
    // IMPORTANT: Clone the node deeply
    const clone = element.cloneNode(true) as HTMLElement;
    
    // 3. Prepare Container for the Clone
    // We append the clone to a temporary container.
    // KEY FIX: Put the container UNDER the overlay using z-index, but ensure it is "visible" for html2canvas to capture it.
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm; /* A4 Width */
      z-index: 99998; /* Under the overlay (99999), but on top of normal content */
      background: white;
      margin: 0;
      padding: 0;
    `;
    
    // Reset styles on the clone to match A4 paper
    clone.style.cssText = `
      width: 100%;
      height: auto;
      min-height: 297mm;
      margin: 0;
      padding: 20mm; /* Match the padding in ReportPreview */
      background: white;
      color: #000;
      transform: none !important;
      box-shadow: none !important;
    `;
    
    // Remove potential conflict classes
    clone.classList.remove('scale-[0.45]', 'scale-[0.6]', 'md:scale-100', 'origin-top', 'transform', 'transition-transform');
    
    // Ensure ID is unique or removed to avoid conflicts
    clone.id = 'pdf-export-clone';
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // 4. Configure html2pdf
    const opt = {
      margin: 0,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      enableLinks: false,
      html2canvas: { 
        scale: 2, // Higher scale for better quality
        useCORS: true, 
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794, // 210mm @ 96 DPI
        width: 794,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as const
      }
    };

    // 5. Generate with a slight delay to allow image rendering
    setTimeout(() => {
      html2pdf().set(opt).from(clone).save()
        .then(() => {
          if (document.body.contains(container)) document.body.removeChild(container);
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          resolve();
        })
        .catch((err: any) => {
          console.error("PDF Export Error:", err);
          if (document.body.contains(container)) document.body.removeChild(container);
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          reject(err);
        });
    }, 1500); // 1.5s delay to ensure DOM is painted and images loaded
  });
};
