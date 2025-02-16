import { jsPDF } from 'jspdf';
import hgtLogo from '../assets/hgt.jpeg';  // Make sure to add this image to your assets
import API from '../services/api';

export const generateInvoice = async (items, total, sale) => {
  // Try to get invoice by orderGroupId first, then fallback to sale.id
  let response;
  if (sale.orderGroupId) {
    response = await API.get(`/api/invoices`, {
      params: {
        'filters[orderGroupId][$eq]': sale.orderGroupId,
        'populate': '*'
      }
    });
  } else {
    // Fallback for older sales
    response = await API.get(`/api/invoices?filters[sale][id][$eq]=${sale.id - 1}&populate=*`);
  }
  
  const invoice = response.data.data[0];
  
  if (!invoice) {
    console.error('No invoice found for sale:', sale);
    return;
  }
  
  const doc = new jsPDF();
  
  // Add logo at the top center with correct 4:3 aspect ratio
  try {
    const imgWidth = 40;
    const imgHeight = imgWidth * (3/4);
    const pageWidth = doc.internal.pageSize.width;
    const x = (pageWidth - imgWidth) / 2;
    doc.addImage(hgtLogo, 'JPEG', x, 15, imgWidth, imgHeight);
  } catch (error) {
    console.error('Error adding logo:', error);
  }

  // Company info (left side) - better spacing
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('HIGH GATE TECHNOLOGIES', 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text([
    'Calle Hospital, 14',
    '08001, Barcelona, España',
    'Tel: +34 933 297 250',
    'www.hgtonline.es',
    'info@hgtonline.es',
    'CIF/NIF: B44726511',
    'NIF: ESB44726511'
  ], 20, 65);

  // Invoice details (right side)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 140, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const saleDate = new Date(sale.Time).toLocaleDateString('es-ES');
  const saleTime = new Date(sale.Time).toLocaleTimeString('es-ES');
  doc.text([
    `Nº: ${(invoice?.InvoiceNumber || 0).toString().padStart(6, '0')}`,
    `Fecha: ${saleDate}`,
    `Hora: ${saleTime}`
  ], 140, 65);

  // Add a separator line - moved down
  doc.setLineWidth(0.5);
  doc.line(20, 95, 190, 95);

  // Products table header - adjusted spacing
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 20, 105);
  doc.text('Descripción', 20, 112);
  doc.text('Precio', 150, 105);
  
  // Products table with alternating background - adjusted starting position
  let yPos = 120;
  items.forEach((item, index) => {
    // Add subtle alternating background
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPos - 5, 180, 15, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(item.product.Product, 20, yPos);
    doc.setFontSize(8);
    doc.text(item.description || '', 20, yPos + 4);
    
    doc.setFontSize(10);
    doc.text('€', 140, yPos);
    doc.text(item.price.toFixed(2), 150, yPos);
    
    yPos += 15;
  });

  // Total section with box
  doc.setLineWidth(0.5);
  doc.rect(120, yPos + 5, 70, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  // Add IVA line
  doc.text('IVA: 0%', 125, yPos + 13);
  
  // Total line (moved down slightly)
  doc.text('Total:', 125, yPos + 17);
  doc.text('€', 155, yPos + 17);
  doc.text(total.toFixed(2), 165, yPos + 17);

  // Add guarantee message
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const textWidth = doc.getStringUnitWidth('Vendido según REBU (RÉGIMEN ESPECIAL PARA PRODUCTOS USADOS)') * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const textX = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text('Vendido según REBU (RÉGIMEN ESPECIAL PARA PRODUCTOS USADOS)', textX, 250);
  doc.text('Ofrecemos cambio dentro de los primeros 14 días de su compra. La reparación o el cambio', textX, 255);
  doc.text('(en caso de avería) se realizará durante el periodo de garantía.', textX, 260);

  // Thank you message - elegant and centered
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const thankYouText = '¡Gracias por confiar en High Gate Technologies!';
  const textWidth = doc.getStringUnitWidth(thankYouText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const textX = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(thankYouText, textX, 270);

  // Save the PDF
  doc.save('recibo.pdf');
};