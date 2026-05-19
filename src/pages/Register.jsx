import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role:"user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 🔥 loading state

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
  const { name, value } = e.target;

  // ❌ block digits in name
  if (name === "firstName" || name === "lastName") {
    if (!/^[A-Za-z]*$/.test(value)) return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  let error = "";

  // 🔥 FIRST NAME
  if (name === "firstName") {
    if (!value) {
      error = "First name is required";
    } else if (!/^[A-Za-z]{1,30}$/.test(value)) {
      error = "Only letters (max 30 characters)";
    }
  }

  // 🔥 LAST NAME
  if (name === "lastName") {
    if (!value) {
      error = "Last name is required";
    } else if (!/^[A-Za-z]{1,30}$/.test(value)) {
      error = "Only letters (max 30 characters)";
    }
  }

  // 🔥 EMAIL (REAL-TIME)
  if (name === "email") {
    if (!value) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Enter correct email (e.g. hello@gmail.com)";
    }
  }

  // 🔥 PASSWORD
  if (name === "password") {
    if (!value) {
      error = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#]).{8,}$/.test(value)
    ) {
      error =
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char";
    }
  }

  // 🔥 SET ERROR
  setErrors((prev) => ({
    ...prev,
    [name]: error,
  }));
};

  // 🔥 VALIDATION
const validate = () => {
  let newErrors = {};

  // FIRST NAME
  if (!form.firstName) {
    newErrors.firstName = "First name is required";
  } else if (!/^[A-Za-z]{1,30}$/.test(form.firstName)) {
    newErrors.firstName = "Only letters (max 30 characters)";
  }

  // LAST NAME
  if (!form.lastName) {
    newErrors.lastName = "Last name is required";
  } else if (!/^[A-Za-z]{1,30}$/.test(form.lastName)) {
    newErrors.lastName = "Only letters (max 30 characters)";
  }

  // EMAIL
  if (!form.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Enter correct email (e.g. hello@gmail.com)";
  }

  // PASSWORD (SPECIAL CHAR REQUIRED)
  if (!form.password) {
    newErrors.password = "Password is required";
  } else if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#]).{8,}$/.test(form.password)
  ) {
    newErrors.password =
      "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // 🔥 REGISTER
  const handleRegister = async () => {
  const isValid = validate();
  if (!isValid) return;

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  ...form,
  email: form.email.trim().toLowerCase(),
  password: form.password.trim(),
  // role: form.email === "admin@gmail.com" ? "admin" : "user",
}),       
    });

    const data = await res.json();

    console.log("RESPONSE:", data); // 

    if (!res.ok) {
      
  toast.error(data.message || "Server error ❌");
  return;
}

toast.success("Registered Successfully ✅", {
  autoClose: 1500, // ⏱️ 1.5 seconds
  style: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderLeft: "5px solid #4caf50",
  },
});


// reset form
setForm({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role:"user",
});

// redirect
navigate("/login");

  } catch (err) {
    console.log("FRONT ERROR:", err);
    alert("Server not responding");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex justify-center items-start bg-[#f4f6f3] pt-10">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-[#4F772D] mb-6 text-center">
          Register
        </h2>

        {/* FIRST NAME */}
       <div className="mb-3">
  <label className="block mb-1 font-medium">First Name <span className="text-red-500">*</span></label>
  <input
    name="firstName"
    value={form.firstName}
    placeholder="Enter your first name"
    maxLength={30}
    onChange={handleChange}
    className={`w-full p-3 rounded border ${
      errors.firstName ? "border-red-500" : "border-gray-300"
    }`}
  />
  {errors.firstName && (
    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
  )}
</div>
        

        {/* LAST NAME */}
        <div className="mb-3">
  <label className="block mb-1 font-medium">Last Name <span className="text-red-500">*</span></label>
  <input
    name="lastName"
    value={form.lastName}
    placeholder="Enter your last name"
    maxLength={30}
    onChange={handleChange}
    className={`w-full p-3 rounded border ${
      errors.lastName ? "border-red-500" : "border-gray-300"
    }`}
  />
  {errors.lastName && (
    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
  )}
</div>

        {/* EMAIL */}
        <div className="mb-3">
  <label className="block mb-1 font-medium">Email <span className="text-red-500">*</span></label>
  <input
    name="email"
    value={form.email}
    placeholder="hello@gmail.com"
    onChange={handleChange}
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
  <label className="block mb-1 font-medium">Password <span className="text-red-500">*</span></label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      placeholder="Enter strong password"
      onChange={handleChange}
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

<div className="mb-3">
  <label className="block mb-1 font-medium">
    Register As
  </label>

  <select
    name="role"
    value={form.role}
    onChange={handleChange}
    className="w-full p-3 rounded border border-gray-300"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
</div>
        <button
  onClick={handleRegister}
  disabled={loading}
  className="w-full bg-[#4F772D] hover:bg-[#3d5f24] text-white py-3 rounded font-semibold mt-3 disabled:opacity-50 transition duration-300"
>
  {loading ? "Registering..." : "Register"}
</button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
  className="text-[#4F772D] cursor-pointer font-semibold hover:underline hover:text-[#3d5f24] transition duration-200"
  onClick={() => navigate("/login")}
>
  Login
</span>
        </p>

      </div>
    </div>
  );
}