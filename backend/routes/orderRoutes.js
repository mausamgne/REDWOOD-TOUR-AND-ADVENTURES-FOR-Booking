const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/AuthUser");
const Address = require("../models/Address");
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sgMail = require("@sendgrid/mail");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// 🔐 AUTH MIDDLEWARE
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
  } catch {
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

const sendOrderConfirmationEmail = async (order) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.log("SendGrid is not configured. Skipping email.");
    return;
  }

  const customerEmail = order.email || order.user?.email;
const customerName =
  `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
  `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim();

  if (!customerEmail) {
    console.log("Customer email missing. Skipping email.");
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.title}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${
            item.travelDate
              ? new Date(item.travelDate).toLocaleDateString()
              : "N/A"
          }</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${
            item.vehicle?.name || "N/A"
          }</td>
        </tr>
      `
    )
    .join("");

  await sgMail.send({
    to: customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Your Redwood Tour Booking Confirmation",
    html: `
      <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6;">
        <h2 style="color:#4f772d;">Booking Confirmed</h2>
        <p>Hello ${customerName || "Guest"},</p>
        <p>Thank you for booking with Redwood National Park Tours.</p>

        <h3>Booking Details</h3>
        <table style="border-collapse:collapse;width:100%;max-width:700px;">
          <thead>
            <tr style="background:#4f772d;color:white;">
              <th style="padding:8px;text-align:left;">Tour</th>
              <th style="padding:8px;text-align:left;">Guests</th>
              <th style="padding:8px;text-align:left;">Travel Date</th>
              <th style="padding:8px;text-align:left;">Vehicle</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p><strong>Total Amount:</strong> $${Number(
          order.amount || 0
        ).toLocaleString()}</p>

        <p><strong>Pickup Location:</strong><br/>
          ${order.address?.address || ""}<br/>
          ${order.address?.city || ""}, ${order.address?.country || ""} ${
      order.address?.zip || ""
    }
        </p>

        <p>If you have any questions, please contact us.</p>
        <p style="color:#4f772d;font-weight:bold;">Redwood National Park Tours</p>
      </div>
    `,
  });
};

// 🔥 CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin cannot place orders ❌",
      });
    }
    // ✅ UPDATE USER PHONE
    if (data.phone) {
      await User.findByIdAndUpdate(user._id, {
        phone: data.phone,
      });
    }

    if (!data.pickupLocation) {
      return res.status(400).json({
        success: false,
        error: "Pickup location missing",
      });
    }

    // ✅ ADDRESS
    const address = await Address.create({
      user: user._id,
      address: data.pickupLocation?.address || "",
      country: data.pickupLocation?.country || "",
      city: data.pickupLocation?.city || "",
      zip: data.pickupLocation?.zip || "",
    });

    // 🔥 🔐 SECURE CARD TOKENIZATION
    const { cardNumber, expiry, cardName } = data.cardDetails || {};

    if (!cardNumber) {
      return res.status(400).json({
        success: false,
        error: "Card number missing",
      });
    }

    // 🔥 CLEAN CARD NUMBER (VERY IMPORTANT)
    let cleanNumber = "";
    let token = "";
    let last4 = "";

    if (cardNumber === "SAVED_CARD") {
      // 🔥 USE EXISTING CARD
      const existingCard = await Card.findOne({ user: user._id }).sort({
        createdAt: -1,
      });

      if (!existingCard) {
        return res.status(400).json({
          success: false,
          error: "No saved card found",
        });
      }

      token = existingCard.cardToken;
      last4 = existingCard.last4;
    } else {
      // 🔥 NEW CARD FLOW
       cleanNumber = cardNumber?.replace(/\D/g, "");

      if (!cleanNumber || cleanNumber.length !== 16) {
        return res.status(400).json({
          success: false,
          error: "Invalid card number",
        });
      }

      token = crypto
        .createHash("sha256")
        .update(cleanNumber + Date.now())
        .digest("hex");

      last4 = cleanNumber.slice(-4);
    }

    // 🔥 DEBUG (CHECK TERMINAL)
    console.log("CARD DEBUG:", {
      cardNumber,
      cleanNumber: cleanNumber || "SAVED_CARD",
      last4,
    });

    // 🔥 SAVE CARD (GUARANTEED TOKEN)
    const card = await Card.create({
      user: user._id,
      cardName: cardName || "",
      last4,
      expiry: expiry || "",
      cardToken: token, // 🔥 ALWAYS PRESENT
      totalAmount: data.amount,
    });


    // ✅ CHECK DUPLICATE BOOKING
const existingOrder = await Order.findOne({
  user: user._id,

  "items.title": {
    $regex: new RegExp(
      `^${data.items[0].title.trim()}$`,
      "i"
    ),
  },

  pickupDate: new Date(
    data.items?.[0]?.travelDate ||
    data.items?.[0]?.date
  ),
});

// ❌ BLOCK SAME TOUR + SAME DATE
if (existingOrder) {
  return res.status(400).json({
    success: false,
    message:
      "You already booked this tour for this date.",
  });
}
    // ✅ ORDER CREATE
    const order = await Order.create({
  user: user._id,
  address: address._id,
  card: card._id,

  firstName: data.firstName || user.firstName || "",
  lastName: data.lastName || user.lastName || "",
  email: data.email || user.email || "",
  phone: data.phone || "",

  items: data.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        travelDate: item.travelDate,
        category: item.category || "Unknown Tour",

        // 🔥 ADD THIS
        vehicle: {
          name: item.vehicle?.name || item.vehicle || "Unknown",
        },
      })),
      amount: data.amount,
      // phone: data.phone,
      passengerCount: data.items?.[0]?.quantity || 1,
      pickupDate: new Date(
        req.body.items?.[0]?.travelDate || req.body.items?.[0]?.date,
      ),
      bookingDate: new Date(),
    });

    const fullOrder = await Order.findById(order._id)
      .populate("user")
      .populate("address")
      .populate("card");
      try {
  await sendOrderConfirmationEmail(fullOrder);
} catch (emailError) {
  console.error("Order email failed:", emailError.message);
}

    res.status(201).json({
      success: true,
      message: "Order placed successfully 🎉",
      data: fullOrder,
    });
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🔥 GET ALL ORDERS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user")
      .populate("address")
      .populate("card");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🔥 CARD FETCH (SAFE FOR FRONTEND)
router.get("/card", authMiddleware, async (req, res) => {
  try {
    const card = await Card.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    if (!card) {
      return res.json({
        success: true,
        card: null,
      });
    }

    // ✅ SAFE RESPONSE (ONLY MASKED DATA)
    res.json({
      success: true,
      card: {
        cardName: card.cardName,
        expiry: card.expiry,
        last4: card.last4,
      },
    });
  } catch (err) {
    console.log("CARD ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 🔥 GET SINGLE ORDER
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("address")
      .populate("card");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized ❌" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🔥 ADMIN: GET ALL ORDERS
router.get("/admin/all-orders", async (req, res) => {
  try {
    const { search, min, max, page = 1 } = req.query;

    let query = {};

    // 🔍 SEARCH
    // TEMPORARY disable search (debug ke liye)
    if (search) {
       const cleanSearch = search.trim();
      const users = await User.find({
  $or: [
    {
      firstName: { $regex: search, $options: "i" },
    },
    {
      lastName: { $regex: search, $options: "i" },
    },
    {
      email: { $regex: search, $options: "i" },
    },
    {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$firstName", " ", "$lastName"],
          },
          regex: cleanSearch,
          options: "i",
        },
      },
    },
  ],
}).select("_id");

      const userIds = users.map((u) => u._id);

      query.$or = [
        { user: { $in: userIds } },
        { phone: { $regex: search, $options: "i" } },
        { "items.title": { $regex: search, $options: "i" } },
      ];
    }

    const { startDate, endDate } = req.query;
    

if (startDate && endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // 🔥 IMPORTANT FIX
  if (start.getTime() === end.getTime()) {
    // 👉 SAME DATE → treat as "TO only"
    query.createdAt = {
      $lte: end,
    };
  } else {
    // 👉 NORMAL RANGE
    query.createdAt = {
      $gte: start,
      $lte: end,
    };
  }
} else if (startDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  query.createdAt = {
    $gte: start,
  };
} else if (endDate) {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  query.createdAt = {
    $lte: end,
  };
}

    // 💰 PRICE FILTER
    if (min || max) {
      query.amount = {
        $gte: Number(min) || 0,
        $lte: Number(max) || 999999999,
      };
    }
    console.log("FINAL QUERY:", query);

    // 📄 PAGINATION
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email phone")
      .populate("card", "last4")
      .select("phone amount createdAt pickupDate user card items")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
