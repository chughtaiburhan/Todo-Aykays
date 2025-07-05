import React, { useState, useEffect } from 'react';
import { getUserTasks } from '../firebase';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import Calendar from './Calendar';
import { format, isSameDay } from 'date-fns';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState('list'); // list, calendar

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const userTasks = await getUserTasks();
            setTasks(userTasks);
        } catch (error) {
            setError('Failed to load tasks');
            console.error('Load tasks error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = () => {
        loadTasks();
    };

    const handleTaskDelete = () => {
        loadTasks();
    };

    const handleAddTask = () => {
        setShowForm(true);
    };

    const handleFormSave = () => {
        setShowForm(false);
        loadTasks();
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setView('list');
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
    };

    const filteredTasks = tasks.filter(task => {
        // First apply status filter
        let statusMatch = true;
        if (filter !== 'all') {
            statusMatch = task.status === filter;
        }

        // Then apply date filter if a date is selected
        let dateMatch = true;
        if (selectedDate) {
            dateMatch = task.dueDate && isSameDay(new Date(task.dueDate), selectedDate);
        }

        return statusMatch && dateMatch;
    });

    const getStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const pending = total - completed;
        return { total, completed, pending };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Tasks
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {stats.total} total tasks • {stats.completed} completed
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-white/20">
                                <button
                                    onClick={() => setView('list')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${view === 'list'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        <span className="hidden sm:inline">List</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setView('calendar')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${view === 'calendar'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden sm:inline">Calendar</span>
                                    </div>
                                </button>
                            </div>
                            <button
                                onClick={handleAddTask}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="hidden sm:inline">Add Task</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date Filter */}
                    {selectedDate && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            Showing tasks for {format(selectedDate, 'MMMM dd, yyyy')}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearDateFilter}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    Clear filter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${filter === 'all'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/20'
                                }`}
                        >
                            All ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${filter === 'pending'
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/20'
                                }`}
                        >
                            Pending ({stats.pending})
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${filter === 'completed'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/20'
                                }`}
                        >
                            Completed ({stats.completed})
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {/* Add Task Form */}
                {showForm && (
                    <div className="mb-6">
                        <TaskForm
                            onSave={handleFormSave}
                            onCancel={handleFormCancel}
                        />
                    </div>
                )}

                {/* Calendar View */}
                {view === 'calendar' && (
                    <div className="mb-6">
                        <Calendar
                            tasks={tasks}
                            onDateSelect={handleDateSelect}
                            selectedDate={selectedDate}
                        />
                    </div>
                )}

                {/* Tasks List */}
                {view === 'list' && (
                    <div className="space-y-4">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                                <p className="text-gray-600 mb-6">
                                    {filter === 'all'
                                        ? "Get started by creating your first task."
                                        : `No ${filter} tasks found.`
                                    }
                                </p>
                                {filter === 'all' && (
                                    <button
                                        onClick={handleAddTask}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Create Your First Task</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onUpdate={handleTaskUpdate}
                                    onDelete={handleTaskDelete}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList; 