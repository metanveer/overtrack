import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import formatDate from "../formatDate";
import round1 from "../round1";

export const downloadEmployeeRecords = async (
  data,
  startDate,
  endDate,
  dept
) => {
  if (!data || data.length === 0) return;

  const dataObject = data[0];
  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;
  const today = new Date().toLocaleDateString();

  const safeDate = (dateStr) => dateStr.replace(/\//g, "-");

  // 📄 HEADER TEMPLATE
  const drawHeader = () => {
    const logoWidth = 50;
    const logoHeight = 60;
    doc.addImage(logoBase64, "PNG", margin, 40, logoWidth, logoHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, 60, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("North Patenga, Chattogram", pageWidth / 2, 78, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`${dept} Department`, pageWidth / 2, 98, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Employee Overtime Record", pageWidth / 2, 128, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Start: ${formatDate(startDate)}`, pageWidth - margin, 120, {
      align: "right",
    });
    doc.text(`End: ${formatDate(endDate)}`, pageWidth - margin, 138, {
      align: "right",
    });
  };

  // 📝 FOOTER (with signature block)
  const drawFooter = (pageNum, pageCount) => {
    const signatureOffset = 60; // Space from bottom for signature
    const sigX = pageWidth - margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("______________________", sigX, pageHeight - signatureOffset, {
      align: "right",
    });
    doc.text("Manager / AGM", sigX, pageHeight - signatureOffset + 18, {
      align: "right",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Printed on: ${today}`, margin, pageHeight - 20);
    doc.text(
      `Page ${pageNum} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 20,
      {
        align: "center",
      }
    );
  };

  // Called on every page
  const drawPageElements = () => {
    drawHeader();
    const pageCount = doc.internal.getNumberOfPages();
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
    drawFooter(pageNum, pageCount);
  };

  drawHeader();
  let currentY = 150;

  // 👤 Employee Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Employee: ${dataObject.Employee}`, margin, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    `Total Overtime: ${round1(dataObject.TotalOtHour)} hrs`,
    pageWidth - margin,
    currentY + 20,
    {
      align: "right",
    }
  );

  // 🧾 OT Type Summary Table
  const otTypeTableBody = dataObject.TotalOtHourByType.map((entry) => [
    entry.Type,
    entry.TotalOtHour,
  ]);

  autoTable(doc, {
    startY: currentY + 20,
    margin: { top: 150, bottom: 80, left: margin, right: margin },
    tableWidth: "wrap",
    head: [["OT Type", "Total Hours"]],
    body: otTypeTableBody,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: 0,
      lineColor: [0, 0, 0],
    },
    theme: "grid",
    headStyles: {
      fillColor: [230, 230, 230],
      fontStyle: "bold",
      textColor: "#000000",
      halign: "center",
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
    },
    didDrawPage: drawPageElements,
  });

  currentY = doc.lastAutoTable.finalY + 20;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed OT Breakdown", margin, currentY);
  currentY += 10;

  // 🧮 OT Details Table
  const record = dataObject.OT;
  const body = record.map((entry) => [
    formatDate(entry.Date),
    entry.OtHour,
    entry.OtTime,
    entry.Unit,
    entry.WorkDescription,
    entry.Remarks || "",
    entry.Type,
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { top: 150, bottom: 80, left: margin, right: margin },
    head: [
      [
        "Date",
        "OT Hour",
        "OT Time",
        "Unit",
        "Work Description",
        "Remarks",
        "Type",
      ],
    ],
    body,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
      textColor: 0,
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [230, 230, 230],
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "center" },
    },
    didDrawPage: drawPageElements,
  });

  doc.save(
    `Employee_OT_Record_${dept}_${safeDate(startDate)}_to_${safeDate(
      endDate
    )}.pdf`
  );
};
