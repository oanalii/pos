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

      if (!data.store) {
        ctx.throw(400, 'Store ID is required');
      }

      // Create sale with proper store relation
      const sale = await strapi.entityService.create('api::sale.sale', {
        data: {
          Price: data.Price,
          Time: data.Time,
          store: data.store, // This should be just the ID
          product: data.product,
          publishedAt: new Date()
        },
        populate: ['store', 'product']
      });

      // Create invoice with proper sale relation
      const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: {
          InvoiceNumber: `INV-${Date.now()}`,
          Date: new Date(),
          Total: data.Price,
          store: data.store, // Same store ID
          sale: sale.id, // Use the actual sale.id, not sale.id - 1
          publishedAt: new Date()
        },
        populate: ['store', 'sale']
      });

      return { data: sale };
    } catch (error) {
      console.error('Error in createWithRelation:', error);
      ctx.throw(500, error);
    }
  }
}));
