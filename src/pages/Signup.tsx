import React from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

type Form = { name: string; email: string; password: string };

export default function Signup() {
  const { register, handleSubmit } = useForm<Form>();
  const nav = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      await client.post("/auth/signup", data);
      alert("Signup success. Please login.");
      nav("/login");
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-indigo-600 flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl shadow-2xl">
      {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign up to start your journey
        </p>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign up</h2>
          <div>
            <input
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
                        focus:ring-2 focus:ring-indigo-400"
              {...register("name", { required: true })}
            />
          </div>
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
          <button className="w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition" type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}
