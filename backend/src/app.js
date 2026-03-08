const express = require('express');
const cors = require('cors');
const datasetRoutes = require('./routes/datasetRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'automated-data-entry-api' });
});

app.use('/api/datasets', datasetRoutes);

// Centralized error handling.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
