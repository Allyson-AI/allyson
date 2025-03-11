import mongoose, { Schema } from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongoDB() {
  if (cached.conn) {
    console.log("Cached mongodb is called!");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    // Your original connection string with the database name replaced
    const originalUri = process.env.MONGODB_URI;
    

    cached.promise = await mongoose.connect(originalUri);
    console.log("connected to mongoDB!");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongoDB;
