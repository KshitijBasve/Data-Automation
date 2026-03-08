const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const pdf = require('pdf-parse');

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeKey = (key) =>
  String(key || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const normalizeRowKeys = (row) => {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = typeof value === 'string' ? value.trim() : value;
  });
  return normalized;
};

const parseCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => rows.push(normalizeRowKeys(data)))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows.map(normalizeRowKeys);
};

const parseJSON = (filePath) => {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return toArray(raw).map(normalizeRowKeys);
};

const parseTXT = (filePath) => {
  const lines = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => ({ row_number: index + 1, content: line }));
};

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdf(dataBuffer);
  return parsed.text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({ row_number: index + 1, content: line }));
};

const parseByMimeType = async ({ filePath, mimeType }) => {
  if (mimeType.includes('csv')) return parseCSV(filePath);
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('sheet')) {
    return parseExcel(filePath);
  }
  if (mimeType.includes('json')) return parseJSON(filePath);
  if (mimeType.includes('pdf')) return parsePDF(filePath);
  if (mimeType.includes('text')) return parseTXT(filePath);

  throw new Error(`Unsupported file type: ${mimeType}`);
};

module.exports = {
  normalizeKey,
  normalizeRowKeys,
  parseByMimeType,
};
