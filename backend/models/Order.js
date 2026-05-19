const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },

    // 📍 ADDRESS
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // 💳 CARD
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },

    // 👥 PASSENGER COUNT
    passengerCount: {
      type: Number,
      default: 1,
    },

    // 🛒 ITEMS
    items: [
      {
        id: Number,
        title: String,
        quantity: {
          type: Number,
          default: 1,
        },
        travelDate: String,
        vehicle: {
  name: String
},
        price: Number,
      },
    ],

    // 💰 TOTAL AMOUNT
    amount: {
      type: Number,
      required: true,
    },
    bookingDate: {
  type: Date,
  default: Date.now,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);