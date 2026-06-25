import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import postRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5050;
const CONNECTION_URL = process.env.MONGODB_URI;
const corsOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : '*';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: corsOrigins }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'mern-memories-server' });
});

app.use('/api/posts', postRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const startServer = async () => {
  let mongoUri = CONNECTION_URL;
  let memoryServer;

  try {
    if (!mongoUri) {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'mern_memories',
        },
      });
      mongoUri = memoryServer.getUri();
      console.log('Using in-memory MongoDB because MONGODB_URI is not set.');
    }

    await mongoose.connect(mongoUri);

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      await mongoose.connection.close();

      if (memoryServer) {
        await memoryServer.stop();
      }

      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Database connection failed.', error.message);
    process.exit(1);
  }
};

startServer();
