import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import formatDate, { getDayName } from "../formatDate";

export const downloadNotice = async (
  groupedData,
  employeePhones,
  dept,
  noticeTitle
) => {
  const noticeDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
    //return previous date of the given date
  };

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

  // 🖼️ Add logo
  doc.addImage(logoBase64, "PNG", margin, 40, 50, 60);

  // 🧾 Header
  doc.setFontSize(18);
  doc.setFont(documentFont, "bold");
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont(documentFont, "normal");
  doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont(documentFont, "bold");
  doc.text(`${dept} Department`, pageWidth / 2, margin + 38, {
    align: "center",
  });

  // HOLIDAY DUTY NOTICE TITLE
  doc.setFontSize(14);
  doc.setFont(documentFont, "bold");
  const titleText = noticeTitle || "Holiday Duty";
  const x = pageWidth / 2;
  const y = margin + 78;

  doc.text(titleText, x, y, { align: "center" });

  // Underline a bit lower
  const underlineOffset = 5; // adjust as needed
  doc.setLineWidth(1.5);
  doc.setDrawColor(0, 0, 0);
  const textWidth = doc.getTextWidth(titleText);
  doc.line(
    x - textWidth / 2,
    y + underlineOffset,
    x + textWidth / 2,
    y + underlineOffset
  );

  // 📅 DATE

  const currentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function getPhoneNumberByName(name, data) {
    const person = data.find((entry) => entry.Name === name);
    return person ? person.Phone : "Phone number not found.";
  }

  doc.setFont(documentFont, "bold");
  doc.setFontSize(11);
  doc.text(
    `Date: ${formatDate(noticeDate(groupedData[0]._id))}`,
    pageWidth - margin,
    margin + 108,
    {
      align: "right",
    }
  );

  let body = [];

  groupedData.forEach((group) => {
    const date = group._id;
    let dateRowSpan = group.records.reduce(
      (acc, rec) => acc + rec.Employee.length,
      0
    );
    let datePrinted = false;

    group.records.forEach((record) => {
      const empLen = record.Employee.length;

      record.Employee.forEach((emp, empIndex) => {
        const row = [];

        if (!datePrinted) {
          row.push({
            content: `${formatDate(date)} (${getDayName(date)})`,
            rowSpan: dateRowSpan,
          });
          datePrinted = true;
        }

        row.push({ content: emp.Name, styles: { halign: "left" } });
        row.push(getPhoneNumberByName(emp.Name, employeePhones));

        if (empIndex === 0) {
          row.push({ content: record.Unit, rowSpan: empLen });
          row.push({
            content: record.WorkDescription,
            rowSpan: empLen,
            styles: { halign: "left" },
          });
        }

        body.push(row);
      });
    });
  });

  const headRow = () => {
    return ["Date", "Employee", "Phone No.", "Assigned To", "Job"];
  };

  autoTable(doc, {
    startY: margin + 128,
    margin: { left: margin, right: margin },
    head: [headRow()],
    body,
    styles: {
      font: documentFont,
      fontSize: 11,
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
  doc.text(`Print date: ${currentDate()}`, margin, pageHeight - 20);
  // ✍️ Signature
  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont(documentFont, "normal");
  // doc.text("______________________", pageWidth - margin - 160, finalY);
  // doc.text("Manager / AGM", pageWidth - margin - 140, finalY + 15);

  doc.save(`Holiday_Duty_Notice_${dept}_${noticeDate(groupedData[0]._id)}.pdf`);
};
