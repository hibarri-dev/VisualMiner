import { useState } from 'react'
import { 
  Boxes, 
  Sparkles, 
  Cpu, 
  Database, 
  BarChart3, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function App() {
  const [count, setCount] = useState(0)

  const features = [
    {
      icon: Cpu,
      title: 'Real-Time Mining Analytics',
      desc: 'Live telemetry and high-precision visual graphs for smart data extraction.'
    },
    {
      icon: Database,
      title: 'Dynamic Data Indexing',
      desc: 'Seamless ingestion and visual querying across distributed datasets.'
    },
    {
      icon: BarChart3,
      title: 'Visual Insights Dashboard',
      desc: 'Interactive UI components styled with Tailwind CSS for instant clarity.'
    },
    {
      icon: Layers,
      title: 'Modular Architecture',
      desc: 'Fast, lightweight React + Vite setup ready for scalable feature development.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              VisualMiner
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tailwind CSS Configured
            </span>
            <button
              onClick={() => setCount(prev => prev + 1)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Counter: {count}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>React (JavaScript) + Vite + Tailwind CSS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              VisualMiner
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Your high-performance visual mining & analytics workspace is ready. Build intelligent workflows, data visualizations, and interactive dashboards with speed.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCount(prev => prev + 1)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore VisualMiner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm font-mono flex items-center gap-2">
              <span className="text-indigo-400">$</span>
              <span>npm run dev</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-100 text-base mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center text-xs text-indigo-400 font-medium gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to develop
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        VisualMiner &copy; {new Date().getFullYear()} &bull; React + Tailwind CSS + Vite
      </footer>
    </div>
  )
}
