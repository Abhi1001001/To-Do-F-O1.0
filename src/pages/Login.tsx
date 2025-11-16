import React from "react";
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

  const onSubmit = async (data: Form) => {
    try {
      const res: AxiosResponse = await client.post("/auth/login", data);
      setAuth(res.data.token, res.data.user);
      nav("/todos");
    } catch (e: any) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-400 to-indigo-600 flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-3xl shadow-2xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">
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

          <button
            className="w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition"
            type="submit"
          >
            Login
          </button>
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
