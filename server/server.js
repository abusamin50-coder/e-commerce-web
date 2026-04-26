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
  .then(() => { console.log('✅ MongoDB Connected!'); })
  .catch((err) => { console.log('❌ MongoDB Error:', err.message); });

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: '🎉 Server working!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});