export default {
  routes: [
    {
      method: 'POST',
      path: '/invoices/create-with-sale',
      handler: 'invoice.createWithSale',
    },
    {
      method: 'GET',
      path: '/invoices/store/:storeId',
      handler: 'invoice.findByStore',
    }
  ]
}; 