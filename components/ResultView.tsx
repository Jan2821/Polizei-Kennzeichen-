
import React, { useState } from 'react';
import { QueryResult, VehicleStatus } from '../types';
import { generateReportPDF } from '../utils/pdfGenerator';
import { storageService } from '../services/storageService';

interface ResultViewProps {
  data: QueryResult & { dataSource?: 'DB' | 'AI' };
}

const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  const [isSaved, setIsSaved] = useState(false);

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.REGISTERED: return 'bg-green-100 text-green-800 border-green-200';
      case VehicleStatus.STOLEN: return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      case VehicleStatus.EXPIRED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case VehicleStatus.FLAGGED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleSaveToDB = () => {
    storageService.addEntry(data);
    setIsSaved(true);
    // Reset notification after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="police-gradient px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
               <h2 className="text-white text-2xl font-bold flex items-center">
                ABFRAGE-ERGEBNIS: {data.plate}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${data.dataSource === 'DB' ? 'bg-blue-400/30 text-blue-100 border border-blue-200/20' : 'bg-purple-400/30 text-purple-100 border border-purple-200/20'}`}>
                {data.dataSource === 'DB' ? 'Zentralregister' : 'KI-Rekonstruktion'}
              </span>
            </div>
            <p className="text-blue-200 text-sm">ID: {data.queryId} • {data.timestamp}</p>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            {data.dataSource === 'AI' && (
              <button
                onClick={handleSaveToDB}
                disabled={isSaved}
                className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-semibold transition-all flex items-center justify-center border ${
                  isSaved 
                  ? 'bg-green-500/20 text-green-200 border-green-500/30 cursor-default' 
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 active:scale-95'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {isSaved ? "GESPEICHERT" : "IN DB ÜBERNEHMEN"}
              </button>
            )}
            <button
              onClick={() => generateReportPDF(data)}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center backdrop-blur-sm border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF EXPORT
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Status & Owner */}
          <section className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System-Status</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(data.status)}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {data.status.toUpperCase()}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Halterinformationen</h3>
              <div className="space-y-3">
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Vollständiger Name</span>
                  <span className="font-semibold text-slate-900">{data.owner.fullName}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Geburtsdatum</span>
                  <span className="font-semibold text-slate-900">{data.owner.dob}</span>
                </p>
                <div className="pt-1">
                  <span className="text-slate-500 text-sm block">Anschrift</span>
                  <p className="font-semibold text-slate-900">{data.owner.address}</p>
                  <p className="font-semibold text-slate-900">{data.owner.postalCode} {data.owner.city}</p>
                </div>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Führerschein-Nr.</span>
                  <span className="font-semibold text-slate-900">{data.owner.driverLicenseNumber}</span>
                </p>
                <p className="flex justify-between items-center pt-2">
                  <span className="text-slate-500 text-sm">Flensburg Punkte</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${data.owner.pointsInFlensburg > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {data.owner.pointsInFlensburg} PKT
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Vehicle Info */}
          <section className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fahrzeugdaten</h3>
              <div className="space-y-3">
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Marke / Modell</span>
                  <span className="font-semibold text-slate-900">{data.vehicle.make} {data.vehicle.model}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Erstzulassung</span>
                  <span className="font-semibold text-slate-900">{data.vehicle.year}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Lackierung</span>
                  <span className="font-semibold text-slate-900">{data.vehicle.color}</span>
                </p>
                <div className="pt-1 pb-1 border-b border-slate-200">
                  <span className="text-slate-500 text-sm block">FIN (VIN)</span>
                  <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">{data.vehicle.vin}</span>
                </div>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">Antrieb</span>
                  <span className="font-semibold text-slate-900">{data.vehicle.engineType}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm">TÜV / HU fällig</span>
                  <span className="font-semibold text-slate-900">{data.vehicle.lastHU}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Versicherung</span>
                  <span className="text-xs text-slate-600 italic">{data.vehicle.insuranceProvider}</span>
                </p>
              </div>
            </div>

            {/* Incident Summary Mini List */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Eintragungen ({data.incidents.length})</h3>
              <div className="space-y-2">
                {data.incidents.length > 0 ? data.incidents.map((inc, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border-l-4 border-blue-900">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-500">{inc.date}</span>
                      <span className="text-[10px] text-slate-400">{inc.location}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 line-clamp-1">{inc.description}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 italic">Keine polizeilichen Auffälligkeiten bekannt.</p>
                )}
              </div>
            </div>
          </section>
        </div>
        
        {/* Important Notice */}
        <div className="bg-yellow-50 px-8 py-3 border-t border-yellow-100">
          <p className="text-[10px] text-yellow-800 text-center font-semibold">
            STRENG VERTRAULICH - NUR FÜR DEN DIENSTGEBRAUCH. MISSBRAUCH WIRD STRAFRECHTLICH VERFOLGT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
