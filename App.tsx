
import React, { useState, useEffect } from 'react';
import { prospectLeads } from './services/geminiService';
import { Lead, SearchParams } from './types';
import LeadCard from './components/LeadCard';
import { sounds } from './services/soundService';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [params, setParams] = useState<SearchParams>({
    niche: '',
    location: '',
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.niche) return;

    sounds.playSearch();
    setLoading(true);
    setError(null);
    try {
      const result = await prospectLeads(params);
      setLeads(result.leads);
      setSources(result.sources);
      if (result.leads.length > 0) {
        sounds.playSuccess();
      }
    } catch (err: any) {
      setError("Ocorreu um erro ao buscar leads. Verifique sua conexão ou tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    sounds.playToggle(nextDark);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="tech-ring group-hover:opacity-100 transition-opacity"></div>
              <div className="tech-glow"></div>
              <div className="relative w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center z-10 shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">LeadGenius <span className="text-blue-600 dark:text-blue-400 font-medium">AI</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Prospects</a>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-16 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-4">Encontre seus próximos clientes ideais</h2>
          <p className="text-slate-400 text-lg">Use inteligência artificial avançada para prospectar empresas e criar estratégias de vendas em segundos.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="glass-morphism bg-white/10 dark:bg-slate-900/50 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl border border-white/10 dark:border-slate-800">
            <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="Qual nicho você procura?" 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-sm py-2"
                value={params.niche}
                onChange={(e) => setParams({...params, niche: e.target.value})}
              />
            </div>
            <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <input 
                type="text" 
                placeholder="Localização" 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-sm py-2"
                value={params.location}
                onChange={(e) => setParams({...params, location: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Buscando...
                </div>
              ) : 'Prospectar'}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {leads.length > 0 ? `Encontrados ${leads.length} Leads Qualificados` : 'Comece sua busca'}
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && !loading && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    <p className="text-lg font-medium">Nenhum resultado para exibir</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                Fontes de Dados
              </h4>
              <div className="space-y-3">
                {sources.length > 0 ? (
                  sources.map((source, idx) => (
                    <a key={idx} href={source.web?.uri || '#'} target="_blank" className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{source.web?.title || 'Informação de Mercado'}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">As fontes aparecerão aqui após a busca.</p>
                )}
              </div>
            </div>

            <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 dark:shadow-none">
              <h4 className="font-bold mb-2">Dica de Prospecção</h4>
              <p className="text-sm text-blue-50 leading-relaxed">
                Leads com score acima de 80 são prioridade máxima. Use o script de IA para iniciar a conversa com relevância.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>&copy; 2024 LeadGenius AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
