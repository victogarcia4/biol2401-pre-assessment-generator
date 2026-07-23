import React, { useState } from 'react';
import { User, AlertCircle, ArrowRight, Key, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChapterMeta } from '../types';

interface StudentIdentificationModalProps {
  isOpen: boolean;
  chapter: ChapterMeta;
  initialFirstName?: string;
  initialLastName?: string;
  onIdentify: (firstName: string, lastName: string, passcode: string) => boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export const StudentIdentificationModal: React.FC<StudentIdentificationModalProps> = ({
  isOpen,
  chapter,
  initialFirstName = '',
  initialLastName = '',
  onIdentify,
  onClose,
  canClose = false
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanPass = passcode.trim();

    if (!cleanFirst || !cleanLast) {
      setError('You must enter both your First Name and Last Name to register.');
      return;
    }

    if (cleanFirst.length < 2 || cleanLast.length < 2) {
      setError('Please enter a valid first name and last name (at least 2 characters each).');
      return;
    }

    if (!cleanPass) {
      setError(`Please enter the access keyword for Exam ${chapter.id} (${chapter.code}).`);
      return;
    }

    if (cleanPass.toLowerCase() !== chapter.passcode.toLowerCase()) {
      setError(`Invalid keyword for Exam ${chapter.id} (${chapter.code}). Please request the access code from your instructor.`);
      return;
    }

    setError('');
    const success = onIdentify(cleanFirst, cleanLast, cleanPass);
    if (success && canClose && onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-start sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#0f172a] light:bg-white border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-white light:text-slate-900 glow-cyan my-auto"
        >
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              title="Close Modal"
            >
              ✕
            </button>
          )}

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] light:bg-slate-100 rounded-[10px] flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 light:text-cyan-800 px-2 py-0.5 rounded">
                  🔒 Restricted Access
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 light:text-amber-800 px-2 py-0.5 rounded">
                  Exam Passcode Required
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white light:text-slate-900 mt-0.5">
                Student Exam Registration
              </h3>
            </div>
          </div>

          {/* Nominal Exam Identification Banner */}
          <div className="bg-[#162032] light:bg-slate-100 p-4 rounded-xl border border-cyan-500/30 mb-5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-cyan-400 light:text-cyan-700 uppercase">Target Exam:</span>
              <span className="text-zinc-400 light:text-slate-500">{chapter.examName}</span>
            </div>
            <p className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-1.5 pt-0.5">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Exam {chapter.id}: {chapter.code} - {chapter.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600 mb-1.5">
                  First Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Victor"
                  autoFocus
                  required
                  className="w-full bg-[#1e293b] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-4 py-3 text-white light:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600 mb-1.5">
                  Last Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Garcia"
                  required
                  className="w-full bg-[#1e293b] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-4 py-3 text-white light:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-amber-400 light:text-amber-700 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Exam {chapter.id} Access Keyword / Passcode <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder={`Enter access keyword for Exam ${chapter.id}...`}
                required
                className="w-full bg-[#1e293b] light:bg-slate-100 border border-amber-500/40 rounded-xl px-4 py-3 text-white light:text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-xl text-xs font-mono"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Unlock & Open Exam {chapter.id}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
