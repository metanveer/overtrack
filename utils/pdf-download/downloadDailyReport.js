import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";

export const downloadDailyReport = async (records, reportDate) => {
  const logoBase64 = await fetchLogoBase64();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 60;

  // 🖼️ Add logo at top-left
  doc.addImage(logoBase64, "PNG", 250, 40, 50, 60); // (x, y, width, height)

  // 🧾 Header Text
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
  doc.text("Daily Overtime Report", pageWidth / 2, margin + 38, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${reportDate}`, pageWidth - margin, margin + 38, {
    align: "right",
  });

  const totalOtHours = records.reduce((sum, item) => {
    return (
      sum +
      item.Employees.reduce((empSum, emp) => empSum + Number(emp.OtHour), 0)
    );
  }, 0);

  const body = [];

  records.forEach((report, reportIndex) => {
    const employeeCount = report.Employees.length;

    report.Employees.forEach((emp, empIndex) => {
      const row = [];

      if (empIndex === 0) {
        row.push({ content: reportIndex + 1, rowSpan: employeeCount });
        row.push({ content: report.WorkDescription, rowSpan: employeeCount });
        row.push({ content: report.Unit, rowSpan: employeeCount });
        row.push({ content: report.Type, rowSpan: employeeCount });
      }

      row.push({
        content: emp.Name,
        styles: { halign: "left" }, // left align employee name
      });

      row.push(emp.OtTime);
      row.push(emp.OtHour);

      if (empIndex === 0) {
        row.push({ content: report.Remarks, rowSpan: employeeCount });
      }

      body.push(row);
    });
  });

  // Total OT row
  body.push([
    {
      content: "Total OT Hours",
      colSpan: 6,
      styles: { halign: "right", fontStyle: "bold" },
    },
    {
      content: totalOtHours.toString(),
      styles: { fontStyle: "bold", halign: "center" },
    },
    "",
  ]);

  autoTable(doc, {
    startY: margin + 58,
    margin: { left: margin, right: margin },
    head: [
      [
        "Sl",
        "Job",
        "Unit",
        "OT Type",
        "Employee Name",
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
      halign: "center",
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

  // Signature space
  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont("helvetica", "normal");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager (Instrument)", pageWidth - margin - 140, finalY + 15);

  doc.save(`Daily_OT_Report_${reportDate}`);
};
