require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());


// ✅ MongoDB Connection (🔥 IMPROVED)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error(" DB Error:", err.message);
    process.exit(1); // 👈 
  });

// ✅ Test route
app.get("/", (req, res) => {
  res.send(" Backend is running...");
});

// ✅ Routes
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/order", orderRoutes);
const searchRoutes = require("./routes/searchRoutes");
app.use("/api/search", searchRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// ❌ HANDLE UNKNOWN ROUTES 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ❌ GLOBAL ERROR HANDLER 
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});