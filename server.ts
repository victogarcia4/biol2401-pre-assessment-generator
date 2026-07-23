import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.json());

  const dataDir = path.join(process.cwd(), 'data');
  const gradesFile = path.join(dataDir, 'grades.json');

  // Ensure data directory and grades.json exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(gradesFile)) {
    fs.writeFileSync(gradesFile, JSON.stringify([]), 'utf-8');
  }

  // GET /api/grades
  app.get('/api/grades', (req, res) => {
    try {
      const content = fs.readFileSync(gradesFile, 'utf-8');
      const grades = JSON.parse(content || '[]');
      res.json(grades);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/grades
  app.post('/api/grades', (req, res) => {
    try {
      const newGrade = req.body;
      const content = fs.readFileSync(gradesFile, 'utf-8');
      const grades = JSON.parse(content || '[]');

      // Insert at beginning
      const updated = [newGrade, ...grades];
      fs.writeFileSync(gradesFile, JSON.stringify(updated, null, 2), 'utf-8');

      res.status(201).json(newGrade);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/grades
  app.delete('/api/grades', (req, res) => {
    try {
      fs.writeFileSync(gradesFile, JSON.stringify([]), 'utf-8');
      res.json({ message: 'Grades database reset successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Integrate Vite dev server middleware if in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BIOL 2401 Server] Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
