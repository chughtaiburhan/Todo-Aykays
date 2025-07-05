import React, { useState } from "react";
import { updateTask, deleteTask } from "../firebase";
import TaskForm from "./TaskForm";

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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
      } else if (diffDays === 0) {
        return "Due today";
      } else if (diffDays === 1) {
        return "Due tomorrow";
      } else if (diffDays <= 7) {
        return `Due in ${diffDays} days`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return "";

    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "border-red-500 bg-red-50"; // Overdue
    if (diffDays <= 1) return "border-orange-500 bg-orange-50"; // Due today/tomorrow
    if (diffDays <= 3) return "border-yellow-500 bg-yellow-50"; // Due soon
    return "border-gray-200 bg-white/70"; // Normal
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-l-4 ${getPriorityColor(task.dueDate)} ${task.status === "completed" ? "opacity-75" : ""} transition-all duration-200 hover:shadow-xl`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-t-2xl text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className={`text-lg font-bold text-gray-900 ${task.status === "completed" ? "line-through" : ""}`}>
                {task.title}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span className="ml-1">{task.status}</span>
              </span>
            </div>

            {task.description && (
              <p className={`text-gray-600 mb-4 ${task.status === "completed" ? "line-through" : ""}`}>
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">{formatDate(task.dueDate)}</span>
              </div>
            )}

            <div className="text-xs text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Created {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleStatusToggle}
              disabled={loading}
              className={`p-2 rounded-xl text-sm font-medium transition-all duration-200 ${task.status === "completed"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
              title={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
            >
              {getStatusIcon(task.status === "completed" ? "pending" : "completed")}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="border-t border-gray-200 p-6">
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
