import express from 'express';

const app = express();
const PORT = 3000;

// middleware (biar bisa baca JSON)
app.use(express.json());

// route basic
app.get('/', (req, res) => {
  res.send('Hello World 🚀');
});

// jalanin server
app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});
