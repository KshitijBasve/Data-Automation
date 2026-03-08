require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initQueue } = require('./queue/processingQueue');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initQueue();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
