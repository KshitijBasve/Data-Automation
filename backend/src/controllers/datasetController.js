const path = require('path');
const Dataset = require('../models/Dataset');
const DataRecord = require('../models/DataRecord');
const { enqueueDataset } = require('../queue/processingQueue');

const uploadAndProcess = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required.' });
    }

    const dataset = await Dataset.create({
      name: req.body.name || req.file.originalname,
      sourceFileName: req.file.filename,
      mimeType: req.file.mimetype,
      metadata: {
        uploadSize: req.file.size,
      },
    });

    await enqueueDataset(dataset._id.toString());

    return res.status(202).json({
      message: 'File accepted for processing.',
      datasetId: dataset._id,
    });
  } catch (error) {
    return next(error);
  }
};

const listDatasets = async (_req, res, next) => {
  try {
    const datasets = await Dataset.find().sort({ createdAt: -1 }).lean();
    res.json(datasets);
  } catch (error) {
    next(error);
  }
};

const getDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findById(req.params.id).lean();
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const records = await DataRecord.find({ datasetId: dataset._id }).limit(100).lean();
    res.json({ ...dataset, previewRecords: records });
  } catch (error) {
    next(error);
  }
};

const removeDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findByIdAndDelete(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    await DataRecord.deleteMany({ datasetId: req.params.id });
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const downloadExport = async (req, res, next) => {
  try {
    const { id, format } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const formatKey = `${format}Path`;
    const filePath = dataset.outputFiles?.[formatKey];

    if (!filePath) {
      return res.status(404).json({ message: `No ${format} export available for this dataset` });
    }

    return res.download(path.resolve(filePath));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadAndProcess,
  listDatasets,
  getDataset,
  removeDataset,
  downloadExport,
};
