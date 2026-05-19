const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // 👤 USER LINK
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

    // 📍 ADDRESS DETAILS
    address: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Address || mongoose.model("Address", addressSchema);