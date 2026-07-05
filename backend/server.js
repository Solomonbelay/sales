const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Sale = require('./models/Sale');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));

// --- Authentication Endpoints ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully. Proceed to Login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server registration error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`);
      return res.json({ _id: user._id, name: user.name, email: user.email });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: 'Server login error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');
  res.json({ message: 'Logged out successfully' });
});

// --- Secured Sales Core Routes ---
app.get('/api/sales', protect, async (req, res) => {
  try {
    const sales = await Sale.find().populate('assignedTo', 'name email');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching records' });
  }
});

app.post('/api/sales', protect, async (req, res) => {
  const { customerName, customerEmail, productService, salesValue, status } = req.body;
  try {
    const newSale = await Sale.create({
      customerName, customerEmail, productService, salesValue, status,
      assignedTo: req.user._id
    });
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create sale data validation error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Secure core active on port ${PORT}`));