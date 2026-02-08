import { useState } from "react";
import { X, User, Mail, Loader2 } from "lucide-react";
import api from "../api/axiosInstance";

export default function AddMemberModal({ isOpen, onClose, groupId, groupName }) {
    const [inputType, setInputType] = useState("username"); // "username" | "email"
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            setLoading(true);
            // Construct the payload to match UserGroupRequest DTO
            const payload = {
                username: inputValue,
                groupId: groupId,
                role: "MEMBER",
            };

            console.log("Submitting payload:", payload);

            // POST request to /api/user-groups/request
            await api.post("/api/user-groups/request", payload);

            alert(`Successfully added member via ${inputType}!`);
            setInputValue("");
            onClose();
        } catch (error) {
            console.error("Failed to add member:", error);
            alert("Failed to add member. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all scale-100">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            Add Member to <span className="text-indigo-600">{groupName}</span>
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-100 transition"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setInputType("username")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${inputType === "username"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Username
                        </button>
                        <button
                            onClick={() => setInputType("email")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${inputType === "email"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter {inputType === "username" ? "Username" : "Email Address"}
                            </label>
                            <input
                                type={inputType === "email" ? "email" : "text"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                    inputType === "username"
                                        ? "e.g. john_doe_123"
                                        : "e.g. john@example.com"
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
