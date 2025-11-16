import React from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";

export default function Forgot() {
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      await client.post("/auth/forgot-password", data);
      alert(
        "If the email exists, a reset link was sent."
      );
    } catch (e: any) {
      alert("Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-indigo-600 flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl shadow-2xl">
      {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email to receive a reset link
        </p>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <h2>Forgot password</h2>
          <input
            placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
                        focus:ring-2 focus:ring-indigo-400"
            {...register("email", { required: true })}
          />
          <button className="w-full py-3 bg-indigo-500 text-white rounded-xl text-lg font-semibold
                       hover:bg-indigo-600 shadow-md transition" type="submit">Send reset link</button>
        </form>
      </div>
    </div>
  );
}
