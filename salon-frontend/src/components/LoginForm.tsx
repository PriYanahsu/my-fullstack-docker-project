import { useState } from "react";
import api from "../lib/api";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", null, {
        params: { email: form.email, password: form.password },
      });
      setMessage("✅ " + res.data);
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data || "Invalid credentials"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

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

      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Login
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}
    </form>
  );
}
