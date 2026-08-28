/**
 * Utility Functions
 * 
 * Helper functions for:
 * - Time formatting and parsing
 * - Date manipulation
 * - Time comparisons
 * - Todo sorting
 */

/**
 * Convert time string (HH:mm) to minutes since midnight
 * Useful for sorting todos by time
 * 
 * @param timeString - Time in HH:mm format
 * @returns Number of minutes since midnight
 * 
 * @example
 * timeToMinutes("14:30") // Returns 870
 */
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight back to HH:mm format
 * 
 * @param minutes - Number of minutes since midnight
 * @returns Time string in HH:mm format
 * 
 * @example
 * minutesToTime(870) // Returns "14:30"
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Format date to display format (e.g., "27 Aug 2026")
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date string
 * 
 * @example
 * formatDate("2026-08-27") // Returns "27 Aug 2026"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

/**
 * Get the day name from a date string
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Day name (e.g., "Monday")
 * 
 * @example
 * getDayName("2026-08-27") // Returns "Thursday"
 */
export const getDayName = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

/**
 * Check if a date is today
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @returns true if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  return dateString === todayString;
};

/**
 * Get today's date in YYYY-MM-DD format
 * 
 * @returns Today's date string
 */
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Calculate duration between two times in minutes
 * 
 * @param startTime - Start time in HH:mm format
 * @param endTime - End time in HH:mm format
 * @returns Duration in minutes
 * 
 * @example
 * calculateDuration("09:00", "10:30") // Returns 90
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return endMinutes - startMinutes;
};

/**
 * Format duration in minutes to readable format
 * 
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "1h 30m")
 * 
 * @example
 * formatDuration(90) // Returns "1h 30m"
 * formatDuration(45) // Returns "45m"
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

/**
 * Sort todos by scheduled time
 * 
 * @param todos - Array of todos
 * @returns Sorted todos (earliest time first)
 */
export const sortTodosByTime = <T extends { time: string }>(todos: T[]): T[] => {
  return [...todos].sort((a, b) => {
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
};

/**
 * Group todos by category
 * 
 * @param todos - Array of todos
 * @returns Object with categories as keys and array of todos as values
 */
export const groupTodosByCategory = (
  todos: any[]
): Record<string, any[]> => {
  return todos.reduce(
    (acc, todo) => {
      if (!acc[todo.category]) {
        acc[todo.category] = [];
      }
      acc[todo.category].push(todo);
      return acc;
    },
    {} as Record<string, any[]>
  );
};

/**
 * Get time period of day based on hour
 * 
 * @param hour - Hour (0-23)
 * @returns Period name (e.g., "Morning", "Afternoon")
 */
export const getTimePeriod = (hour: number): string => {
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
};

/**
 * Get time period from time string
 * 
 * @param timeString - Time in HH:mm format
 * @returns Period name
 * 
 * @example
 * getTimePeriodFromString("09:30") // Returns "Morning"
 */
export const getTimePeriodFromString = (timeString: string): string => {
  const hour = parseInt(timeString.split(":")[0], 10);
  return getTimePeriod(hour);
};
