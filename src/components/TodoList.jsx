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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <div className="flex items-center space-x-3">
                        <div className="flex bg-gray-100 rounded-md p-1">
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-1 text-sm font-medium rounded ${view === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-3 py-1 text-sm font-medium rounded ${view === 'calendar'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Calendar
                            </button>
                        </div>
                        <button
                            onClick={handleAddTask}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-md">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-md">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Filter */}
                {selectedDate && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-blue-900">
                                    Showing tasks for {format(selectedDate, 'MMMM dd, yyyy')}
                                </span>
                            </div>
                            <button
                                onClick={clearDateFilter}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Clear filter
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Completed ({stats.completed})
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    {error}
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
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? "Get started by creating a new task."
                                    : `No ${filter} tasks found.`
                                }
                            </p>
                            {filter === 'all' && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleAddTask}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Task
                                    </button>
                                </div>
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
    );
};

export default TodoList; 