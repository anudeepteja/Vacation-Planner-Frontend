import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const goToDashboard = () => {
    /*if (location.pathname === "/dashboard") {
      // ✅ If already on dashboard, force reload
      navigate(0);
    } else {
      navigate("/dashboard");
    }*/
   navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left side */}
      <div
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={goToDashboard}
      >
        Vacation Planner
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-6">
        {user && (
          <span
            className="text-gray-700 font-medium cursor-pointer hover:text-indigo-600 transition"
            onClick={() => navigate("/profile")}
          >
            Hi, {user.username}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
