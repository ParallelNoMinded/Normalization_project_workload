import React, { useState, useMemo } from 'react';
import { 
  ProjectState, 
  SelectedTask 
} from './types';
import { 
  BASE_NORMS, 
  COMPLEXITY_FACTORS, 
  TEAM_MATURITY, 
  DATA_QUALITY, 
  MODEL_AVAILABILITY, 
  RISK_MULTIPLIERS,
  RISK_CRITERIA,
  ROLE_COSTS,
  ROLE_LABELS,
  Role,
  Task
} from './data/norms';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Download, 
  Settings2, 
  AlertTriangle, 
  FileText,
  Users,
  ChevronRight,
  Calculator,
  Search,
  CheckCircle2,
  GitBranch,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import * as XLSX from 'xlsx';
import mermaid from 'mermaid';
import { GoogleGenAI, Type } from "@google/genai";

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#1e3a8a',
    lineColor: '#64748b',
    secondaryColor: '#f8fafc',
    tertiaryColor: '#fff',
    fontFamily: 'Inter'
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const containerId = React.useMemo(() => 'mermaid-' + Math.random().toString(36).substr(2, 9), []);

  React.useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart) return;
      setIsLoading(true);
      try {
        const { svg: renderedSvg } = await mermaid.render(containerId, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Mermaid error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    renderChart();
    return () => { isMounted = false; };
  }, [chart, containerId]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 overflow-auto flex flex-col items-center shadow-lg relative min-h-[300px] justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        className="w-full flex justify-center" 
        style={{ opacity: isLoading ? 0.3 : 1 }}
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </div>
  );
};

const COLORS = ['#141414', '#3E3E3E', '#666666', '#8E8E8E', '#B5B5B5', '#DCDCDC'];

export default function App() {
  const [project, setProject] = useState<ProjectState>({
    name: 'New AI Project',
    client: '',
    context: {
      complexity: 'medium',
      teamMaturity: 'mixed',
      dataQuality: 'good',
      modelAvailability: 'pretrained',
    },
    risks: Object.keys(RISK_MULTIPLIERS).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    scoring: Object.keys(RISK_CRITERIA).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    parallelStreams: 2,
    selectedTasks: [],
    customTasks: [],
    searchCache: {},
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'active' | 'library' | 'summary' | 'diagram' | 'portfolio'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedTask, setMatchedTask] = useState<Task | null>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);

  // --- Portfolio Persistence ---
  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      console.error('Portfolio fetch error:', err);
    }
  };

  React.useEffect(() => {
    fetchPortfolio();
  }, []);

  // --- Backend Persistence (Simulated PostgreSQL) ---
  React.useEffect(() => {
    const saveToBackend = async () => {
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: project.name, tasks: project.selectedTasks })
        });
      } catch (err) {
        console.error('Persistence error:', err);
      }
    };
    if (project.selectedTasks.length > 0) {
      const timer = setTimeout(saveToBackend, 5000);
      return () => clearTimeout(timer);
    }
  }, [project.name, project.selectedTasks]);

  // --- Architecture Logic (C4) ---
  const mermaidChart = useMemo(() => {
    const lines = ['graph TD'];
    
    // Nodes defined by categories
    const selectedCats = new Set(project.selectedTasks.map(t => t.category));
    const allTitlesLower = project.selectedTasks.map(t => t.title.toLowerCase()).join(' ');
    
    // Define logic with specific technology awareness
    lines.push('  subgraph Client[Interface Layer]');
    lines.push('    UI[Frontend / Mobile]');
    lines.push('  end');

    if (selectedCats.has('Development (Backend)') || selectedCats.has('MCP (AI Platform)')) {
      lines.push('  subgraph Logic[Application Services]');
      lines.push('    API[API Gateway / Services]');
      lines.push('    Core[Business Logic / LLM Hub]');
      lines.push('  end');
      lines.push('  UI --> API');
      lines.push('  API --> Core');
    }

    if (allTitlesLower.includes('rag') || allTitlesLower.includes('llm') || allTitlesLower.includes('gpt') || allTitlesLower.includes('gemini')) {
      lines.push('  subgraph AI[AI & Retrieval]');
      lines.push('    MODEL[GenAI Model]');
      lines.push('    EMB[Embedding Engine]');
      lines.push('  end');
      lines.push('  Core --> MODEL');
      lines.push('  Core --> EMB');
    }

    if (selectedCats.has('Data & Memory')) {
      lines.push('  subgraph Storage[Persistence Layer]');
      if (allTitlesLower.includes('postgres') || allTitlesLower.includes('sql') || allTitlesLower.includes('base')) {
        lines.push('    SQL[(SQL Database)]');
        lines.push('    Core --> SQL');
      }
      if (allTitlesLower.includes('qdrant') || allTitlesLower.includes('weaviate') || allTitlesLower.includes('chroma') || allTitlesLower.includes('vector')) {
        lines.push('    VDB[(Vector Database)]');
        lines.push('    Core --> VDB');
      }
      if (allTitlesLower.includes('redis') || allTitlesLower.includes('cache')) {
        lines.push('    RD[(Redis Cache)]');
        lines.push('    Core --> RD');
      }
      lines.push('  end');
    }

    if (selectedCats.has('Infrastructure & DevOps')) {
      lines.push('  subgraph Infra[Infrastructure]');
      lines.push('    K8S[Cloud Environment]');
      lines.push('    CI[CI/CD / Security]');
      lines.push('  end');
      lines.push('  API -.-> K8S');
    }

    return lines.length > 1 ? lines.join('\n') : 'graph TD\n  Empty[Добавьте работы для генерации схемы]';
  }, [project.selectedTasks]);

  // --- AI-Powered Matching ---
  const findSemanticMatch = async (query: string): Promise<string | null> => {
    const systemInstruction = `You are a technical matching engine. Identify the category and primary keyword for the given query.
    Categories: RnD (Исследования), Design (Проектирование), Development (Backend), Development (Frontend), Development (AI/ML Logic), Testing (Тестирование), Infrastructure & DevOps, Deployment (Запуск), MCP (AI Platform).
    Synonym mapping: 
    - "chroma", "weaviate", "qdrant", "milvus", "pinecone" -> Infrastructure & DevOps (Vector Database)
    - "postgresql", "mysql", "mongodb", "clickhouse" -> Infrastructure & DevOps (SQL/NoSQL)
    - "kafka", "rabbitmq" -> Infrastructure & DevOps (Event Streaming)
    - "vllm", "tgi", "ollama", "triton" -> Infrastructure & DevOps (Inference)
    - "wren.ai", "trino" -> RnD (Исследования) (Semantic Layer)
    Example query: "Qdrant" -> { "category": "Infrastructure & DevOps", "keyword": "Vector Database" }
    Return JSON.`;

    try {
      let analysis: { category: string; keyword: string };
      
      // Try Gemini if key is available
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'undefined') {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: query,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                keyword: { type: Type.STRING },
              }
            }
          }
        });
        analysis = JSON.parse(response.text);
      } else {
        // Fallback to Ollama (Local)
        const response = await fetch("http://localhost:11434/api/generate", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "llama3",
            prompt: `${systemInstruction}\n\nQuery: ${query}\n\nReturn only JSON.`,
            stream: false,
            format: "json"
          })
        });
        if (!response.ok) throw new Error('Ollama not available');
        const data = await response.json();
        analysis = JSON.parse(data.response);
      }
      
      const allTasks = [...Object.values(BASE_NORMS).flat(), ...project.customTasks];
      
      return allTasks.find(t => 
        t.title.toLowerCase().includes(analysis.keyword.toLowerCase()) ||
        t.description.toLowerCase().includes(analysis.keyword.toLowerCase()) ||
        (t.category === analysis.category && t.title.toLowerCase().includes(analysis.keyword.toLowerCase()))
      )?.id || null;
    } catch (err) {
      console.error('Semantic match error:', err);
      return null;
    }
  };
  // --- Matching Logic (with Redis-like caching via backend) ---
  const findMatch = async (query: string) => {
    if (!query || query.length < 2) return;
    
    const lowerQuery = query.toLowerCase().trim();

    // 1. Check Server Cache (Redis Simulation)
    try {
      const res = await fetch(`/api/cache/${encodeURIComponent(lowerQuery)}`);
      const cacheResult = await res.json();
      if (cacheResult.hit) {
        const allTasks = [...Object.values(BASE_NORMS).flat(), ...project.customTasks];
        setMatchedTask(allTasks.find(t => t.id === cacheResult.data) || null);
        return;
      }
    } catch (err) {
      console.error('Cache error:', err);
    }
    
    const allTasks = [...Object.values(BASE_NORMS).flat(), ...project.customTasks];
    
    // 2. Exact Title Match
    const exactTitleMatch = allTasks.find(t => t.title.toLowerCase() === lowerQuery);
    if (exactTitleMatch) {
      setMatchedTask(exactTitleMatch);
      return;
    }

    // 3. Fuzzy match
    const fuzzy = allTasks.find(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.category.toLowerCase().includes(lowerQuery)
    );
    
    if (fuzzy) {
      setMatchedTask(fuzzy);
      return;
    }

    // 4. AI Semantic Matching
    const semanticId = await findSemanticMatch(query);
    if (semanticId) {
      const task = allTasks.find(t => t.id === semanticId);
      if (task) {
        setMatchedTask(task);
        fetch('/api/cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: lowerQuery, data: semanticId })
        });
      }
    }
  };

  const allAvailableTasks = useMemo(() => {
    return [...Object.values(BASE_NORMS).flat(), ...project.customTasks];
  }, [project.customTasks]);

  const categories = useMemo(() => {
    const cats = new Set(allAvailableTasks.map(t => t.category));
    return ['All', ...Array.from(cats)].sort();
  }, [allAvailableTasks]);

  const categorizedTasks = useMemo(() => {
    const filtered = allAvailableTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const groups: Record<string, Task[]> = {};
    filtered.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [allAvailableTasks, searchQuery, selectedCategory]);

  // --- Calculations ---
  const multiplierInfo = useMemo(() => {
    const base = 
      COMPLEXITY_FACTORS[project.context.complexity].multiplier *
      TEAM_MATURITY[project.context.teamMaturity].multiplier *
      DATA_QUALITY[project.context.dataQuality].multiplier *
      MODEL_AVAILABILITY[project.context.modelAvailability].multiplier;

    const riskBufferPercent = Object.entries(project.risks)
      .filter(([_, active]) => active)
      .reduce((sum, [key, _]) => sum + (RISK_MULTIPLIERS[key as keyof typeof RISK_MULTIPLIERS] || 0), 0);

    const scoringBufferPercent = Object.entries(project.scoring)
      .filter(([_, active]) => !active)
      .reduce((sum, [key, _]) => sum + (RISK_CRITERIA[key].multiplier || 0), 0);

    return {
      baseMultiplier: base,
      riskMultiplier: 1 + riskBufferPercent + scoringBufferPercent,
      totalMultiplier: base * (1 + riskBufferPercent + scoringBufferPercent),
      riskBufferPercent: riskBufferPercent + scoringBufferPercent
    };
  }, [project.context, project.risks, project.scoring]);

  const taskEstimates = useMemo(() => {
    return project.selectedTasks.map(task => {
      const constraintHours = (task.appliedConstraints || []).reduce((sum, cid) => {
        const c = task.constraints?.find(x => x.id === cid);
        return sum + (c?.adjustment || 0);
      }, 0);
      
      const adjustedHours = (task.baseHours + constraintHours) * multiplierInfo.totalMultiplier * task.quantity;
      const cost = adjustedHours * ROLE_COSTS[task.assignedRole];
      return {
        ...task,
        adjustedHours,
        cost
      };
    });
  }, [project.selectedTasks, multiplierInfo]);

  const summary = useMemo(() => {
    const totalHours = taskEstimates.reduce((sum, t) => sum + t.adjustedHours, 0);
    const totalCost = taskEstimates.reduce((sum, t) => sum + t.cost, 0);
    
    // Distribution by category
    const byCategory = taskEstimates.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.adjustedHours;
      return acc;
    }, {} as Record<string, number>);

    // Distribution by role
    const byRole = taskEstimates.reduce((acc, t) => {
      const label = ROLE_LABELS[t.assignedRole] || t.assignedRole;
      acc[label] = (acc[label] || 0) + t.adjustedHours;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHours,
      totalCost,
      totalDays: totalHours / 8,
      totalWeeks: (totalHours / 40) / project.parallelStreams,
      totalMonths: (totalHours / 160) / project.parallelStreams,
      byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      byRole: Object.entries(byRole).map(([name, value]) => ({ name, value }))
    };
  }, [taskEstimates, project.parallelStreams]);

  // --- Handlers ---
  const addTask = (task: Task, userQuery?: string) => {
    const newTask: SelectedTask = {
      ...task,
      instanceId: Math.random().toString(36).substr(2, 9),
      quantity: 1,
      assignedRole: task.defaultRole,
      appliedConstraints: [],
      userFormulation: userQuery
    };

    setProject(prev => {
      const newCache = userQuery ? { ...prev.searchCache, [userQuery.toLowerCase()]: task.id } : prev.searchCache;
      
      // Update Server Cache (Redis Simulation)
      if (userQuery) {
        fetch('/api/cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userQuery.toLowerCase(), data: task.id })
        });
      }

      return {
        ...prev,
        selectedTasks: [...prev.selectedTasks, newTask],
        searchCache: newCache
      };
    });
    setSearchQuery('');
    setMatchedTask(null);
  };

  const addCustomTask = (taskData: Omit<Task, 'id'>) => {
    const newId = `custom_${Date.now()}`;
    const newTask: Task = { ...taskData, id: newId };
    const query = searchQuery.toLowerCase().trim();
    
    // Sync with Server Cache (Redis Simulation)
    if (query) {
      fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, data: newId })
      });
    }

    setProject(prev => ({
      ...prev,
      customTasks: [...prev.customTasks, newTask],
      searchCache: query ? { ...prev.searchCache, [query]: newId } : prev.searchCache,
      selectedTasks: [...prev.selectedTasks, {
        ...newTask,
        instanceId: Math.random().toString(36).substr(2, 9),
        quantity: 1,
        assignedRole: newTask.defaultRole,
        appliedConstraints: [],
        userFormulation: searchQuery
      }]
    }));
    
    setSearchQuery('');
    setMatchedTask(newTask); // Highlight the new task
  };

  const removeTask = (instanceId: string) => {
    setProject(prev => ({
      ...prev,
      selectedTasks: prev.selectedTasks.filter(t => t.instanceId !== instanceId)
    }));
  };

  const updateTask = (instanceId: string, updates: Partial<SelectedTask>) => {
    setProject(prev => ({
      ...prev,
      selectedTasks: prev.selectedTasks.map(t => t.instanceId === instanceId ? { ...t, ...updates } : t)
    }));
  };

  const saveToPortfolio = async () => {
    try {
      const projectData = {
        name: project.name,
        client: project.client,
        tasks: project.selectedTasks,
        estimates: taskEstimates,
        summary: summary,
        chart: mermaidChart,
        date: new Date().toISOString()
      };
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        alert('Проект успешно сохранен в портфолио!');
        fetchPortfolio();
      }
    } catch (err) {
      console.error('Portfolio save error:', err);
    }
  };

  const exportToExcel = () => {
    const worksheetData = taskEstimates.map(t => ({
      'Категория': t.category,
      'Работа': t.title,
      'Базовые часы': t.baseHours,
      'Количество': t.quantity,
      'Роль': t.assignedRole,
      'Итоговые часы': t.adjustedHours.toFixed(1),
      'Стоимость (RUB)': t.cost.toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Оценка AI");
    
    // Add summary
    const summaryData = [
      { 'Показатель': 'Итого часов', 'Значение': summary.totalHours.toFixed(1) },
      { 'Показатель': 'Итого стоимость', 'Значение': summary.totalCost.toLocaleString() },
      { 'Показатель': 'Итого дней', 'Значение': summary.totalDays.toFixed(1) },
      { 'Показатель': 'Срок (мес)', 'Значение': summary.totalMonths.toFixed(1) },
      { 'Показатель': 'Коэф. сложности', 'Значение': multiplierInfo.totalMultiplier.toFixed(2) }
    ];
    const wsSum = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSum, "Итого");

    XLSX.writeFile(wb, `${project.name.replace(/\s+/g, '_')}_оценка.xlsx`);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F5F5F5] font-sans text-[#141414] selection:bg-[#141414] selection:text-white">
      {/* Header */}
      <header id="header" className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">AI Architect <span className="text-blue-600">Metric</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="export-btn"
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white text-xs uppercase tracking-widest font-bold rounded hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Экспорт КП
          </button>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Config & Filters */}
        <aside id="sidebar" className="lg:col-span-3 space-y-8 bg-slate-50 p-6 border-r border-slate-200 -mt-6 -ml-6 min-h-screen">
          <section id="project-info" className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Параметры проекта</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Название проекта</label>
                <input 
                  type="text"
                  placeholder="Введите название..."
                  value={project.name}
                  onChange={e => setProject({...project, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:border-blue-500 focus:outline-none placeholder:opacity-30 shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Заказчик</label>
                <input 
                  type="text"
                  placeholder="Наименование компании..."
                  value={project.client}
                  onChange={e => setProject({...project, client: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:border-blue-500 focus:outline-none placeholder:opacity-30 shadow-sm"
                />
              </div>
            </div>
          </section>

          <section id="multipliers" className="space-y-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-sans">Глобальные факторы</h2>
            
            <div className="space-y-4">
              {[
                { label: 'Сложность системы', key: 'complexity', options: COMPLEXITY_FACTORS },
                { label: 'Зрелость команды', key: 'teamMaturity', options: TEAM_MATURITY },
                { label: 'Качество данных', key: 'dataQuality', options: DATA_QUALITY },
                { label: 'Стратегия Моделей', key: 'modelAvailability', options: MODEL_AVAILABILITY },
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">{field.label}</label>
                  <select 
                    value={project.context[field.key as keyof typeof project.context]}
                    onChange={e => setProject({...project, context: {...project.context, [field.key]: e.target.value as any}})}
                    className="w-full bg-white border border-slate-200 p-2 text-sm rounded appearance-none cursor-pointer focus:border-blue-500 shadow-sm text-slate-700"
                  >
                    {Object.entries(field.options).map(([key, val]) => (
                      <option key={key} value={key}>{val.label} (×{val.multiplier})</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section id="risk-assessment" className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Буферы рисков</h2>
            <div className="space-y-1">
              {Object.entries(RISK_MULTIPLIERS).map(([risk, multiplier]) => (
                <label key={risk} className="flex items-center gap-2 text-[10px] cursor-pointer group text-slate-600 hover:text-blue-600 transition-colors">
                  <input 
                    type="checkbox"
                    checked={project.risks[risk]}
                    onChange={() => setProject(prev => ({
                      ...prev,
                      risks: { ...prev.risks, [risk]: !prev.risks[risk] }
                    }))}
                    className="accent-blue-600 w-3 h-3"
                  />
                  <span>
                    {risk} <span className="text-slate-400 font-mono">+{multiplier * 100}%</span>
                  </span>
                </label>
              ))}
            </div>

            <h2 className="text-[11px] font-medium tracking-widest text-[#666] uppercase italic serif flex items-center gap-2 pt-2 border-t border-black/5">
              <CheckCircle2 className="w-3 h-3" />
              Критерии готовности (DoR)
            </h2>
            <div className="space-y-1">
              {Object.entries(RISK_CRITERIA).map(([key, val]) => (
                <label key={key} className="flex items-start gap-2 text-[10px] cursor-pointer group text-balance">
                  <input 
                    type="checkbox"
                    checked={project.scoring[key]}
                    onChange={() => setProject(prev => ({
                      ...prev,
                      scoring: { ...prev.scoring, [key]: !prev.scoring[key] }
                    }))}
                    className="accent-[#141414] mt-0.5 w-3 h-3 shrink-0"
                  />
                  <span className={cn(project.scoring[key] ? "text-green-600 font-bold" : "text-[#888]")}>
                    {val.description}
                  </span>
                </label>
              ))}
              {!Object.values(project.scoring).every(v => v) && (
                <div className="text-[9px] text-red-500 font-bold mt-1 uppercase">
                  Отсутствие критериев увеличивает риски
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-black/5">
              <div className="flex justify-between text-[10px] uppercase font-bold text-[#888]">
                <span>Параллельные потоки</span>
                <span className="text-black">{project.parallelStreams}</span>
              </div>
              <input 
                type="range"
                min="1"
                max="5"
                step="1"
                value={project.parallelStreams}
                onChange={e => setProject({...project, parallelStreams: parseInt(e.target.value)})}
                className="w-full accent-[#141414] h-1 bg-[#ddd] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[9px] text-[#aaa] italic">Влияет на календарный план.</p>
            </div>
          </section>

          <div id="multiplier-badge" className="mt-auto border-t border-slate-200 pt-6">
            <div className="bg-slate-800 text-white p-4 rounded-lg shadow-xl space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-2 uppercase font-black tracking-widest">Итоговый множитель риска</div>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold text-amber-400">×{multiplierInfo.totalMultiplier.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 italic">С учетом всех факторов</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-700">
                <div className="flex justify-between text-[9px] uppercase font-medium text-slate-400">
                  <span>Сложность ({project.context.complexity})</span>
                  <span className="text-slate-200">×{COMPLEXITY_FACTORS[project.context.complexity].multiplier}</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-medium text-slate-400">
                  <span>Команда ({project.context.teamMaturity})</span>
                  <span className="text-slate-200">×{TEAM_MATURITY[project.context.teamMaturity].multiplier}</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-medium text-slate-400">
                  <span>Данные ({project.context.dataQuality})</span>
                  <span className="text-slate-200">×{DATA_QUALITY[project.context.dataQuality].multiplier}</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-medium text-slate-400">
                  <span>Модель ({project.context.modelAvailability})</span>
                  <span className="text-slate-200">×{MODEL_AVAILABILITY[project.context.modelAvailability].multiplier}</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-bold text-slate-400 pt-1 border-t border-slate-700/50">
                  <span>Базовый буфер (DoR/Risks)</span>
                  <span className="text-slate-200">×{multiplierInfo.riskMultiplier.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                 <div 
                  className="bg-amber-400 h-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, (multiplierInfo.totalMultiplier / 4) * 100)}%` }} 
                 />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Execution */}
        <section id="execution-area" className="lg:col-span-9 space-y-8">
          
          {/* Tabs */}
          <nav id="tabs" className="flex border-b border-slate-200">
            {[
              { id: 'catalog', label: 'Каталог работ', icon: Search },
              { id: 'active', label: `План проекта (${project.selectedTasks.length})`, icon: LayoutDashboard },
              { id: 'diagram', label: 'Архитектура (C4)', icon: GitBranch },
              { id: 'portfolio', label: 'Готовые проекты', icon: FileText },
              { id: 'library', label: 'Библиотека', icon: Settings2 },
              { id: 'summary', label: 'Коммерческое предложение', icon: BarChart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2",
                  activeTab === tab.id 
                    ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                    : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && (
              <motion.div 
                key="catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div id="smart-search" className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-4 bg-white border border-[#141414] px-4 py-3 shadow-[4px_4px_0px_#141414]">
                      <Search className="w-5 h-5 opacity-40" />
                      <input 
                        type="text"
                        placeholder="Поиск или ввод новой работы..."
                        value={searchQuery}
                        onChange={async (e) => {
                          const q = e.target.value;
                          setSearchQuery(q);
                          await findMatch(q);
                        }}
                        className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                      />
                    </div>
                    
                    <div className="md:w-64 flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      <select 
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="flex-1 bg-transparent border-none text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {searchQuery && matchedTask && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border border-blue-600 p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-blue-600 tracking-widest mb-1">Найдено совпадение</h4>
                            <h3 className="text-sm font-bold">{matchedTask.title}</h3>
                            <p className="text-[11px] text-[#555]">{matchedTask.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">{matchedTask.baseHours}ч</span>
                            <div className="text-[9px] uppercase font-bold text-[#888]">{matchedTask.defaultRole}</div>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 p-2 rounded text-[10px] italic flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span>Результат: {matchedTask.resultImage}</span>
                        </div>

                        {matchedTask.constraints && matchedTask.constraints.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="text-[9px] uppercase font-bold text-[#666]">Возможные ограничения:</h5>
                            <div className="flex flex-wrap gap-2">
                              {matchedTask.constraints.map(c => (
                                <span key={c.id} className="px-2 py-0.5 bg-white border border-[#141414]/10 rounded-full text-[9px]">
                                  {c.label} ({c.adjustment > 0 ? '+' : ''}{c.adjustment}ч)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => addTask(matchedTask, searchQuery)}
                            className="flex-1 bg-blue-600 text-white py-2 text-xs uppercase font-bold tracking-widest hover:bg-blue-700"
                          >
                            Принять и добавить в проект
                          </button>
                          <button 
                            onClick={() => setMatchedTask(null)}
                            className="px-4 py-2 border border-blue-600 text-blue-600 text-xs uppercase font-bold tracking-widest hover:bg-blue-100"
                          >
                            Отклонить
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {searchQuery && !matchedTask && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white border border-red-200 p-6 space-y-4 shadow-[4px_4px_0px_#fee2e2]"
                      >
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <h3 className="text-xs uppercase font-black tracking-widest">Не найдено. Опишите новую работу:</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400">Категория</label>
                            <select id="new-cat" className="w-full border-b border-slate-300 py-1 text-xs focus:outline-none bg-transparent">
                              {categories.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="Other">Другое...</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold">Базовые часы (макс 16ч)</label>
                            <input id="new-hours" type="number" max="16" className="w-full border-b border-[#141414] py-1 text-xs focus:outline-none" />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[9px] uppercase font-bold">Ожидаемый результат (Что будет сделано?)</label>
                            <input id="new-result" type="text" placeholder="например, Docker-compose с активными сервисами" className="w-full border-b border-[#141414] py-1 text-xs focus:outline-none" />
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const cat = (document.getElementById('new-cat') as HTMLInputElement).value || 'Custom';
                            const hours = parseInt((document.getElementById('new-hours') as HTMLInputElement).value) || 8;
                            const result = (document.getElementById('new-result') as HTMLInputElement).value || 'Task done';
                            addCustomTask({
                              title: searchQuery,
                              category: cat,
                              description: 'Пользовательская задача',
                              baseHours: Math.min(16, hours),
                              defaultRole: 'Development',
                              resultImage: result,
                              constraints: []
                            });
                          }}
                          className="w-full bg-[#141414] text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-[#333]"
                        >
                          Создать и сохранить в кэш
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categorizedTasks).map(([cat, tasks]) => {
                    return (
                      <div key={cat} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{cat}</span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{tasks.length} UNITS</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {tasks.map(task => (
                            <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 group transition-colors">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{task.title}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{task.baseHours}h</span>
                                  <span className="text-[10px] uppercase font-bold text-slate-400">{task.defaultRole}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => addTask(task)}
                                className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-lg transition-all transform hover:bg-blue-700 active:scale-90"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {project.selectedTasks.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 p-20 text-center space-y-4 rounded-xl">
                    <p className="text-slate-400 italic">No tasks selected for this project yet.</p>
                    <button onClick={() => setActiveTab('catalog')} className="text-xs uppercase underline tracking-widest font-bold text-blue-600">Go to Catalog</button>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                          <th className="px-4 py-4 w-1/3">Вид работ / Описание</th>
                          <th className="px-4 py-4">Исполнитель</th>
                          <th className="px-4 py-4">База</th>
                          <th className="px-4 py-4">Кол-во</th>
                          <th className="px-4 py-4">Итого</th>
                          <th className="px-4 py-4 text-right">Оценка (₽)</th>
                          <th className="px-4 py-4 text-center">Действие</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {taskEstimates.map(task => (
                          <tr key={task.instanceId} className="group hover:bg-[#fcfcfc] transition-colors leading-tight">
                            <td className="px-4 py-3">
                              <div className="font-bold text-sm tracking-tight text-slate-800">{task.title}</div>
                              {task.userFormulation && (
                                <div className="text-[9px] text-blue-600 font-bold italic opacity-70">Запрос: "{task.userFormulation}"</div>
                              )}
                              <div className="text-[9px] text-[#aaa] font-mono uppercase tracking-tighter mt-0.5">{task.category}</div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {task.constraints?.map(c => (
                                  <button 
                                    key={c.id}
                                    onClick={() => {
                                      const active = task.appliedConstraints.includes(c.id);
                                      updateTask(task.instanceId, {
                                        appliedConstraints: active 
                                          ? task.appliedConstraints.filter(id => id !== c.id)
                                          : [...task.appliedConstraints, c.id]
                                      });
                                    }}
                                    className={cn(
                                      "px-1.5 py-0.5 text-[8px] uppercase font-bold border rounded transition-all",
                                      task.appliedConstraints.includes(c.id)
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-500"
                                    )}
                                  >
                                    {c.label} ({c.adjustment > 0 ? '+' : ''}{c.adjustment}ч)
                                  </button>
                                ))}
                              </div>
                              <div className="mt-2 flex items-center gap-1.5 text-[8px] text-[#888] font-bold uppercase tracking-wider bg-slate-50 p-1 rounded-sm w-fit border border-slate-100">
                                <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                                <span>Результат: {task.resultImage}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={task.assignedRole}
                                onChange={e => updateTask(task.instanceId, { assignedRole: e.target.value as Role })}
                                className="bg-transparent border-none text-[11px] uppercase font-bold focus:ring-0 w-full cursor-pointer"
                              >
                                {Object.keys(ROLE_COSTS).map(role => (
                                  <option key={role} value={role}>{ROLE_LABELS[role as Role] || role}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number" 
                                value={task.baseHours}
                                onChange={e => updateTask(task.instanceId, { baseHours: parseInt(e.target.value) || 0 })}
                                className="w-12 bg-white border border-slate-200 p-1 text-xs font-mono text-center focus:border-blue-500 outline-none rounded shadow-inner"
                              />
                              <span className="text-[10px] text-slate-400 ml-1">ч</span>
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number" 
                                value={task.quantity}
                                onChange={e => updateTask(task.instanceId, { quantity: parseInt(e.target.value) || 1 })}
                                className="w-12 bg-white border border-[#eee] p-1 text-xs font-mono text-center focus:border-[#141414] outline-none rounded"
                              />
                            </td>
                            <td className="px-4 py-3 font-mono text-xs font-bold">
                              {task.adjustedHours.toFixed(1)}ч
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs">
                              {Math.round(task.cost).toLocaleString()} ₽
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button onClick={() => removeTask(task.instanceId)} className="p-1 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'diagram' && (
              <motion.div 
                key="diagram"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <header className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Архитектурная схема проекта</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Визуализация на основе выбранных компонентов (C4 Model / Mermaid)</p>
                    </div>
                    <Network className="w-10 h-10 text-blue-600 opacity-20" />
                  </header>

                  {project.selectedTasks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-lg">
                      <p className="text-slate-400 italic">Добавьте работы в план проекта, чтобы сформировать архитектуру.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <Mermaid chart={mermaidChart} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Технологический стек</h4>
                          <ul className="text-xs space-y-1 text-slate-700">
                            {Array.from(new Set(project.selectedTasks.map(t => t.category))).map(cat => (
                              <li key={cat} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {cat}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                          <h4 className="text-[10px] font-black uppercase text-amber-500 mb-2">Зависимости</h4>
                          <p className="text-[11px] text-amber-800 italic leading-relaxed">
                            Схема автоматически построена на основе выбранных этапов: {project.selectedTasks.length} ед. работ. 
                            Учитываются связи между API, Логикой и Инфраструктурой.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div 
                key="library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Полная библиотека работ</h3>
                  <div className="space-y-8">
                    {Object.entries(BASE_NORMS).map(([cat, tasks]) => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100 pb-1">{cat}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tasks.map(t => (
                            <div key={t.id} className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 transition-colors bg-slate-50/30">
                              <div className="font-bold text-xs">{t.title}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{t.description}</div>
                              <div className="flex justify-between items-center mt-2 group">
                                <span className="text-[10px] font-mono font-bold text-blue-600">{t.baseHours}ч</span>
                                <span className="text-[9px] text-slate-400 group-hover:text-slate-600 transition-colors">{t.defaultRole}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {project.customTasks.length > 0 && (
                      <div className="space-y-3 pt-6 border-t border-slate-100">
                        <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-widest border-b border-amber-100 pb-1">Пользовательские работы (Кэш)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.customTasks.map(t => (
                            <div key={t.id} className="p-3 border border-amber-100 rounded-lg bg-amber-50/10">
                              <div className="font-bold text-xs">{t.title}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{t.category}</div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] font-mono font-bold text-amber-600">{t.baseHours}ч</span>
                                <button 
                                  onClick={() => setProject(prev => ({
                                    ...prev,
                                    customTasks: prev.customTasks.filter(ct => ct.id !== t.id)
                                  }))}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'portfolio' && (
              <motion.div 
                key="portfolio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Архив завершенных проектов</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
                    Найдено: {portfolio.length}
                  </p>
                </div>
                
                {portfolio.length === 0 ? (
                  <div className="bg-white p-12 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-4">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="font-bold text-slate-600">Портфолио пусто</h3>
                      <p className="text-sm text-slate-400">Сохраняйте готовые КП, чтобы они появились здесь.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {portfolio.map((p: any) => (
                      <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                            <p className="text-sm text-slate-500">{p.client} • {new Date(p.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-blue-600">{p.summary.totalCost.toLocaleString()} ₽</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{p.summary.totalHours.toFixed(0)} часов</div>
                          </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Архитектура решения</h4>
                            <Mermaid chart={p.chart} />
                          </div>
                          <div className="space-y-6">
                             <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Состав работ</h4>
                                <div className="space-y-2 max-h-[300px] overflow-auto pr-2">
                                  {p.tasks.map((t: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                                      <span className="font-medium text-slate-700">{t.title}</span>
                                      <span className="text-slate-400">{t.baseHours}ч</span>
                                    </div>
                                  ))}
                                </div>
                             </div>
                             <div className="flex gap-4">
                                <button 
                                  onClick={async () => {
                                    if (confirm('Удалить проект из портфолио?')) {
                                      await fetch(`/api/portfolio/${p.id}`, { method: 'DELETE' });
                                      fetchPortfolio();
                                    }
                                  }}
                                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" /> Удалить
                                </button>
                                <button 
                                  className="flex-1 px-4 py-2 bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                >
                                  <Download className="w-4 h-4" /> Скачать CP
                                </button>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'summary' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 pb-12"
              >
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold">Коммерческое предложение</h2>
                   <div className="flex gap-4">
                      <button 
                         onClick={saveToPortfolio}
                         className="flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 text-xs uppercase tracking-widest font-bold rounded hover:bg-blue-50 transition-all"
                      >
                        <FileText className="w-4 h-4" /> В архив
                      </button>
                      <button 
                         onClick={exportToExcel}
                         className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-xs uppercase tracking-widest font-bold rounded hover:bg-blue-700 transition-all shadow-lg"
                      >
                        <Download className="w-4 h-4" /> Скачать Excel
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Calculator className="w-24 h-24" />
                      </div>
                      <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-white/10 pb-2">Итоговая смета</h3>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Бюджет проекта (ФОТ)</p>
                        <p className="text-5xl font-black text-white">{summary.totalCost.toLocaleString()} <span className="text-xl font-normal text-slate-500">₽</span></p>
                      </div>
                      <div className="flex gap-8 border-t border-white/10 pt-6">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Трудозатраты</p>
                          <p className="text-2xl font-bold text-white">{summary.totalHours.toFixed(0)} <span className="text-sm font-normal text-slate-500">ч/час</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Срок (прогноз)</p>
                          <p className="text-2xl font-bold text-white">~{summary.totalWeeks.toFixed(1)} <span className="text-sm font-normal text-slate-500">нед.</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex-1">Детализация расчета коэффициента</h3>
                      </div>
                      <div className="space-y-3 font-mono text-[11px]">
                         <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span className="text-slate-500">Множитель среды (Base/Team/Data/Model):</span>
                            <span className="font-bold text-slate-800">×{multiplierInfo.baseMultiplier.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between p-2">
                            <span className="text-slate-500">Добавочный риск (Риски + Unmet DoR):</span>
                            <span className="text-red-500">+{((multiplierInfo.riskMultiplier - 1) * 100).toFixed(0)}% к базе</span>
                         </div>
                         <div className="p-2 border-t border-slate-100 mt-2">
                             <p className="text-[9px] text-slate-400 italic mb-2">* По умолчанию Добавочный риск составляет 1.80 (80%), если не отмечены критерии Definition of Ready (DoR) в левой панели. Каждый отмеченный пункт снижает этот риск.</p>
                         </div>
                         <div className="flex justify-between p-2 bg-blue-50 rounded border-t-2 border-blue-200 font-bold">
                            <span className="text-blue-800">Итоговый коэффициент:</span>
                            <span className="text-blue-900">×{multiplierInfo.totalMultiplier.toFixed(2)}</span>
                         </div>
                         <div className="pt-4 text-[9px] text-slate-400 leading-tight">
                            * Формула: Environment_Multiplier × (1 + Risk_Buffer + DoR_Buffer)
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Архитектура решения (C4 Level 2)</h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Mermaid chart={mermaidChart} />
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Распределение ресурсов по ролям</h3>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={summary.byRole} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={120} fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer id="footer" className="p-8 mt-12 border-t border-[#141414]/10 text-center">
        <p className="text-[10px] text-[#aaa] font-black uppercase tracking-widest">
          Система оценки и нормирования работ © 2026 Architect Tools
        </p>
      </footer>
    </div>
  );
}
