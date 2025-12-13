import mongoose from "mongoose";

let isConnected = false; // track connection state

export default async function connectDB() {
  if (isConnected) {
    console.log("Using existing database connection");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,           // connection pool size
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
      socketTimeoutMS: 45000,    // operation timeout
    });

    isConnected = true;
    console.log(`Database connected successfully! Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
