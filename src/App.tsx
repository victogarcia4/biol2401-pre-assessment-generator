import React, { useState } from 'react';
import { Header } from './components/Header';
import { PreAssessmentQuiz } from './components/PreAssessmentQuiz';
import { QuestionBankTable } from './components/QuestionBankTable';
import { SLOAnalytics } from './components/SLOAnalytics';
import { CSVExportModal } from './components/CSVExportModal';
import { CHAPTERS } from './data/chapters';
import { CHAPTER_1_MCQS } from './data/chapter1';
import { CHAPTER_2_MCQS } from './data/chapter2';
import { CHAPTER_3_MCQS } from './data/chapter3';
import { CHAPTER_4_MCQS } from './data/chapter4';
import { CHAPTER_5_MCQS } from './data/chapter5';
import { CHAPTER_6_MCQS } from './data/chapter6';
import { ChapterMeta, MCQItem } from './types';
import { Heart, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [selectedChapter, setSelectedChapter] = useState<ChapterMeta>(CHAPTERS[0]);
  const [activeTab, setActiveTab] = useState<'quiz' | 'bank' | 'analytics' | 'export'>('quiz');

  // Dynamically load MCQs based on selected chapter
  const currentMCQs: MCQItem[] = 
    selectedChapter.id === 1 ? CHAPTER_1_MCQS :
    selectedChapter.id === 2 ? CHAPTER_2_MCQS :
    selectedChapter.id === 3 ? CHAPTER_3_MCQS :
    selectedChapter.id === 4 ? CHAPTER_4_MCQS :
    selectedChapter.id === 5 ? CHAPTER_5_MCQS :
    selectedChapter.id === 6 ? CHAPTER_6_MCQS : [];

  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col font-sans selection:bg-[#00f0ff]/30 selection:text-white">
      
      {/* Dynamic Header & Navigation */}
      <Header
        selectedChapter={selectedChapter}
        onSelectChapter={setSelectedChapter}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Chapter Overview Banner */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0d1527] to-[#0f1b33]">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">
                {selectedChapter.code} Overview
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Syllabus Mapping: {selectedChapter.examName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {selectedChapter.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {selectedChapter.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono hidden sm:block">
              <span className="block text-[10px] text-zinc-400 uppercase font-bold">Bank Status</span>
              <span className="text-xs font-bold text-emerald-400">
                {selectedChapter.hasData ? `${selectedChapter.questionCount} MCQs Mapped` : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'quiz' && (
          <PreAssessmentQuiz chapter={selectedChapter} mcqs={currentMCQs} />
        )}

        {activeTab === 'bank' && (
          <QuestionBankTable chapter={selectedChapter} mcqs={currentMCQs} />
        )}

        {activeTab === 'analytics' && (
          <SLOAnalytics chapter={selectedChapter} mcqs={currentMCQs} />
        )}

        {activeTab === 'export' && (
          <CSVExportModal chapter={selectedChapter} mcqs={currentMCQs} />
        )}

      </main>

      {/* Class Footer */}
      <footer className="border-t border-white/10 bg-[#090d16] py-6 mt-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pre-Assessment Generator • BIOL 2401 Human Anatomy & Physiology I</p>
          
          <div className="flex items-center gap-2">
            <img
              src="/vhgm pic foto.png"
              alt="Dr. Víctor García"
              className="w-5 h-5 rounded-full object-cover border border-cyan-400/40"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/dr-victor-garcia.png";
              }}
            />
            <span className="text-zinc-400">Designed & Created by Dr. Víctor García Martínez</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
