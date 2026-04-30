import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/database.js';

// route imports
import userRoutes from './routes/user.routes.js';
import typeRoutes from './routes/type.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import orderItemRoutes from './routes/orderItem.routes.js';
import orderRoutes from './routes/order.routes.js';
import menuSectionRoutes from './routes/menuSection.routes.js';
import menuRoutes from './routes/menu.routes.js';
import filterMenuRoutes from './routes/filterMenu.routes.js';
import ingredientRoutes from './routes/ingredients.routes.js';
import ingredientItemsRoutes from './routes/ingredientItems.routes.js';
import packageItemsRoutes from './routes/packageItems.routes.js';

// 👇 IMPORT ERROR HANDLER
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use('/api/user', userRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orderitem', orderItemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menusection', menuSectionRoutes);
app.use('/api/filtermenu', filterMenuRoutes);
app.use('/api/orderitem', orderItemRoutes);
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/ingredientitem', ingredientItemsRoutes);
app.use('/api/packageitem', packageItemsRoutes);

// 👇 ERROR HANDLER (HARUS PALING BAWAH, SEBELUM app.listen)
app.use(errorHandler);

sequelize.authenticate().then(() => {
  console.log('✅ Database connected!');
}).catch((error) => {
  console.error('❌ Error:', error);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running di http://localhost:${PORT}`);
});