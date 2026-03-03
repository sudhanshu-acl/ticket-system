// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI');
}

// Connection function
export const connectDB = async (): Promise<void> => {
  try {
    const connectionString = MONGODB_URI;
    const conn = await mongoose.connect(connectionString, {
      // serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      readPreference: 'secondaryPreferred'
    });

    console.log('✅ Mongoose connected to DB');


    // Handle process termination
    process.on('SIGINT', async () => {
      console.error('❌ Mongoose connection disconnected');
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
    process.exit(1);
  }
};