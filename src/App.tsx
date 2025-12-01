import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Navbar from "./component/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-neutral-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/todos" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </div>
  );
}
