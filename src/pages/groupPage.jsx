import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import api from "../api/axiosInstance"; // ✅ use api with JWT & refresh
import { motion } from "framer-motion";

export default function GroupPage() {
  const { groupId } = useParams();
  const { user, groups, loading } = useUser(); // ✅ use loading from context
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(true);

  // ✅ Wait for context loading before rendering or fetching data
  useEffect(() => {
    if (!loading && user) {
      const fetchMembers = async () => {
        try {
          setLoadingMembers(true);
          const res = await api.get(`/api/user-groups/group/${groupId}`);
          setMembers(res.data);
        } catch (err) {
          console.error("Error fetching group members:", err);
        } finally {
          setLoadingMembers(false);
        }
      };

      const fetchProposals = async () => {
        try {
          setLoadingProposals(true);
          const res = await api.get(`/trip-proposals/group/${groupId}`);
          const proposalsData = res.data;

          // Fetch approval status for each proposal for current user
          const proposalsWithStatus = await Promise.all(
            proposalsData.map(async (p) => {
              try {
                const approvalRes = await api.get(
                  `/api/proposal-approvals/${user.userId}/${p.id}`
                );
                return { ...p, status: approvalRes.data.status };
              } catch {
                return { ...p, status: "PENDING" };
              }
            })
          );

          setProposals(proposalsWithStatus);
        } catch (err) {
          console.error("Error fetching proposals:", err);
        } finally {
          setLoadingProposals(false);
        }
      };

      fetchMembers();
      fetchProposals();
    }
  }, [loading, user, groupId]); // ✅ fetch only after context finished loading

  // ✅ Show loader while context is fetching user info
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading user data...
      </div>
    );
  }

  // ✅ Show login message if no user
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Please log in to view this group.
      </div>
    );
  }

  const group = groups.find((g) => g.groupId === parseInt(groupId));

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Group not found or you are not part of this group.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main layout */}
      <div className="flex max-w-7xl mx-auto mt-24 gap-6 px-4">
        {/* Left Panel - Trips */}
        <motion.div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl relative p-8 flex flex-col">
          <div className="overflow-y-auto flex-1 pr-4">
            {/* Group Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-indigo-700">
                {group.groupName}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {group.description || "No description available"}
              </p>
            </div>

            {/* Trip Proposals */}
            <h2 className="text-2xl font-semibold text-pink-700 mb-4">
              🌍 Trip Proposals
            </h2>
            {loadingProposals ? (
              <p className="text-gray-500">Loading proposals...</p>
            ) : proposals.length ? (
              <div className="grid grid-cols-1 gap-6">
                {proposals.map((p) => (
                  <motion.div
                    key={p.id}
                    onClick={() => navigate(`/trip/${p.id}`)}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 rounded-2xl shadow hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">
                        {p.placeName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === "APPROVED"
                            ? "bg-green-200 text-green-800"
                            : p.status === "REJECTED"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{p.description}</p>
                    <p className="text-sm text-gray-800 mb-2">
                      ₹{p.costPerPerson} per person
                    </p>
                    <p className="text-sm text-gray-500">
                      Proposed by: {p.proposedBy.fullName}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No trip proposals yet.</p>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Members */}
        <motion.div className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 sticky top-24 h-[calc(100vh-96px)] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            👥 Members
          </h2>
          {loadingMembers ? (
            <p className="text-gray-500">Loading members...</p>
          ) : members.length ? (
            <ul className="space-y-3">
              {members.map((m) => (
                <li
                  key={m.user.userId}
                  className="p-3 bg-indigo-50 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{m.user.fullName}</p>
                    <p className="text-sm text-gray-500">@{m.user.username}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-pink-200 text-pink-800 font-semibold">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No members found.</p>
          )}
        </motion.div>
      </div>

      {/* Floating Add Trip Button */}
      <div className="fixed bottom-6 right-[22rem] z-50">
        <motion.button
          onClick={() => navigate("/propose-trip")}
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(255,105,180,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition"
        >
          ➕ Add Trip
        </motion.button>
      </div>
    </div>
  );
}
