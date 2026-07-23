import React from 'react';
import { BookOpen, FileSpreadsheet, ClipboardList, BarChart3, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { ChapterMeta } from '../types';

interface HeaderProps {
  selectedChapter: ChapterMeta;
  onSelectChapter: (chapter: ChapterMeta) => void;
  activeTab: 'quiz' | 'bank' | 'analytics' | 'export';
  setActiveTab: (tab: 'quiz' | 'bank' | 'analytics' | 'export') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedChapter,
  onSelectChapter,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="border-b border-white/10 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* Top Branding Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                  BIOL 2401 A&P I
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  HAPS SLO Mapped
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 mt-0.5">
                Pre-Assessment Generator
              </h1>
            </div>
          </div>

          {/* Chapter Dropdown & Instructor Badge */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Chapter Selector */}
            <div className="relative flex-1 md:w-80">
              <select
                value={selectedChapter.id}
                onChange={(e) => {
                  const ch = CHAPTERS.find(c => c.id === Number(e.target.value));
                  if (ch) onSelectChapter(ch);
                }}
                className="w-full appearance-none bg-[#162032] border border-cyan-500/30 hover:border-cyan-400 text-white text-xs font-mono font-semibold rounded-lg px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm transition"
              >
                {CHAPTERS.map(ch => (
                  <option key={ch.id} value={ch.id} className="bg-[#0f172a] text-white">
                    {ch.code}: {ch.title.split(': ')[1]} {ch.hasData ? `(${ch.questionCount} MCQs)` : '(Pending)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Instructor Badge */}
            <div className="flex items-center gap-2 bg-[#162032] border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
              <img
                src="/vhgm pic foto.png"
                alt="Dr. Victor Garcia M."
                className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/dr-victor-garcia.png";
                }}
              />
              <div className="text-left">
                <span className="block text-[10px] font-mono text-zinc-400 leading-none">Curated by</span>
                <span className="text-xs font-bold text-zinc-200">Dr. Victor Garcia M.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-[#111827] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Pre-Assessment Mode (Quiz)
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
              activeTab === 'bank'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Question Bank ({selectedChapter.questionCount} MCQs)
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            SLO & HAPS Mapping
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ml-auto ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Chapter CSV
          </button>
        </nav>
      </div>
    </header>
  );
};
