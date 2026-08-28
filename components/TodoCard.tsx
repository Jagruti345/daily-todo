"use client";

/**
 * TodoCard Component
 * 
 * Displays a single todo item with:
 * - Title, description, and time
 * - Category and priority badges
 * - Status indicator (completed/pending)
 * - Action buttons (edit, complete, delete)
 * 
 * This is a client component so it can handle user interactions like
 * clicking buttons and toggling completion status.
 * 
 * @component
 * @example
 * <TodoCard
 *   todo={todo}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggleComplete={handleToggleComplete}
 * />
 */

import { Todo } from "@/types/todo";
import React, { useState } from "react";

interface TodoCardProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onDelete?: (todoId: string) => void;
  onToggleComplete?: (todoId: string, completed: boolean) => void;
}

/**
 * Priority badge styling
 * Different colors for different priority levels
 */
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

/**
 * Category badge color - using different Tailwind colors
 */
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Study: "bg-blue-100 text-blue-800",
    Coding: "bg-purple-100 text-purple-800",
    Health: "bg-green-100 text-green-800",
    College: "bg-indigo-100 text-indigo-800",
    Personal: "bg-pink-100 text-pink-800",
    Work: "bg-orange-100 text-orange-800",
    Exercise: "bg-red-100 text-red-800",
    Reading: "bg-cyan-100 text-cyan-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`
        rounded-lg border-2 p-4 transition-all duration-200
        ${
          todo.completed
            ? "border-gray-300 bg-gray-50 opacity-75"
            : "border-blue-200 bg-white hover:shadow-lg hover:border-blue-400"
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Title and Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          {/* Completion Checkbox */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) =>
              onToggleComplete?.(todo.id, e.target.checked)
            }
            className="mt-1 h-5 w-5 cursor-pointer rounded border-2 border-gray-300"
            aria-label="Toggle completion status"
          />

          {/* Title */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                todo.completed
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {todo.title}
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <span
          className={`
            inline-block rounded-full border px-3 py-1 text-xs font-semibold
            ${getPriorityColor(todo.priority)}
          `}
        >
          {todo.priority}
        </span>
      </div>

      {/* Scheduled time */}
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="font-semibold">⏰</span>
          <span>{todo.time}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="font-semibold">📅</span>
          <span>{todo.date}</span>
        </div>
      </div>

      {/* Category */}
      <div className="mt-3 flex flex-wrap gap-2">
        {/* Category Badge */}
        <span
          className={`
            inline-block rounded-full px-3 py-1 text-xs font-medium
            ${getCategoryColor(todo.category)}
          `}
        >
          📁 {todo.category}
        </span>

      </div>

      {/* Action Buttons - Show on hover or mobile */}
      {(isHovered || true) && (
        <div className="mt-4 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(todo)}
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              aria-label="Edit todo"
            >
              ✏️ Edit
            </button>
          )}
          {onToggleComplete && !todo.completed && (
            <button
              onClick={() => onToggleComplete(todo.id, true)}
              className="rounded-md bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
              aria-label="Mark as complete"
            >
              ✅ Complete
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              aria-label="Delete todo"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
