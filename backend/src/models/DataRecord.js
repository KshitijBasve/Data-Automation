const mongoose = require('mongoose');

const dataRecordSchema = new mongoose.Schema(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dataset',
      required: true,
      index: true,
    },
    rowHash: { type: String, required: true, index: true },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

dataRecordSchema.index({ datasetId: 1, rowHash: 1 }, { unique: true });

module.exports = mongoose.model('DataRecord', dataRecordSchema);
