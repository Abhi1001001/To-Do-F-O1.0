import { useQuery, useMutation, useQueryClient } from "react-query";
import client from "../api/client";
import { set, useForm } from "react-hook-form";
import useAuthStore from "../store/auth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import TaskPopup from "../component/TaskPopup";
import { IoClose } from "react-icons/io5";
import EditTaskPopup from "../component/EditTaskPopup";
import { useNavigate } from "react-router-dom";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Todos() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { reset } = useForm<{
    title: string;
    description?: string;
  }>();
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Todo | null>();
  const Navigate = useNavigate();

  const fetchTodos = async () => {
    const res = await client.get("/todos");
    return res.data as Todo[];
  };

  const { data: todos = [], isLoading } = useQuery("todos", fetchTodos, {
    enabled: !!token,
  });

  const deleteTodo = useMutation(
    async (id: string) => {
      setLoading(true);
      client.delete(`/todos/${id}`).then((r) => {
        r.data;
        setLoading(false);
        Navigate("/");
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );

  const toggleTodo = useMutation(
    async (id: string) =>
    {
      setLoading(true);
      client.patch(`/todos/${id}/toggle`).then((r) => {
        r.data;
        setLoading(false);
        Navigate("/");
      }),
    { onSuccess: () => queryClient.invalidateQueries("todos") }
    }
  );

  if (!token)
    return (
      <div className="w-full bg-linear-to-b from-gray-900 to-neutral-900 flex flex-col justify-center items-center p-4 text-3xl font-semibold text-white">
        Please login to view Tasks
      </div>
    );

  return (
    <div className="w-full p-6 text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="w-1/2 m-auto">
          <h1 className="md:text-3xl text-2xl font-bold text-center text-white drop-shadow-sm">
            The Minimal Task List
          </h1>
          <p className="text-center text-white/90 ">
            Click the task to mark it completed. Delete tasks with the trash
            button. Update tasks with the edit button.
          </p>
        </div>
        <div className="w-1/2 py-2">
          <h1 className="text-3xl font-semibold">Today</h1>
          <span className="text-sm opacity-90 mt-1">
            {new Date().toDateString()}
          </span>
        </div>

        {isLoading || loading ? (
          <div role="status" className="flex justify-center items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {todos.map((t) => (
              <li
                key={t._id}
                className="w-full bg-linear-to-b from-gray-900 to-neutral-900 rounded-xl p-5 shadow-white/20 flex items-start justify-between shadow-md"
              >
                <div>
                  <strong
                    className={`text-lg font-semibold ${
                      t.completed ? "line-through text-gray-400" : "text-white"
                    }`}
                  >
                    {t.title}
                  </strong>
                  <div className="text-sm mt-1">{t.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => toggleTodo.mutate(t._id)}
                  >
                    {t.completed ? "Undo" : "Complete"}
                  </button>{" "}
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg"
                    onClick={() => {
                      setEditing(t);
                      reset({ title: t.title, description: t.description });
                      setOpenEditPopup(true);
                    }}
                  >
                    <FiEdit2 />
                  </button>{" "}
                  <button
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg"
                    onClick={() => deleteTodo.mutate(t._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setOpenAddPopup(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg text-sm"
          >
            Add Task
          </button>
        </div>
        {openAddPopup && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="relative z-10 w-full max-w-xl transform overflow-hidden rounded-2xl bg-linear-to-b from-gray-900 to-neutral-900 p-6 shadow-2xl transition-all duration-200 ease-out">
              <TaskPopup />
              <button
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-neutral-800/40 text-gray-300 transition hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                onClick={() => setOpenAddPopup(false)}
              >
                <IoClose />
              </button>
            </div>
          </div>
        )}
        {openEditPopup && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="relative z-10 w-full max-w-xl transform overflow-hidden rounded-2xl bg-linear-to-b from-gray-900 to-neutral-900 p-6 shadow-2xl transition-all duration-200 ease-out">
              <EditTaskPopup task={editing} />
              <button
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-neutral-800/40 text-gray-300 transition hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                onClick={() => setOpenEditPopup(false)}
              >
                <IoClose />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
