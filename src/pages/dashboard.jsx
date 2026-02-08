import { useState } from "react";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import { UserPlus } from "lucide-react";
import AddMemberModal from "../components/AddMemberModal";


export default function Dashboard() {
  const { user, groups, proposals, loading } = useUser();
  const [activeTab, setActiveTab] = useState("groups");
  const navigate = useNavigate(); // ✅ hook for redirect

  /* State for Add Member Modal */
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const openAddMemberModal = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeAddMemberModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  if (loading) {
    // ... existing loading code
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Please log in to see your dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username} 👋
          </h1>
          <p className="text-gray-500">Wallet Balance: ₹{user.walletAmount}</p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-6 py-2 rounded-xl font-semibold shadow 
              ${activeTab === "groups" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`px-6 py-2 rounded-xl font-semibold shadow 
              ${activeTab === "proposals" ? "bg-pink-600 text-white" : "bg-white text-gray-700"}`}
          >
            Proposals
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow p-6">
          {activeTab === "groups" ? (
            <>
              <h2 className="text-xl font-bold mb-4">Your Groups</h2>

              {/* Create Group Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => navigate("/create-group")}
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-semibold shadow hover:bg-purple-700 transition"
                >
                  🚀 Create New Group
                </button>
              </div>

              {groups && groups.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">Group Name</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <tr
                        key={g.groupId}
                        className="border-t cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => navigate(`/group/${g.groupId}`)}
                      >
                        <td className="p-3">{g.groupName}</td>
                        <td className="p-3">{g.description}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddMemberModal(g);
                            }}
                            className="flex items-center gap-2 px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition ml-auto"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add Member
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">You are not in any groups yet.</p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Your Proposals</h2>
              {proposals && proposals.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">Place</th>
                      <th className="p-3">Cost per Person</th>
                      <th className="p-3">Group</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3">{p.placeName}</td>
                        <td className="p-3">₹{p.costPerPerson}</td>
                        <td className="p-3">{p.group?.groupName}</td>
                        <td className="p-3">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">You haven’t proposed any trips yet.</p>
              )}

              {/* ✅ Add Proposal Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/propose-trip")}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700"
                >
                  + Propose New Trip
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {selectedGroup && (
        <AddMemberModal
          isOpen={isModalOpen}
          onClose={closeAddMemberModal}
          groupId={selectedGroup.groupId}
          groupName={selectedGroup.groupName}
        />
      )}
    </div>
  );
}
