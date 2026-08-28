"use client";

import { useEffect, useState } from "react";
import { CreateTodoInput, Priority, Todo } from "@/types/todo";
import { priorityOptions, sampleCategories } from "@/lib/data";

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
  category: todo?.category ?? "Study",
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await onSubmit({ ...formData, title: formData.title.trim() });
      if (!initialTodo) setFormData(getInitialFormState());
    } catch (submitError) {
      setError("Failed to save todo");
      console.error(submitError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {sampleCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : initialTodo ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
