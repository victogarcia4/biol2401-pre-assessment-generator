import React, { useState } from 'react';
import { Key, Copy, Check, X, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CHAPTERS } from '../data/chapters';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: number, passcode: string) => {
    navigator.clipboard.writeText(passcode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-start sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0f172a] light:bg-white border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-white light:text-slate-900 overflow-hidden flex flex-col max-h-[85vh] my-auto"
        >
          {/* Top Decorative Amber Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] light:bg-amber-50 rounded-[10px] flex items-center justify-center">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 light:text-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Confidential Directory
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white light:text-slate-900 mt-0.5">
                Secret Master Exam Passcodes (Exams 1–12)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 light:text-slate-600 mb-4 font-light leading-relaxed shrink-0">
            Below is the secret list of access keywords required for students to unlock each exam. Share the relevant keyword with students during exam sessions.
          </p>

          {/* Scrollable Passcodes Table */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHAPTERS.map((ch) => {
                const isCopied = copiedId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl bg-[#162032] light:bg-slate-50 border border-amber-500/20 light:border-slate-300 flex items-center justify-between gap-3 hover:border-amber-500/50 transition"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 light:text-amber-800 px-2 py-0.5 rounded">
                          Exam {ch.id} ({ch.code})
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 light:text-slate-500">
                          {ch.examName}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white light:text-slate-900 truncate">
                        {ch.title.split(': ')[1] || ch.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="bg-[#0b0f19] light:bg-white px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 light:text-amber-900 font-mono font-bold text-xs flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>{ch.passcode}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(ch.id, ch.passcode)}
                        className={`p-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/10 light:bg-slate-200 hover:bg-amber-500/20 text-zinc-300 light:text-slate-700'
                        }`}
                        title="Copy passcode"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-white/10 light:border-slate-200 flex justify-between items-center text-xs font-mono text-zinc-400 shrink-0">
            <span>BIOL 2401 Human Anatomy & Physiology I</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 light:bg-slate-200 hover:bg-zinc-700 text-white light:text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
