import { MCQItem, ChapterMeta } from '../types';

interface ScoreData {
  score: number;
  total: number;
  percentage: number;
  sloStats: Record<string, { correct: number; total: number; title: string }>;
}

export function exportQuizToPDF(
  chapter: ChapterMeta,
  mcqs: MCQItem[],
  userAnswers: Record<number, "A" | "B" | "C" | "D">,
  scoreData: ScoreData,
  studentName: string = "Estudiante BIOL 2401"
) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build SLO summary rows
  const sloEntries = Object.entries(scoreData.sloStats).map(([code, data]) => {
    const pct = Math.round((data.correct / data.total) * 100);
    let priorityTag = '';
    let colorClass = '';

    if (pct < 60) {
      priorityTag = '🔴 Prioridad Alta (Énfasis Urgente en Clase)';
      colorClass = '#ef4444';
    } else if (pct < 80) {
      priorityTag = '🟡 Prioridad Media (Repaso Breve)';
      colorClass = '#f59e0b';
    } else {
      priorityTag = '🟢 Dominado (Baja Prioridad)';
      colorClass = '#10b981';
    }

    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; font-family: monospace; font-size: 13px;">${code}</td>
        <td style="padding: 10px; font-size: 13px;">${data.title}</td>
        <td style="padding: 10px; text-align: center; font-weight: bold; font-size: 14px; color: ${colorClass};">${data.correct}/${data.total} (${pct}%)</td>
        <td style="padding: 10px; font-weight: bold; font-size: 12px; color: ${colorClass};">${priorityTag}</td>
      </tr>
    `;
  }).join('');

  // Build questions breakdown
  const questionsHtml = mcqs.map((q, index) => {
    const userAns = userAnswers[index];
    const isCorrect = userAns === q.letterAnswer;
    const statusColor = isCorrect ? '#059669' : '#dc2626';
    const statusText = isCorrect ? '✓ Correcta' : '✗ Incorrecta';

    const optionsHtml = (['A', 'B', 'C', 'D'] as const).map(letter => {
      const isSelected = userAns === letter;
      const isRight = q.letterAnswer === letter;
      let optBg = '#ffffff';
      let optBorder = '#cbd5e1';
      let badge = '';

      if (isRight) {
        optBg = '#ecfdf5';
        optBorder = '#10b981';
        badge = '<span style="color: #047857; font-weight: bold; font-size: 11px; margin-left: 8px;">(Respuesta Correcta)</span>';
      }
      if (isSelected && !isRight) {
        optBg = '#fef2f2';
        optBorder = '#ef4444';
        badge = '<span style="color: #b91c1c; font-weight: bold; font-size: 11px; margin-left: 8px;">(Tu Selección)</span>';
      } else if (isSelected && isRight) {
        badge = '<span style="color: #047857; font-weight: bold; font-size: 11px; margin-left: 8px;">(Tu Selección ✓)</span>';
      }

      const optionText = letter === 'A' ? q.optionA : letter === 'B' ? q.optionB : letter === 'C' ? q.optionC : q.optionD;

      return `
        <div style="background-color: ${optBg}; border: 1px solid ${optBorder}; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; font-size: 12.5px;">
          <strong style="width: 24px; display: inline-block;">${letter})</strong> ${optionText} ${badge}
        </div>
      `;
    }).join('');

    return `
      <div style="page-break-inside: avoid; margin-bottom: 24px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; background-color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
          <div>
            <span style="font-weight: bold; font-size: 14px; color: #1e293b;">Pregunta ${index + 1} de ${mcqs.length}</span>
            <span style="background-color: #e0f2fe; color: #0369a1; font-family: monospace; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">
              ${q.slo}
            </span>
          </div>
          <span style="font-weight: bold; font-size: 13px; color: ${statusColor};">${statusText}</span>
        </div>

        <p style="font-size: 13.5px; color: #0f172a; margin-top: 0; margin-bottom: 12px; font-weight: 500; leading: 1.4;">
          ${q.question}
        </p>

        <div style="margin-bottom: 14px;">
          ${optionsHtml}
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 0 6px 6px 0;">
          <div style="font-weight: bold; font-size: 11.5px; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            💡 Rationale / Explicación Pedagógica:
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.5;">
            ${q.explanation}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>BIOL 2401 Examen Pre-Clase - ${chapter.code}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.4;
          margin: 0;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #0284c7;
          padding-bottom: 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
        .score-card {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .score-value {
          font-size: 24px;
          font-weight: 900;
          color: #0284c7;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          background-color: #f1f5f9;
          text-align: left;
          padding: 8px 10px;
          font-size: 12px;
          color: #475569;
          text-transform: uppercase;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">BIOL 2401 Human Anatomy & Physiology I</h1>
          <p class="subtitle">Evaluación Pre-Clase con Rationales • Dr. Víctor García M.</p>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; font-size: 14px;">${chapter.code}: ${chapter.title}</div>
          <div style="font-size: 12px; color: #64748b;">${currentDate}</div>
        </div>
      </div>

      <div class="score-card">
        <div>
          <div style="font-size: 12px; color: #0369a1; font-weight: bold; text-transform: uppercase;">Reporte de Examen Estudiante</div>
          <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 2px;">${studentName}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Calificación Obtenida</div>
          <div class="score-value">${scoreData.score} / ${scoreData.total} (${scoreData.percentage}%)</div>
        </div>
      </div>

      <h2 style="font-size: 16px; border-left: 4px solid #0284c7; padding-left: 10px; color: #0f172a; margin-bottom: 12px;">
        Priorización de Outcomes (SLOs) para Enfoque en Clase
      </h2>
      <table>
        <thead>
          <tr>
            <th>SLO Code</th>
            <th>Descripción del Outcome de Aprendizaje</th>
            <th style="text-align: center;">Precisión</th>
            <th>Nivel de Prioridad en Clase</th>
          </tr>
        </thead>
        <tbody>
          ${sloEntries}
        </tbody>
      </table>

      <h2 style="font-size: 16px; border-left: 4px solid #0284c7; padding-left: 10px; color: #0f172a; margin-top: 30px; margin-bottom: 16px;">
        Desglose de las 15 Preguntas y Rationales Explicativos
      </h2>

      ${questionsHtml}

      <div style="margin-top: 30px; border-t: 1px solid #e2e8f0; padding-top: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
        Documento generado automáticamente por BIOL 2401 Pre-Assessment Generator • Dr. Víctor García M.
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
