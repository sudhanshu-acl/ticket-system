// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI');
}

// Connection function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<void> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectionString = MONGODB_URI;
    cached.promise = mongoose.connect(connectionString, {
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      readPreference: 'secondaryPreferred'
    }).then((mongoose) => {
      console.log('✅ Mongoose connected to DB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Mongoose connection error:', error);
    throw error;
  }
};