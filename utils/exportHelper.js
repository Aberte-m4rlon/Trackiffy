// utils/exportHelper.js
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import stream from "stream";

// CSV Export
export const exportCSV = (res, filename, data) => {
  const parser = new Parser();
  const csv = parser.parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment(filename);
  return res.send(csv);
};

// PDF Export
export const exportPDF = (res, title, data) => {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${title}.pdf`);
  doc.pipe(res);

  doc.fontSize(18).text(title, { align: "center" });
  doc.moveDown();

  if (data.length) {
    const headers = Object.keys(data[0]);
    doc.fontSize(12).text(headers.join(" | "), { underline: true });
    doc.moveDown(0.5);
    data.forEach((row) => {
      const line = headers.map((h) => row[h] ?? "").join(" | ");
      doc.text(line);
    });
  } else {
    doc.fontSize(12).text("No data available.");
  }

  doc.end();
};
