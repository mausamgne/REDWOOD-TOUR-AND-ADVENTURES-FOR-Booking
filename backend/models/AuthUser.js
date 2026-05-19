const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authUserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },

    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
    password: String,

    // 🔥 LOGIN TRACKING 
    loginCount: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },

    //  👉 
    phone: String,
    address: String,
    city: String,
    country: String,
    zip: String,
    age: Number,
    hotel: String,
  },
  { timestamps: true }
);

// 🔐 PASSWORD HASH
authUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("AuthUser", authUserSchema);