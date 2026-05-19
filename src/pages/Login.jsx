// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
const [errors, setErrors] = useState({});

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("auth"));

  if (saved) {
    setEmail(saved.email || "");
    setPassword(saved.password || "");
    setRememberMe(true);
  }
}, []);

const validate = () => {
  let newErrors = {};

  if (!email) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Enter correct email (e.g. hello@gmail.com)";
  }

  if (!password) {
    newErrors.password = "Password is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email.trim().toLowerCase(),
    password: password.trim(),
  }),
});

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);


      if (!res.ok) {
        toast.error(data.message || "Login failed ❌");
        return;
      }
      // 🔥 SAVE LATEST LOGIN (IMPORTANT)
localStorage.setItem(
  "auth",
  JSON.stringify({
    email: email.trim().toLowerCase(),
    password: password.trim(),
  })
);

     // 🔥 SAVE DATA
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

// ✅ REMEMBER ME 
if (rememberMe) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      email: email,
      password: password,
    })
  );
} else {
  localStorage.removeItem("auth");
}

// 🔥 trigger update
window.dispatchEvent(new Event("storage"));


      // ✅ SUCCESS TOAST
      toast.success("Login successful 🎉", {
  autoClose: 1500, // ⏱️ 1.5 seconds ()
  style: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderLeft: "5px solid #4caf50",
  },
});


      // 🔥 REDIRECT (NO RELOAD)
      setTimeout(() => {
  if (data.user.role === "admin") {
    navigate("/admin"); // 👑 admin dashboard
  } else {
    navigate("/review-order"); // 👤 normal user
  }
}, 700);

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error("Server error ❌");
    }
  }; 


  return (
    <div className="min-h-screen flex justify-center items-start pt-10 bg-[#f4f6f3]">
      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
  autoComplete="on"
  className="bg-white p-8 rounded shadow-md w-full max-w-md"
>

        <h2 className="text-2xl font-bold text-[#4F772D] mb-6 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <div className="mb-3">
  <label className="block mb-1 font-medium">Email <span className="text-red-500">*</span></label>

  <input
    type="email"
    name="email"
    autoComplete="email"
    placeholder="hello@gmail.com"
    value={email}
    onChange={(e) => {
  const value = e.target.value;
  setEmail(value);

  let error = "";

  if (!value) {
    error = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = "Enter correct email (e.g. hello@gmail.com)";
  }

  setErrors((prev) => ({
    ...prev,
    email: error,
  }));
}}
    className={`w-full p-3 rounded border ${
      errors.email ? "border-red-500" : "border-gray-300"
    }`}
  />

  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>

        {/* PASSWORD */}
        <div className="mb-3">
  <label className="block mb-1 font-medium">Password  <span className="text-red-500">*</span> </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      autoComplete="current-password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        setErrors((prev) => ({ ...prev, password: "" }));
      }}
      className={`w-full p-3 rounded border ${
        errors.password ? "border-red-500" : "border-gray-300"
      }`}
    />

    <span
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-3 cursor-pointer"
>
  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
</span>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
  )}
</div>

        {/* LOGIN BUTTON */}
        <button type="submit"
          className="w-full bg-[#4F772D] hover:bg-[#3d5f24] text-white py-3 rounded font-semibold transition"
        >
          Login
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-[#4F772D] cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
        <div className="flex justify-between items-center mt-5 mb-3">
          
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
    />
    Remember me
  </label>


  <span
    onClick={() => navigate("/forgot-password")}
    className="text-[#4F772D] cursor-pointer font-semibold hover:underline"
  >
    Forgot Password?
  </span>
</div>
</form> 
      </div>
      
    // </div>
    
  );
}