const mongoose = require("mongoose");

const UrlResponseSchema = new mongoose.Schema({
  urlDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UrlData",
    required: true,
  },
  response: {
    type: Object, // This can be a JSON object or a string, depending on the response format
    required: [true, "Response is required"],
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UrlResponse", UrlResponseSchema);
