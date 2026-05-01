import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/database.js';

// route imports
import userRoutes from './routes/user.routes.js';
// ... dst

import GlobalAPI from "./routes/index.js";
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api', GlobalAPI);

app.use(errorHandler);

// ========== INI YANG PENTING ==========
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();