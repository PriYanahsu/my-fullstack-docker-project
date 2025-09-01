import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    if (!form.fullName) newErrors.fullName = "Full Name is required";
    else if (form.fullName.length < 2) newErrors.fullName = "Full Name must be at least 2 characters";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/register", form);
      setMessage("✅ Registration successful!");
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-w-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=2070&auto=format')] bg-cover bg-center opacity-20"></div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center text-pink-600 mb-4 hover:text-pink-700 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-pink-600">Join Chic Salon</h2>

          <div className="mb-4">
            <input
              className={`w-full p-3 border rounded-full ${errors.fullName ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <input
              className={`w-full p-3 border rounded-full ${errors.email ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <input
              className={`w-full p-3 border rounded-full ${errors.password ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <input
              className={`w-full p-3 border rounded-full ${errors.phone ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
              type="text"
              name="phone"
              placeholder="Phone (e.g., +1234567890)"
              value={form.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-3 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoading ? "Registering..." : "Register"}
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-pink-600 hover:text-pink-700 underline transition-colors duration-300"
            >
              Already have an account? Login
            </Link>
          </div>

          {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
        </form>
      </motion.div>

      {/* Decorative footer wave */}
      <div className="absolute bottom-0 w-full h-24 bg-pink-600 clip-path-wave"></div>

      {/* Standard CSS for wave effect */}
      <style>
        {`
          .clip-path-wave {
            clip-path: polygon(0 60%, 100% 0%, 100% 100%, 0% 100%);
          }
        `}
      </style>
    </div>
  );
}