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
            <div className="grid grid-cols-7 gap-1 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3">
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
                return <div key={`empty-${index}`} className="h-28 border border-gray-200/50 bg-gray-50/30 rounded-xl"></div>;
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
                    className={`h-28 border border-gray-200/50 p-2 cursor-pointer transition-all duration-200 rounded-xl hover:shadow-md ${isSelected ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 shadow-lg' : ''
                        } ${isToday ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300' : 'bg-white/70 backdrop-blur-sm'}`}
                >
                    <div className="flex justify-between items-start h-full">
                        <div className="flex-1">
                            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                {format(day, 'd')}
                            </span>

                            {tasksForDay.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {tasksForDay.slice(0, 2).map(task => (
                                        <div
                                            key={task.id}
                                            className={`text-xs p-1 rounded-lg truncate ${task.status === 'completed'
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white line-through'
                                                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                                }`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                    {tasksForDay.length > 2 && (
                                        <div className="text-xs text-gray-500 text-center bg-gray-100 rounded-lg py-1">
                                            +{tasksForDay.length - 2} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {totalTasks > 0 && (
                            <div className="flex flex-col items-end space-y-1">
                                <div className="flex items-center space-x-1">
                                    {completedTasks > 0 && (
                                        <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
                                            {completedTasks}
                                        </span>
                                    )}
                                    {totalTasks > completedTasks && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium">
                                            {totalTasks - completedTasks}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={prevMonth}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>

                <button
                    onClick={nextMonth}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {renderCalendarHeader()}

            <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    <span className="font-medium">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                    <span className="font-medium">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    <span className="font-medium">Today</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span className="font-medium">Selected</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar; 