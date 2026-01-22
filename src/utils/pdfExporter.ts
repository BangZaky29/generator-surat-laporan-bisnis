// @ts-ignore
import html2pdf from 'html2pdf.js';

export const exportToPDF = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const A4_WIDTH = 794; // px @96dpi

  await html2pdf()
    .set({
      filename: `${fileName}.pdf`,
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: false,

      html2canvas: {
        scale: 2,
        windowWidth: A4_WIDTH,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,

        /**
         * 🔥 INI KUNCI UTAMA
         * HAPUS SEMUA SCALE / TRANSFORM DARI PREVIEW
         */
        onclone: (doc) => {
          const report = doc.getElementById(elementId);
          if (!report) return;

          // pastikan A4 asli
          report.style.width = `${A4_WIDTH}px`;
          report.style.minHeight = '1123px';
          report.style.padding = '76px';
          report.style.transform = 'none';
          report.style.boxShadow = 'none';

          // HAPUS SCALE DARI SEMUA PARENT
          let parent = report.parentElement;
          while (parent && parent !== doc.body) {
            parent.style.transform = 'none';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }

          // FORCE semua child visible
          report.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.transform = 'none';
              el.style.visibility = 'visible';
              el.style.opacity = '1';
            }
          });
        }
      },

      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    })
    .from(element)
    .save();
};
