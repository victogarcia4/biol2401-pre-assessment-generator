import React, { useState } from 'react';
import { MCQItem, ChapterMeta } from '../types';
import { FileSpreadsheet, Download, Copy, Check, Printer, FileCode, Sparkles } from 'lucide-react';

interface CSVExportModalProps {
  chapter: ChapterMeta;
  mcqs: MCQItem[];
}

export const CSVExportModal: React.FC<CSVExportModalProps> = ({ chapter, mcqs }) => {
  const [copied, setCopied] = useState(false);

  const generateCSVText = () => {
    const escapeCSV = (field: any) => {
      if (field === null || field === undefined) return '""';
      const str = String(field);
      if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const headers = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Letter Answer', 'Subject', 'SLO', 'SLO Description', 'Chapter', 'Explanation'];
    const lines = [headers.map(escapeCSV).join(',')];

    mcqs.forEach(m => {
      const row = [
        m.question,
        m.optionA,
        m.optionB,
        m.optionC,
        m.optionD,
        m.correctAnswer,
        m.letterAnswer,
        m.subject,
        m.slo,
        m.sloDescription,
        m.chapter,
        m.explanation
      ].map(escapeCSV).join(',');
      lines.push(row);
    });

    return lines.join('\n');
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSVText();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', chapter.csvFileName || `Chapter_${String(chapter.id).padStart(2, '0')}_MCQs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(mcqs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Chapter_${String(chapter.id).padStart(2, '0')}_MCQs.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCSV = () => {
    const csvContent = generateCSVText();
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const csvPreview = generateCSVText();

  return (
    <div className="space-y-6">
      
      {/* Export Action Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-emerald-500/30 glow-emerald">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded uppercase">
                Export Manager
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Spreadsheet Ready (.csv)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Export Question Spreadsheet – {chapter.code}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Direct download of the `.csv` spreadsheet for Chapter {chapter.id} containing {mcqs.length} MCQ questions mapped to BIOL 2401 Final Exam SLOs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadCSV}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download {chapter.csvFileName}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-4 py-3 rounded-xl bg-[#162032] hover:bg-white/10 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              Download JSON
            </button>

            <button
              onClick={handleCopyCSV}
              className="px-4 py-3 rounded-xl bg-[#162032] hover:bg-white/10 text-xs font-bold text-zinc-300 border border-white/10 flex items-center gap-2 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy CSV'}
            </button>
          </div>
        </div>

        {/* Saved File Info Banner */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-200">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-mono font-bold block text-emerald-300">
              Generated file saved to disk:
            </span>
            <span className="font-mono text-zinc-400 text-[11px]">
              Generador-de-Pre-Assessment/data/{chapter.csvFileName}
            </span>
          </div>
        </div>

        {/* Live CSV Code Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              CSV Format Live Preview (.csv)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              UTF-8 Encoded • {csvPreview.split('\n').length} Lines
            </span>
          </div>

          <div className="bg-[#090d16] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-300/90 overflow-x-auto max-h-80 leading-relaxed">
            <pre>{csvPreview}</pre>
          </div>
        </div>
      </div>

    </div>
  );
};
