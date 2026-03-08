const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema(
  {
    rowNumber: Number,
    message: String,
    payload: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sourceFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    totalRows: { type: Number, default: 0 },
    insertedRows: { type: Number, default: 0 },
    duplicateRows: { type: Number, default: 0 },
    invalidRows: { type: Number, default: 0 },
    normalizedHeaders: [{ type: String }],
    errorLogs: [errorLogSchema],
    outputFiles: {
      csvPath: String,
      excelPath: String,
      jsonPath: String,
    },
    metadata: {
      uploadSize: Number,
      uploadedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dataset', datasetSchema);
