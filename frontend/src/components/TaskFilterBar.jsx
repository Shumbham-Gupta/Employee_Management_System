import React from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";

export default function TaskFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  role = "admin",
}) {
  const statusOptions =
    role === "admin"
      ? ["All", "New", "Active", "Completed", "Failed"]
      : ["All", "Not Started", "In Progress", "Completed"];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3.5 top-3 text-gray-400 dark:text-slate-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search task or employee..."
          className="w-full pl-10 pr-4 py-2 border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-sm text-gray-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-1.5">
          <Filter size={16} className="text-gray-400 dark:text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-700 dark:text-slate-200 outline-none cursor-pointer dark:bg-slate-800"
          >
            <option value="All">All Statuses</option>
            {statusOptions.filter((s) => s !== "All").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-1.5">
          <span className="text-xs">🏷️</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-700 dark:text-slate-200 outline-none cursor-pointer dark:bg-slate-800"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-1.5">
          <ArrowUpDown size={16} className="text-gray-400 dark:text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-700 dark:text-slate-200 outline-none cursor-pointer dark:bg-slate-800"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="deadline">Deadline Soonest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
