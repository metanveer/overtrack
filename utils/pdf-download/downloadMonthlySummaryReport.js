import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import { transformOTMonthlySummary } from "../transformOtMonthlySummary";

export const downloadMonthlySummaryReport = async (data, monthName) => {
  const {
    allDates,
    employeeList,
    employeeMap,
    dayTotals,
    grandTotal,
    topThree,
  } = transformOTMonthlySummary(data);

  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;

  // 🖼️ Add logo
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
  doc.text("Monthly OT Summary", pageWidth / 2, margin + 38, {
    align: "center",
  });

  // 📅 Month name (top right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Month: ${monthName}`, pageWidth - margin, margin + 38, {
    align: "right",
  });

  // 📋 Build table
  const head = [
    ["#", "Employee Name", ...allDates.map((d) => d.slice(8)), "Total"],
  ];

  const body = employeeList.map((name, index) => {
    const row = [
      index + 1,
      name,
      ...allDates.map((d) => employeeMap[name][d] || ""),
      employeeMap[name].total,
    ];
    return row;
  });

  // 🧮 Daily totals
  const totalsRow = [
    "",
    "Total Per Day",
    ...allDates.map((d) => dayTotals[d]),
    grandTotal,
  ];

  body.push(totalsRow);

  autoTable(doc, {
    startY: margin + 58,
    margin: { left: margin, right: margin },
    head,
    body,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: 0,
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      1: { halign: "left" }, // left align employee name
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    didParseCell: function (data) {
      const rowIndex = data.row.index;
      const isTotalRow = rowIndex === body.length - 1;
      const isEmployeeNameColumn = data.column.index === 1;
      const isTopEmployee = isEmployeeNameColumn && topThree.has(data.cell.raw);

      if (isTotalRow) {
        data.cell.styles.fillColor = [220, 220, 220];
        data.cell.styles.fontStyle = "bold";
      }

      if (isTopEmployee) {
        data.cell.styles.fillColor = [255, 255, 200];
        data.cell.styles.fontStyle = "bold";
      }
    },

    didDrawPage: function (data) {
      const pageCount = doc.internal.getNumberOfPages();
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 20,
        { align: "right" }
      );
    },
  });

  doc.save(`Monthly_OT_Summary_${monthName}.pdf`);
};
