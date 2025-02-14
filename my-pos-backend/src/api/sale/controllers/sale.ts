/**
 * sale controller
 */

import { factories } from '@strapi/strapi'

interface Invoice {
  id: number;
  InvoiceNumber: string;
  Date: string;
  Total: number;
  sale?: any;
  store?: any;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface Sale {
  id: number;
  Price: number;
  Time: string;
  description?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: number;
    Name: string;
    [key: string]: any;
  };
  product?: {
    id: number;
    Product: string;
    [key: string]: any;
  };
  invoice?: Invoice;
}

export default factories.createCoreController('api::sale.sale', ({ strapi }) => ({
  async find(ctx) {
    try {
      const query: any = {
        ...ctx.query,
        populate: ['product', 'store']
      };

      // Get sales using the core controller
      const entries = await strapi.entityService.findMany('api::sale.sale', {
        filters: query.filters,
        populate: query.populate,
        sort: { createdAt: 'desc' }
      });

      return {
        data: entries,
        meta: {}
      };

    } catch (error) {
      console.error('Error fetching sales:', error);
      ctx.throw(500, error);
    }
  },

  async createWithRelation(ctx) {
    try {
      const { data } = ctx.request.body;
      console.log('Creating sale with data:', data);

      // Create sale first
      const sale = await strapi.entityService.create('api::sale.sale', {
        data: {
          Price: data.Price,
          Time: data.Time,
          store: data.store,
          product: data.product,
          description: data.Description,
          publishedAt: new Date()
        },
        populate: ['store', 'product']
      }) as Sale;

      console.log('Created sale with ID:', sale.id);

      // Create invoice with sale.id - 1
      const invoiceData = {
        InvoiceNumber: `INV-${Date.now()}`,
        Date: new Date(),
        Total: data.Price,
        store: data.store,
        sale: Number(sale.id) - 1,
        publishedAt: new Date()
      };
      console.log('Creating invoice with data:', invoiceData);

      const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: invoiceData,
        populate: ['store', 'sale']
      }) as Invoice;

      console.log('Created invoice:', {
        invoiceId: invoice.id,
        linkedToSaleId: invoice.sale?.id || null,
        storeId: invoice.store?.id || null
      });

      return { data: sale };
    } catch (error) {
      console.error('Error in createWithRelation:', error);
      ctx.throw(500, error);
    }
  }
}));