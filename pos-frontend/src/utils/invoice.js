import jsPDF from 'jspdf';

export const generateInvoice = (items, total) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Company Logo (you'll need to add your logo file)
  // doc.addImage('logo.png', 'PNG', 20, 10, 40, 40);
  
  // Company Info - Moved down by 10 units
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('HIGH GATE TECHNOLOGIES S.L.', 20, 30);
  
  // Let's add some debugging to see what's happening
  console.log('Checking text position at (20, 30)');
  
  // Clear any potential overlapping text
  doc.setFillColor(255, 255, 255); // White background
  doc.rect(18, 25, pageWidth - 36, 10, 'F'); // Create white rectangle behind text
  
  // Rewrite company name
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('HIGH GATE TECHNOLOGIES S.L.', 20, 30);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('TIENDA DE MÓVILES Y ACCESORIOS', 20, 35);
  
  doc.setFontSize(10);
  doc.text([
    'Avenida Paralelo 58, 08001, Barcelona',
    'Calle Hospital 14, 08001, Barcelona',
    'Calle Mallorca, Barcelona',
    'Avenida Gaudí, Barcelona',
    'Calle Consell de Cent, Barcelona',
    'Tel: +34 123 456 789',
    'Correo: info@hgtonline.es'
  ], 20, 45);  // Moved down addresses to make room for subtitle

  // Date and Invoice Number - Moved down
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - 60, 40);
  doc.text(`Factura Nº: ${Math.floor(Math.random() * 10000)}`, pageWidth - 60, 45);
  
  // Line separator - Moved down
  doc.line(20, 75, pageWidth - 20, 75);
  
  // Table Headers - Moved down
  let yPos = 85;
  doc.setFont(undefined, 'bold');
  doc.text('Producto', 20, yPos);
  doc.text('Precio', pageWidth - 60, yPos);
  
  // Add items
  doc.setFont(undefined, 'normal');
  yPos += 10;
  items.forEach(item => {
    const price = parseFloat(item.price);
    doc.text(item.product.Product, 20, yPos);
    // Added space between € and digits
    doc.text(`€  ${price.toFixed(2)}`, pageWidth - 60, yPos);
    yPos += 8;
  });
  
  // Total
  yPos += 10;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Total:', 20, yPos);
  // Added space between € and digits
  doc.text(`€  ${parseFloat(total).toFixed(2)}`, pageWidth - 60, yPos);
  
  // Footer
  const footer = [
    'Síguenos en:',
    'Instagram: hgtonline.es',
    'TikTok: hgt.es',
    'Página web: www.hgtonline.es',
    '© 2025 High Gate Technologies S.L. Todos los derechos reservados.'
  ];
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  yPos = doc.internal.pageSize.height - 30;
  footer.forEach(line => {
    doc.text(line, pageWidth/2, yPos, { align: 'center' });
    yPos += 5;
  });

  // Save the PDF
  doc.save(`hgt-factura-${new Date().toISOString().split('T')[0]}.pdf`);
}; 