import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database.js';
dotenv.config();

// middleware

const app = express();
const PORT = 5000;

app.use(cors());
// middleware (biar bisa baca JSON)
app.use(express.json());

// route basic
app.get('/', (req, res) => {
  res.send('Hello World 🚀');
});

sequelize.authenticate().then(() => {
  console.log('Database connected!');
}).catch((error) => {
  console.error('Error connecting to database:', error);
})

// jalanin server
app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});
