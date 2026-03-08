const { processDataset } = require('../services/processingService');

const queue = [];
let isProcessing = false;

const processNext = async () => {
  if (isProcessing || !queue.length) return;
  isProcessing = true;

  const job = queue.shift();

  try {
    await processDataset(job.datasetId);
  } catch (error) {
    console.error(`Failed processing dataset ${job.datasetId}:`, error.message);
  } finally {
    isProcessing = false;
    setImmediate(processNext);
  }
};

const initQueue = () => {
  console.log('In-memory processing queue initialized (single worker).');
};

const enqueueDataset = async (datasetId) => {
  queue.push({ datasetId, createdAt: new Date() });
  processNext();
  return { queued: true, datasetId };
};

module.exports = {
  initQueue,
  enqueueDataset,
};
