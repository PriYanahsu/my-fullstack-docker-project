import { useState } from "react";
import api from "../lib/api";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form); // ✅ fixed endpoint
      setMessage("✅ Registration successful!");
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data || "Something went wrong"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        className="w-full mb-3 p-2 border rounded"
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Register
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}
    </form>
  );
}
