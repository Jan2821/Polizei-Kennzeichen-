
export enum VehicleStatus {
  REGISTERED = 'Zugelassen',
  STOLEN = 'Fahndung/Geklaut',
  EXPIRED = 'Abgemeldet',
  FLAGGED = 'Auffällig'
}

export interface Owner {
  fullName: string;
  dob: string;
  address: string;
  postalCode: string;
  city: string;
  driverLicenseNumber: string;
  pointsInFlensburg: number;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  engineType: string;
  lastHU: string;
  insuranceProvider: string;
}

export interface Incident {
  date: string;
  description: string;
  location: string;
  officer: string;
}

export interface QueryResult {
  plate: string;
  status: VehicleStatus;
  owner: Owner;
  vehicle: Vehicle;
  incidents: Incident[];
  queryId: string;
  timestamp: string;
}
