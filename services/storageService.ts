
import { QueryResult } from "../types";
import { MOCK_DATABASE } from "./mockDatabase";

const STORAGE_KEY = 'polizei_zf_database';

export const storageService = {
  getDatabase: (): QueryResult[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialisierung mit Standardwerten
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATABASE));
      return MOCK_DATABASE;
    }
    return JSON.parse(stored);
  },

  addEntry: (entry: QueryResult): void => {
    const db = storageService.getDatabase();
    // Verhindere Duplikate (nach Kennzeichen normalisiert)
    const filteredDb = db.filter(e => 
      e.plate.replace(/\s|-/g, '').toUpperCase() !== entry.plate.replace(/\s|-/g, '').toUpperCase()
    );
    const updatedDb = [entry, ...filteredDb];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDb));
  },

  findEntry: (plate: string): QueryResult | undefined => {
    const db = storageService.getDatabase();
    const search = plate.replace(/\s|-/g, '').toUpperCase();
    return db.find(e => e.plate.replace(/\s|-/g, '').toUpperCase() === search);
  }
};
