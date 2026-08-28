"use client";

import { AuthUser } from "@/types/auth";
import { CreateTodoInput, Todo } from "@/types/todo";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import TodoForm from "./TodoForm";

const getTodayString = () => new Date().toISOString().slice(0, 10);
const formatDate = (dateStr: string) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const moveDate = (dateStr: string, days: number) => {
  const next = new Date(`${dateStr}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      setShowModal(false);
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
    setShowModal(false);
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
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
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-sm font-bold tracking-wider text-slate-400">
            Loading session...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <AuthForm onSuccess={(authUser) => setUser(authUser)} />
      </main>
    );
  }

  // Filter tasks by selected date, search query, and category
  const dayTodos = todos.filter((todo) => todo.date === selectedDate);
  
  const categoriesList = [
    "All",
    ...Array.from(new Set(todos.map((t) => t.category))),
  ];

  const filteredTodos = dayTodos
    .filter((todo) => {
      const matchesCategory =
        selectedCategory === "All" || todo.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = dayTodos.filter((todo) => todo.completed).length;
  const totalCount = dayTodos.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const groupedTodos = filteredTodos.reduce<Record<string, Todo[]>>(
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
  const periodStyles: Record<string, { bg: string; border: string; text: string }> = {
    Morning: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    Afternoon: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
    Evening: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
    Night: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400" },
  };

  const userInitial = (user.name || user.email)[0].toUpperCase();

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Top Navbar */}
        <header className="glass-dark flex flex-col justify-between gap-4 rounded-3xl p-5 shadow-2xl md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 font-black text-white shadow-lg shadow-sky-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Daily Todo</h1>
              <p className="text-xs font-semibold text-slate-400">Personal Schedule & Rhythm</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks or categories..."
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 font-extrabold text-white text-xs">
                {userInitial}
              </div>
              <span className="hidden text-xs font-bold text-slate-200 sm:inline max-w-[140px] truncate">
                {user.name || user.email}
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 hover:-translate-y-0.5"
            >
              + New Task
            </button>

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Date Controls & Daily Progress Banner */}
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          {/* Date Selector Card */}
          <div className="glass-dark flex flex-col justify-between gap-4 rounded-3xl p-6 shadow-xl sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Scheduled Day</span>
                {selectedDate === getTodayString() && (
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-black text-sky-300">
                    TODAY
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-2xl font-black text-white">{formatDate(selectedDate)}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(moveDate(selectedDate, -1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Previous day"
              >
                ‹
              </button>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-sky-500"
              />

              <button
                onClick={() => setSelectedDate(moveDate(selectedDate, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Next day"
              >
                ›
              </button>

              {selectedDate !== getTodayString() && (
                <button
                  onClick={() => setSelectedDate(getTodayString())}
                  className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-extrabold text-sky-400 transition hover:bg-sky-500/20"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="glass-dark flex flex-col justify-between rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Daily Completion</span>
              <span className="text-sm font-black text-sky-400">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="my-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Total: <strong className="text-white">{totalCount}</strong></span>
              <span>Completed: <strong className="text-emerald-400">{completedCount}</strong></span>
              <span>Pending: <strong className="text-amber-300">{totalCount - completedCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => {
            const count =
              cat === "All"
                ? dayTodos.length
                : dayTodos.filter((t) => t.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-extrabold transition ${
                  isSelected
                    ? "bg-white text-slate-950 shadow-lg"
                    : "glass-dark text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {cat}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task Section */}
        {isLoading ? (
          <div className="glass-dark rounded-3xl py-16 text-center text-sm font-bold text-slate-400">
            Loading tasks...
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="glass-dark flex flex-col items-center justify-center rounded-3xl py-16 text-center border border-dashed border-slate-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-3xl text-sky-400">
              ✓
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-white">
              {searchQuery || selectedCategory !== "All"
                ? "No matching tasks found"
                : "No tasks for this day"}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters or search keywords."
                : "Click '+ New Task' above to start scheduling your rhythm."}
            </p>
            {!searchQuery && selectedCategory === "All" && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg transition hover:bg-sky-600"
              >
                + Add your first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {periods
              .filter((period) => groupedTodos[period])
              .map((period) => (
                <section key={period} className="space-y-3">
                  {/* Period Header */}
                  <div className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 ${periodStyles[period].bg} ${periodStyles[period].border}`}>
                    <h3 className={`text-sm font-black ${periodStyles[period].text}`}>
                      {period}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {groupedTodos[period].length} {groupedTodos[period].length === 1 ? "task" : "tasks"}
                    </span>
                  </div>

                  {/* Tasks Grid */}
                  <div className="grid gap-3 sm:grid-cols-1">
                    {groupedTodos[period].map((todo) => (
                      <article
                        key={todo.id}
                        className={`glass-dark flex items-center justify-between gap-4 rounded-2xl p-4 transition-all hover:border-slate-700 ${
                          todo.completed ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo.id, todo.completed)}
                            className="h-5 w-5 rounded-lg accent-sky-500 cursor-pointer"
                            aria-label={`Mark ${todo.title} complete`}
                          />
                          
                          <div className="min-w-0 flex-1">
                            <h4
                              className={`text-sm font-bold text-white transition ${
                                todo.completed ? "line-through text-slate-400" : ""
                              }`}
                            >
                              {todo.title}
                            </h4>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                              {/* Time Chip */}
                              <span className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-0.5 text-slate-300">
                                🕒 {todo.time}
                              </span>

                              {/* Priority Chip */}
                              <span
                                className={`rounded-lg px-2 py-0.5 text-white ${
                                  todo.priority === "HIGH"
                                    ? "bg-rose-500/80"
                                    : todo.priority === "MEDIUM"
                                    ? "bg-amber-500/80"
                                    : "bg-emerald-500/80"
                                }`}
                              >
                                {todo.priority}
                              </span>

                              {/* Category Chip */}
                              <span className="rounded-lg bg-sky-500/10 px-2 py-0.5 text-sky-400">
                                {todo.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="rounded-xl p-2 text-xs font-bold text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
                          title="Delete Task"
                        >
                          ✕
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">Create New Task</h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>
            <TodoForm onSubmit={handleCreateTodo} onCancel={() => setShowModal(false)} isLoading={isLoading} />
          </div>
        </div>
      )}
    </main>
  );
}
