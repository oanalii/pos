/**
 * sale controller
 */

import { factories } from '@strapi/strapi'

interface SaleResult {
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
    }) as SaleResult[];
    
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
      const result = await strapi.entityService.create('api::sale.sale', {
        data: {
          Price: data.Price,
          Time: data.Time,
          store: data.store,
          product: data.product,
          publishedAt: new Date()
        },
        populate: ['store', 'product']
      });

      console.log('Created sale with ID:', result.id);

      // Create invoice
      const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: {
          InvoiceNumber: `INV-${Date.now()}`,
          Date: new Date(),
          Total: data.Price,
          store: data.store,
          sale: result.id,  // Just use the original ID
          publishedAt: new Date()
        },
        populate: ['store', 'sale']
      });

      console.log('Created invoice with ID:', invoice.id);

      // Update sale with invoice
      const updatedSale = await strapi.entityService.update('api::sale.sale', result.id, {
        data: {
          invoice: invoice.id
        },
        populate: ['store', 'product', 'invoice']
      });

      console.log('Updated sale with invoice:', updatedSale);

      return { data: updatedSale };
    } catch (error) {
      console.error('Error in createWithRelation:', error);
      ctx.throw(500, error);
    }
  }
}));
