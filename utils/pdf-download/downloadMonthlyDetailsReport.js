import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

// export const downloadMonthlyDetailsReport = async (groupedData, monthName) => {
//   const logoBase64 = await fetchLogoBase64();

//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "pt",
//     format: "a4",
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 60;

//   // 🖼️ Add logo
//   doc.addImage(logoBase64, "PNG", 250, 40, 50, 60);

//   // 🧾 Header
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
//     align: "center",
//   });

//   doc.setFontSize(11);
//   doc.setFont("helvetica", "normal");
//   doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
//     align: "center",
//   });

//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Monthly Overtime Report", pageWidth / 2, margin + 38, {
//     align: "center",
//   });

//   // 📅 Month name (top right corner)
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   doc.text(`Month: ${monthName}`, pageWidth - margin, margin + 38, {
//     align: "right",
//   });

//   let body = [];
//   let grandTotalOt = 0;

//   groupedData.forEach((group) => {
//     const date = group._id;
//     let dateRowSpan = group.records.reduce(
//       (acc, rec) => acc + rec.Employee.length,
//       0
//     );
//     let datePrinted = false;

//     group.records.forEach((record) => {
//       const empLen = record.Employee.length;

//       record.Employee.forEach((emp, empIndex) => {
//         const row = [];

//         if (!datePrinted) {
//           row.push({ content: date, rowSpan: dateRowSpan });
//           datePrinted = true;
//         }

//         if (empIndex === 0) {
//           row.push({ content: record.Type, rowSpan: empLen });
//           row.push({ content: record.Unit, rowSpan: empLen });
//           row.push({
//             content: record.WorkDescription,
//             rowSpan: empLen,
//             styles: { halign: "left" },
//           });
//         }

//         row.push({ content: emp.Name, styles: { halign: "left" } });
//         row.push(emp.OtTime);
//         row.push(emp.OtHour);

//         grandTotalOt += parseFloat(emp.OtHour || 0);

//         if (empIndex === 0) {
//           row.push({ content: record.Remarks, rowSpan: empLen });
//         }

//         body.push(row);
//       });
//     });
//   });

//   // Add grand total row
//   body.push([
//     {
//       content: "Total OT Hours",
//       colSpan: 6,
//       styles: { halign: "right", fontStyle: "bold" },
//     },
//     {
//       content: grandTotalOt.toFixed(2),
//       styles: { fontStyle: "bold", halign: "center" },
//     },
//     "",
//   ]);

//   // 📄 Render table and use didDrawPage for page numbers
//   autoTable(doc, {
//     startY: margin + 58,
//     margin: { left: margin, right: margin },
//     head: [
//       [
//         "Date",
//         "Type",
//         "Unit",
//         "Work Description",
//         "Employee",
//         "OT Time",
//         "OT Hour",
//         "Remarks",
//       ],
//     ],
//     body,
//     styles: {
//       fontSize: 10,
//       cellPadding: 4,
//       textColor: 0,
//       valign: "middle",
//       lineWidth: 0.1,
//       lineColor: [0, 0, 0],
//     },
//     headStyles: {
//       fillColor: [230, 230, 230],
//       textColor: 0,
//       fontStyle: "bold",
//       halign: "center",
//     },
//     theme: "grid",
//     tableWidth: "auto",
//     didDrawPage: function (data) {
//       const pageCount = doc.internal.getNumberOfPages();
//       const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;

//       doc.setFontSize(10);
//       doc.text(
//         `Page ${pageNumber} of ${pageCount}`,
//         pageWidth - margin,
//         pageHeight - 20,
//         { align: "right" }
//       );
//     },
//   });

//   // ✍️ Signature
//   const finalY = doc.lastAutoTable.finalY + 70;
//   doc.setFont("helvetica", "normal");
//   doc.text("______________________", pageWidth - margin - 160, finalY);
//   doc.text("Manager (Instrument)", pageWidth - margin - 140, finalY + 15);

//   doc.save(`Monthly_OT_Report_${monthName}.pdf`);
// };

export const downloadMonthlyDetailsReport = async (groupedData, monthName) => {
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
  doc.text("Monthly Overtime Report", pageWidth / 2, margin + 38, {
    align: "center",
  });

  // 📅 Month name (top right corner)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Month: ${monthName}`, pageWidth - margin, margin + 38, {
    align: "right",
  });

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
          row.push({ content: date, rowSpan: dateRowSpan });
          datePrinted = true;
        }

        if (empIndex === 0) {
          row.push({ content: record.Type, rowSpan: empLen });
          row.push({ content: record.Unit, rowSpan: empLen });
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
    const dailyTotalRounded = Math.round(dailyTotalOt * 10) / 10;
    grandTotalOt += dailyTotalRounded;

    body.push([
      {
        content: `Total OT Hours for ${date}`,
        colSpan: 6,
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
  body.push([
    {
      content: "Total OT Hours (Monthly)",
      colSpan: 6,
      styles: { fontStyle: "bold", halign: "right" },
    },
    {
      content: grandTotalOt.toFixed(1),
      styles: { fontStyle: "bold", halign: "center" },
    },
    "",
  ]);

  // 📄 Render table
  autoTable(doc, {
    startY: margin + 58,
    margin: { left: margin, right: margin },
    head: [
      [
        "Date",
        "Type",
        "Unit",
        "Work Description",
        "Employee",
        "OT Time",
        "OT Hour",
        "Remarks",
      ],
    ],
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
