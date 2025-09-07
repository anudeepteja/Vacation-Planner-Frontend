import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {useUser} from "../context/UserContext"

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { FetchUserDetailsByUsername } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("Login attempt:", formData);
  
      const response = await axios.post(
        "http://localhost:8080/users/login",
        formData, // Axios automatically stringifies JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Login success:", response.data);
  
      // Example: if backend returns token or userId
      // localStorage.setItem("token", response.data.token);
      FetchUserDetailsByUsername(formData.username);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
  
      // Axios errors may be in error.response
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials, please try again!");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  
  

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-lg p-10 shadow-2xl"
      >
        <h2 className="mb-4 text-center text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          Vacation Planner
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Come on Lets plan your vacation
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 font-semibold text-white shadow-lg transition hover:shadow-2xl"
          >
            🚀 Login
          </motion.button>
        </form>

        {/* Signup link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer font-semibold text-pink-600 hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
