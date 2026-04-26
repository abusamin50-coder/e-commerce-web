require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB Connected Successfully!'); })
  .catch((error) => { console.log('❌ MongoDB Connection Failed:', error.message); });

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: '🎉 Server is working!' });
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: '🎉 Auth routes working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📌 Auth routes: http://localhost:' + PORT + '/api/auth/users');
});