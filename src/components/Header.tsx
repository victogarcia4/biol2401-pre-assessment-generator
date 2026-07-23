import React, { useState, useEffect } from 'react';
import { BookOpen, FileSpreadsheet, ClipboardList, BarChart3, Sparkles, ChevronDown, Lock, LogOut, ShieldCheck, Sun, Moon, Users, User, UserCheck } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { ChapterMeta } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  selectedChapter: ChapterMeta;
  onSelectChapter: (chapter: ChapterMeta) => void;
  activeTab: 'quiz' | 'group' | 'bank' | 'analytics' | 'export';
  setActiveTab: (tab: 'quiz' | 'group' | 'bank' | 'analytics' | 'export') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedChapter,
  onSelectChapter,
  activeTab,
  setActiveTab
}) => {
  const { isAdmin, setIsLoginModalOpen, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [studentProfile, setStudentProfile] = useState<{ firstName: string; lastName: string } | null>(() => {
    try {
      const saved = localStorage.getItem('biol2401_student_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  useEffect(() => {
    const syncProfile = () => {
      try {
        const saved = localStorage.getItem('biol2401_student_profile');
        if (saved) setStudentProfile(JSON.parse(saved));
        else setStudentProfile(null);
      } catch {}
    };
    window.addEventListener('storage', syncProfile);
    const interval = setInterval(syncProfile, 1000);
    return () => {
      window.removeEventListener('storage', syncProfile);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-white/10 light:border-slate-200 bg-[#0d1322]/80 light:bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* Top Branding Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] light:bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 light:text-cyan-700 border border-cyan-500/30 px-2 py-0.5 rounded">
                  BIOL 2401 A&P I
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/30 px-2 py-0.5 rounded">
                  HAPS SLO Mapped
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white light:text-slate-900 flex items-center gap-2 mt-0.5">
                Pre-Assessment Generator
              </h1>
            </div>
          </div>

          {/* Chapter Dropdown, Theme Switcher & Auth Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Chapter Selector */}
            <div className="relative flex-1 md:w-72">
              <select
                value={selectedChapter.id}
                onChange={(e) => {
                  const ch = CHAPTERS.find(c => c.id === Number(e.target.value));
                  if (ch) onSelectChapter(ch);
                }}
                className="w-full appearance-none bg-[#162032] light:bg-slate-100 border border-cyan-500/30 light:border-slate-300 hover:border-cyan-400 text-white light:text-slate-900 text-xs font-mono font-semibold rounded-lg px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm transition"
              >
                {CHAPTERS.map(ch => (
                  <option key={ch.id} value={ch.id} className="bg-[#0f172a] light:bg-white text-white light:text-slate-900">
                    {ch.code}: {ch.title.split(': ')[1]} {ch.hasData ? `(${ch.questionCount} MCQs)` : '(Pending)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[#162032] light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-cyan-400 light:text-cyan-700 transition shrink-0 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Instructor Badge */}
            <div className="flex items-center gap-2 bg-[#162032] light:bg-slate-100 border border-white/10 light:border-slate-300 px-3 py-1.5 rounded-lg shrink-0">
              <img
                src="/vhgm pic foto.png"
                alt="Dr. Victor Garcia M."
                className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/dr-victor-garcia.png";
                }}
              />
              <div className="text-left">
                <span className="block text-[10px] font-mono text-zinc-400 light:text-slate-500 leading-none">Curated by</span>
                <span className="text-xs font-bold text-zinc-200 light:text-slate-800">Dr. Victor Garcia M.</span>
              </div>
            </div>

            {/* Student Profile Status Indicator */}
            {!isAdmin && (
              studentProfile ? (
                <div className="flex items-center gap-2 bg-[#162032] light:bg-slate-100 border border-cyan-500/40 px-3 py-1 rounded-lg shrink-0 font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="text-left">
                    <span className="block text-[9px] text-zinc-400 light:text-slate-500 leading-none">Student</span>
                    <span className="text-xs font-bold text-white light:text-slate-900">{studentProfile.firstName} {studentProfile.lastName}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-950/40 light:bg-amber-50 border border-amber-500/40 px-3 py-1 rounded-lg shrink-0 font-mono">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <div className="text-left">
                    <span className="block text-[9px] text-amber-400/80 light:text-amber-800 leading-none">Student</span>
                    <span className="text-xs font-bold text-amber-300 light:text-amber-900">Registration Required 🔒</span>
                  </div>
                </div>
              )
            )}

            {/* Admin Authentication Action Button */}
            {!isAdmin ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-[#162032] light:bg-slate-100 hover:bg-cyan-500/10 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 light:text-cyan-700 text-xs font-bold font-mono px-3.5 py-2 rounded-lg transition shrink-0 shadow-sm cursor-pointer"
                title="Restricted Administrator Access"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Access</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-950/60 light:bg-emerald-100 border border-emerald-500/40 px-3 py-1.5 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 light:text-emerald-700" />
                <span className="text-xs font-mono font-bold text-emerald-300 light:text-emerald-800">Admin Mode</span>
                <button
                  onClick={logout}
                  className="ml-1 p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Log Out Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-[#111827] light:bg-slate-100 p-1 rounded-xl border border-white/5 light:border-slate-200">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Pre-Assessment Mode (Quiz)
          </button>

          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('group')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'group'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-amber-400" />
                Class Group Analytics
              </button>

              <button
                onClick={() => setActiveTab('bank')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'bank'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Question Bank ({selectedChapter.questionCount} MCQs)
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                SLO & HAPS Mapping
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ml-auto cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'text-emerald-400 light:text-emerald-700 hover:bg-emerald-500/10'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Chapter CSV
              </button>
            </>
          ) : (
            <div className="ml-auto px-3 py-1.5 text-[11px] font-mono text-zinc-500 light:text-slate-500 flex items-center gap-1.5 select-none">
              <Lock className="w-3 h-3 text-zinc-500" />
              <span>Additional options restricted to Admin</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
