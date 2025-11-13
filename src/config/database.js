const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ujalapathak10_db_user:nWdZsRXYbE3thxDQ@cluster0.8vgnoz5.mongodb.net/"
  );
};

module.exports = connectDB;
