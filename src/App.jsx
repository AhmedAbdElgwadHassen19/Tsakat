
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import AdminPage from "./Components/Admin";
import Goals from "./Components/Goals"
import AdminGoalsPage from "./Components/AdminGoals";
function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/adminGoalsPage" element={<AdminGoalsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;