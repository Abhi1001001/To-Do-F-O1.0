import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import client from "../api/client";
import { useForm } from "react-hook-form";
import useAuthStore from "../store/auth";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Todos() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [editing, setEditing] = useState<Todo | null>(null);
  const { register, handleSubmit, reset } = useForm<{
    title: string;
    description?: string;
  }>();

  const fetchTodos = async () => {
    const res = await client.get("/todos");
    return res.data as Todo[];
  };

  const { data: todos = [], isLoading } = useQuery("todos", fetchTodos, {
    enabled: !!token,
  });

  const createTodo = useMutation(
    async (payload: { title: string; description?: string }) =>
      client.post("/todos", payload).then((r) => r.data),
    { onSuccess: () => queryClient.invalidateQueries("todos") }
  );

  const updateTodo = useMutation(
    async ({ id, payload }: any) =>
      client.put(`/todos/${id}`, payload).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
        setEditing(null);
        reset();
      },
    }
  );

  const deleteTodo = useMutation(
    async (id: string) => client.delete(`/todos/${id}`).then((r) => r.data),
    { onSuccess: () => queryClient.invalidateQueries("todos") }
  );

  const toggleTodo = useMutation(
    async (id: string) =>
      client.patch(`/todos/${id}/toggle`).then((r) => r.data),
    { onSuccess: () => queryClient.invalidateQueries("todos") }
  );

  const onSubmit = (data: any) => {
    if (editing) {
      updateTodo.mutate({ id: editing._id, payload: data });
    } else {
      createTodo.mutate(data, { onSuccess: () => reset() });
    }
  };

  if (!token)
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-400 to-indigo-600 flex flex-col justify-center items-center p-4 text-3xl font-semibold text-white">
        Please login to view todos
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-400 to-indigo-600 flex flex-col justify-center items-center p-4">
      {/* Header */}
      <h1 className="md:text-3xl text-2xl font-bold text-center text-white -mt-12 mb-6 drop-shadow-sm">
        ✏️ The Minimal To Do List
      </h1>
      <p className="text-center text-white/90 -mt-5 mb-10">
        Click the task to mark it completed. Delete tasks with the trash button.
        Update tasks with the edit button.
      </p>
      <form
        className="md:w-1/2 w-full flex flex-col gap-2 justify-center items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          placeholder="Add your new to do"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
          {...register("title", { required: true })}
        />
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Description"
          {...register("description")}
        />
        <button
          className="bg-green-400 text-white px-4 py-3 rounded-xl flex items-center justify-center text-xl hover:bg-green-500 transition"
          type="submit"
        >
          {editing ? "Update" : "Add"} <AiOutlinePlus />
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              reset();
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="md:w-1/2 w-full py-4">
          {todos.map((t) => (
            <li
              key={t._id}
              className=" flex md:flex-row flex-col justify-between md:items-center items-start bg-gray-50 p-4 rounded-xl gap-2 shadow-sm hover:shadow-md transition"
            >
              <div>
                <strong
                  className={`text-lg ${
                    t.completed ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {t.title}
                </strong>
                <div className="text-sm text-gray-500 mt-1">
                  {t.description}
                </div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                  onClick={() => toggleTodo.mutate(t._id)}
                >
                  {t.completed ? "Undo" : "Complete"}
                </button>{" "}
                <button
                  className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition"
                  onClick={() => {
                    setEditing(t);
                    reset({ title: t.title, description: t.description });
                  }}
                >
                  <FiEdit2 />
                </button>{" "}
                <button
                  className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition"
                  onClick={() => deleteTodo.mutate(t._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
