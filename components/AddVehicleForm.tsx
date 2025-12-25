
import React, { useState } from 'react';
import { QueryResult, VehicleStatus } from '../types';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';

interface AddVehicleFormProps {
  onClose: () => void;
  onSuccess: (plate: string) => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onClose, onSuccess }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<QueryResult>>({
    plate: '',
    status: VehicleStatus.REGISTERED,
    owner: {
      fullName: '',
      dob: '',
      address: '',
      postalCode: '',
      city: '',
      driverLicenseNumber: '',
      pointsInFlensburg: 0
    },
    vehicle: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vin: '',
      engineType: 'Benzin',
      lastHU: '',
      insuranceProvider: ''
    },
    incidents: []
  });

  const handleAiAutofill = async () => {
    if (!formData.plate) return;
    setIsAiLoading(true);
    try {
      const aiData = await geminiService.queryLicensePlate(formData.plate);
      // We take everything except the ID and timestamp to keep it "fresh" as a new user entry
      setFormData({
        ...aiData,
        plate: formData.plate.toUpperCase() // Keep the original user-inputted plate formatting if preferred
      });
    } catch (err) {
      alert("KI-Autofill fehlgeschlagen. Bitte manuell eingeben.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: QueryResult = {
      ...formData as QueryResult,
      queryId: "USR-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleString('de-DE')
    };
    
    storageService.addEntry(newEntry);
    onSuccess(newEntry.plate);
    onClose();
  };

  const updateNested = (category: 'owner' | 'vehicle', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="police-gradient px-8 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-white font-bold text-xl uppercase tracking-wider">Neuen Datensatz anlegen</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          {/* Basisdaten */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-blue-100 pb-2 mb-4">Basis-Informationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">KENNZEICHEN</label>
                <input required type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})} placeholder="B-MW 1234" className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none mono" />
              </div>
              <div>
                <button 
                  type="button"
                  onClick={handleAiAutofill}
                  disabled={!formData.plate || isAiLoading}
                  className="w-full h-[42px] px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white text-xs font-bold rounded transition-all flex items-center justify-center shadow-md active:scale-95"
                >
                  {isAiLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      KI-AUTOFILL
                    </>
                  )}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">STATUS</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Halter */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-blue-100 pb-2 mb-4">Halterdaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Vollständiger Name" value={formData.owner?.fullName} onChange={e => updateNested('owner', 'fullName', e.target.value)} className="p-2 border rounded" />
              <input required type="text" placeholder="Geburtsdatum (z.B. 01.01.1990)" value={formData.owner?.dob} onChange={e => updateNested('owner', 'dob', e.target.value)} className="p-2 border rounded" />
              <input required type="text" placeholder="Straße / Hausnummer" value={formData.owner?.address} onChange={e => updateNested('owner', 'address', e.target.value)} className="p-2 border rounded" />
              <div className="grid grid-cols-3 gap-2">
                <input required type="text" placeholder="PLZ" value={formData.owner?.postalCode} onChange={e => updateNested('owner', 'postalCode', e.target.value)} className="p-2 border rounded col-span-1" />
                <input required type="text" placeholder="Ort" value={formData.owner?.city} onChange={e => updateNested('owner', 'city', e.target.value)} className="p-2 border rounded col-span-2" />
              </div>
            </div>
          </section>

          {/* Fahrzeug */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-blue-100 pb-2 mb-4">Fahrzeugdaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Marke (z.B. Audi)" value={formData.vehicle?.make} onChange={e => updateNested('vehicle', 'make', e.target.value)} className="p-2 border rounded" />
              <input required type="text" placeholder="Modell (z.B. A3)" value={formData.vehicle?.model} onChange={e => updateNested('vehicle', 'model', e.target.value)} className="p-2 border rounded" />
              <input required type="text" placeholder="FIN (VIN)" value={formData.vehicle?.vin} onChange={e => updateNested('vehicle', 'vin', e.target.value.toUpperCase())} className="p-2 border rounded mono" />
              <input required type="text" placeholder="Lackierung" value={formData.vehicle?.color} onChange={e => updateNested('vehicle', 'color', e.target.value)} className="p-2 border rounded" />
            </div>
          </section>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors">Abbrechen</button>
            <button type="submit" className="px-8 py-2 bg-blue-900 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all active:scale-95">REGISTRIEREN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
