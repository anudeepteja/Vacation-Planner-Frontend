import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";
import api from "../api/axiosInstance"; // Axios instance

export default function ProposeTrip() {
  const { user, groups, FetchUserDetailsByUsername } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    placeName: "",
    costPerPerson: "",
    description: "",
    groupId: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to propose a trip!");
      return;
    }

    try {
      const payload = {
        placeName: formData.placeName,
        costPerPerson: parseFloat(formData.costPerPerson),
        description: formData.description,
        proposedBy: { userId: user.userId },
        group: { groupId: parseInt(formData.groupId) },
      };

      await api.post("/trip-proposals", payload);

      // ✅ Refresh context so dashboard sees updated proposals
      await FetchUserDetailsByUsername(user.username);

      alert("Trip proposal submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting trip proposal:", err);
      alert("Failed to submit proposal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      <Navbar />

      {/* Decorative circles in background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto mt-6 flex justify-start relative z-10">
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl shadow hover:bg-gray-300 transition"
        >
          ⬅ Back to Dashboard
        </motion.button>
      </div>

      {/* Form card */}
      <motion.div
        className="max-w-2xl mx-auto p-8 mt-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-8">
          🌍 Propose a New Adventure
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Place Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Place Name
            </label>
            <input
              type="text"
              name="placeName"
              value={formData.placeName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-indigo-400 outline-none transition transform hover:scale-[1.01]"
              placeholder="e.g., Manali, Goa, Bali"
            />
          </div>

          {/* Cost per Person */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cost per Person (₹)
            </label>
            <input
              type="number"
              name="costPerPerson"
              value={formData.costPerPerson}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-pink-400 outline-none transition transform hover:scale-[1.01]"
              placeholder="e.g., 5000"
            />
          </div>

          {/* Group Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Group
            </label>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-purple-400 outline-none transition transform hover:scale-[1.01]"
            >
              <option value="">-- Choose a Group --</option>
              {groups.map((g) => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-indigo-400 outline-none transition transform hover:scale-[1.01]"
              placeholder="Describe your trip idea..."
            ></textarea>
          </div>

          {/* Submit */}
          <motion.div className="flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              🚀 Submit Proposal
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
