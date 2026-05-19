const express = require("express");
const router = express.Router();

const AuthUser = require("../models/AuthUser");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OTP = require("../models/Otp");


// ✅ ADD HERE
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token ❌" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};
// Create a transporter for sending emails
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7905136c566a7e",
    pass: "bf95084c58d9f1",
  },
});

console.log("AUTH ROUTES LOADED 🔥");

//register route
router.post("/register", async (req, res) => {
  try {
    console.log("🔥 REGISTER BODY:", req.body);

    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await AuthUser.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ AUTH USER ()
    const authUser = await AuthUser.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      password: password,
      role: role ||"user",
    });

    // ✅ NORMAL USER ()
    const normalUser = await User.create({
      firstName,
      lastName,
      email,
      phone: "",
      age: null,
      address: "",
      city: "",
      country: "",
      zip: "",
    });

    console.log("✅ USER SAVED:", normalUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: authUser._id,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
        role: authUser.role,
      },
    });
  } catch (err) {
    console.log("❌ REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//send otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await AuthUser.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP
    await OTP.create({
      email: email.trim().toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send mail
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email.trim().toLowerCase(),
      subject: "OTP for Password Reset",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending OTP ❌" });
  }
});

//RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    let { email, otp, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim(); // 🔥 IMPORTANT

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired ❌" });
    }

    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    // 🔥 CHECK SAME PASSWORD
    const isSame = await bcrypt.compare(password, user.password);

    if (isSame) {
      return res.status(400).json({
        message: "Old password is not allowed ❌ Please create a new one",
      });
    }

    // 🔐 HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await AuthUser.findOneAndUpdate({ email }, { password: hashedPassword });

    console.log("✅ NEW HASH SAVED:", hashedPassword);

    await OTP.deleteMany({ email });

    res.json({ message: "Password reset successful ✅" });
  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({ message: "Error ❌" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await AuthUser.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("Entered Password:", password);
    console.log("DB Password:", user.password);
    password = password.trim();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 🔥 LOGIN TRACK
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
  { id: user._id, role: user.role }, // 👈 ADD
  process.env.JWT_SECRET || "secret",
  { expiresIn: "1d" }
);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        zip: user.zip,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// ================= GET PROFILE (FIXED 🔥) =================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const authUser = await AuthUser.findById(req.user.id);
    if (!authUser) {
  return res.status(404).json({
    success: false,
    message: "Auth user not found",
  });
}

    const user = await User.findOne({
      email: authUser.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= UPDATE PROFILE  =================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const authUser = await AuthUser.findById(req.user.id);
    if (!authUser) {
  return res.status(404).json({
    success: false,
    message: "Auth user not found",
  });
}

    const updatedUser = await User.findOneAndUpdate(
      { email: authUser.email },
      {
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        zip: req.body.zip,
        age: req.body.age,
        hotel: req.body.hotel,
      },
      { new: true }
    );

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
