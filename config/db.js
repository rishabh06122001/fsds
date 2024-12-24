const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectString = process.env.DATABASE_CONNECTION;

    await mongoose.connect(connectString).then(() => {
      console.log("Connected to DB");
    });
  } catch (error) {
    console.log("Error in mongoose connection", error);
  }
};

module.exports = connectDB;
