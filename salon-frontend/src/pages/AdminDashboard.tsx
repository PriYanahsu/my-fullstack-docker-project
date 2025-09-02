import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { ArrowLeft, Loader2, LogOut, Check, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
  role: string;
}

interface Appointment {
  id: number;
  serviceType: string;
  appointmentTime: string;
  status: string;
  user: User;
}

interface JwtPayload {
  exp?: number;
  role?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      if (decoded.role !== "ADMIN") {
        navigate("/dashboard"); // Redirect if not admin
        return;
      }
    } catch (e) {
      localStorage.removeItem("jwtToken");
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("jwtToken");
    try {
      const [apptRes, userRes] = await Promise.all([
        api.get("/admin/appointments/pending", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }), // assume you have endpoint for users
      ]);
      setPendingAppointments(apptRes.data);
      setUsers(userRes.data);
    } catch (err: any) {
      setMessage("❌ Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentDecision = async (id: number, status: string) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.put(`/admin/appointments/${id}/approve`, status, {
        headers: { Authorization: `Bearer ${token}`},
      });
      setMessage(`✅ Appointment ${status}`);
      fetchData();
    } catch {
      setMessage("❌ Failed to update appointment");
    }
  };

  const handleGrantAccess = async (id: number, role: string) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.put(`/admin/users/${id}/grant-access`, role, {
        headers: { Authorization: `Bearer ${token}`},
      });
      setMessage(`✅ Role updated to ${role}`);
      fetchData();
    } catch {
      setMessage("❌ Failed to update user role");
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
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509339022327-1e1e25360a82?q=80&w=2070&auto=format')] bg-cover bg-center opacity-20"></div>

      <motion.div
        className="relative z-10 w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between mb-4">
          <Link to="/" className="flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-300">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-pink-600">Admin Dashboard</h2>

          {message && <p className="mb-4 text-center text-sm font-medium">{message}</p>}

          {/* Pending Appointments */}
          <h3 className="text-xl font-bold mb-4 text-pink-600">Pending Appointments</h3>
          {pendingAppointments.length ? (
            <ul className="space-y-4 mb-8">
              {pendingAppointments.map((appt) => (
                <li key={appt.id} className="bg-pink-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p><strong>User:</strong> {appt.user.email}</p>
                    <p><strong>Service:</strong> {appt.serviceType}</p>
                    <p><strong>Time:</strong> {new Date(appt.appointmentTime).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAppointmentDecision(appt.id, "APPROVED")}
                      className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 flex items-center"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleAppointmentDecision(appt.id, "REJECTED")}
                      className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mb-8">No pending appointments.</p>
          )}

          {/* User Management */}
          <h3 className="text-xl font-bold mb-4 text-pink-600">User Management</h3>
          {users.length ? (
            <ul className="space-y-4">
              {users.map((u) => (
                <li key={u.id} className="bg-pink-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p><strong>Email:</strong> {u.email}</p>
                    <p><strong>Role:</strong> {u.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => handleGrantAccess(u.id, "ADMIN")}
                        className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role !== "USER" && (
                      <button
                        onClick={() => handleGrantAccess(u.id, "USER")}
                        className="bg-purple-500 text-white px-3 py-2 rounded-full hover:bg-purple-600"
                      >
                        Make User
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No users found.</p>
          )}
        </div>
      </motion.div>

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
