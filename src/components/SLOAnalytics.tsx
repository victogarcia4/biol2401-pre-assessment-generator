import React from 'react';
import { MCQItem, ChapterMeta } from '../types';
import { BarChart3, CheckCircle2, Award, Target, BookOpen, Layers } from 'lucide-react';

interface SLOAnalyticsProps {
  chapter: ChapterMeta;
  mcqs: MCQItem[];
}

export const SLOAnalytics: React.FC<SLOAnalyticsProps> = ({ chapter, mcqs }) => {
  // Aggregate SLOs
  const sloMap: Record<string, { count: number; desc: string; subject: string; questions: string[] }> = {};
  const subjectMap: Record<string, number> = {};

  mcqs.forEach(q => {
    if (!sloMap[q.slo]) {
      sloMap[q.slo] = { count: 0, desc: q.sloDescription, subject: q.subject, questions: [] };
    }
    sloMap[q.slo].count++;
    sloMap[q.slo].questions.push(q.question);

    subjectMap[q.subject] = (subjectMap[q.subject] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Total MCQs</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono block pt-1">
            {mcqs.length}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono">100% Assessment Coverage</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Evaluated SLOs</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono block pt-1">
            {Object.keys(sloMap).length}
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">Mapped to HAPS Standards</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Subject Categories</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono block pt-1">
            {Object.keys(subjectMap).length}
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">Curriculum Alignment</span>
        </div>
      </div>

      {/* Subject Categories Breakdown */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Distribution by Subject Category ({chapter.code})
        </h3>

        <div className="space-y-4">
          {Object.entries(subjectMap).map(([subjectName, count]) => {
            const pct = Math.round((count / mcqs.length) * 100);
            return (
              <div key={subjectName} className="space-y-1.5 p-4 rounded-xl bg-[#111827] border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{subjectName}</span>
                  <span className="text-cyan-400 font-bold">{count} MCQs ({pct}%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed SLO Grid */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Detailed Learning Outcomes Mapping (HAPS & BIOL 2401)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(sloMap).map(([sloCode, info]) => (
            <div key={sloCode} className="p-4 rounded-xl bg-[#111827] border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                  {sloCode}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {info.count} {info.count === 1 ? 'Question' : 'Questions'} Mapped
                </span>
              </div>

              <p className="text-xs text-zinc-200 leading-snug font-medium">
                {info.desc}
              </p>

              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Subject: {info.subject}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
