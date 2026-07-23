import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0f172a] light:bg-white border border-amber-500/40 rounded-2xl shadow-2xl text-white light:text-slate-900 overflow-hidden flex flex-col max-h-[85vh] my-auto"
        >
          {/* Top Decorative Amber Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 z-10" />

          {/* Fixed Pinned Header Section */}
          <div className="p-6 sm:p-8 pb-4 shrink-0 border-b border-white/10 light:border-slate-200 relative bg-[#0f172a] light:bg-white z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white light:hover:text-slate-900 p-2 rounded-xl hover:bg-white/10 light:hover:bg-slate-200 transition cursor-pointer"
              title="Close Directory"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content */}
            <div className="flex items-center gap-3 sm:gap-4 pr-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full bg-[#0b0f19] light:bg-amber-50 rounded-[10px] flex items-center justify-center">
                  <Key className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 light:text-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Admin Confidential Directory
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white light:text-slate-900 mt-0.5">
                  Secret Master Exam Passcodes (Exams 1–12)
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 light:text-slate-600 mt-3 font-light leading-relaxed">
              Below is the secret list of access keywords required for students to unlock each exam. Share the relevant keyword with students during exam sessions.
            </p>
          </div>

          {/* Scrollable Cards Grid Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-3 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHAPTERS.map((ch) => {
                const isCopied = copiedId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl bg-[#162032] light:bg-slate-50 border border-amber-500/20 light:border-slate-300 flex items-center justify-between gap-3 hover:border-amber-500/50 transition shadow-sm"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 light:text-amber-800 px-2 py-0.5 rounded">
                          Exam {ch.id} ({ch.code})
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 light:text-slate-500 truncate">
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

          {/* Fixed Pinned Footer Section */}
          <div className="p-4 sm:px-8 border-t border-white/10 light:border-slate-200 flex justify-between items-center text-xs font-mono text-zinc-400 light:text-slate-500 shrink-0 bg-[#0f172a] light:bg-slate-50">
            <span>BIOL 2401 Human Anatomy & Physiology I</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 light:bg-slate-200 hover:bg-zinc-700 light:hover:bg-slate-300 text-white light:text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
