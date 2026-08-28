"use client";

import { priorityOptions, sampleCategories } from "@/lib/data";
import { CreateTodoInput, Priority, Todo } from "@/types/todo";
import { useEffect, useState } from "react";

const getTodayString = () => new Date().toISOString().slice(0, 10);

interface TodoFormProps {
  initialTodo?: Todo;
  onSubmit: (data: CreateTodoInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const getInitialFormState = (todo?: Todo): CreateTodoInput => ({
  title: todo?.title ?? "",
  date: todo?.date ?? getTodayString(),
  time: todo?.time ?? "09:00",
  priority: todo?.priority ?? "MEDIUM",
  category: todo?.category ?? "Work",
});

export default function TodoForm({
  initialTodo,
  onSubmit,
  onCancel,
  isLoading = false,
}: TodoFormProps) {
  const [formData, setFormData] = useState<CreateTodoInput>(
    getInitialFormState(initialTodo)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(getInitialFormState(initialTodo));
    setError("");
  }, [initialTodo]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "priority" ? (value as Priority) : value,
    }));
    setError("");
  };

  const handlePrioritySelect = (priority: Priority) => {
    setFormData((current) => ({ ...current, priority }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a task title");
      return;
    }

    try {
      await onSubmit({ ...formData, title: formData.title.trim() });
      if (!initialTodo) setFormData(getInitialFormState());
    } catch (submitError) {
      setError("Failed to save task");
      console.error(submitError);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {/* Title input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Task Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          disabled={isLoading}
          autoFocus
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Scheduled Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
          {sampleCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Pills */}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Priority Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {priorityOptions.map((priority) => {
            const isSelected = formData.priority === priority;
            const priorityColors = {
              LOW: isSelected
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100"
                : "border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300",
              MEDIUM: isSelected
                ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100"
                : "border-slate-200 text-slate-600 hover:bg-amber-50 hover:border-amber-300",
              HIGH: isSelected
                ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-100"
                : "border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-300",
            };

            return (
              <button
                key={priority}
                type="button"
                onClick={() => handlePrioritySelect(priority)}
                disabled={isLoading}
                className={`rounded-xl border py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${priorityColors[priority]}`}
              >
                {priority}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit / Cancel Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-xl bg-slate-950 py-3.5 font-extrabold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-600 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialTodo
            ? "Update Task"
            : "+ Save Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 px-5 py-3.5 font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
