export default {
  beforeCreate: async (event) => {
    const { data } = event.params;
    
    // Get the highest invoice number
    const result = await strapi.db.query('api::invoice.invoice').findMany({
      select: ['InvoiceNumber'],
      orderBy: { createdAt: 'desc' },
      limit: 1,
    });

    // Set next invoice number
    const lastNumber = result[0]?.InvoiceNumber || 0;
    data.InvoiceNumber = lastNumber + 1;
  }
}; 