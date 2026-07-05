const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Production MongoDB connected successfully.');
  } catch (err) {
    console.error('Database connection crash: ', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;