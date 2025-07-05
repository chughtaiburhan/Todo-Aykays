import React, { useState } from "react";
import { updateTask, deleteTask } from "../firebase";
import TaskForm from "./TaskForm";
import { format } from "date-fns";
const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await updateTask(task.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      setError("Failed to update task status");
      console.error("Update status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteTask(task.id);
      onDelete();
    } catch (error) {
      setError("Failed to delete task");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateObj) => {
    try {
      let date;

      // If it's a Firestore timestamp
      if (dateObj && typeof dateObj === "object" && "seconds" in dateObj) {
        date = new Date(dateObj.seconds * 1000);
      } else {
        // Fallback: assume it's a string or Date
        date = new Date(dateObj);
      }

      if (isNaN(date)) {
        throw new Error("Invalid date");
      }

      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return "";

    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "border-red-500"; // Overdue
    if (diffDays <= 1) return "border-orange-500"; // Due today/tomorrow
    if (diffDays <= 3) return "border-yellow-500"; // Due soon
    return "border-gray-300"; // Normal
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getPriorityColor(
        task.dueDate
      )} ${task.status === "completed" ? "opacity-75" : ""}`}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3
              className={`text-lg font-medium text-gray-900 ${
                task.status === "completed" ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>

          {task.description && (
            <p
              className={`text-gray-600 mb-2 ${
                task.status === "completed" ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Due: {formatDate(task.dueDate)}
            </div>
          )}

          <div className="text-xs text-gray-400">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleStatusToggle}
            disabled={loading}
            className={`p-2 rounded-md text-sm font-medium ${
              task.status === "completed"
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              task.status === "completed"
                ? "Mark as pending"
                : "Mark as completed"
            }
          >
            {task.status === "completed" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <TaskForm
            task={task}
            onSave={() => {
              setIsEditing(false);
              onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
            isEditing={true}
          />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
