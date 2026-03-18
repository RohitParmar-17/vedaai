"use client";

import { Download } from "lucide-react";

export default function DownloadButton({ targetId }: { targetId: string }) {
  const handleDownload = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const canvas = await html2canvas(el, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 900,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("question-paper.pdf");
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-white text-[#1C1917] rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
    >
      <Download size={14} />
      Download as PDF
    </button>
  );
}
