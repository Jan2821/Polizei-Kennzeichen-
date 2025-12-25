
import { GoogleGenAI, Type } from "@google/genai";
import { QueryResult, VehicleStatus } from "../types";
import { storageService } from "./storageService";

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY ist nicht konfiguriert. Bitte in den Vercel Environment Variables setzen.");
    }
    return new GoogleGenAI({ apiKey });
  }

  async queryLicensePlate(plate: string): Promise<QueryResult & { dataSource: 'DB' | 'AI' }> {
    const formattedPlate = plate.toUpperCase().trim();
    
    // 1. Check persistent database
    const localMatch = storageService.findEntry(formattedPlate);

    if (localMatch) {
      return {
        ...localMatch,
        dataSource: 'DB',
        timestamp: new Date().toLocaleString('de-DE')
      };
    }

    // 2. Fallback to Gemini
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed police vehicle registry report for the German license plate: "${formattedPlate}". 
      The data must look realistic and include an owner, vehicle specs, and history. 
      IMPORTANT: This plate was NOT found in the central registry. Use German language for the content.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plate: { type: Type.STRING },
            status: { type: Type.STRING, enum: Object.values(VehicleStatus) },
            owner: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                dob: { type: Type.STRING },
                address: { type: Type.STRING },
                postalCode: { type: Type.STRING },
                city: { type: Type.STRING },
                driverLicenseNumber: { type: Type.STRING },
                pointsInFlensburg: { type: Type.NUMBER }
              },
              required: ["fullName", "dob", "address", "city"]
            },
            vehicle: {
              type: Type.OBJECT,
              properties: {
                make: { type: Type.STRING },
                model: { type: Type.STRING },
                year: { type: Type.NUMBER },
                color: { type: Type.STRING },
                vin: { type: Type.STRING },
                engineType: { type: Type.STRING },
                lastHU: { type: Type.STRING },
                insuranceProvider: { type: Type.STRING }
              },
              required: ["make", "model", "vin"]
            },
            incidents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  officer: { type: Type.STRING }
                }
              }
            }
          },
          required: ["plate", "status", "owner", "vehicle"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      dataSource: 'AI',
      queryId: "EXT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleString('de-DE')
    };
  }
}

export const geminiService = new GeminiService();
