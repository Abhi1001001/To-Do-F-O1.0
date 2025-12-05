import { useState } from "react";
import { useForm } from "react-hook-form";
import client from "../api/client";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function EditTaskPopup({ task }: Todo | any) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<{
    title: string;
    description?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateTodo = useMutation(async ({ id, payload }: any) => {
    setLoading(true);
    client.put(`/todos/${id}`, payload).then((r) => {
      setLoading(false);
      r.data;
      navigate("/");
    }),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("todos");
          reset();
        },
      };
  });

  const onSubmit = (data: any) => {
    updateTodo.mutate({ id: task._id, payload: data });
  };
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold text-gray-100">Update Task</h3>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="e.g., Finish homepage UI"
          className="w-full rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          defaultValue={task.title}
          {...register("title", { required: true })}
        />
        <textarea
          className="w-full resize-y rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          defaultValue={task.description}
          placeholder="Add more details (optional)"
          {...register("description")}
        />
        <input
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 bg-indigo-600 hover:bg-indigo-500"
          type="submit"
          disabled={loading}
          value={loading ? "Updating" : "Update"}
        />
      </form>
    </>
  );
}
