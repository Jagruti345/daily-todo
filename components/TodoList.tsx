"use client";

/**
 * TodoList Component
 * 
 * Displays a list of todos organized by time period:
 * - Morning (Before 12 PM)
 * - Afternoon (12 PM - 5 PM)
 * - Evening (5 PM - 9 PM)
 * - Night (After 9 PM)
 * 
 * Features:
 * - Grouped by time period for better organization
 * - Sorted chronologically within each period
 * - Shows completion status visually
 * - Stats about total, completed, and pending tasks
 * 
 * @component
 * @example
 * <TodoList
 *   todos={todos}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggleComplete={handleToggleComplete}
 * />
 */

import React from "react";
import { Todo } from "@/types/todo";
import { TodoCard } from "./TodoCard";
import { sortTodosByTime, getTimePeriodFromString } from "@/lib/utils";

interface TodoListProps {
  todos: Todo[];
  onEdit?: (todo: Todo) => void;
  onDelete?: (todoId: string) => void;
  onToggleComplete?: (todoId: string, completed: boolean) => void;
  showStats?: boolean;
  groupByTimePeriod?: boolean;
}

/**
 * Get emoji for time period
 */
const getTimePeriodEmoji = (period: string): string => {
  switch (period) {
    case "Morning":
      return "🌅";
    case "Afternoon":
      return "☀️";
    case "Evening":
      return "🌆";
    case "Night":
      return "🌙";
    default:
      return "⏰";
  }
};

/**
 * Get color for time period header
 */
const getTimePeriodColor = (period: string): string => {
  switch (period) {
    case "Morning":
      return "bg-yellow-50 border-yellow-200";
    case "Afternoon":
      return "bg-orange-50 border-orange-200";
    case "Evening":
      return "bg-purple-50 border-purple-200";
    case "Night":
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
  showStats = true,
  groupByTimePeriod = true,
}) => {
  // Sort todos by scheduled time
  const sortedTodos = sortTodosByTime(todos);

  // Calculate stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by time period if enabled
  const groupedTodos = groupByTimePeriod
    ? sortedTodos.reduce(
        (acc, todo) => {
          const period = getTimePeriodFromString(todo.time);
          if (!acc[period]) {
            acc[period] = [];
          }
          acc[period].push(todo);
          return acc;
        },
        {} as Record<string, Todo[]>
      )
    : { All: sortedTodos };

  // Order time periods
  const periodOrder = ["Morning", "Afternoon", "Evening", "Night", "All"];
  const orderedPeriods = Object.keys(groupedTodos).sort(
    (a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b)
  );

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && (
        <div className="grid grid-cols-2 gap-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {completionPercentage}%
            </p>
            <p className="text-sm text-gray-600">Productivity</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-xl text-gray-500">
            📭 No todos for today yet
          </p>
          <p className="mt-2 text-gray-500">
            Create one to get started!
          </p>
        </div>
      )}

      {/* Todos Grouped by Time Period */}
      <div className="space-y-6">
        {orderedPeriods.map((period) => (
          <div key={period} className="space-y-3">
            {/* Time Period Header */}
            <div
              className={`
                rounded-lg border-2 px-4 py-3 font-semibold text-gray-900
                ${getTimePeriodColor(period)}
              `}
            >
              <span className="mr-2 text-lg">
                {getTimePeriodEmoji(period)}
              </span>
              {period === "All" ? "All Tasks" : `${period}`}
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({groupedTodos[period].length} tasks)
              </span>
            </div>

            {/* Todos for this period */}
            <div className="space-y-3">
              {groupedTodos[period].map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
