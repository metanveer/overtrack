import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import formatDate, { getDayName } from "../formatDate";

export const downloadNotice = async (
  groupedData,
  employeePhones,
  dept,
  noticeTitle,
  printPhoneNumbers,
  printRemarks
) => {
  const noticeDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  // Logo
  doc.addImage(logoBase64, "PNG", margin, 40, 50, 60);

  // Header
  doc.setFontSize(18).setFont(documentFont, "bold");
  doc.text("EASTERN REFINERY LIMITED", pageWidth / 2, margin, {
    align: "center",
  });

  doc.setFontSize(12).setFont(documentFont, "normal");
  doc.text("North Patenga, Chattogram", pageWidth / 2, margin + 18, {
    align: "center",
  });

  doc.setFontSize(12).setFont(documentFont, "bold");
  doc.text(`${dept} Department`, pageWidth / 2, margin + 38, {
    align: "center",
  });

  // Notice Title
  doc.setFontSize(14).setFont(documentFont, "bold");
  const titleText = noticeTitle || "Holiday Duty";
  const x = pageWidth / 2;
  const y = margin + 78;
  doc.text(titleText, x, y, { align: "center" });

  // Underline
  const underlineOffset = 5;
  doc.setLineWidth(1.5).setDrawColor(0, 0, 0);
  const textWidth = doc.getTextWidth(titleText);
  doc.line(
    x - textWidth / 2,
    y + underlineOffset,
    x + textWidth / 2,
    y + underlineOffset
  );

  // Date
  const currentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function getPhoneNumberByName(name, data) {
    const person = data.find((entry) => entry.Name === name);
    return person && person.Phone ? person.Phone : "Not available";
  }

  doc.setFont(documentFont, "bold").setFontSize(11);
  doc.text(
    `Date: ${formatDate(noticeDate(groupedData[0]._id))}`,
    pageWidth - margin,
    margin + 108,
    { align: "right" }
  );

  // Build table body
  let body = [];

  groupedData.forEach((group) => {
    const date = group._id;
    let dateRowSpan = group.records.reduce(
      (acc, rec) => acc + rec.Employee.length,
      0
    );
    let datePrinted = false;
    let spannedCells = []; // Track row-spanned cells

    group.records.forEach((record) => {
      const empLen = record.Employee.length;

      record.Employee.forEach((emp, empIndex) => {
        const row = [];

        // Date column (once per date group)
        if (!datePrinted) {
          const dateCell = {
            content: `${formatDate(date)} (${getDayName(date)})`,
            rowSpan: dateRowSpan,
            styles: {
              lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            },
          };
          row.push(dateCell);
          spannedCells.push(dateCell);
          datePrinted = true;
        }

        // Employee name
        row.push({
          content: emp.Name,
          styles: {
            halign: "left",
            lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
          },
        });

        // Phone
        if (printPhoneNumbers) {
          row.push({
            content: getPhoneNumberByName(emp.Name, employeePhones),
            styles: {
              halign: "center",
              lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            },
          });
        }

        // Job details
        if (empIndex === 0) {
          const unitCell = {
            content: record.Unit,
            rowSpan: empLen,
            styles: {
              lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            },
          };
          const jobCell = {
            content: record.WorkDescription,
            rowSpan: empLen,
            styles: {
              halign: "left",
              lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
            },
          };
          row.push(unitCell, jobCell);
          spannedCells.push(unitCell, jobCell);

          if (printRemarks) {
            const remarkCell = {
              content: record.Remarks,
              rowSpan: empLen,
              styles: {
                halign: "left",
                lineWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
              },
            };
            row.push(remarkCell);
            spannedCells.push(remarkCell);
          }
        }

        // Thick top border for first row of job
        if (empIndex === 0) {
          row.forEach((cell) => {
            if (typeof cell === "object") cell.styles.lineWidth.top = 1.5;
          });
        }

        // Thick bottom border for last row of job
        if (empIndex === empLen - 1) {
          row.forEach((cell) => {
            if (typeof cell === "object") cell.styles.lineWidth.bottom = 1.5;
          });
          // Update all row-spanned cells for this job
          spannedCells.forEach((cell) => {
            cell.styles.lineWidth.bottom = 1.5;
          });
          spannedCells = []; // reset for next job
        }

        body.push(row);
      });
    });
  });

  // Build header dynamically
  const headRow = () => {
    const head = ["Date", "Employee"];
    if (printPhoneNumbers) head.push("Phone No.");
    head.push("Assigned To", "Job");
    if (printRemarks) head.push("Remarks");
    return head;
  };

  // Table
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
    theme: "grid",
    tableWidth: "auto",
  });

  // Signature
  const finalY = doc.lastAutoTable.finalY + 90;
  doc.text("______________________", pageWidth - margin - 130, finalY);
  doc.text("Authorized Signatory", pageWidth - margin - 120, finalY + 15);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, {
      align: "right",
    });
  }
  doc.text(`Print date: ${currentDate()}`, margin, pageHeight - 20);

  // Save PDF
  doc.save(`Holiday_Duty_Notice_${dept}_${noticeDate(groupedData[0]._id)}.pdf`);
};
