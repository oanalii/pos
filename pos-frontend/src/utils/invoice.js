import { jsPDF } from 'jspdf';
import hgtLogo from '../assets/hgt.jpeg';  // Make sure to add this image to your assets
import API from '../services/api';

export const generateInvoice = async (items, total) => {
  // Get next invoice number from backend
  const response = await API.get('/api/invoices/count');
  const nextInvoiceNumber = response.data + 1;
  
  const doc = new jsPDF();
  
  // Add logo at the top center - adjusted size and position
  try {
    doc.addImage(hgtLogo, 'JPEG', 85, 10, 40, 20); // Centered (85 instead of 75) and thinner (40 width)
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
  doc.text('Teléfono: 34933297250', 20, 64);
  doc.text('Web: www.hgtonline.es', 20, 71);
  doc.text('Email: info@hgtonline.es', 20, 78);
  doc.text('CIF/NIF: B44726511', 20, 85);
  doc.text('NIF: ESB44726511', 20, 92);

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

  // Products table with lines - increased margin from NIF
  doc.setFontSize(10);
  doc.text('Producto', 20, 120);  // Moved down from 100 to 120
  doc.text('Precio', 150, 120);   // Moved down to match
  
  // Add top line - moved down
  doc.setLineWidth(0.5);
  doc.line(20, 125, 190, 125);    // Moved down from 105 to 125
  
  let yPos = 130;                 // Moved down from 110 to 130
  items.forEach(item => {
    doc.text(item.product.Product, 20, yPos);
    doc.setFontSize(8);
    doc.text(item.description || '', 20, yPos + 4);
    doc.setFontSize(10);
    doc.text('€', 140, yPos);  // Euro symbol moved left
    doc.text(item.price.toFixed(2), 150, yPos);  // Price number separate from €
    yPos += 12;
  });

  // Add bottom line
  doc.line(20, yPos + 5, 190, yPos + 5);

  // Total with separated euro symbol
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 120, yPos + 15);
  doc.text('€', 140, yPos + 15);  // Euro symbol moved left
  doc.text(total.toFixed(2), 150, yPos + 15);  // Total number separate from €

  // Thank you message - centered at bottom
  doc.setFont('helvetica', 'normal');
  const thankYouText = '¡Muchas gracias por su compra!';
  const textWidth = doc.getStringUnitWidth(thankYouText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const textX = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(thankYouText, textX, 270);  // Fixed Y position near bottom of page

  // Save the PDF
  doc.save('recibo.pdf');
};