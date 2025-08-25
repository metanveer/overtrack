import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

export const downloadUnitsSummary = async (groupedData, dept) => {
  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const documentFont = "times";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;

  // Logo
  doc.addImage(logoBase64, "PNG", margin, 40, 50, 60);

  // Header
  doc.setFontSize(18).setFont(documentFont, "bold");
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
    align: "center",
  });

  doc.setFontSize(12).setFont(documentFont, "normal");
  doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
    align: "center",
  });

  doc.setFontSize(12).setFont(documentFont, "bold");
  doc.text(`${dept} Department`, pageWidth / 2, margin + 38, {
    align: "center",
  });

  // Title
  const titleText = "Overtime Summary";
  const x = pageWidth / 2;
  const y = margin + 78;
  doc.setFontSize(14).setFont(documentFont, "bold");
  doc.text(titleText, x, y, { align: "center" });

  // Underline
  const underlineOffset = 5;
  doc.setLineWidth(1.5).setDrawColor(0, 0, 0);
  const textWidth = doc.getTextWidth(titleText);
  doc.line(
    x - textWidth / 2,
    y + underlineOffset,
    x + textWidth / 2,
    y + underlineOffset
  );

  // Current date
  const today = new Date();
  const currentDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  doc.setFont(documentFont, "bold").setFontSize(11);
  doc.text(`Date: ${currentDate}`, pageWidth - margin, margin + 108, {
    align: "right",
  });

  // Prepare table data
  const sortedData = [...groupedData].sort(
    (a, b) => b.totalOtHours - a.totalOtHours
  );
  const totalSum = sortedData.reduce((sum, item) => sum + item.totalOtHours, 0);

  const body = sortedData.map((row, idx) => [
    { content: idx + 1, styles: { halign: "center" } },
    { content: row.Unit, styles: { halign: "center" } },
    { content: row.totalOtHours, styles: { halign: "center" } },
  ]);

  // Add total row
  body.push([
    {
      content: "Total",
      colSpan: 2,
      styles: { halign: "center", fontStyle: "bold" },
    },
    { content: totalSum, styles: { halign: "center", fontStyle: "bold" } },
  ]);

  // Table
  autoTable(doc, {
    startY: margin + 128,
    margin: { left: margin, right: margin },
    head: [["Rank", "Unit / Work Area", "Overtime Hours"]],
    body,
    styles: {
      font: documentFont,
      fontSize: 11,
      cellPadding: 4,
      textColor: 0,
      valign: "middle",
      halign: "center", // ✅ default center alignment for all cells
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [200, 220, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center", // ✅ center aligned header
    },
    theme: "grid",
    tableWidth: "auto",
  });

  // Signature
  const finalY = doc.lastAutoTable.finalY + 90;
  doc.text("______________________", pageWidth - margin - 130, finalY);
  doc.text("Authorized Signatory", pageWidth - margin - 120, finalY + 15);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, {
      align: "right",
    });
  }
  doc.text(`Print date: ${currentDate}`, margin, pageHeight - 20);

  // Save PDF
  doc.save(`OT_Summary_${dept}_${currentDate}.pdf`);
};
