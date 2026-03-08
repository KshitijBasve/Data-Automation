const { hashRow } = require('../utils/hash');

const REQUIRED_FIELDS = ['name', 'email'];

const inferRequiredFields = (rows) => {
  if (!rows.length) return REQUIRED_FIELDS;
  const sample = rows[0];
  const hasDefaultFields = REQUIRED_FIELDS.every((field) => field in sample);
  if (hasDefaultFields) return REQUIRED_FIELDS;

  return Object.keys(sample).slice(0, 2);
};

const normalizeValue = (value) => {
  if (typeof value === 'string') return value.trim();
  return value;
};

const validateRows = (rows) => {
  const seenHashes = new Set();
  const validRows = [];
  const errors = [];
  const requiredFields = inferRequiredFields(rows);

  rows.forEach((row, index) => {
    const rowNumber = index + 1;
    const normalizedRow = Object.keys(row).reduce((acc, key) => {
      acc[key] = normalizeValue(row[key]);
      return acc;
    }, {});

    const missingFields = requiredFields.filter((field) => {
      const value = normalizedRow[field];
      return value === null || value === undefined || value === '';
    });

    if (missingFields.length) {
      errors.push({
        rowNumber,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        payload: normalizedRow,
      });
      return;
    }

    const rowHash = hashRow(normalizedRow);
    if (seenHashes.has(rowHash)) {
      errors.push({ rowNumber, message: 'Duplicate row detected', payload: normalizedRow });
      return;
    }

    seenHashes.add(rowHash);
    validRows.push({ rowHash, data: normalizedRow });
  });

  return {
    validRows,
    errors,
    requiredFields,
  };
};

module.exports = {
  validateRows,
};
