import { useState } from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function TaskPopup() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    title: string;
    description?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createTodo = useMutation(
    async (payload: { title: string; description?: string }) => {
      setLoading(true);
      client.post("/todos", payload).then((r) => {
        r.data;
        setLoading(false);
        navigate("/");
      }),
        { onSuccess: () => queryClient.invalidateQueries("todos") };
    }
  );

  const onSubmit = (data: any) => {
    createTodo.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold text-gray-100">Add Task</h3>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="e.g., Finish homepage UI"
          className="w-full rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          {...register("title", { required: true })}
        />
        <textarea
          className="w-full resize-y rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Add more details (optional)"
          {...register("description")}
        />
        <input
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 bg-indigo-600 hover:bg-indigo-500"
          type="submit"
          disabled={loading}
          value={loading ? "Adding..." : "Add Task"}
        />
      </form>
    </>
  );
}
