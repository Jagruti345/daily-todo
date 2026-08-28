"use client";

import { AuthUser } from "@/types/auth";
import { useState } from "react";

interface AuthFormProps {
  onSuccess?: (user: AuthUser) => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (onSuccess && data.user) {
        onSuccess(data.user);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white bg-white/95 p-8 shadow-2xl backdrop-blur-md">
      {/* Brand Logo & Icon Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-200">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mt-3 text-xl font-black text-slate-900">Daily Todo</h1>
        <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Personal Task Rhythm
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
          className={`flex-1 pb-2 text-center text-base font-extrabold transition ${
            isLogin
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setError(null);
          }}
          className={`flex-1 pb-2 text-center text-base font-extrabold transition ${
            !isLogin
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">
          {isLogin ? "Welcome back" : "Get started"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isLogin
            ? "Log in to access and manage your private tasks."
            : "Sign up for free to start organizing your tasks by user ID."}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <input
              type="text"
              required={!isLogin}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Smith"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-slate-950 py-3.5 text-center font-bold text-white shadow-lg shadow-slate-300 transition hover:bg-sky-700 disabled:opacity-50"
        >
          {isLoading
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>
    </div>
  );
}
