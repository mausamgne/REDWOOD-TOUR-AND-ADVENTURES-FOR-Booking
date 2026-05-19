const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const User = require("../models/User");
const Address = require("../models/Address");
const Payment = require("../models/Card");

// ✅ SEARCH ROUTE FIRST
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.json([]);
    }

    const orders = await Order.find({
      orderNumber: { $regex: q, $options: "i" },
    }).limit(5);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).limit(5);

    const addresses = await Address.find({
      $or: [
        { city: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
      ],
    }).limit(5);

    const formattedOrders = orders.map((item) => ({
      type: "ORDER",
      id: item._id,
      title: item.orderNumber || "Order",
    }));

    const formattedUsers = users.map((item) => ({
      type: "USER",
      id: item._id,
      title: item.name,
    }));

    const formattedAddresses = addresses.map((item) => ({
      type: "ADDRESS",
      id: item._id,
      title: `${item.city}, ${item.country}`,
    }));

    res.json([
      ...formattedOrders,
      ...formattedUsers,
      ...formattedAddresses,
    ]);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Search Error",
    });
  }
});



// ✅ FIND BY ID ROUTE SECOND
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const order = await Order.findById(id)
      .populate("user")
      .populate("address")
      .populate("payment");

    if (order) {
      return res.json({ type: "ORDER", data: order });
    }

    const user = await User.findById(id);
    if (user) {
      return res.json({ type: "USER", data: user });
    }

    const address = await Address.findById(id);
    if (address) {
      return res.json({ type: "ADDRESS", data: address });
    }

    const payment = await Payment.findById(id);
    if (payment) {
      return res.json({ type: "PAYMENT", data: payment });
    }

    return res.status(404).json({
      success: false,
      message: "No data found",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;