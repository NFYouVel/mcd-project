import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database.js';

//route imports
import userRoutes from './routes/user.routes.js';
import typeRoutes from './routes/type.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import orderItemRoutes from './routes/orderItem.routes.js';
import orderRoutes from './routes/order.routes.js';
import menuSectionRoutes from './routes/menuSection.routes.js';
import menuRoutes from './routes/menu.routes.js';
import filterMenuRoutes from './routes/filterMenu.routes.js';
import { OrderItems } from './models/OrderItems.js';


dotenv.config();

// middleware

const app = express();
const PORT = 5000;

app.use(cors());
// middleware (biar bisa baca JSON)
app.use(express.json());

// route basic
app.use('/api/user',userRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orderitem', orderItemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menusection', menuSectionRoutes);
app.use('/api/filtermenu', filterMenuRoutes);
app.use('/api/orderitem', orderItemRoutes);


sequelize.authenticate().then(() => {
  
  console.log('Database connected!');
}).catch((error) => {
  console.error('Error connecting to database:', error);
})

// jalanin server
app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});
