import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- MOCK DATABASE (POSTGRES SIMULATION) ---
  let projects: any[] = []; 
  let finishedProjects: any[] = [
    {
      id: "seed_1",
      name: "Smart Analytics ATP/RC",
      client: "Magnit (Simulated)",
      date: "2026-04-15T00:00:00.000Z",
      tasks: [
        { title: "Wren.ai Sandbox Setup", baseHours: 8, category: "RnD (Исследования)" },
        { title: "Data Schema Audit (Transport)", baseHours: 8, category: "RnD (Исследования)" },
        { title: "Semantic Layer Design", baseHours: 8, category: "RnD (Исследования)" },
        { title: "Text-to-SQL Agent", baseHours: 16, category: "Development (AI/ML Logic)" }
      ],
      summary: {
        totalHours: 140,
        totalCost: 850000,
        totalDays: 14,
        totalWeeks: 2.8,
        totalMonths: 0.7,
        byRole: [
            { name: "DS Инженер", value: 40 },
            { name: "DevOps/SRE", value: 20 },
            { name: "Бэкенд", value: 30 },
            { name: "Аналитик", value: 50 }
        ]
      },
      chart: `graph TD
    User((Пользователь)) --> Chat[Chat UI]
    Chat --> B[Backend Orchestrator]
    B --> Wren[Wren.ai Semantic Layer]
    Wren --> Trino[Trino Query Engine]
    Trino --> ATP[(БД АТП)]
    Trino --> RC[(БД РЦ)]
    B --> LLM[LLM API Connector]`
    }
  ]; 
  let searchCache: Record<string, string> = {}; 

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", persistence: "simulated_postgres", caching: "simulated_redis" });
  });

  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const project = req.body;
    projects.push({ ...project, id: Date.now() });
    res.status(201).json({ success: true });
  });

  app.get("/api/portfolio", (req, res) => {
    res.json(finishedProjects);
  });

  app.post("/api/portfolio", (req, res) => {
    const project = req.body;
    finishedProjects.push({ ...project, id: `finished_${Date.now()}` });
    res.status(201).json({ success: true });
  });

  app.delete("/api/portfolio/:id", (req, res) => {
    const { id } = req.params;
    finishedProjects = finishedProjects.filter(p => p.id !== id);
    res.json({ success: true });
  });

  app.get("/api/cache/:query", (req, res) => {
    const { query } = req.params;
    if (searchCache[query]) {
      console.log(`[Redis] Cache Hit for: ${query}`);
      return res.json({ hit: true, data: searchCache[query] });
    }
    res.json({ hit: false });
  });

  app.post("/api/cache", (req, res) => {
    const { query, data } = req.body;
    searchCache[query] = data;
    console.log(`[Redis] Cached new result for: ${query}`);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
