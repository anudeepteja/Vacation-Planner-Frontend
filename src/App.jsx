import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import ProposeTrip from "./pages/ProposeTrip"; // ✅ import your new page
import Profile from "./pages/profile";
import GroupPage from "./pages/groupPage";
import TripDetails from "./pages/TripDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ New Route for proposing a trip */}
        <Route path="/propose-trip" element={<ProposeTrip />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/trip/:proposalId" element={<TripDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

