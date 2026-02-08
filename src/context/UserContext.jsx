import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance"; // Axios instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Set initial loading to true

  // Fetch user + groups + proposals by username
  const FetchUserDetailsByUsername = async (username) => {
    try {
      setLoading(true);

      // 1. User info
      const userRes = await api.get(`/users/username/${username}`);
      const fullUser = userRes.data;
      //console.log("fullUser", fullUser);
      setUser(fullUser);

      const userId = fullUser.userId;

      // 2. User groups
      const userGroupsRes = await api.get(`/api/user-groups/user/${userId}`);
      //console.log("userGroupsRes", userGroupsRes);
      const groupIds = userGroupsRes.data.map((ug) => ug.group.groupId);

      // Fetch all groups in parallel
      const groupsData = await Promise.all(
        groupIds.map((id) => api.get(`/api/groups/${id}`).then((r) => r.data))
      );
      //console.log("groupsData", groupsData);
      setGroups(groupsData);

      // 3. User proposals
      const proposalsRes = await api.get(`/trip-proposals/user/${userId}`);
      //console.log("proposalsRes", proposalsRes);
      setProposals(proposalsRes.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setUser(null); // ✅ reset user on failure
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: On app start, check localStorage and fetch user
  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");

    if (username && token) {
      // If a user is logged in and token exists, fetch their details
      FetchUserDetailsByUsername(username);
    } else {
      setLoading(false); // No logged in user, stop loading
    }
  }, []);

  const logoutUser = () => {
    setUser(null);
    setGroups([]);
    setProposals([]);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username"); // ✅ also remove username
  };

  return (
    <UserContext.Provider
      value={{ user, groups, proposals, FetchUserDetailsByUsername, logoutUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => useContext(UserContext);
