import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();



  /// 🔥 SEND OTP
const sendOtp = async () => {
  if (!email) {
    toast.error("Email is required ❌", {
      autoClose: 1500,
    });
    return;
  }


    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
  toast.error(data.message || "Error sending OTP ❌", {
    autoClose: 1500,
  });
} else {
  toast.success("OTP sent to your email 📩", {
    autoClose: 1500,
  });
  setStep(2);
}
} catch (err) {
  toast.error("Server error ❌", {
    autoClose: 1500,
  });
}

setLoading(false);
};

// 🔥 RESET PASSWORD
const resetPassword = async () => {
  if (!otp || !password) {
    toast.error("All fields are required ❌", {
      autoClose: 1500,
    });
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Error ❌", {
        autoClose: 1500,
      });
    } else {
      toast.success("Password reset successful ✅", {
        autoClose: 1500,
      });

      // 🔥 redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  } catch (err) {
    toast.error("Server error ❌", {
      autoClose: 1500,
    });
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f4f6f3] px-4 pt-17">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-[#4F772D] mb-6">
          Forgot Password
        </h2>

        
{step === 1 && (
  <>
    <label className="block mb-1 font-medium">
      Email <span className="text-red-500">*</span>
    </label>

    <input
      type="email"
      name="email"
      autoComplete="username"
      placeholder="hello@gmail.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className={`w-full p-3 rounded border mb-2 ${
        email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "border-red-500"
          : "border-gray-300"
      }`}
    />

    {/* 🔥 ERROR MESSAGE */}
    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
      <p className="text-red-500 text-sm mb-2">
        Enter a valid email (e.g. hello@gmail.com)
      </p>
    )}

    <button
      onClick={sendOtp}
      disabled={
        loading ||
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      }
      className="w-full bg-[#4F772D] hover:bg-[#3d5f24] text-white py-3 rounded font-semibold transition disabled:opacity-50"
    >
      {loading ? "Sending OTP..." : "Send OTP"}
    </button>
  </>
)}

        
{step === 2 && (
  <>
    {/* OTP */}
    <label className="block mb-1 font-medium">
      OTP <span className="text-red-500">*</span>
    </label>

    <input
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className={`w-full p-3 rounded border mb-2 ${
        otp && otp.length < 6 ? "border-red-500" : "border-gray-300"
      }`}
    />

    {otp && otp.length < 6 && (
      <p className="text-red-500 text-sm mb-2">OTP must be 6 digits</p>
    )}

    {/* NEW PASSWORD */}
    <label className="block mb-1 font-medium">
      New Password <span className="text-red-500">*</span>
    </label>

    <div className="relative mb-2">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full p-3 pr-10 rounded border ${
          password && password.length < 6
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />

      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
      >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </span>
    </div>

    {password && password.length < 6 && (
      <p className="text-red-500 text-sm mb-2">
        Password must be at least 6 characters
      </p>
    )}



    {/* CONFIRM PASSWORD */}
    <label className="block mb-1 font-medium">
  Confirm Password <span className="text-red-500">*</span>
</label>

<div className="relative mb-2">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className={`w-full p-3 pr-10 rounded border ${
      confirmPassword && confirmPassword !== password
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />

  {/* 👁️ EYE ICON */}
  <span
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
  >
    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
  </span>
</div>



    {/* BUTTON */}
    <button
      onClick={resetPassword}
      disabled={
        loading ||
        !otp ||
        !password ||
        !confirmPassword ||
        password !== confirmPassword ||
        password.length < 6
      }
      className="w-full bg-[#4F772D] hover:bg-[#3d5f24] text-white py-3 rounded font-semibold transition disabled:opacity-50"
    >
      {loading ? "Updating..." : "Reset Password"}
    </button>
  </>
)}
        {/* BACK TO LOGIN */}
        <p className="text-center mt-4 text-sm">
          Remember your password?{" "}
          <span
            className="text-[#4F772D] cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}