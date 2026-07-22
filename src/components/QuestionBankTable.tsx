import React, { useState } from 'react';
import { MCQItem, ChapterMeta } from '../types';
import { Search, Filter, BookOpen, ChevronDown, ChevronUp, CheckCircle, Tag } from 'lucide-react';

interface QuestionBankTableProps {
  chapter: ChapterMeta;
  mcqs: MCQItem[];
}

export const QuestionBankTable: React.FC<QuestionBankTableProps> = ({ chapter, mcqs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const subjects = ['ALL', ...Array.from(new Set(mcqs.map(q => q.subject)))];

  const filteredMCQs = mcqs.filter(q => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.slo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.sloDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Control Bar */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">
              {chapter.code} Question Bank
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {filteredMCQs.length} of {mcqs.length} Questions Displayed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            MCQ Question Bank – {chapter.title.split(': ')[1]}
          </h2>
        </div>

        {/* Search & Subject Filter inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by question or SLO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#162032] border border-white/10 hover:border-cyan-500/50 focus:border-cyan-500 text-xs font-mono text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none transition"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none bg-[#162032] border border-white/10 hover:border-cyan-500/50 focus:border-cyan-500 text-xs font-mono font-semibold text-white rounded-lg px-3.5 py-2.5 pr-8 focus:outline-none cursor-pointer transition"
            >
              {subjects.map(s => (
                <option key={s} value={s} className="bg-[#0f172a] text-white">
                  {s === 'ALL' ? 'All Subjects' : s}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827] border-b border-white/10 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">#</th>
                <th className="py-3.5 px-4 font-semibold">MCQ Question</th>
                <th className="py-3.5 px-4 font-semibold w-32">SLO Code</th>
                <th className="py-3.5 px-4 font-semibold w-48">Subject Category</th>
                <th className="py-3.5 px-4 font-semibold w-32 text-center">Correct Answer</th>
                <th className="py-3.5 px-4 font-semibold w-16 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredMCQs.map((q, idx) => {
                const isExpanded = expandedId === idx;
                return (
                  <React.Fragment key={idx}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : idx)}
                      className={`hover:bg-white/5 cursor-pointer transition ${isExpanded ? 'bg-cyan-950/20' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 text-center">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-zinc-200 leading-snug max-w-md">
                        {q.question}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                        <span className="bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block">
                          {q.slo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {q.subject}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md inline-block">
                          Option {q.letterAnswer}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-zinc-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4 mx-auto text-cyan-400" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                      </td>
                    </tr>

                    {/* Expanded Detail Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#0f172a]/90">
                        <td colSpan={6} className="p-6 space-y-4 border-l-4 border-cyan-500">
                          
                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(["A", "B", "C", "D"] as const).map(letter => {
                              const isCorrect = q.letterAnswer === letter;
                              return (
                                <div
                                  key={letter}
                                  className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                                    isCorrect
                                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold'
                                      : 'bg-[#162032] border-white/10 text-zinc-300'
                                  }`}
                                >
                                  <span className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold shrink-0 ${
                                    isCorrect ? 'bg-emerald-500 text-black' : 'bg-white/10 text-zinc-400'
                                  }`}>
                                    {letter}
                                  </span>
                                  <span className="pt-0.5 leading-normal">
                                    {q[`option${letter}` as keyof MCQItem]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* SLO Description & Rationale */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-lg bg-[#111827] border border-white/5 space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                                HAPS Learning Outcome Description ({q.slo})
                              </span>
                              <p className="text-zinc-300 leading-relaxed font-light">
                                {q.sloDescription}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                                Pedagogical Rationale
                              </span>
                              <p className="text-zinc-300 leading-relaxed font-light">
                                {q.explanation}
                              </p>
                            </div>
                          </div>

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
