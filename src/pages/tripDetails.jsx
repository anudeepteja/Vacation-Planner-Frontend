import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";
import api from "../api/axiosInstance"; // Axios instance

export default function TripDetails() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [trip, setTrip] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTripAndStatus = async () => {
      try {
        const tripRes = await api.get(
          `/trip-proposals/${proposalId}`
        );
        setTrip(tripRes.data);

        // fetch approval status for current user
        const approvalRes = await api.get(
          `/api/proposal-approvals/${user.userId}/${proposalId}`
        );
        setStatus(approvalRes.data.status);
      } catch (err) {
        console.warn("Error fetching trip or status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTripAndStatus();
  }, [proposalId, user]);

  const updateStatus = async (newStatus) => {
    try {
      console.error("007");
      setUpdating(true);
      await api.put(
        `/api/proposal-approvals/${user.userId}/${proposalId}`,
        { status: newStatus }
      );
      console.error("008" , newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!trip) {
    return <div className="flex h-screen items-center justify-center">Trip not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white/90 rounded-3xl shadow-xl">
        {/* Trip Info */}
        <motion.h1
          className="text-4xl font-bold text-indigo-700 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {trip.placeName}
        </motion.h1>

        <p className="text-lg text-gray-700 mb-4">{trip.description}</p>
        <p className="text-xl text-pink-700 mb-2">💰 ₹{trip.costPerPerson} per person</p>
        <p className="text-md text-gray-600 mb-6">
          Proposed by: <span className="font-semibold">{trip.proposedBy.fullName}</span>
        </p>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              status === "APPROVED"
                ? "bg-green-200 text-green-800"
                : status === "REJECTED"
                ? "bg-red-200 text-red-800"
                : "bg-yellow-200 text-yellow-800"
            }`}
          >
            Your Status: {status}
          </span>
        </div>

        {/* Approve / Reject Buttons */}
        {status === "PENDING" && (
          <div className="flex gap-4 mb-6">
            <button
              disabled={updating}
              onClick={() => updateStatus("APPROVED")}
              className="px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              ✅ Approve
            </button>
            <button
              disabled={updating}
              onClick={() => updateStatus("REJECTED")}
              className="px-6 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
            >
              ❌ Reject
            </button>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          ← Back to Group
        </button>
      </div>
    </div>
  );
}
