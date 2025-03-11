
import mongoose from "mongoose";

interface MongoDBConfig {
  uri: string;
  dbName: string;
  maxAttempts: number;
  retryInterval: number;
  timeout: number;
}

const config: MongoDBConfig = {
  uri: process.env.MONGODB_URI || '',
  dbName: process.env.MONGODB_DB_NAME || '',
  maxAttempts: 5,
  retryInterval: 5000,
  timeout: 30000,
};

const validateMongoURI = (uri: string, dbName: string): string => {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MongoDB URI format');
  }

  try {
    const url = new URL(uri);
    url.pathname = `/${dbName}`;
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid MongoDB URI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const connectToDatabase = async (): Promise<void> => {
  let attempts = 0;
  const databaseUri = validateMongoURI(config.uri, config.dbName);

  while (attempts < config.maxAttempts) {
    try {
      if (mongoose.connection.readyState === 1) {
        console.log('Already connected to MongoDB');
        return;
      }

      await mongoose.connect(databaseUri, {
        serverSelectionTimeoutMS: config.timeout,
        connectTimeoutMS: config.timeout,
        socketTimeoutMS: config.timeout,
        dbName: config.dbName,
        authSource: 'admin',
      });

      const dbName = mongoose.connection.db?.databaseName ?? 'unknown';
      console.log(`Connected to MongoDB: ${dbName}`);
      setupMongoListeners();
      return;

    } catch (error) {
      attempts++;
      console.error(
        `MongoDB connection attempt ${attempts} failed:`,
        error instanceof Error ? error.message : 'Unknown error',
        error
      );

      if (attempts === config.maxAttempts) {
        throw new Error(`Failed to connect to MongoDB after ${config.maxAttempts} attempts`);
      }

      await new Promise(resolve => setTimeout(resolve, config.retryInterval));
    }
  }
};

const setupMongoListeners = (): void => {
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    handleReconnection();
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    handleReconnection();
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  });
};

const handleReconnection = async (): Promise<void> => {
  let backoff = 1000;
  const maxBackoff = 60000;

  while (true) {
    try {
      if (mongoose.connection.readyState === 1) {
        console.log('Connection already established');
        return;
      }

      await connectToDatabase();
      console.log('Successfully reconnected to MongoDB');
      return;

    } catch (error) {
      console.error(
        `Reconnection failed. Retrying in ${backoff}ms:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      await new Promise(resolve => setTimeout(resolve, backoff));
      backoff = Math.min(backoff * 2, maxBackoff);
    }
  }
};
