
import { jsPDF } from 'jspdf';
import { QueryResult } from '../types';

export const generateReportPDF = (data: QueryResult) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 30;

  // Header
  doc.setFillColor(30, 58, 138); // Navy Blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('POLIZEI - DIENSTBELEG', margin, 25);
  
  doc.setFontSize(10);
  doc.text(`Abfrage-ID: ${data.queryId} | Zeitstempel: ${data.timestamp}`, margin, 35);

  // Status Section
  y = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Kettenabfrage: ${data.plate}`, margin, y);
  
  doc.setFontSize(12);
  doc.text(`Status: ${data.status}`, 140, y);
  
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);

  // Owner Section
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('HALTERINFORMATIONEN', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  y += 10;
  doc.text(`Name: ${data.owner.fullName}`, margin, y);
  doc.text(`Geburtsdatum: ${data.owner.dob}`, 120, y);
  y += 7;
  doc.text(`Anschrift: ${data.owner.address}`, margin, y);
  y += 7;
  doc.text(`${data.owner.postalCode} ${data.owner.city}`, margin, y);
  y += 7;
  doc.text(`Führerschein-Nr: ${data.owner.driverLicenseNumber}`, margin, y);
  doc.text(`Punkte (Flensburg): ${data.owner.pointsInFlensburg}`, 120, y);

  // Vehicle Section
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FAHRZEUGDATEN', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  y += 10;
  doc.text(`Fahrzeug: ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.year})`, margin, y);
  doc.text(`Farbe: ${data.vehicle.color}`, 140, y);
  y += 7;
  doc.text(`FIN: ${data.vehicle.vin}`, margin, y);
  y += 7;
  doc.text(`Motor: ${data.vehicle.engineType}`, margin, y);
  doc.text(`Nächste HU: ${data.vehicle.lastHU}`, 140, y);
  y += 7;
  doc.text(`Versicherung: ${data.vehicle.insuranceProvider}`, margin, y);

  // Incidents Section
  if (data.incidents && data.incidents.length > 0) {
    y += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('POLIZEILICHE EINTRÄGE', margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 5;
    
    data.incidents.forEach((inc) => {
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${inc.date} - ${inc.location}`, margin, y);
      doc.setFont('helvetica', 'normal');
      y += 5;
      doc.text(`${inc.description} (Dienstbeauftragter: ${inc.officer})`, margin + 5, y);
    });
  } else {
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Keine polizeilichen Einträge vorhanden.', margin, y);
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Nur für den internen Dienstgebrauch bestimmt. Geheimhaltungspflicht gemäß § 203 StGB.', margin, 285);
  }

  doc.save(`Polizeibericht_${data.plate.replace(/\s+/g, '_')}_${data.queryId}.pdf`);
};
