import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const options = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  try {
    console.log(`[Database] Connecting to MongoDB at: ${env.MONGODB_URI.replace(/:([^:@]{3,})@/, ':****@')}...`);
    const conn = await mongoose.connect(env.MONGODB_URI, options);
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host} (${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected. Attempting reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] MongoDB reconnected.');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    console.warn(`[Database] MongoDB initial connection warning: ${error.message}`);
    console.warn(`[Database] Running in fallback-ready mode. Data operations will buffer or use memory fallback.`);
    isConnected = false;
    return null;
  }
};

export const getDbStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A',
  };
};
