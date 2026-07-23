import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, X, KeyRound, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (login(password)) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
      }, 500);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setError(false);
    setPassword('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#0f172a] light:bg-white border border-cyan-500/30 light:border-slate-300 rounded-2xl p-6 sm:p-8 shadow-2xl text-white light:text-slate-900"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white light:hover:text-slate-900 p-1 rounded-lg hover:bg-white/10 light:hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] light:bg-slate-100 rounded-[10px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white light:text-slate-900">Admin Access</h3>
              <p className="text-xs text-zinc-400 light:text-slate-600 font-mono">Dr. Victor Garcia M.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 light:text-slate-600 mb-6 leading-relaxed">
            Course management, question bank editing, and aggregate class analytics are restricted. Enter your administrator password to proceed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••••••"
                  autoFocus
                  className="w-full bg-[#1e293b] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-4 py-3 text-white light:text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
                <KeyRound className="w-5 h-5 text-zinc-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-lg text-xs font-mono"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Incorrect password. Access denied.</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-lg text-xs font-mono"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Access granted! Loading admin suite...</span>
              </motion.div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 light:border-slate-300 text-zinc-400 light:text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-white/5 light:hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                Log In
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
