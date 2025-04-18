import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

export const downloadMonthlyBill = async (data) => {
  if (!data || !data.billData || data.billData.length === 0 || !data.billMonth)
    return;

  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;

  const monthName = new Date(data.billMonth + "-01").toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // 🖼️ Logo
  doc.addImage(logoBase64, "PNG", 250, 40, 50, 60);

  // 🧾 Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Overtime Billing Summary", pageWidth / 2, margin + 38, {
    align: "center",
  });

  // 📅 Month
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Month: ${monthName}`, pageWidth - margin, margin + 38, {
    align: "right",
  });

  // Calculate totals
  const totalOt = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.totalOt) || 0),
    0
  );
  const totalBill = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.bill) || 0),
    0
  );
  const totalPayment = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.payment) || 0),
    0
  );

  // Prepare table
  const head = [
    [
      "#",
      "Name",
      "Designation",
      "Double",
      "Triple",
      "Total HR.",
      "Bill HR.",
      "Diff",
      "Basic TK.",
      "Payment TK.",
      "Remarks",
    ],
  ];

  const body = data.billData.map((emp, idx) => [
    idx + 1,
    emp.name,
    emp.designation,
    emp.double,
    emp.triple,
    emp.totalOt,
    emp.bill,
    emp.difference,
    emp.basic.toLocaleString(),
    emp.payment.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    emp.remarks || "",
  ]);

  body.push([
    "",
    {
      content: "Totals",
      colSpan: 3,
      styles: { fontStyle: "bold", halign: "right" },
    },
    "",
    totalOt,
    totalBill.toLocaleString(),
    "",
    "",
    totalPayment.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    "",
  ]);

  autoTable(doc, {
    startY: margin + 58,
    margin: { left: margin, right: margin },
    head,
    body,
    theme: "grid",
    tableWidth: "auto",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: 0,
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      1: { halign: "left" }, // Name
      2: { halign: "left" }, // Designation
      10: { halign: "left" }, // Remarks
    },
    didDrawPage: function () {
      const pageCount = doc.internal.getNumberOfPages();
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 20,
        {
          align: "right",
        }
      );
    },
  });

  // ✍️ Signature
  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont("helvetica", "normal");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager (Instrument)", pageWidth - margin - 140, finalY + 15);

  doc.save(`Monthly_Billing_Summary_${data.billMonth}.pdf`);
};
