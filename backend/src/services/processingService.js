const fs = require('fs');
const path = require('path');
const Dataset = require('../models/Dataset');
const DataRecord = require('../models/DataRecord');
const { parseByMimeType } = require('../utils/fileParsers');
const { validateRows } = require('./validationService');
const { exportRows } = require('./exportService');

const processDataset = async (datasetId) => {
  const dataset = await Dataset.findById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found');
  }

  dataset.status = 'processing';
  await dataset.save();

  const uploadPath = path.join(process.cwd(), 'uploads', dataset.sourceFileName);

  try {
    const rows = await parseByMimeType({
      filePath: uploadPath,
      mimeType: dataset.mimeType,
    });

    const { validRows, errors } = validateRows(rows);

    dataset.totalRows = rows.length;
    dataset.invalidRows = errors.length;
    dataset.duplicateRows = errors.filter((entry) => entry.message.includes('Duplicate')).length;
    dataset.normalizedHeaders = rows.length ? Object.keys(rows[0]) : [];
    dataset.errorLogs = errors.slice(0, 200);

    if (validRows.length) {
      await DataRecord.insertMany(
        validRows.map((row) => ({
          datasetId: dataset._id,
          rowHash: row.rowHash,
          data: row.data,
        })),
        { ordered: false }
      );
    }

    dataset.insertedRows = validRows.length;
    const exported = exportRows({
      rows: validRows.map((item) => item.data),
      datasetId: dataset._id,
    });

    dataset.outputFiles = exported;
    dataset.status = 'completed';
    await dataset.save();

    if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);

    return dataset;
  } catch (error) {
    dataset.status = 'failed';
    dataset.errorLogs = [{ rowNumber: 0, message: error.message, payload: {} }];
    await dataset.save();
    throw error;
  }
};

module.exports = {
  processDataset,
};
