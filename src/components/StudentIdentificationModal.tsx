import React, { useState } from 'react';
import { User, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentIdentificationModalProps {
  isOpen: boolean;
  onIdentify: (firstName: string, lastName: string) => void;
}

export const StudentIdentificationModal: React.FC<StudentIdentificationModalProps> = ({
  isOpen,
  onIdentify
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();

    if (!cleanFirst || !cleanLast) {
      setError('Debes ingresar tu Nombre y tu Apellido para tomar el examen.');
      return;
    }

    if (cleanFirst.length < 2 || cleanLast.length < 2) {
      setError('Por favor ingresa un nombre y apellido válidos.');
      return;
    }

    setError('');
    onIdentify(cleanFirst, cleanLast);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#0f172a] light:bg-white border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-white light:text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] light:bg-slate-100 rounded-[10px] flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                  Registro Obligatorio
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white light:text-slate-900 mt-0.5">
                Identificación de Estudiante
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 light:text-slate-600 mb-6 leading-relaxed">
            Bienvenido al examen pre-clase de **BIOL 2401**. Por favor ingresa tu Nombre y Apellido para registrar tu participación y guardar tus resultados.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600 mb-1.5">
                  Nombre (First Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError('');
                  }}
                  placeholder="Ej. Víctor"
                  autoFocus
                  required
                  className="w-full bg-[#1e293b] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-4 py-3 text-white light:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600 mb-1.5">
                  Apellido (Last Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError('');
                  }}
                  placeholder="Ej. García"
                  required
                  className="w-full bg-[#1e293b] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-4 py-3 text-white light:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
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

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Comenzar Examen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
