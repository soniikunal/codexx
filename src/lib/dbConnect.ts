import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend globalThis to hold our cache
declare global {
  var mongooseGlobal: MongooseGlobal;
}

// Use global cache or initialize it
const globalCache = globalThis as typeof globalThis & { mongooseGlobal?: MongooseGlobal };

if (!globalCache.mongooseGlobal) {
  globalCache.mongooseGlobal = { conn: null, promise: null };
}

const cached = globalCache.mongooseGlobal;

export default async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
