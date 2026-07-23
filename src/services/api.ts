import { GradeRecord } from '../types';

const LOCAL_STORAGE_KEY = 'biol2401_grades_repository_v1';
const API_BASE = '/api';

export async function fetchGrades(): Promise<GradeRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/grades`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // Sync local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable, loading grades from local storage fallback:', err);
  }

  // Fallback to local storage
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to parse local storage grades:', e);
    return [];
  }
}

export async function saveGradeRecord(
  payload: Omit<GradeRecord, 'id' | 'date'>
): Promise<GradeRecord> {
  const newRecord: GradeRecord = {
    ...payload,
    id: `grade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
  };

  // Try backend API first
  try {
    const res = await fetch(`${API_BASE}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });

    if (res.ok) {
      const saved = await res.json();
      // Update local storage
      const current = await fetchGrades();
      return saved;
    }
  } catch (err) {
    console.warn('Backend API save failed, saving to local storage fallback:', err);
  }

  // Fallback: save to local storage
  try {
    const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = [newRecord, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing to local storage fallback:', e);
  }

  return newRecord;
}

export async function deleteGradeRecord(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/grades/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend API delete failed, deleting from local storage fallback:', err);
  }

  try {
    const current: GradeRecord[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to delete grade record from local storage:', e);
    return false;
  }
}

export async function clearAllGrades(): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/grades`, { method: 'DELETE' });
  } catch {}

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function exportGradesToCSV(records: GradeRecord[]): void {
  if (!records || records.length === 0) return;

  const headers = [
    'Record ID',
    'Timestamp',
    'Chapter Title',
    'Chapter Code',
    'First Name',
    'Last Name',
    'Full Name',
    'Correct Count',
    'Total Questions',
    'Grade (%)'
  ];

  const rows = records.map(r => {
    const dateFormatted = new Date(r.date).toLocaleString('en-US');
    return [
      `"${r.id}"`,
      `"${dateFormatted}"`,
      `"${r.chapterTitle.replace(/"/g, '""')}"`,
      `"${r.chapterCode}"`,
      `"${r.firstName.replace(/"/g, '""')}"`,
      `"${r.lastName.replace(/"/g, '""')}"`,
      `"${r.studentName.replace(/"/g, '""')}"`,
      r.score,
      r.total,
      r.percentage
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BIOL_2401_Grades_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
