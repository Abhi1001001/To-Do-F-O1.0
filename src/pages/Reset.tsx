import React from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";
import { useSearchParams } from "react-router-dom";

export default function Reset() {
  const { register, handleSubmit } = useForm<{ newPassword: string }>();
  const [search] = useSearchParams();

  const onSubmit = async (data: any) => {
    const token = search.get("token");
    const email = search.get("email");
    if (!token || !email) return alert("Invalid reset link");
    try {
      await client.post("/auth/reset-password", {
        token,
        email,
        newPassword: data.newPassword,
      });
      alert("Password reset successful. Please login.");
    } catch (e: any) {
      alert(e.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-indigo-600 flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Reset password</h2>
          <input
            placeholder="New password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
                        focus:ring-2 focus:ring-indigo-400"
            type="password"
            {...register("newPassword", { required: true })}
          />
          <button
            className="w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition"
            type="submit"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
