import { FiPenTool } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAuthStore from "../store/auth";

export default function Navbar() {
  const { token, logout } = useAuthStore();
  return (
    <>
      <nav className="w-full bg-gray-900 shadow-white/20 shadow-md sticky top-0 z-50">
       <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
       {/* left section */}
          <div className="flex items-center gap-3">
            <h1>
              <Link className="cursor-pointer" to="/">
                <FiPenTool className="text-white text-2xl drop-shadow-md" />
              </Link>
            </h1>
            <h1 className="hidden md:block text-white text-xl font-semibold tracking-wide">
              Minimal To-Do
            </h1>
            <h1 className="block md:hidden text-white text-xl font-semibold tracking-wide">
              To-Do
            </h1>
          </div>
          {/* right section */}

          <div className="flex items-center gap-6">
            {token ? (
              <>
                <Link
                  title="List your tasks"
                  className="text-white text-base"
                  to="/todos"
                >
                  Tasks
                </Link>{" "}
                <button
                  className="bg-white text-red-600 px-5 py-2 rounded-full font-medium shadow hover:bg-gray-100 transition"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="bg-white text-blue-600 px-5 py-2 rounded-full font-medium shadow hover:bg-gray-100 transition"
                  to="/login"
                >
                  Login
                </Link>{" "}
                <Link className="text-white" to="/signup">Sign up</Link>
              </>
            )}
          </div>

          </div>
      </nav>
    </>
  );
}
