"use client";

import { AuthUser } from "@/types/auth";
import { CreateTodoInput, Todo } from "@/types/todo";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import TodoForm from "./TodoForm";

const getTodayString = () => new Date().toISOString().slice(0, 10);
const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
const moveDate = (date: string, days: number) => {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch todos when user is authenticated
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const loadTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/todos");
        if (!response.ok) throw new Error("Failed to fetch todos");
        setTodos(await response.json());
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setTodos([]);
      setShowForm(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateTodo = async (data: CreateTodoInput) => {
    if (!user) return;
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create todo");
    const newTodo = await response.json();
    setTodos((current) => [...current, newTodo]);
    setShowForm(false);
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this task?")) return;
    const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    if (!user) return;
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    if (!response.ok) return;
    const updated = await response.json();
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? updated : todo))
    );
  };

  if (isAuthChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef3f7]">
        <div className="text-center font-bold text-slate-500">
          Loading your session...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#eef3f7] px-4 py-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Authentication Required
          </p>
          <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
            Daily Todo
          </h1>
          <p className="mt-2 text-slate-600">
            Please log in or create an account to view and manage your tasks.
          </p>
        </div>
        <AuthForm onSuccess={(authUser) => setUser(authUser)} />
      </main>
    );
  }

  const selectedTodos = todos
    .filter((todo) => todo.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const completedCount = selectedTodos.filter((todo) => todo.completed).length;

  const groupedTodos = selectedTodos.reduce<Record<string, Todo[]>>(
    (groups, todo) => {
      const hour = Number(todo.time.slice(0, 2));
      const period =
        hour < 12
          ? "Morning"
          : hour < 17
          ? "Afternoon"
          : hour < 21
          ? "Evening"
          : "Night";
      (groups[period] ??= []).push(todo);
      return groups;
    },
    {}
  );

  const periods = ["Morning", "Afternoon", "Evening", "Night"];
  const periodStyles: Record<string, string> = {
    Morning: "border-amber-200 bg-amber-50 text-amber-950",
    Afternoon: "border-sky-200 bg-sky-50 text-sky-950",
    Evening: "border-indigo-200 bg-indigo-50 text-indigo-950",
    Night: "border-slate-200 bg-slate-100 text-slate-950",
  };

  return (
    <main className="min-h-screen bg-[#eef3f7] px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Your rhythm, organized
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Daily Todo
            </h1>
            <p className="mt-2 text-slate-500">Plan clearly. Move deliberately.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Logged in as
              </p>
              <p className="text-sm font-extrabold text-slate-900">
                {user.name || user.email}
              </p>
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                + Add task
              </button>
            )}

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Selected day
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {formatDate(selectedDate)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous day"
                  onClick={() => setSelectedDate(moveDate(selectedDate, -1))}
                  className="h-10 w-10 rounded-lg border border-slate-200 text-lg hover:bg-slate-100"
                >
                  ‹
                </button>
                <input
                  aria-label="Choose date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500"
                />
                <button
                  aria-label="Next day"
                  onClick={() => setSelectedDate(moveDate(selectedDate, 1))}
                  className="h-10 w-10 rounded-lg border border-slate-200 text-lg hover:bg-slate-100"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-300 md:min-w-[310px]">
            <div>
              <p className="text-xs text-slate-400">Tasks</p>
              <p className="mt-2 text-3xl font-black">{selectedTodos.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Done</p>
              <p className="mt-2 text-3xl font-black text-emerald-400">
                {completedCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Open</p>
              <p className="mt-2 text-3xl font-black text-amber-300">
                {selectedTodos.length - completedCount}
              </p>
            </div>
          </div>
        </section>

        {showForm && (
          <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">New task</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <TodoForm onSubmit={handleCreateTodo} isLoading={isLoading} />
          </section>
        )}

        {isLoading ? (
          <div className="rounded-2xl bg-white py-16 text-center text-slate-500 shadow-sm">
            Loading your schedule...
          </div>
        ) : selectedTodos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
            <p className="text-4xl text-sky-500">◌</p>
            <p className="mt-3 text-lg font-bold text-slate-800">
              Nothing scheduled for this day
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add a task or choose another date.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {periods
              .filter((period) => groupedTodos[period])
              .map((period) => (
                <section key={period}>
                  <div
                    className={`mb-3 flex items-center justify-between rounded-xl border px-4 py-3 ${periodStyles[period]}`}
                  >
                    <h2 className="font-extrabold">{period}</h2>
                    <span className="text-sm font-semibold">
                      {groupedTodos[period].length}{" "}
                      {groupedTodos[period].length === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {groupedTodos[period].map((todo) => (
                      <article
                        key={todo.id}
                        className={`flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                          todo.completed ? "opacity-60" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() =>
                            handleToggleComplete(todo.id, todo.completed)
                          }
                          className="h-5 w-5 accent-sky-600"
                          aria-label={`Mark ${todo.title} complete`}
                        />
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-bold text-slate-900 ${
                              todo.completed ? "line-through" : ""
                            }`}
                          >
                            {todo.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                              {todo.time}
                            </span>
                            <span
                              className={`rounded-md px-2 py-1 text-white ${
                                todo.priority === "HIGH"
                                  ? "bg-rose-500"
                                  : todo.priority === "MEDIUM"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            >
                              {todo.priority}
                            </span>
                            <span className="rounded-md bg-sky-100 px-2 py-1 text-sky-700">
                              {todo.category}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="rounded-lg px-3 py-2 text-sm font-bold text-rose-500 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
