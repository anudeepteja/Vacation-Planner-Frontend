import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";

export default function createGroup() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { user ,FetchUserDetailsByUsername } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/groups", {
        groupName,
        description,
      });

      await FetchUserDetailsByUsername(user.username);
      alert("🎉 Group Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create group. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar />

      <div className="flex justify-center mt-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            ✨ Create a New Group
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Group Name
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your group..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
            >
              🚀 Create Group
            </button>
          </form>

          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full text-indigo-600 font-semibold hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
