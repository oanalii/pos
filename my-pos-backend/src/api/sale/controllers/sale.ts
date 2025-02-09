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
    console.log('Query params:', ctx.query);
    
    // Define the filter type
    type QueryFilters = {
      filters?: {
        store?: {
          id?: {
            $eq?: string
          }
        }
      }
    };

    // Get all sales without any filtering first
    const entries = await strapi.entityService.findMany('api::sale.sale', {
      populate: ['product', 'store'],
      sort: { createdAt: 'desc' }
    }) as Sale[];
    
    console.log('All sales:', entries);
    
    // Type cast query to our filter type
    const query = ctx.query as QueryFilters;
    const storeId = parseInt(query.filters?.store?.id?.$eq || '0');
    console.log('Filtering by store ID:', storeId);
    
    const filtered = entries
      .filter(sale => sale.store?.id === storeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('Filtered and sorted sales:', filtered);
    
    return { data: filtered };
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
          publishedAt: new Date()
        },
        populate: ['store', 'product']
      }) as Sale;

      console.log('Created sale with ID:', sale.id);

      // Create invoice with sale.id - 1
      const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: {
          InvoiceNumber: `INV-${Date.now()}`,
          Date: new Date(),
          Total: data.Price,
          store: data.store,
          sale: sale.id - 1,  // Subtract 1 from sale ID
          publishedAt: new Date()
        },
        populate: ['store', 'sale']
      }) as Invoice;

      console.log('Created invoice with adjusted sale ID:', {
        invoiceId: invoice.id,
        linkedToSaleId: sale.id - 1
      });

      return { data: sale };
    } catch (error) {
      console.error('Error in createWithRelation:', error);
      ctx.throw(500, error);
    }
  }
}));
