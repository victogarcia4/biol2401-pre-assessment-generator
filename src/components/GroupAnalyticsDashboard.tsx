import React, { useState, useEffect } from 'react';
import { GradeRecord, ChapterMeta } from '../types';
import { CHAPTERS } from '../data/chapters';
import { fetchGrades, clearAllGrades, exportGradesToCSV } from '../services/api';
import { BarChart3, Users, Award, AlertTriangle, Download, Trash2, Search, Filter, BookOpen, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface GroupAnalyticsDashboardProps {
  selectedChapter: ChapterMeta;
}

export const GroupAnalyticsDashboard: React.FC<GroupAnalyticsDashboardProps> = ({ selectedChapter }) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChapterId, setFilterChapterId] = useState<number | 'all'>(selectedChapter.id);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchGrades();
    setGrades(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter records by chapter if selected
  const filteredGrades = grades.filter(g => {
    const matchesChapter = filterChapterId === 'all' || g.chapterId === filterChapterId;
    const search = searchQuery.toLowerCase().trim();
    const matchesSearch = !search ||
      g.studentName.toLowerCase().includes(search) ||
      g.firstName.toLowerCase().includes(search) ||
      g.lastName.toLowerCase().includes(search);
    return matchesChapter && matchesSearch;
  });

  // Calculate Group Analytics Metrics
  const totalExams = filteredGrades.length;
  const avgScore = totalExams > 0
    ? Math.round(filteredGrades.reduce((sum, g) => sum + g.percentage, 0) / totalExams)
    : 0;

  const passingExams = filteredGrades.filter(g => g.percentage >= 70).length;
  const passRate = totalExams > 0 ? Math.round((passingExams / totalExams) * 100) : 0;

  // Aggregate Group SLO Accuracy Matrix
  const groupSloStats: Record<string, { correct: number; total: number; title: string }> = {};

  filteredGrades.forEach(g => {
    if (g.sloStats) {
      Object.entries(g.sloStats).forEach(([code, stat]) => {
        if (!groupSloStats[code]) {
          groupSloStats[code] = { correct: 0, total: 0, title: stat.title };
        }
        groupSloStats[code].correct += stat.correct;
        groupSloStats[code].total += stat.total;
      });
    }
  });

  // Convert to array and sort ascending by correctness % (lowest correctness = highest teaching priority)
  const sortedGroupSLOs = Object.entries(groupSloStats)
    .map(([code, stat]) => {
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      let priorityLabel = '🟢 Mastered (Low Priority)';
      let barBg = 'bg-emerald-500';
      let badgeBg = 'bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border-emerald-500/30';

      if (pct < 60) {
        priorityLabel = '🔴 High Priority (Urgent Class Focus)';
        barBg = 'bg-rose-500';
        badgeBg = 'bg-rose-500/10 text-rose-400 light:text-rose-700 border-rose-500/30';
      } else if (pct < 80) {
        priorityLabel = '🟡 Medium Priority (Brief Review)';
        barBg = 'bg-amber-500';
        badgeBg = 'bg-amber-500/10 text-amber-400 light:text-amber-700 border-amber-500/30';
      }

      return { code, title: stat.title, correct: stat.correct, total: stat.total, pct, priorityLabel, barBg, badgeBg };
    })
    .sort((a, b) => a.pct - b.pct);

  const highPriorityCount = sortedGroupSLOs.filter(s => s.pct < 60).length;

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear the class grade database? This action cannot be undone.')) {
      await clearAllGrades();
      await loadData();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Global Filters */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 light:text-cyan-800 px-2.5 py-1 rounded uppercase">
              Class Session Results
            </span>
            <span className="text-[10px] font-mono text-zinc-400 light:text-slate-600">
              Cohort Aggregate Analytics
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 mt-1">
            Class Session Dashboard by SLO
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 light:text-slate-700 font-light mt-1">
            Visualize priority topics to emphasize during lecture based on cumulative student performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter by Chapter */}
          <div className="relative flex-1 md:w-64">
            <select
              value={filterChapterId}
              onChange={(e) => setFilterChapterId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full appearance-none bg-[#162032] light:bg-slate-100 border border-cyan-500/30 light:border-slate-300 text-white light:text-slate-900 text-xs font-mono font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm transition"
            >
              <option value="all">All Chapters ({grades.length} Records)</option>
              {CHAPTERS.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.code}: {ch.title.split(': ')[1]}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-cyan-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-[#162032] light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-cyan-400 border border-white/10 light:border-slate-300 transition shrink-0 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Exams Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 light:border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600">Exams Taken</span>
            <span className="text-2xl font-black text-white light:text-slate-900 font-mono">{totalExams}</span>
            <span className="block text-[11px] text-zinc-400 light:text-slate-500">Student Submissions</span>
          </div>
        </div>

        {/* Group Average Score Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 light:border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600">Class Average</span>
            <span className="text-2xl font-black text-white light:text-slate-900 font-mono">{avgScore}%</span>
            <span className="block text-[11px] text-zinc-400 light:text-slate-500">Cohort Mean Accuracy</span>
          </div>
        </div>

        {/* Group Pass Rate Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 light:border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600">Pass Rate</span>
            <span className="text-2xl font-black text-white light:text-slate-900 font-mono">{passRate}%</span>
            <span className="block text-[11px] text-zinc-400 light:text-slate-500">Students Scoring ≥ 70%</span>
          </div>
        </div>

        {/* High Priority SLO Count Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 light:border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 light:text-slate-600">Critical SLOs (&lt;60%)</span>
            <span className="text-2xl font-black text-rose-400 font-mono">{highPriorityCount}</span>
            <span className="block text-[11px] text-zinc-400 light:text-slate-500">Require In-Class Focus</span>
          </div>
        </div>

      </div>

      {/* Group SLO Priority Chart Section */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-white/10 light:border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 light:border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Group SLO Priority Breakdown
            </h3>
            <p className="text-xs text-zinc-400 light:text-slate-600 mt-1">
              SLOs ordered from lowest to highest class accuracy. Focus the first minutes of class on red bar 🔴 SLOs.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-rose-400 light:text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 🔴 High (&lt;60%)
            </span>
            <span className="flex items-center gap-1 text-amber-400 light:text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 🟡 Medium (60-79%)
            </span>
            <span className="flex items-center gap-1 text-emerald-400 light:text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 🟢 Mastered (≥80%)
            </span>
          </div>
        </div>

        {sortedGroupSLOs.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Users className="w-12 h-12 text-zinc-500 mx-auto" />
            <h4 className="text-base font-bold text-white light:text-slate-900">No Saved Submissions Yet</h4>
            <p className="text-xs text-zinc-400 light:text-slate-600 max-w-md mx-auto">
              Once your students complete the pre-class assessment, aggregate group results will appear sorted by priority here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGroupSLOs.map(({ code, title, correct, total, pct, priorityLabel, barBg, badgeBg }) => (
              <div key={code} className="p-4 rounded-xl bg-[#111827] light:bg-slate-100 border border-white/5 light:border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono text-cyan-300 light:text-cyan-700">{code}</span>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${badgeBg}`}>
                        {priorityLabel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 light:text-slate-700 font-light leading-relaxed">
                      {title}
                    </p>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <span className="text-lg font-black text-white light:text-slate-900">{pct}%</span>
                    <span className="text-xs text-zinc-500 light:text-slate-500 block">({correct} of {total} class correct responses)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800/80 light:bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-white/5 light:border-slate-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${barBg} shadow-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Grade Book Table */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-white/10 light:border-slate-200">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 light:border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Student Grade Roster ({filteredGrades.length})
            </h3>
            <p className="text-xs text-zinc-400 light:text-slate-600 mt-0.5">
              Assessment history per student including timestamp, grade, and response data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by First or Last Name..."
                className="w-full bg-[#162032] light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-white light:text-slate-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Export CSV Button */}
            <button
              onClick={() => exportGradesToCSV(filteredGrades)}
              disabled={filteredGrades.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {/* Reset Grades Button */}
            {grades.length > 0 && (
              <button
                onClick={handleClearData}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                title="Reset grade database"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Session Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        {filteredGrades.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 light:text-slate-500 font-mono">
            No grade records found matching the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 light:border-slate-200 text-zinc-400 light:text-slate-500 uppercase">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Chapter</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 light:divide-slate-200">
                {filteredGrades.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 light:hover:bg-slate-100 transition">
                    <td className="py-3 px-4 font-bold text-white light:text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 light:text-cyan-800 font-bold text-xs uppercase shrink-0">
                          {r.firstName.charAt(0)}{r.lastName.charAt(0)}
                        </div>
                        <div>
                          <span className="block text-sm text-white light:text-slate-900 font-sans font-semibold leading-none">{r.firstName} {r.lastName}</span>
                          <span className="text-[10px] text-zinc-500 light:text-slate-500">{r.studentName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-300 light:text-slate-700">
                      <span className="font-bold text-cyan-400 light:text-cyan-700">{r.chapterCode}</span>
                      <span className="block text-[10px] text-zinc-400 light:text-slate-500 truncate max-w-xs">{r.chapterTitle}</span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
                      <span className={`px-2.5 py-1 rounded-full ${
                        r.percentage >= 70
                          ? 'bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 light:text-rose-700 border border-rose-500/30'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-zinc-300 light:text-slate-700">
                      {r.score} / {r.total}
                    </td>

                    <td className="py-3 px-4 text-right text-zinc-400 light:text-slate-500 text-[11px]">
                      {new Date(r.date).toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
