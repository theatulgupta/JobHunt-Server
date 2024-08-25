import 'dotenv/config';

import mongoose from 'mongoose';

const DB_NAME = process.env.DB_NAME;

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(`${uri}/${DB_NAME}`);
    console.log('MongoDB connected successfully ✅');
  } catch (error) {
    console.error('MongoDB connection failed ❌:', error.message);
    process.exit(1);
  }
};
