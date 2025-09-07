import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // logged-in user
  const [groups, setGroups] = useState([]);    // user groups
  const [proposals, setProposals] = useState([]); // trip proposals
  const [loading, setLoading] = useState(false);

  // Call this after login
  const FetchUserDetailsByUsername = async (username) => {
    //setUser(username);

    try {
      setLoading(true);
      // Fetch groups
      const userRes = await axios.get(`http://localhost:8080/users/username/${username}`);
      setUser(userRes.data);
      
      console.log("userRes.data : " , userRes.data);
      const userId = userRes.data.userId;
      
      // Get all user-group relations
      const UserGroupRes = await axios.get(
        `http://localhost:8080/api/user-groups/user/${userId}`
      );

      // Extract all groupIds from response
      const groupIds = UserGroupRes.data.map((ug) => ug.group.groupId);
      console.log("Group IDs:", groupIds);

      // Now fetch all groups in parallel using Promise.all
      const groupPromises = groupIds.map((id) =>
        axios.get(`http://localhost:8080/api/groups/${id}`)
      );
      const groupResponses = await Promise.all(groupPromises);

      // Extract data from each response
      const groupsData = groupResponses.map((res) => res.data);
      console.log("Groups data:", groupsData);

      setGroups(groupsData);
      // Fetch proposals
      const proposalsRes = await axios.get(`http://localhost:8080/trip-proposals/user/${userId}`);
      console.log("PROPOSALS : " , proposalsRes);
      console.log("PROPOSALS DATA : " , proposalsRes.data);
      setProposals(proposalsRes.data);
    } catch (err) {
      console.error("Error fetching user-related data:", err);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setGroups([]);
    setProposals([]);
    //localStorage.removeItem("token"); // if you’re storing token
  };

  return (
    <UserContext.Provider
      value={{ user, groups, proposals, FetchUserDetailsByUsername, logoutUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook for easy access
export const useUser = () => useContext(UserContext);
