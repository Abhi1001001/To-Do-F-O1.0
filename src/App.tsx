import { Routes, Route, Link, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import useAuthStore from "./store/auth";
import { FiPenTool } from "react-icons/fi";

export default function App() {
  const { token, logout } = useAuthStore();

  return (
    <div>
      <header className="w-full py-4 px-6 bg-white/20 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1>
              <Link className="cursor-pointer" to="/">
                <FiPenTool className="text-white text-2xl drop-shadow-md" />
              </Link>
            </h1>
            <h1 className="text-xl hidden md:block font-semibold text-white drop-shadow-md">
              Minimal To-Do
            </h1>
            <h1 className="text-xl block md:hidden font-semibold text-white drop-shadow-md">
              To-Do
            </h1>
          </div>

          <div className="space-x-2">
            {token ? (
              <>
                <Link title="List your todos" className="text-white text-xl" to="/todos">Todos</Link>{" "}
                <button
                  className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
                  to="/login"
                >
                  Login
                </Link>{" "}
                <Link to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

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
