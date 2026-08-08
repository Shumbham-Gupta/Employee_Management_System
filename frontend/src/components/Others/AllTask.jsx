

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";

const AllTask = () => {
  const authContext = useContext(AuthContext);
  const userData = authContext?.user ? [authContext.user] : [];
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const closePopup = () => setSelectedEmployee(null);

  const calculateDeadline = (assignedDate) => {
    if (!assignedDate) return "N/A";
    const date = new Date(assignedDate);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  const getTaskStatus = (task) => {
    if (task.newTask) return "New";
    if (task.active) return "Active";
    if (task.completed) return "Completed";
    if (task.failed) return "Failed";
    return "Unknown";
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg py-3 px-4 mb-3">
        <h2>Employee Name</h2>
        <h3>New Task</h3>
        <h3>Active Task</h3>
        <h3>Completed</h3>
        <h3>Failed</h3>
      </div>

      {/* Employee List */}
      <div className="divide-y divide-gray-200">
        {userData?.map((elem, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEmployee(elem)}
            className="grid grid-cols-5 items-center py-3 px-4 hover:bg-indigo-100 cursor-pointer transition-colors duration-150"
          >
            <h2 className="font-medium text-gray-800">
              {elem.firstName || "N/A"}
            </h2>
            <h3 className="text-gray-600">{elem.taskCount?.newTask || 0}</h3>
            <h3 className="text-gray-600">{elem.taskCount?.active || 0}</h3>
            <h3 className="text-green-600 font-semibold">
              {elem.taskCount?.completed || 0}
            </h3>
            <h3 className="text-red-500 font-semibold">
              {elem.taskCount?.failed || 0}
            </h3>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] rounded-xl shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            {/* Employee Details */}
            <h2 className="text-2xl font-bold text-indigo-600 mb-1">
              {selectedEmployee.firstName || "N/A"}'s Profile
            </h2>
            <p className="text-gray-600 mb-4">
              Email: {selectedEmployee.email || "N/A"}
            </p>

            {/* Task Table */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Task List
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm text-left">
                <thead className="bg-indigo-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3 border-b">Title</th>
                    <th className="py-2 px-3 border-b">Status</th>
                    <th className="py-2 px-3 border-b">Assigned Date</th>
                    <th className="py-2 px-3 border-b">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.tasks && selectedEmployee.tasks.length > 0 ? (
                    selectedEmployee.tasks
                      .filter((task) => task.newTask || task.active)
                      .map((task, idx) => {
                        const status = getTaskStatus(task);
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 transition duration-150"
                          >
                            <td className="py-2 px-3 border-b">
                              {task.title || "N/A"}
                            </td>
                            <td className="py-2 px-3 border-b">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  status === "Active"
                                    ? "bg-blue-100 text-blue-700"
                                    : status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "Failed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="py-2 px-3 border-b">
                              {task.date || "N/A"}
                            </td>
                            <td className="py-2 px-3 border-b">
                              {task.date
                                ? calculateDeadline(task.date)
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-3 text-gray-500"
                      >
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTask;

