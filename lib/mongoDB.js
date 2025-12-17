// lib/clients/mongodb.ts
import mongoose from 'mongoose';

// Ensure MONGODB_URI is defined in your .env.local file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose; // Use global object to cache the connection

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // If a connection is already cached, return it
    return cached.conn;
  }
  if (!cached.promise) {
    // If there's no pending promise, create a new connection promise
    const opts = {
      bufferCommands: false, // Disable Mongoose's internal buffering
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Once connected, store the connection instance
      return mongoose;
    });
  }
  try {
    // Await the connection promise to get the active connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise to allow retries
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default dbConnect;