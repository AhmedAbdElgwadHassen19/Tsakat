
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import AdminPage from "./Components/Admin";
import Goals from "./Components/Goals"
import AdminGoalsPage from "./Components/AdminGoals";
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/adminGoalsPage" element={<AdminGoalsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;