const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const toCSV = (rows) => {
  if (!rows.length) return '';

  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const line = headers
      .map((header) => {
        const value = row[header] ?? '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',');
    csvLines.push(line);
  });

  return csvLines.join('\n');
};

const exportRows = ({ rows, datasetId }) => {
  const exportDir = path.join(process.cwd(), 'exports');
  ensureDir(exportDir);

  const baseName = `dataset_${datasetId}`;
  const jsonPath = path.join(exportDir, `${baseName}.json`);
  const csvPath = path.join(exportDir, `${baseName}.csv`);
  const excelPath = path.join(exportDir, `${baseName}.xlsx`);

  fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
  fs.writeFileSync(csvPath, toCSV(rows));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CleanedData');
  XLSX.writeFile(workbook, excelPath);

  return { jsonPath, csvPath, excelPath };
};

module.exports = { exportRows };
