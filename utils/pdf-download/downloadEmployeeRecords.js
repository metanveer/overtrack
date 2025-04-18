import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

export const downloadEmployeeRecords = async (data, startDate, endDate) => {
  if (!data || data.length === 0) return;

  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;

  // 🖼️ Logo
  doc.addImage(logoBase64, "PNG", 240, 40, 50, 60);

  // 🧾 Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
    align: "center",
  });

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Employee Overtime Record", pageWidth / 2, margin + 38, {
    align: "center",
  });

  // 📅 Date range at top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Start: ${startDate}`, pageWidth - margin, margin + 10, {
    align: "right",
  });
  doc.text(`End: ${endDate}`, pageWidth - margin, margin + 28, {
    align: "right",
  });

  let currentY = margin + 60;
  let grandTotalOt = 0;

  data.forEach((record, empIndex) => {
    const startY = currentY + (empIndex === 0 ? 10 : 40);

    // 👤 Employee Name
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Employee: ${record.Employee}`, margin, startY);

    // 🧾 OT Type Summary
    const summaryStr = record.TotalOtHourByType.map(
      (item) => `${item.Type}: ${item.TotalOtHour} hrs`
    ).join(" | ");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(summaryStr, margin, startY + 18);

    // 🧮 OT Detail Table
    const tableY = startY + 30;

    const body = record.OT.map((entry) => {
      grandTotalOt += parseFloat(entry.OtHour || 0);
      return [
        entry.Date,
        entry.OtHour,
        entry.OtTime,
        entry.Unit,
        entry.WorkDescription,
        entry.Remarks || "",
        entry.Type,
      ];
    });

    autoTable(doc, {
      startY: tableY,
      margin: { left: margin, right: margin },
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
      theme: "grid",
      tableWidth: "auto",
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
        0: { halign: "center" }, // Date
        4: { halign: "left" }, // Work Description
        5: { halign: "left" }, // Remarks
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

    currentY = doc.lastAutoTable.finalY;
  });

  // 🧮 Total OT Summary
  const totalY = currentY + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    `Total Overtime Hours: ${grandTotalOt.toFixed(2)} hrs`,
    margin,
    totalY
  );

  // ✍️ Signature
  const finalY = totalY + 70;
  doc.setFont("helvetica", "normal");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager (Instrument)", pageWidth - margin - 140, finalY + 15);

  doc.save(`Employee_OT_Record_${startDate}_to_${endDate}.pdf`);
};
