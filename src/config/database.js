const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECT_CONNECTION);
};

module.exports = connectDB;
