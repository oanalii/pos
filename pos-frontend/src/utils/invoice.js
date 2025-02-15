import { jsPDF } from 'jspdf';
import hgtLogo from '../assets/hgt.jpeg';  // Make sure to add this image to your assets
import API from '../services/api';

export const generateInvoice = async (items, total) => {
  // Get next invoice number from backend
  const response = await API.get('/api/invoices/count');
  const nextInvoiceNumber = response.data + 1;
  
  const doc = new jsPDF();
  
  // Add logo at the top center
  try {
    doc.addImage(hgtLogo, 'JPEG', 75, 10, 60, 30); // Adjust x, y, width, height as needed
  } catch (error) {
    console.error('Error adding logo:', error);
  }

  // Company info (left side)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('HIGH GATE TECHNOLOGIES', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Calle Hospital, 14, 08001, Barcelona, España', 20, 57);
  doc.text('Teléfono: 34933297250', 20, 57);
  doc.text('Web: www.hgtonline.es', 20, 64);
  doc.text('Email: info@hgtonline.es', 20, 71);
  doc.text('CIF/NIF: B44726511', 20, 78);
  doc.text('NIF: ESB44726511', 20, 85);

  // Receipt info (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RECIBO', 150, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentTime = new Date().toLocaleTimeString('es-ES');
  doc.text(`${currentDate} ${currentTime}`, 150, 57);
  doc.text(`Factura #${nextInvoiceNumber.toString().padStart(6, '0')}`, 150, 64);

  // Products table with lines
  doc.setFontSize(10);
  doc.text('Producto', 20, 100);
  doc.text('Precio', 150, 100);
  
  // Add top line
  doc.setLineWidth(0.5);
  doc.line(20, 105, 190, 105);
  
  let yPos = 110;
  items.forEach(item => {
    doc.text(item.product.Product, 20, yPos);
    doc.setFontSize(8);
    doc.text(item.description || '', 20, yPos + 4);
    doc.setFontSize(10);
    doc.text(`€${item.price.toFixed(2)}`, 150, yPos);
    yPos += 12;
  });

  // Add bottom line
  doc.line(20, yPos + 5, 190, yPos + 5);

  // Total
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 120, yPos + 15);
  doc.text(`€${total.toFixed(2)}`, 150, yPos + 15);

  // Save the PDF
  doc.save('recibo.pdf');
};