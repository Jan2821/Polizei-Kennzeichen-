
import React, { useState } from 'react';

interface PlateInputProps {
  onSearch: (plate: string) => void;
  isLoading: boolean;
}

const PlateInput: React.FC<PlateInputProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.toUpperCase().trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Kennzeichen eingeben
            </label>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 w-8 h-12 rounded flex flex-col items-center justify-center text-white font-bold text-xs">
                <span>D</span>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="B-MW 1234"
                className="w-full text-4xl font-bold tracking-[0.2em] uppercase p-2 border-b-4 border-slate-800 focus:outline-none focus:border-blue-600 bg-transparent mono"
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="h-16 px-8 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold rounded-lg transition-all flex items-center shadow-md active:scale-95"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "ABFRAGE"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlateInput;
