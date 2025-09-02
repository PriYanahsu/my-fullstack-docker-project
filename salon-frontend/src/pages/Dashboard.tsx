import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import {jwtDecode} from "jwt-decode";

interface Appointment {
  id: number;
  serviceType: string;
  appointmentTime: string;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface DashboardData {
  appointments: Appointment[];
  notifications: Notification[];
}

interface BookFormData {
  serviceType: string;
  appointmentTime: string;
}

interface JwtPayload {
  exp?: number; // Optional expiration claim
  role?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [bookForm, setBookForm] = useState<BookFormData>({
    serviceType: "",
    appointmentTime: "",
  });
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Partial<BookFormData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
        return;
      }
    } catch (e) {
      localStorage.removeItem("jwtToken");
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    setIsLoading(true);
        const token = localStorage.getItem("jwtToken");

    try {
      const response = await api.get("/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardData(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      } else {
        setMessage("❌ Failed to load dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateBookForm = (): boolean => {
    const newErrors: Partial<BookFormData> = {};
    if (!bookForm.serviceType) newErrors.serviceType = "Service type is required";
    if (!bookForm.appointmentTime) newErrors.appointmentTime = "Appointment time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBookForm()) return;

    setIsBooking(true);
    const token = localStorage.getItem("jwtToken");
    try {
      await api.post("/user/appointments", bookForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Appointment booked successfully!");
      fetchDashboard(); // Refresh dashboard
      setBookForm({ serviceType: "", appointmentTime: "" });
    } catch (err: any) {
      console.error("Booking error:", err.response?.data || err.message);
      setMessage("❌ " + (err.response?.data?.message || "Booking failed"));
    } finally {
      setIsBooking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=2070&auto=format')] bg-cover bg-center opacity-20"></div>

      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header with Back and Logout */}
        <div className="flex justify-between mb-4">
          <Link
            to="/"
            className="flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-pink-600">Your Dashboard</h2>

          {/* Book Appointment Form */}
          <h3 className="text-xl font-bold mb-4 text-pink-600">Book New Appointment</h3>
          <form onSubmit={handleBookSubmit} className="mb-8">
            <div className="mb-4">
              <input
                className={`w-full p-3 border rounded-full ${errors.serviceType ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
                type="text"
                name="serviceType"
                placeholder="Service Type (e.g., Haircut)"
                value={bookForm.serviceType}
                onChange={handleBookChange}
                disabled={isBooking}
              />
              {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
            </div>

            <div className="mb-4">
              <input
                className={`w-full p-3 border rounded-full ${errors.appointmentTime ? 'border-red-500' : 'border-pink-200'} focus:border-pink-500 focus:outline-none transition-colors duration-300`}
                type="datetime-local"
                name="appointmentTime"
                value={bookForm.appointmentTime}
                onChange={handleBookChange}
                disabled={isBooking}
              />
              {errors.appointmentTime && <p className="mt-1 text-sm text-red-500">{errors.appointmentTime}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300 flex items-center justify-center"
              disabled={isBooking}
            >
              {isBooking ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isBooking ? "Booking..." : "Book Appointment"}
            </button>
          </form>

          {message && <p className="mb-4 text-center text-sm font-medium">{message}</p>}

          {/* Appointments List */}
          <h3 className="text-xl font-bold mb-4 text-pink-600">Your Appointments</h3>
          {dashboardData?.appointments.length ? (
            <ul className="space-y-4">
              {dashboardData.appointments.map((appt) => (
                <li key={appt.id} className="bg-pink-50 p-4 rounded-lg">
                  <p><strong>Service:</strong> {appt.serviceType}</p>
                  <p><strong>Time:</strong> {new Date(appt.appointmentTime).toLocaleString()}</p>
                  <p><strong>Status:</strong> {appt.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No appointments yet.</p>
          )}

          {/* Notifications List */}
          <h3 className="text-xl font-bold mt-8 mb-4 text-pink-600">Notifications</h3>
          {dashboardData?.notifications.length ? (
            <ul className="space-y-4">
              {dashboardData.notifications.map((notif) => (
                <li key={notif.id} className="bg-pink-50 p-4 rounded-lg">
                  <p>{notif.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No new notifications.</p>
          )}
        </div>
      </motion.div>

      {/* Decorative footer wave */}
      <div className="absolute bottom-0 w-full h-24 bg-pink-600 clip-path-wave"></div>

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