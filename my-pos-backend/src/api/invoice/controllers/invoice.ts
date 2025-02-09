/**
 * invoice controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
  async createWithSale(ctx) {
    try {
      const { sale, total, store } = ctx.request.body;
      
      const invoiceNumber = `INV-${Date.now()}`;
      
      const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: {
          InvoiceNumber: invoiceNumber,
          Date: new Date(),
          Total: total,
          sale: sale,
          store: store,
          publishedAt: new Date()
        }
      });

      return { data: invoice };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async findByStore(ctx) {
    try {
      const { storeId } = ctx.params;
      const { user } = ctx.state; // Get logged in user

      // Verify user belongs to this store
      if (user.store.id !== parseInt(storeId)) {
        return ctx.forbidden('You can only access invoices from your store');
      }

      const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
        filters: {
          store: storeId
        },
        populate: {
          sale: {
            populate: ['product']
          }
        },
        sort: { Date: 'desc' }
      });

      return { data: invoices };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));
