const mongoose = require("mongoose");

// Define the schema for train data
const trainSchema = new mongoose.Schema({
  train_number: {
    type: String,
    required: true,
    unique: true, // Ensures each train_number is unique
  },
  coaches: [
    {
      type: String, // Store coach numbers as strings
      required: true,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// Create the model
const Train = mongoose.model("Train", trainSchema);

module.exports = Train;
