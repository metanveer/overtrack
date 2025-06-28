import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchLogoBase64 } from "./fetchLogo";
import round1 from "../round1";

// ➕ Helper to convert number to ordinal string
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const downloadYearlyOtSummary = async (data, dept, year, reportType) => {
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
    `Yearly Overtime (Hour) Summary - ${year} (${
      reportType === "billed" ? "Billed" : "Actual"
    })`,
    pageWidth / 2,
    margin + 58,
    {
      align: "center",
    }
  );

  // 🔤 Displayed months
  const displayMonths = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const getFullMonthKey = (abbr, index) =>
    new Date(0, index)
      .toLocaleString("default", { month: "long" })
      .toLowerCase();

  const head = [["#", "Name", ...displayMonths, "TOTAL HRS.", "POSITION"]];

  // Step 1: Compute totals for each employee
  const employeeData = data.map((emp, idx) => {
    const values = displayMonths.map(
      (abbr, i) => round1(emp[getFullMonthKey(abbr, i)]) || 0
    );
    const total = values.reduce((sum, v) => sum + v, 0);
    return {
      idx: idx + 1,
      name: emp.name,
      values,
      total,
    };
  });

  // Step 2: Sort by total and assign ordinal position
  const sorted = [...employeeData].sort((a, b) => b.total - a.total);
  const positions = new Map();
  sorted.forEach((emp, rank) => {
    positions.set(emp.name, getOrdinal(rank + 1));
  });

  // Step 3: Final body rows
  const body = employeeData.map((emp) => [
    emp.idx,
    emp.name,
    ...emp.values.map((v) => v || ""),
    round1(emp.total),
    positions.get(emp.name),
  ]);

  // Monthly totals
  const totals = displayMonths.map((abbr, i) =>
    data.reduce(
      (sum, emp) => sum + (round1(emp[getFullMonthKey(abbr, i)]) || 0),
      0
    )
  );
  const grandTotal = totals.reduce((sum, val) => sum + val, 0);

  body.push([
    "",
    { content: "TOTAL HRS.", styles: { fontStyle: "bold", halign: "right" } },
    ...totals.map((t) => round1(t)),
    round1(grandTotal),
    "", // for Position column
  ]);

  autoTable(doc, {
    startY: margin + 80,
    margin: { left: margin, right: margin },
    head,
    body,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: 0,
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [220, 220, 220],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center" }, // #
      1: { halign: "left" }, // Name
      ...Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 2, { halign: "center" }])
      ),
      14: { halign: "center", fontStyle: "bold" }, // TOTAL
      15: { halign: "center", fontStyle: "bold" }, // POSITION, same width as month columns
    },
  });

  // 🕒 Footer
  const now = new Date();
  const formattedDate = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Prepared on: ${formattedDate}`, margin, pageHeight - 20);

  const finalY = doc.lastAutoTable.finalY + 70;
  doc.setFont("helvetica", "bold");
  doc.text("______________________", pageWidth - margin - 160, finalY);
  doc.text("Manager / AGM", pageWidth - margin - 140, finalY + 15);

  doc.save(
    `Yearly_OT_Summary_${
      reportType === "billed" ? "Billed" : "Actual"
    }_${dept}_${year}.pdf`
  );
};
