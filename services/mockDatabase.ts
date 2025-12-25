
import { QueryResult, VehicleStatus } from "../types";

export const MOCK_DATABASE: QueryResult[] = [
  {
    plate: "B-MW 1234",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-001-A",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Maximilian Mustermann",
      dob: "12.05.1985",
      address: "Friedrichstraße 12",
      postalCode: "10117",
      city: "Berlin",
      driverLicenseNumber: "L0987654321",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "BMW",
      model: "3er Touring",
      year: 2021,
      color: "Alpinweiß",
      vin: "WBA31AG0X0FS12345",
      engineType: "Diesel",
      lastHU: "05/2024",
      insuranceProvider: "Allianz SE"
    },
    incidents: [
      { date: "14.02.2023", description: "Geschwindigkeitsüberschreitung (15 km/h innerorts)", location: "Berlin Mitte", officer: "POM Schmidt" }
    ]
  },
  {
    plate: "HH-AB 123",
    status: VehicleStatus.STOLEN,
    queryId: "DB-002-B",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Jan-Hinnerk Jensen",
      dob: "23.11.1972",
      address: "Reeperbahn 1",
      postalCode: "20359",
      city: "Hamburg",
      driverLicenseNumber: "H1234567890",
      pointsInFlensburg: 3
    },
    vehicle: {
      make: "Volkswagen",
      model: "Golf VIII",
      year: 2020,
      color: "Deep Black Perleffekt",
      vin: "WVWZZZCDZLW112233",
      engineType: "Benzin",
      lastHU: "11/2023",
      insuranceProvider: "HUK-Coburg"
    },
    incidents: [
      { date: "01.01.2024", description: "Als gestohlen gemeldet - Fahndung eingeleitet", location: "HH-Altona", officer: "PHK Meyer" }
    ]
  },
  {
    plate: "S-GT 911",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-003-C",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Dr. Christian Lindner",
      dob: "07.01.1979",
      address: "Schlossplatz 1",
      postalCode: "70173",
      city: "Stuttgart",
      driverLicenseNumber: "S7766554433",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "Porsche",
      model: "911 Carrera S",
      year: 2023,
      color: "Indischrot",
      vin: "WP0ZZZ99ZPS100911",
      engineType: "Benzin",
      lastHU: "08/2026",
      insuranceProvider: "LVM Versicherung"
    },
    incidents: []
  },
  {
    plate: "M-XY 987",
    status: VehicleStatus.FLAGGED,
    queryId: "DB-004-D",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Svetlana Sokolova",
      dob: "15.08.1992",
      address: "Leopoldstraße 240",
      postalCode: "80807",
      city: "München",
      driverLicenseNumber: "M4433221100",
      pointsInFlensburg: 8
    },
    vehicle: {
      make: "Mercedes-Benz",
      model: "C 63 AMG",
      year: 2019,
      color: "Graphitgrau Magno",
      vin: "W1K2050861F123456",
      engineType: "Benzin",
      lastHU: "03/2025",
      insuranceProvider: "AXA Konzern AG"
    },
    incidents: [
      { date: "12.06.2023", description: "Verdacht auf illegales Straßenrennen", location: "München Ring", officer: "PK Weber" },
      { date: "05.12.2023", description: "Lärmbelästigung (Klappenabgasanlage)", location: "München Innenstadt", officer: "PHK Gruber" }
    ]
  },
  {
    plate: "F-FM 321",
    status: VehicleStatus.EXPIRED,
    queryId: "DB-005-E",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Thomas Müller",
      dob: "13.09.1989",
      address: "Mainzer Landstraße 100",
      postalCode: "60327",
      city: "Frankfurt am Main",
      driverLicenseNumber: "F9988776655",
      pointsInFlensburg: 1
    },
    vehicle: {
      make: "Audi",
      model: "A4 Avant",
      year: 2015,
      color: "Manhattan-Grau",
      vin: "WAUZZZ8W7GA000111",
      engineType: "Diesel",
      lastHU: "01/2023",
      insuranceProvider: "ERGO Group"
    },
    incidents: []
  },
  {
    plate: "K-PL 111",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-006-F",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Anja Kölner",
      dob: "01.04.1982",
      address: "Dompropst-Ketzer-Straße 1",
      postalCode: "50667",
      city: "Köln",
      driverLicenseNumber: "K1122334455",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "Ford",
      model: "Fiesta",
      year: 2018,
      color: "Frost-Weiß",
      vin: "WF0DXXGAKDH123456",
      engineType: "Benzin",
      lastHU: "10/2025",
      insuranceProvider: "DEVK"
    },
    incidents: []
  },
  {
    plate: "L-LE 444",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-007-G",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Robert Lehmann",
      dob: "25.05.1995",
      address: "Karl-Liebknecht-Straße 45",
      postalCode: "04107",
      city: "Leipzig",
      driverLicenseNumber: "L5566778899",
      pointsInFlensburg: 2
    },
    vehicle: {
      make: "Skoda",
      model: "Octavia RS",
      year: 2022,
      color: "Mamba-Grün",
      vin: "TMBJJ7NX0NY123456",
      engineType: "Benzin",
      lastHU: "06/2025",
      insuranceProvider: "VHV Versicherungen"
    },
    incidents: [
      { date: "10.11.2023", description: "Falschparken mit Behinderung", location: "Leipzig City", officer: "PMin Wagner" }
    ]
  },
  {
    plate: "HB-ZZ 99",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-008-H",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Sarah Bremer",
      dob: "12.12.1990",
      address: "Am Wall 120",
      postalCode: "28195",
      city: "Bremen",
      driverLicenseNumber: "B4455667788",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "Tesla",
      model: "Model 3",
      year: 2021,
      color: "Solid Black",
      vin: "5YJ3E1EA5LF123456",
      engineType: "Elektro",
      lastHU: "12/2024",
      insuranceProvider: "Itzehoer"
    },
    incidents: []
  },
  {
    plate: "D-D 1",
    status: VehicleStatus.REGISTERED,
    queryId: "DB-009-I",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Gerhard Reicher",
      dob: "01.01.1950",
      address: "Königsallee 1",
      postalCode: "40212",
      city: "Düsseldorf",
      driverLicenseNumber: "D1111111111",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "Mercedes-Benz",
      model: "S 500",
      year: 2024,
      color: "Obsidianschwarz",
      vin: "W1K2230631A999999",
      engineType: "Hybrid",
      lastHU: "01/2027",
      insuranceProvider: "Gothaer"
    },
    incidents: []
  },
  {
    plate: "B-PL 2024",
    status: VehicleStatus.FLAGGED,
    queryId: "DB-010-J",
    timestamp: new Date().toLocaleString('de-DE'),
    owner: {
      fullName: "Polizeipräsidium Berlin",
      dob: "01.01.1900",
      address: "Platz der Luftbrücke 6",
      postalCode: "12101",
      city: "Berlin",
      driverLicenseNumber: "DIENST-001",
      pointsInFlensburg: 0
    },
    vehicle: {
      make: "Volkswagen",
      model: "Passat GTE",
      year: 2023,
      color: "Silber/Blau (Polizei)",
      vin: "WVWZZZ3CZPE998877",
      engineType: "Hybrid",
      lastHU: "09/2026",
      insuranceProvider: "Selbstversichert (Land Berlin)"
    },
    incidents: [
      { date: "20.02.2024", description: "Fahrzeug für verdeckte Ermittlungen freigegeben", location: "Berlin", officer: "Direktion 4" }
    ]
  }
];
