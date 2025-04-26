import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import round1 from "../round1";

export const downloadMonthlyBill = async (data, dept) => {
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
  doc.text(`${dept} Department`, pageWidth / 2, margin + 38, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Overtime Billing Summary", pageWidth / 2, margin + 58, {
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
    round1(totalOt),
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
    startY: margin + 78,
    margin: { left: margin, right: margin },
    head,
    body,
    theme: "grid",
    tableWidth: "auto",
    styles: {
      fontSize: 8,
      cellPadding: 3,
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
      0: { halign: "center" }, // #
      1: { halign: "left" }, // Name
      2: { halign: "left" }, // Designation
      3: { halign: "center" }, // Double
      4: { halign: "center" }, // Triple
      5: { halign: "center" }, // Total HR
      6: { halign: "center" }, // Bill HR
      7: { halign: "center" }, // Diff
      8: { halign: "righ" }, // Basic TK
      9: { halign: "right" }, // Payment TK
      10: { halign: "left" }, // Remarks
    },
  });

  // 🧾 Footer with correct total page count
  // const pageCount = doc.internal.getNumberOfPages();

  // for (let i = 1; i <= pageCount; i++) {
  //   doc.setPage(i);
  //   doc.setFontSize(10);
  //   doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, {
  //     align: "right",
  //   });
  // }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const formattedDate = `${day}-${month}-${year} at ${hours}:${minutes} ${ampm}`;

  doc.text(`Prepared on: ${formattedDate}`, margin, pageHeight - 20);

  // ✍️ Signature
  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont("helvetica", "bold");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager / AGM", pageWidth - margin - 140, finalY + 15);

  doc.save(`Monthly_Billing_Summary_${data.billMonth}.pdf`);
};
