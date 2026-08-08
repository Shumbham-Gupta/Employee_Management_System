import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Zap, UserCheck, Briefcase, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";


export default function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem("remembered_email") || "");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem("remembered_email")));
  const [portalMode, setPortalMode] = useState("admin"); // 'admin' | 'employee'

  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();


  const submit = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
    } else {
      localStorage.removeItem("remembered_email");
    }

    try {
      const data = await login(email, password);
      if (data.user.role === "admin") navigate("/admin");
      else navigate("/employee");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* LEFT SIDE: Brand Showcase & Features */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            <Zap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              TaskInfus EMS
            </h1>
            <p className="text-xs text-indigo-300 font-medium">Enterprise Management Platform</p>
          </div>
        </div>

        {/* Hero Copy & Live Feature Badges */}
        <div className="relative z-10 my-10 md:my-0 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-4">
              <Sparkles size={14} /> Multi-Tenant Role-Based Access
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Streamline Operations, Empower Teams & Track Performance
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
              Complete MERN stack workspace featuring real-time task allocation, interactive attendance tracking, leave workflows, and executive analytics.
            </p>
          </motion.div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="text-indigo-400 mb-2" size={24} />
              <h3 className="font-bold text-sm text-white">JWT Security</h3>
              <p className="text-xs text-slate-400 mt-1">Role authorization & token headers</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Briefcase className="text-amber-400 mb-2" size={24} />
              <h3 className="font-bold text-sm text-white">Task Workflow</h3>
              <p className="text-xs text-slate-400 mt-1">Priority badges & live status</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Clock className="text-emerald-400 mb-2" size={24} />
              <h3 className="font-bold text-sm text-white">Clock In / Out</h3>
              <p className="text-xs text-slate-400 mt-1">Daily hours & attendance log</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <UserCheck className="text-purple-400 mb-2" size={24} />
              <h3 className="font-bold text-sm text-white">Leave Approvals</h3>
              <p className="text-xs text-slate-400 mt-1">Employee requests & admin actions</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 pt-6 border-t border-white/10">
          © {new Date().getFullYear()} TaskInfus EMS • Built with React 19, Express & MongoDB
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login Card */}
      <div className="md:w-1/2 bg-slate-950 p-8 lg:p-14 flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-950/40"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400 mt-1">Select portal mode or enter account credentials</p>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700/50">
            <button
              type="button"
              onClick={() => setPortalMode("admin")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 ${
                portalMode === "admin"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🧑‍💼 Admin Portal
            </button>
            <button
              type="button"
              onClick={() => setPortalMode("employee")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 ${
                portalMode === "employee"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👷 Employee Portal
            </button>
          </div>


          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Contact system administrator to reset password")}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/30 transition-all duration-200 mt-2 ${
                loading
                  ? "bg-indigo-500/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                `Sign In to ${portalMode === "admin" ? "Admin" : "Employee"} Workspace →`
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
