import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Wallet } from "lucide-react";

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Please log in to view your Profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />

      <motion.div
        className="max-w-3xl mx-auto p-8 mt-16 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            {user.fullName}
          </h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Mail className="text-indigo-500" />
            <span className="font-medium text-gray-700">{user.email}</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Phone className="text-pink-500" />
            <span className="font-medium text-gray-700">{user.phoneNumber}</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Wallet className="text-green-600" />
            <span className="font-medium text-gray-700">
              Wallet Balance: <span className="font-semibold">₹{user.walletAmount}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
