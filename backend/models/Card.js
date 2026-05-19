const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔐 Token 
    cardToken: {
      type: String,
      required: false,
    },

    // 👤 Name on card
    cardName: {
      type: String,
      default: "",
    },

    // 🔢  last 4 digits 
    last4: {
      type: String,
      required: true,
    },

    // 📅 Expiry 
    expiry: {
      type: String,
      default: "",
    },

    // 💰 Order amount
    totalAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);