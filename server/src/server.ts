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
import ingredientItemsRoutes from './routes/ingredientItems.routes.js';
import menuRoutes from './routes/menu.routes.js';
import menuSectionRoutes from './routes/menuSection.routes.js';
import menuVariantGroupsRoutes from './routes/menuVariantGroups.routes.js';
import orderItemRoutes from './routes/orderItem.routes.js';
import packageItemsRoutes from './routes/packageItems.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import typeRoutes from './routes/type.routes.js';
import variantGroupsRoutes from './routes/variantGroups.routes.js';
import variantItemsRoutes from './routes/variantItems.routes.js';
import filterMenuItems from './routes/filterMenuItems.routes.js'

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api', GlobalAPI);
app.use('/api/user', userRoutes);
// routes
app.use('/api/user', userRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orderitem', orderItemRoutes);

app.use('/api/menu', menuRoutes);
app.use('/api/menusection', menuSectionRoutes);
app.use('/api/orderitem', orderItemRoutes);
app.use('/api/ingredient', ingredientItemsRoutes);
app.use('/api/ingredientitem', ingredientItemsRoutes);
app.use('/api/packageitem', packageItemsRoutes);
app.use('/api/variantgroup', variantGroupsRoutes);
app.use('/api/variantitem', variantItemsRoutes);
app.use('/api/menuvariantgroup', menuVariantGroupsRoutes);

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