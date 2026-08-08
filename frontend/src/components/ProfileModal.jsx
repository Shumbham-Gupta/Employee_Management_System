import React, { useState } from "react";
import API from "../utils/api.js";
import { toast } from "react-toastify";
import { User, Lock, X, KeyRound } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/change-password", { currentPassword, newPassword });
      toast.success(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={20} />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
            <p className="text-xs text-gray-500">{user?.email} • <span className="capitalize font-semibold text-indigo-600">{user?.role}</span></p>
          </div>
        </div>

        {/* Change Password Form */}
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <KeyRound size={18} className="text-indigo-600" /> Security & Password
        </h4>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-xl p-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-xl p-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-xl p-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-xl hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md text-sm"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
