import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = ({ tasks, onDateSelect, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            return isSameDay(new Date(task.dueDate), date);
        });
    };

    // Get task count for a specific date
    const getTaskCount = (date) => {
        return getTasksForDate(date).length;
    };

    // Get completed task count for a specific date
    const getCompletedTaskCount = (date) => {
        return getTasksForDate(date).filter(task => task.status === 'completed').length;
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleDateClick = (date) => {
        onDateSelect(date);
    };

    const renderCalendarHeader = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCalendarDays = () => {
        const startDate = monthStart;
        const endDate = monthEnd;
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        // Add padding days at the beginning
        const startPadding = startDate.getDay();
        const paddingDays = [];
        for (let i = 0; i < startPadding; i++) {
            paddingDays.push(null);
        }

        return [...paddingDays, ...days].map((day, index) => {
            if (!day) {
                return <div key={`empty-${index}`} className="h-24 border border-gray-200 bg-gray-50"></div>;
            }

            const tasksForDay = getTasksForDate(day);
            const totalTasks = tasksForDay.length;
            const completedTasks = getCompletedTaskCount(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
                <div
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-100 border-indigo-300' : ''
                        } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                            {format(day, 'd')}
                        </span>
                        {totalTasks > 0 && (
                            <div className="flex flex-col items-end space-y-1">
                                <div className="flex items-center space-x-1">
                                    {completedTasks > 0 && (
                                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                                            {completedTasks}
                                        </span>
                                    )}
                                    {totalTasks > completedTasks && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                            {totalTasks - completedTasks}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {tasksForDay.length > 0 && (
                        <div className="mt-1 space-y-1">
                            {tasksForDay.slice(0, 2).map(task => (
                                <div
                                    key={task.id}
                                    className={`text-xs p-1 rounded truncate ${task.status === 'completed'
                                            ? 'bg-green-100 text-green-800 line-through'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    title={task.title}
                                >
                                    {task.title}
                                </div>
                            ))}
                            {tasksForDay.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                    +{tasksForDay.length - 2} more
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>

                <button
                    onClick={nextMonth}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {renderCalendarHeader()}

            <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span>Pending</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar; 