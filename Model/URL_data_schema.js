const mongoose = require("mongoose");

const UrlDataSchema = new mongoose.Schema({
  urldata: {
    type: String,
    required: [true, "URL is required"],
  },
  trainId: {
    type: String,
    required: [true, "Train ID is required"],
  },
  coachId: {
    type: String,
    required: [true, "Coach ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UrlData", UrlDataSchema);
