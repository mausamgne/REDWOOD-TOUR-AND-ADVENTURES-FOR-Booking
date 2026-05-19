import { useCart } from "../components/context/CartContext";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import Heading from "../components/common/Heading";
import Text from "../components/common/Text";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";

import "react-phone-input-2/lib/style.css";
import { createOrder } from "../services/api";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const { cartItems, calculateItemTotal, subtotal, grandTotal, clearCart } =
    useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [realCardNumber, setRealCardNumber] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "in",
    email: "",
    address: "",
    country: "",
    city: "",
    zip: "",
    hotel: "",
    age: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) return;

        // 🔥 USER PROFILE FETCH ()
        const token = localStorage.getItem("token");
        if (!token) return;

        const res1 = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data1 = await res1.json();

        // 🔥 CARD FETCH ()
        const res2 = await fetch("http://localhost:5000/api/order/card", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data2 = await res2.json();

        if (data1.success && data2.success) {
          setForm((prev) => ({
            ...prev,

            firstName: data1.user?.firstName || "",
            lastName: data1.user?.lastName || "",
            email: data1.user?.email || "",
            phone: data1.user?.phone || "",
            address: data1.user?.address || "",
            city: data1.user?.city || "",
            country: data1.user?.country || "",
            zip: data1.user?.zip || "",
            age: data1.user?.age || "",
            hotel: data1.user?.hotel || "",

            // 🔥 CARD
            cardName: data2.card?.cardName || "",
            cardNumber:
              data2.card && data2.card.last4
                ? `**** **** **** ${data2.card.last4}`
                : "",
            expiry: data2.card?.expiry || "",
            cvv: "",
          }));
        }
      } catch (err) {
        console.log("Autofill error:", err);
      }
    };

    fetchAllData();
  }, []);

  // ✅ CLEAN handleChange
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= FORMATTERS ================= */

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    let newErrors = {};

    /* ================= REQUIRED CHECK ================= */

    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "address",
      "country",
      "city",
      "zip",
      "hotel",
      "age",
      "cardName",
      // "cardNumber",
      "expiry",
      // "cvv",
    ];

    // ✅ CARD VALIDATION (FINAL FIX)
    if (!realCardNumber && form.cardNumber.includes("*")) {
      // ✅ saved card → skip validation
    } else {
      const cleanNumber = realCardNumber || form.cardNumber.replace(/\D/g, "");

      if (!cleanNumber || cleanNumber.length !== 16) {
        newErrors.cardNumber = "Enter valid card number";
      }
    }

    requiredFields.forEach((field) => {
      if (!form[field] || String(form[field]).trim() === "") {
        newErrors[field] = "* This field is required";
      }
    });

    /* ================= FORMAT VALIDATION ================= */

    // First Name
    if (form.firstName && form.firstName.trim() !== "") {
      if (form.firstName.length > 30) {
        newErrors.firstName = "Maximum 30 characters allowed";
      }
    }

    // Last Name
    if (form.lastName && !/^[A-Za-z\s]+$/.test(form.lastName)) {
      newErrors.lastName = "Only letters allowed";
    }

    // Card Name
    if (form.cardName && !/^[A-Za-z\s]+$/.test(form.cardName)) {
      newErrors.cardName = "Only letters allowed";
    }

    // Email
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    const digits = form.phone.replace(/\D/g, "");
    const localNumber = digits.slice(-10);

    if (!localNumber || localNumber.length !== 10) {
      newErrors.phone = "Enter valid phone number";
    }

    // Age
    if (form.age) {
      const age = Number(form.age);
      if (age < 18 || age > 99) {
        newErrors.age = "Age must be between 18 and 99";
      }
    }

    // Zip
    if (form.zip && !/^\d{6}$/.test(form.zip)) {
      newErrors.zip = "Zip must be 6 digits";
    }

    // Card Number
    // ✅ FIXED CARD VALIDATION
    if (!realCardNumber && form.cardNumber.includes("*")) {
      // ✅ saved card → skip validation
    } else {
      const cleanNumber = realCardNumber || form.cardNumber.replace(/\D/g, "");

      if (!cleanNumber || cleanNumber.length !== 16) {
        newErrors.cardNumber = "Enter valid card number";
      }
    }

    // CVV
    if (!form.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(form.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }
    // Expiry card
    const rawExpiry = form.expiry.replace("/", "");

    if (rawExpiry.length !== 6) {
      newErrors.expiry = "Invalid expiry date";
    } else {
      const month = Number(rawExpiry.slice(0, 2));
      const year = Number(rawExpiry.slice(2));

      if (month < 1 || month > 12) {
        newErrors.expiry = "Month must be between 01–12";
      } else if (year < new Date().getFullYear()) {
        newErrors.expiry = "Card has expired";
      }
    }

    // Terms
    if (!agreeTerms) {
      newErrors.terms = "You must accept Terms & Conditions";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const errors = validate(); // ✅ capture return

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // ✅ GET SAVED BOOKINGS
const previousOrders =
  JSON.parse(localStorage.getItem("placedOrders")) || [];

// ✅ CHECK DUPLICATE BOOKING
const duplicateBooking = cartItems.some((cartItem) => {
  const currentTitle = cartItem.title?.trim().toLowerCase();

  const currentDate =
  cartItem.travelDate || cartItem.date;

  return previousOrders.some((order) => {
    const savedTitle = order.title?.trim().toLowerCase();

   const savedDate =
  order.travelDate || order.date;

    return (
      savedTitle === currentTitle &&
      savedDate === currentDate
    );
  });
});

// ❌ BLOCK SAME TOUR + SAME DATE
if (duplicateBooking) {
  toast.error(
    "You already booked this tour for this date."
  );
  return;
}

// ❌ BLOCK
// if (duplicateBooking) {
//   toast.error(
//     "You already booked this tour for this date."
//   );
//   return;
// }      // 🔥
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      const cleanedItems = cartItems.map((item) => {
  const bookingDate =
    item.travelDate || item.date;

  return {
    id: item.id,

    // ✅ NORMALIZED TITLE
    title: item.title
      ?.trim()
      .toLowerCase(),

    quantity: item.quantity,

    // ✅ SAME DATE EVERYWHERE
    travelDate: bookingDate,
    date: bookingDate,

    vehicleId: item.vehicle?.id,

    price: item.total || item.price,

    category:
      item.category ||
      item.location ||
      item.tourName,
  };
});

      let finalCardNumber = "";

      if (realCardNumber && realCardNumber.length === 16) {
        finalCardNumber = realCardNumber; // new card
      } else if (form.cardNumber.includes("*")) {
        finalCardNumber = "SAVED_CARD"; // 👈
      }
      const orderData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        age: Number(form.age),

        pickupLocation: {
          address: form.address || "",
          country: form.country || "",
          city: form.city || "",
          zip: form.zip || "",
        },
        pickupDate:
          cartItems[0]?.travelDate || cartItems[0]?.date || new Date(),

        // ✅

        cardDetails: {
          cardNumber: finalCardNumber,
          expiry: form.expiry,
          cardName: form.cardName,
        },

        items: cleanedItems,
        amount: grandTotal,
      };

      // 🔥 ORDER SAVE
      console.log("🚀 ORDER DATA:", orderData);
      const res = await createOrder(orderData);
      console.log("Saved in DB:", res);

      // 🔥 USER UPDATE

      if (userId) {
        const user = JSON.parse(localStorage.getItem("user"));
        // const userId = user?._id;

        await fetch(`http://localhost:5000/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: user.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            country: form.country,
            zip: form.zip,
            age: form.age,
            hotel: form.hotel,
          }),
        });
      }

      // ✅ SAVE BOOKINGS BEFORE CLEAR CART
const newBookings = cartItems.map((item) => ({
  title: item.title?.trim().toLowerCase(),
  travelDate:
  item.travelDate || item.date,
}));

localStorage.setItem(
  "placedOrders",
  JSON.stringify([
    ...previousOrders,
    ...newBookings,
  ])
);

console.log(
  "FINAL BOOKINGS:",
  JSON.parse(localStorage.getItem("placedOrders"))
);
      clearCart();
//       const newBookings = cartItems.map((item) => ({
//   title: item.title?.trim().toLowerCase(),
//   travelDate: new Date(
//     item.travelDate || item.date
//   )
//     .toISOString()
//     .split("T")[0],
// }));

// localStorage.setItem(
//   "placedOrders",
//   JSON.stringify([
//     ...previousOrders,
//     ...newBookings,
//   ])
// );
      navigate("/order-placed");
    } catch (err) {
      console.log("Error saving order:", err);
      alert("Something went wrong ❌");
    }
  };
  //
  if (user?.role === "admin") {
    return (
      <CheckoutLayout step={1}>
        <div className="text-center py-20">
          <h2 className="text-2xl text-red-600 font-bold">
            Admin cannot place orders ❌
          </h2>
        </div>
      </CheckoutLayout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <CheckoutLayout step={1}>
        <div className="text-center py-20">
          <Heading as="h2">Your Cart is Empty</Heading>
        </div>
      </CheckoutLayout>
    );
  }
  // console.log("🚀 SENDING ORDER:", orderData);
  const inputStyle =
    "w-full border rounded-lg p-4 focus:ring-2 focus:ring-green-600 outline-none";

  const errorText = "text-red-500 text-sm mt-1";
  return (
    <CheckoutLayout step={3}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 bg-white p-10 shadow-lg">
          {/* First & Last */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Text className="font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.firstName}
                maxLength={30} // 🔥 limit
                placeholder="Enter your first name"
                onChange={(e) =>
                  handleChange(
                    "firstName",
                    e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  )
                }
                className={inputStyle}
              />

              {submitted && errors.firstName && (
                <p className={errorText}>{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Text className="font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.lastName}
                maxLength={30} // 🔥 limit
                placeholder="Enter your last name"
                onChange={(e) =>
                  handleChange(
                    "lastName",
                    e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  )
                }
                className={inputStyle}
              />

              {submitted && errors.lastName && (
                <p className={errorText}>{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="w-full">
              <Text className="font-medium mb-2 block">
                Cellphone Number <span className="text-red-500">*</span>
              </Text>

              <div className="w-full">
                <PhoneInput
                  country={"in"}
                  value={form.phone || ""}
                  onChange={(phone) => {
                    handleChange("phone", phone);

                    const digits = phone.replace(/\D/g, "");
                    const localNumber = digits.slice(-10);

                    if (localNumber.length !== 10) {
                      setErrors((prev) => ({
                        ...prev,
                        phone: "Enter valid phone number",
                      }));
                    } else {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.phone; // ✅ error remove
                        return newErrors;
                      });
                    }
                  }}
                  enableSearch={true}
                  containerClass="w-full"
                  inputClass={`!w-full !h-15 !pl-14 !text-sm !border rounded-md ${
                    errors.phone && errors.phone.length > 0
                      ? "!border-red-500"
                      : "!border-black"
                  }`}
                  buttonClass="!border-black !rounded-l-md"
                  dropdownClass="!text-black"
                />
              </div>

              {errors.phone && (
                <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
              )}
            </div>

            <div>
              <Text className="font-medium mb-2">
                Valid Email <span className="text-red-500">*</span>
              </Text>

              <input
                type="email"
                value={form.email || ""}
                placeholder="example@email.com"
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.email ? "border-red-500" : "border-black"
                }`}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("email", value);

                  // 🔥 LIVE VALIDATION
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "* Email is required",
                    }));
                  } else if (!emailRegex.test(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "Enter a valid email",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className="mt-6">
            <Text className="font-medium mb-2">
              Billing Address <span className="text-red-500">*</span>
            </Text>

            <input
              value={form.address || ""}
              maxLength={200} // 🔥 LIMIT (approx 200 chars)
              placeholder="Street address, apartment, suite, etc."
              className={`w-full border rounded-lg p-4 outline-none ${
                errors.address ? "border-red-500" : "border-black"
              }`}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("address", value);

                // 🔥 LIVE VALIDATION
                if (!value.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    address: "* Address is required",
                  }));
                } else if (value.length > 200) {
                  setErrors((prev) => ({
                    ...prev,
                    address: "Maximum 200 characters allowed",
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    address: "",
                  }));
                }
              }}
            />

            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="mt-6">
            <Text className="font-medium mb-2">
              Billing Country <span className="text-red-500">*</span>
            </Text>

            <select
              value={form.country || ""}
              className={`w-full border rounded-lg p-4 outline-none ${
                errors.country ? "border-red-500" : "border-black"
              }`}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("country", value);

                // 🔥 LIVE VALIDATION
                if (!value) {
                  setErrors((prev) => ({
                    ...prev,
                    country: "* Country is required",
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    country: "",
                  }));
                }
              }}
            >
              <option value="">Choose Your Country</option>
              <option>India</option>
              <option>USA</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>UAE</option>
              <option>Singapore</option>
              <option>Japan</option>
            </select>

            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* City + Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* City */}
            <div>
              <Text className="font-medium mb-2">
                Billing City <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.city || ""}
                maxLength={50} // 🔥 limit
                placeholder="Enter your billing city"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  handleChange("city", value);

                  // 🔥 LIVE VALIDATION
                  if (!value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      city: "* City is required",
                    }));
                  } else if (value.length > 50) {
                    setErrors((prev) => ({
                      ...prev,
                      city: "Maximum 50 characters allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      city: "",
                    }));
                  }
                }}
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.city ? "border-red-500" : "border-black"
                }`}
              />

              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* Zip Code */}
            <div>
              <Text className="font-medium mb-2">
                Zip Code <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.zip || ""}
                maxLength={6} // 🔥 6 digit limit
                inputMode="numeric"
                placeholder="Enter zip / postal code"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("zip", value);

                  // 🔥 LIVE VALIDATION
                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      zip: "* Zip code is required",
                    }));
                  } else if (value.length !== 6) {
                    setErrors((prev) => ({
                      ...prev,
                      zip: "Zip code must be 6 digits",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      zip: "",
                    }));
                  }
                }}
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.zip ? "border-red-500" : "border-black"
                }`}
              />

              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
            </div>
          </div>

          {/* Pickup + Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Text className="font-medium mb-2">
                Hotel / Pick-up Location <span className="text-red-500">*</span>
              </Text>

              <input
                value={form.hotel || ""}
                maxLength={200} // 🔥 limit
                placeholder="Hotel name or pickup location"
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("hotel", value);

                  // 🔥 LIVE VALIDATION
                  if (!value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      hotel: "* Pickup location is required",
                    }));
                  } else if (value.length > 200) {
                    setErrors((prev) => ({
                      ...prev,
                      hotel: "Maximum 200 characters allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      hotel: "",
                    }));
                  }
                }}
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.hotel ? "border-red-500" : "border-black"
                }`}
              />

              {errors.hotel && (
                <p className="text-red-500 text-sm mt-1">{errors.hotel}</p>
              )}
            </div>

            <div>
              <Text className="font-medium mb-2">
                Age(s) <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.age || ""}
                maxLength={2}
                inputMode="numeric"
                placeholder="Age"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("age", value);

                  // 🔥 LIVE VALIDATION
                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      age: "* This field is required",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      age: "", // ✅ remove error
                    }));
                  }
                }}
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.age ? "border-red-500" : "border-black"
                }`}
              />

              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <Heading as="h3" className="text-2xl mt-12 mb-6">
            Payment Details
          </Heading>

          <div className="border rounded-2xl p-8 bg-gray-50 space-y-6">
            <div>
              <Text className="font-medium mb-2">
                Name on Card <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={form.cardName || ""}
                maxLength={30} //
                placeholder="John Doe"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  handleChange("cardName", value);

                  // 🔥 LIVE VALIDATION
                  if (!value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      cardName: "* Name on card is required",
                    }));
                  } else if (value.length > 30) {
                    setErrors((prev) => ({
                      ...prev,
                      cardName: "Maximum 30 characters allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      cardName: "",
                    }));
                  }
                }}
                className={`w-full border rounded-lg p-4 outline-none ${
                  errors.cardName ? "border-red-500" : "border-black"
                }`}
              />

              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>

            <div>
              <Text>
                Card Number <span className="text-red-500">*</span>
              </Text>

              <input
                type="text"
                value={
                  realCardNumber
                    ? formatCardNumber(realCardNumber)
                    : form.cardNumber || ""
                }
                inputMode="numeric"
                placeholder="Card Number"
                maxLength={19} // 16 digits + spaces
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");

                  setRealCardNumber(rawValue); // ✅ ADD THIS
                  handleChange("cardNumber", rawValue.slice(0, 16));
                }}
                className="w-full h-14 px-3 border border-black rounded-md"
              />

              {submitted && errors.cardNumber && (
                <p className={errorText}>{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text>
                  Expiration (MM/YYYY) <span className="text-red-500">*</span>
                </Text>

                <input
                  type="text"
                  value={formatExpiry(form.expiry || "")}
                  placeholder="MM/YYYY"
                  maxLength={7}
                  inputMode="numeric"
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    handleChange("expiry", rawValue.slice(0, 6));

                    // 🔥 SIMPLE VALIDATION
                    if (!rawValue) {
                      setErrors((prev) => ({
                        ...prev,
                        expiry: "* Expiry date is required",
                      }));
                    } else if (rawValue.length < 6) {
                      setErrors((prev) => ({
                        ...prev,
                        expiry: "Invalid expiry date",
                      }));
                    } else {
                      const month = Number(rawValue.slice(0, 2));
                      const year = Number(rawValue.slice(2));

                      if (
                        month < 1 ||
                        month > 12 ||
                        year < 2026 ||
                        year > 2042
                      ) {
                        setErrors((prev) => ({
                          ...prev,
                          expiry: "Invalid expiry date", // ✅ simple message
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          expiry: "",
                        }));
                      }
                    }
                  }}
                  className={`w-full border rounded-lg p-4 outline-none ${
                    errors.expiry ? "border-red-500" : "border-black"
                  }`}
                />

                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>

              <div>
                <Text>
                  Security Number/CVV <span className="text-red-500">*</span>
                </Text>

                <input
                  type="password"
                  name="cc-csc"
                  value={form.cvv || ""}
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) =>
                    handleChange("cvv", e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full h-14 px-3 border border-black rounded-md"
                  autoComplete="cc-csc"
                />

                {submitted && errors.cvv && (
                  <p className={errorText}>{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-green-700 cursor-pointer"
              />

              <Text className="text-sm leading-none">
                I accept the{" "}
                <span
                  className="underline text-green-700 cursor-pointer"
                  onClick={() => setShowTerms(true)} // 🔥 open modal
                >
                  Terms & Conditions
                </span>
              </Text>
            </label>

            {submitted && errors.terms && (
              <Text className="text-red-500 text-sm mt-2">{errors.terms}</Text>
            )}
          </div>

          {/* Submit */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-xl text-lg font-semibold transition"
            >
              Submit Secure Order →
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - UPDATED DESIGN */}
        <div className="bg-[#f2f2f2] p-8 rounded-2xl shadow-lg h-fit sticky top-24">
          {/* ================= ORDER SUMMARY ================= */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow-md sticky top-24 h-fit">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Order Summary
            </h3>

            <div className="border-b border-gray-300 mb-6"></div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const totalForTour = calculateItemTotal(item);
                return (
                  <div key={item.id} className="space-y-4 mb-6">
                    <div className="text-gray-800 font-medium">
                      {item.title}

                      <div className="text-sm text-gray-600">
                        (
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "No Date"}
                        , {item.quantity} Guest{item.quantity > 1 ? "s" : ""})
                      </div>

                      {item.vehicle?.name && (
                        <div className="text-sm text-gray-600">
                          By {item.vehicle?.name}
                        </div>
                      )}
                    </div>

                    {item.date && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Date :</span>
                        <span className="text-gray-700">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "No Date"}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-semibold">Number of guests :</span>
                      <span className="text-gray-700">{item.quantity}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Cost of tour :</span>
                      <span className="text-gray-700">
                        ${Number(totalForTour).toLocaleString()}
                      </span>
                    </div>

                    {item.vehicle?.name && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Vehicle :</span>
                        <span className="text-gray-700">
                          {item.vehicle.name}
                        </span>
                      </div>
                    )}

                    <div className="border-b border-gray-300 mt-4"></div>
                  </div>
                );
              })
            )}

            {cartItems.length > 0 && (
              <div className="space-y-4 mt-6">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Subtotal :</span>
                  <span>${Number(subtotal).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Tax :</span>
                  <span>$0</span>
                </div>

                <div className="flex justify-between text-xl font-bold border-t border-gray-400 pt-4">
                  <span>Grand Total :</span>
                  <span className="text-green-800">
                    ${Number(grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {showTerms && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>

                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• All bookings are subject to availability.</li>
                    <li>• Payments once made are non-refundable.</li>
                    <li>• Users must provide accurate personal details.</li>
                    <li>
                      • Company is not responsible for delays or cancellations.
                    </li>
                    <li>• By proceeding, you agree to our policies.</li>
                  </ul>

                  <button
                    onClick={() => setShowTerms(false)}
                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
