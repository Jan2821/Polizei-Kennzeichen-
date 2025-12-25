
import React, { useState, useCallback, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { QueryResult } from './types';
import PlateInput from './components/PlateInput';
import ResultView from './components/ResultView';
import AddVehicleForm from './components/AddVehicleForm';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [result, setResult] = useState<(QueryResult & { dataSource?: 'DB' | 'AI' }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Initialisiere DB beim Start und prüfe Config
  useEffect(() => {
    storageService.getDatabase();
    if (!process.env.API_KEY) {
      setHasApiKey(false);
    }
  }, []);

  const handleSearch = useCallback(async (plate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await geminiService.queryLicensePlate(plate);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Fehler bei der Datenbankabfrage. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="police-gradient py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">ZF-ABFRAGESYSTEM</h1>
              <p className="text-blue-200 text-[10px] tracking-widest uppercase">Zentrales Fahrzeugregister • Bundespolizei</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <button 
               onClick={() => setShowAddForm(true)}
               className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded border border-green-400/50 transition-colors flex items-center shadow-lg"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
               </svg>
               NEUER EINTRAG
             </button>
             <div className="hidden md:flex items-center space-x-4 border-l border-blue-400/30 pl-6">
                <span className="text-blue-100 text-sm font-medium">Dienststelle S-01</span>
                <div className="h-8 w-8 bg-blue-700 rounded-full border border-blue-400 flex items-center justify-center text-white text-xs font-bold">DS</div>
             </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {!hasApiKey && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center text-amber-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium">
              <strong>Vercel Hinweis:</strong> Der API_KEY ist nicht gesetzt. KI-Funktionen sind deaktiviert. 
              Bitte füge <code>API_KEY</code> in deinen Vercel Project Settings hinzu.
            </p>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {!result && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4">
                Zentrales Kennzeichen-Auskunftssystem
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Autorisierter Zugriff auf das Halterverzeichnis und polizeiliche Vorgangsdaten. 
                Geben Sie ein Kennzeichen ein oder legen Sie einen neuen Datensatz an.
              </p>
            </div>
          )}

          <PlateInput onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center shadow-sm">
              <span className="font-bold block mb-1">SYSTEMFEHLER</span>
              {error}
            </div>
          )}

          {result && <ResultView data={result} />}
        </div>
      </main>

      {showAddForm && (
        <AddVehicleForm 
          onClose={() => setShowAddForm(false)} 
          onSuccess={(plate) => handleSearch(plate)} 
        />
      )}

      {/* Status Bar */}
      <footer className="bg-slate-200 py-2 px-6 border-t border-slate-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-slate-500 font-medium">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              LOKALER SPEICHER AKTIV
            </span>
            <span className="flex items-center">
              <span className={`w-2 h-2 ${hasApiKey ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></span>
              KI-SCAN MODUL {hasApiKey ? 'BEREIT' : 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-900 text-white px-1 rounded uppercase">Vercel Ready</span>
            <span>VERS: 4.8.0-CLOUD | © BUNDESPOLIZEI DATENZENTRUM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
