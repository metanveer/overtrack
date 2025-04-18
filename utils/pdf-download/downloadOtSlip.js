import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

export const downloadOtSlip = async (data) => {
  if (!data) return;

  const logoBase64 = await fetchLogoBase64();
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  let currentY = margin;

  // 🖼️ Logo
  doc.addImage(logoBase64, "PNG", margin, currentY, 50, 60);

  // Centered Title, Address & Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, currentY + 20, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("North Patenga, Chattogram", pageWidth / 2, currentY + 38, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Overtime Slip", pageWidth / 2, currentY + 58, { align: "center" });

  currentY += 80;

  // 🧾 OT Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const bold = (label) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, currentY);
    doc.setFont("helvetica", "normal");
  };

  bold("Date:");
  doc.text(`${data.Date}`, margin + 40, currentY);
  doc.setFont("helvetica", "bold");

  doc.setFont("helvetica", "bold");
  doc.text(`Type: ${data.Type}`, pageWidth - margin, currentY, {
    align: "right",
  });
  currentY += 18;

  doc.setFont("helvetica", "bold");
  doc.text("Unit:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.Unit}`, margin + 38, currentY);
  currentY += 18;

  doc.setFont("helvetica", "bold");
  doc.text("Work Description:", margin, currentY);
  currentY += 16;

  const desc = doc.splitTextToSize(
    data.WorkDescription,
    pageWidth - margin * 2
  );
  doc.setFont("helvetica", "normal");
  doc.text(desc, margin, currentY);
  currentY += desc.length * 14 + 10;

  // 👥 Employees Table
  doc.setFont("helvetica", "bold");
  doc.text("Employee", margin, currentY);
  currentY += 10;

  autoTable(doc, {
    startY: currentY + 10,
    margin: { left: margin, right: margin },
    head: [["Name", "OT Time", "OT Hour"]],
    body: data.Employee.map((emp) => [emp.Name, emp.OtTime, emp.OtHour]),
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: "#000000",
      lineColor: "#000000",
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: "#000000",
      fontStyle: "bold",
      lineColor: "#000000", // ensure black border for head
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 200 },
    },
  });

  const tableEndY = doc.lastAutoTable.finalY + 20;

  // 💬 Remarks & ✍️ Signature
  const remarksText = doc.splitTextToSize(
    data.Remarks || "",
    pageWidth / 2 - margin
  );

  if (data.Remarks?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.text("Remarks:", margin, tableEndY);
    doc.setFont("helvetica", "normal");
    doc.text(remarksText, margin, tableEndY + 15);
  }

  // ✍️ Signature to the right
  const signatureY = tableEndY;

  doc.setFont("helvetica", "normal");
  doc.text(
    "_________________________",
    pageWidth - margin - 150,
    signatureY + 10 + 18
  );

  // "Manager (Instrument)" 2 lines (28pt) below
  doc.text(
    "Manager (Instrument)",
    pageWidth - margin - 130,
    signatureY + 10 + 32
  );

  // Save file
  doc.save(`Overtime_Slip_${data.Date}.pdf`);
};
