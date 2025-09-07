import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/users", {
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    });

    console.log("Signup successful:", response.data);
    alert("Account created successfully!");
    navigate("/login");
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      alert(error.response.data.message || "Signup failed!");
    } else if (error.request) {
      // Request was made but no response received
      alert("No response from server. Please try again later.");
    } else {
      // Something else happened
      alert("Error: " + error.message);
    }
    console.error("Signup error:", error);
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
        {/* Title */}
        <h2 className="mb-4 text-center text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          Create Account ✨
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Join us today and start planning vacation 🌍
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 font-semibold text-white shadow-lg transition hover:shadow-2xl"
          >
            🎉 Sign Up
          </motion.button>
        </form>

        {/* Redirect to Login */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold text-pink-600 hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
