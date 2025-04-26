import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import formatDate from "../formatDate";

export const downloadMonthlyDetailsReport = async (
  groupedData,
  monthName,
  unitConfig,
  dept
) => {
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
  doc.text(`${dept} Department`, pageWidth / 2, margin + 38, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${
      unitConfig
        ? `Overtime Log for ${unitConfig.unitName}`
        : "Monthly Overtime Report"
    }`,
    pageWidth / 2,
    margin + 58,
    {
      align: "center",
    }
  );

  // 📅 Month name (top right corner)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `${unitConfig ? `Start date: ${unitConfig.start}` : ``}`,
    pageWidth - margin,
    margin + 20,
    {
      align: "right",
    }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `${unitConfig ? `End date: ${unitConfig.end}` : `Month: ${monthName}`}`,
    pageWidth - margin,
    margin + 38,
    {
      align: "right",
    }
  );

  let body = [];
  let grandTotalOt = 0; // now only accumulates daily totals

  groupedData.forEach((group) => {
    const date = group._id;
    let dateRowSpan = group.records.reduce(
      (acc, rec) => acc + rec.Employee.length,
      0
    );
    let datePrinted = false;
    let dailyTotalOt = 0;

    group.records.forEach((record) => {
      const empLen = record.Employee.length;

      record.Employee.forEach((emp, empIndex) => {
        const row = [];

        const otHour = parseFloat(emp.OtHour || 0);
        const roundedOt = Math.round(otHour * 10) / 10;

        if (!datePrinted) {
          row.push({ content: formatDate(date), rowSpan: dateRowSpan });
          datePrinted = true;
        }

        if (empIndex === 0) {
          row.push({ content: record.Type, rowSpan: empLen });
          if (!unitConfig) {
            row.push({ content: record.Unit, rowSpan: empLen });
          }
          row.push({
            content: record.WorkDescription,
            rowSpan: empLen,
            styles: { halign: "left" },
          });
        }

        row.push({ content: emp.Name, styles: { halign: "left" } });
        row.push(emp.OtTime);
        row.push(roundedOt.toFixed(1)); // 1 decimal place
        dailyTotalOt += roundedOt;

        if (empIndex === 0) {
          row.push({ content: record.Remarks, rowSpan: empLen });
        }

        body.push(row);
      });
    });

    // Push daily total row

    const dailyTotalColSpan = unitConfig ? 5 : 6;

    const dailyTotalRounded = Math.round(dailyTotalOt * 10) / 10;
    grandTotalOt += dailyTotalRounded;

    body.push([
      {
        content: `Total OT Hours for ${formatDate(date)}`,
        colSpan: dailyTotalColSpan,
        styles: { fontStyle: "bold", halign: "right" },
      },
      {
        content: dailyTotalRounded.toFixed(1),
        styles: { fontStyle: "bold", halign: "center" },
      },
      "",
    ]);
  });

  // Monthly grand total row
  const finalColSpan = unitConfig ? 5 : 6;

  body.push([
    {
      content: "Grand Total",
      colSpan: finalColSpan,
      styles: { fontStyle: "bold", halign: "right" },
    },
    {
      content: grandTotalOt.toFixed(1),
      styles: { fontStyle: "bold", halign: "center" },
    },
    "",
  ]);

  const headRow = unitConfig
    ? [
        "Date",
        "Type",
        "Work Description",
        "Employee",
        "OT Time",
        "OT Hour",
        "Remarks",
      ]
    : [
        "Date",
        "Type",
        "Unit",
        "Work Description",
        "Employee",
        "OT Time",
        "OT Hour",
        "Remarks",
      ];

  // 📄 Render table
  autoTable(doc, {
    startY: margin + 78,
    margin: { left: margin, right: margin },
    head: [headRow],
    body,
    styles: {
      fontSize: 10,
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
      5: { halign: "center" },
    },
    theme: "grid",
    tableWidth: "auto",
  });

  // 🧾 Footer with correct total page count
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, {
      align: "right",
    });
  }

  // ✍️ Signature
  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont("helvetica", "normal");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager / AGM", pageWidth - margin - 140, finalY + 15);

  doc.save(`Monthly_OT_Report_${monthName}.pdf`);
};
