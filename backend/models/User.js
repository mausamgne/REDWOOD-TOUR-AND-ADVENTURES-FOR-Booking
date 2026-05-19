const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
      
    },

    age: {
      type: Number,
    },

    // ✅ ADD THESE
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    zip: {
      type: String,
    },
    hotel: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);