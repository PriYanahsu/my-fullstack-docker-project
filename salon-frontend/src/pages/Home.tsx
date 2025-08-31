import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Salon Appointment</h1>
      <div className="flex gap-4">
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
        <Link to="/login" className="text-green-600 underline">
          Login
        </Link>
      </div>
    </div>
  );
}
