const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the configured URI.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log('MongoDB connected successfully.');
};

module.exports = connectDB;
