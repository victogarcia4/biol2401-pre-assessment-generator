import React, { useState } from 'react';
import { MCQItem, ChapterMeta } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, ArrowLeft, RotateCcw, Award, BookOpen, Lightbulb, FileText, Download, UserCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportQuizToPDF } from '../utils/QuizPDFExport';

interface PreAssessmentQuizProps {
  chapter: ChapterMeta;
  mcqs: MCQItem[];
}

export const PreAssessmentQuiz: React.FC<PreAssessmentQuizProps> = ({ chapter, mcqs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studyMode, setStudyMode] = useState(true); // Immediate explanation mode
  const [studentName, setStudentName] = useState('');

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl max-w-xl mx-auto my-12 border border-white/10">
        <BookOpen className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Chapter Under Construction</h3>
        <p className="text-zinc-400 text-sm">
          Chapter {chapter.id} is currently configured to receive its 15 MCQ question bank mapped to HAPS SLOs.
        </p>
      </div>
    );
  }

  const currentQ = mcqs[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];

  const handleSelectOption = (letter: "A" | "B" | "C" | "D") => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: letter }));
    if (studyMode) {
      setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    const sloStats: Record<string, { correct: number; total: number; title: string }> = {};
    const subjectStats: Record<string, { correct: number; total: number }> = {};

    mcqs.forEach((q, idx) => {
      const ans = userAnswers[idx];
      const isRight = ans === q.letterAnswer;
      if (isRight) correctCount++;

      // SLO stats
      if (!sloStats[q.slo]) {
        sloStats[q.slo] = { correct: 0, total: 0, title: q.sloDescription };
      }
      sloStats[q.slo].total++;
      if (isRight) sloStats[q.slo].correct++;

      // Subject stats
      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = { correct: 0, total: 0 };
      }
      subjectStats[q.subject].total++;
      if (isRight) subjectStats[q.subject].correct++;
    });

    const percentage = Math.round((correctCount / mcqs.length) * 100);
    return { score: correctCount, total: mcqs.length, percentage, sloStats, subjectStats };
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  const scoreData = isSubmitted ? calculateScore() : null;

  const handleExportPDF = () => {
    if (!scoreData) return;
    const name = studentName.trim() ? studentName.trim() : "Estudiante BIOL 2401";
    exportQuizToPDF(chapter, mcqs, userAnswers, scoreData, name);
  };

  return (
    <div className="space-y-6">
      
      {/* Assessment Header & Settings */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">
              {chapter.code} Assessment
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Exam Target: {chapter.examName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {chapter.title}
          </h2>
        </div>

        {!isSubmitted && (
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer bg-[#162032] px-3 py-1.5 rounded-lg border border-white/10">
              <input
                type="checkbox"
                checked={studyMode}
                onChange={(e) => setStudyMode(e.target.checked)}
                className="rounded border-zinc-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Show Immediate Rationale</span>
            </label>

            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30">
              {Object.keys(userAnswers).length} / {mcqs.length} Answered
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!isSubmitted ? (
        <div className="space-y-6">
          
          {/* Question Stepper Progress Bar */}
          <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 relative"
          >
            {/* Question Top Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded">
                  Question {currentIndex + 1} of {mcqs.length}
                </span>
                <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded">
                  SLO: {currentQ.slo}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                {currentQ.subject}
              </span>
            </div>

            {/* Question Stem */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>
              <p className="text-xs text-zinc-400 italic">
                SLO Description: {currentQ.sloDescription}
              </p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {(["A", "B", "C", "D"] as const).map((letter) => {
                const optText = currentQ[`option${letter}` as keyof MCQItem] as string;
                const isSelected = selectedAnswer === letter;
                const isCorrectOption = currentQ.letterAnswer === letter;
                
                let btnStyle = "bg-[#111827] border-white/10 hover:border-cyan-500/50 hover:bg-white/5 text-zinc-200";
                
                if (selectedAnswer) {
                  if (isSelected && isCorrectOption) {
                    btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10";
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                  } else if (isCorrectOption && (studyMode || showExplanation[currentIndex])) {
                    btnStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300";
                  }
                }

                return (
                  <button
                    key={letter}
                    onClick={() => handleSelectOption(letter)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-200 ${btnStyle} cursor-pointer`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      isSelected
                        ? isCorrectOption
                          ? 'bg-emerald-500 text-black'
                          : 'bg-rose-500 text-white'
                        : 'bg-white/10 text-zinc-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-medium pt-1 leading-normal flex-1">
                      {optText}
                    </span>
                    {selectedAnswer && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                    )}
                    {selectedAnswer && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            <AnimatePresence>
              {(showExplanation[currentIndex] || (selectedAnswer && studyMode)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm space-y-2 mt-4"
                >
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                    <span>Pedagogical Rationale:</span>
                  </div>
                  <p className="leading-relaxed font-light text-zinc-300">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg bg-[#162032] hover:bg-white/10 text-xs font-semibold text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < mcqs.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition cursor-pointer"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
                  >
                    Finish Assessment
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </motion.div>

        </div>
      ) : (
        /* Results View */
        scoreData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Score Banner & Export Action */}
            <div className="glass-card p-8 rounded-2xl text-center space-y-6 border border-cyan-500/30 glow-cyan">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Award className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Pre-Assessment Results
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {chapter.title} – BIOL 2401
                </p>
              </div>

              <div className="inline-flex items-baseline gap-2 bg-[#111827] px-6 py-3 rounded-2xl border border-white/10">
                <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
                  {scoreData.percentage}%
                </span>
                <span className="text-zinc-400 text-sm font-mono">
                  ({scoreData.score} of {scoreData.total} Correct)
                </span>
              </div>

              {/* Student Name & PDF Export Bar */}
              <div className="max-w-xl mx-auto bg-[#0f172a] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Descargar Reporte PDF con Rationales Pedagógicos</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Escribe tu Nombre o Matrícula (Opcional)"
                    className="flex-1 bg-[#1e293b] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleExportPDF}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Guardar en PDF</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-[#162032] hover:bg-white/10 text-xs font-bold text-zinc-200 flex items-center gap-2 border border-white/10 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reiniciar Examen
                </button>
              </div>
            </div>

            {/* Graphical SLO Priority Emphasis Breakdown */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Priorización de SLOs para la Clase (Énfasis Recomendado)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ordenado por prioridad de enseñanza según el porcentaje de aciertos en esta evaluación.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono shrink-0 pt-2 sm:pt-0">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 🔴 Alta (&lt;60%)
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 🟡 Media (60-79%)
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 🟢 Dominado (≥80%)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(scoreData.sloStats)
                  .map(([sloCode, stat]) => {
                    const pct = Math.round((stat.correct / stat.total) * 100);
                    let priorityLabel = '🟢 Dominado (Baja Prioridad)';
                    let priorityColor = 'emerald';
                    let barBg = 'bg-emerald-500';
                    let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                    if (pct < 60) {
                      priorityLabel = '🔴 Prioridad Alta (Énfasis Urgente en Clase)';
                      priorityColor = 'rose';
                      barBg = 'bg-rose-500';
                      badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                    } else if (pct < 80) {
                      priorityLabel = '🟡 Prioridad Media (Repaso Breve)';
                      priorityColor = 'amber';
                      barBg = 'bg-amber-500';
                      badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    }

                    return { sloCode, stat, pct, priorityLabel, priorityColor, barBg, badgeBg };
                  })
                  .sort((a, b) => a.pct - b.pct) // Sort ascending by correctness percentage so lowest (highest priority) is first
                  .map(({ sloCode, stat, pct, priorityLabel, barBg, badgeBg }) => (
                    <div key={sloCode} className="p-4 rounded-xl bg-[#111827] border border-white/5 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm font-mono text-cyan-300">{sloCode}</span>
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg}`}>
                              {priorityLabel}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-light leading-relaxed">
                            {stat.title}
                          </p>
                        </div>

                        <div className="text-right font-mono shrink-0">
                          <span className="text-base font-extrabold text-white">{pct}%</span>
                          <span className="text-xs text-zinc-500 block">({stat.correct} de {stat.total} Aciertos)</span>
                        </div>
                      </div>

                      {/* Graphical Progress Bar */}
                      <div className="w-full bg-zinc-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
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
            </div>

            {/* Detailed Questions & Rationales Review list */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-white/10">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                <FileText className="w-5 h-5 text-cyan-400" />
                Revisión Detallada de Preguntas y Rationales
              </h4>

              <div className="space-y-6">
                {mcqs.map((q, index) => {
                  const userAns = userAnswers[index];
                  const isRight = userAns === q.letterAnswer;

                  return (
                    <div key={index} className="p-5 rounded-xl bg-[#111827] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                            Pregunta {index + 1}
                          </span>
                          <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                            {q.slo}
                          </span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                          isRight
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {isRight ? '✓ Respuesta Correcta' : '✗ Respuesta Incorrecta'}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as const).map(letter => {
                          const optText = q[`option${letter}` as keyof MCQItem] as string;
                          const isUserChoice = userAns === letter;
                          const isCorrectChoice = q.letterAnswer === letter;

                          let style = "bg-zinc-900/60 border-white/5 text-zinc-400";
                          if (isCorrectChoice) {
                            style = "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold";
                          } else if (isUserChoice && !isCorrectChoice) {
                            style = "bg-rose-950/60 border-rose-500/60 text-rose-300 font-bold";
                          }

                          return (
                            <div key={letter} className={`p-2.5 rounded-lg border flex items-center justify-between ${style}`}>
                              <span><strong>{letter})</strong> {optText}</span>
                              {isUserChoice && <span className="text-[10px] font-mono uppercase bg-white/10 px-1.5 py-0.5 rounded">Tu Elección</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                          <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Rationale Pedagógico:</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-light">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )
      )}

    </div>
  );
};
