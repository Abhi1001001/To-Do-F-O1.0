import React, { useState } from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";
import useAuthStore from "../store/auth";
import { useNavigate, Link } from "react-router-dom";
import { AxiosResponse } from "axios";

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await client.post("/auth/login", data);
      setAuth(res.data.token, res.data.user);
      nav("/todos");
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-[80vh] flex justify-center items-center p-4 text-white">
      <div className="shadow-white/30 shadow-lg w-full max-w-md p-8 rounded-3xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Login to continue to your dashboard
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>
          <div>
            <input
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none
                        focus:ring-2 focus:ring-indigo-400"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <input
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none
                        focus:ring-2 focus:ring-indigo-400"
              type="password"
              {...register("password", { required: true })}
            />
          </div>

          {loading ? (
            <button
              className="flex justify-center items-center w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-neutral-tertiary animate-spin fill-brand me-2"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              className="w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition cursor-pointer"
              type="submit"
            >
              Login
            </button>
          )}
          <div>
            <Link className="float-right" to="/forgot">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
