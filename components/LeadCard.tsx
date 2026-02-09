
import React, { useState } from 'react';
import { Lead } from '../types';
import { analyzeLeadOutreach } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const handleAnalyze = async () => {
    sounds.playAnalyze();
    setIsAnalyzing(true);
    try {
      const result = await analyzeLeadOutreach(lead);
      setStrategy(result);
    } catch (error) {
      alert("Falha ao analisar lead.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasCoordinates = typeof lead.latitude === 'number' && typeof lead.longitude === 'number';
  const mapsEmbedUrl = hasCoordinates 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ''}&q=${lead.latitude},${lead.longitude}&zoom=15&language=pt`
    : '';
  const fullMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lead.latitude},${lead.longitude}`
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lead.name}</h3>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">{lead.industry}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          lead.potentialScore > 75 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          Score: {lead.potentialScore}
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
        {lead.description}
      </p>

      <div className="space-y-2 mb-6 text-sm">
        <div className="flex items-center text-slate-500 dark:text-slate-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {lead.location}
        </div>
        <div className="flex items-center text-slate-500 dark:text-slate-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline truncate">
            {lead.website}
          </a>
        </div>
        {lead.email && (
          <div className="flex items-center text-slate-500 dark:text-slate-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12z"/></svg>
            <a href={`mailto:${lead.email}`} className="text-blue-500 dark:text-blue-400 hover:underline truncate">
              {lead.email}
            </a>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center text-slate-500 dark:text-slate-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <a href={`tel:${lead.phone}`} className="text-blue-500 dark:text-blue-400 hover:underline truncate">
              {lead.phone}
            </a>
          </div>
        )}
      </div>

      {hasCoordinates && (
        <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <a href={fullMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${lead.name} no mapa completo`}>
            <iframe
              title={`Mapa de ${lead.name}`}
              width="100%"
              height="200"
              loading="lazy"
              allowFullScreen
              src={mapsEmbedUrl}
              className="border-0"
              style={{ filter: isAnalyzing ? 'grayscale(100%) blur(2px)' : 'none' }}
            ></iframe>
          </a>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
            Clique no mapa para expandir
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-sm py-2 px-4 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 border border-slate-700 dark:border-slate-700"
        >
          {isAnalyzing ? 'Analisando...' : 'Ver Estratégia de IA'}
        </button>
      </div>

      {strategy && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Sugestão de Abordagem:</h4>
          <div className="prose prose-sm text-blue-800 dark:text-blue-400 whitespace-pre-wrap">
            {strategy}
          </div>
          <button 
            onClick={() => setStrategy(null)}
            className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadCard;
