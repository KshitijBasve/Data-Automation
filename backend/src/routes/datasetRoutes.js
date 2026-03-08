const express = require('express');
const {
  uploadAndProcess,
  listDatasets,
  getDataset,
  removeDataset,
  downloadExport,
} = require('../controllers/datasetController');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadAndProcess);
router.get('/', listDatasets);
router.get('/:id', getDataset);
router.delete('/:id', removeDataset);
router.get('/:id/export/:format', downloadExport);

module.exports = router;
