/**
 * sale controller
 */

import { factories } from '@strapi/strapi'

interface User {
  id: number;
  username: string;
  email: string;
  store?: {
    id: number;
    Name: string;
    address?: string;
    [key: string]: any;
  };
}

interface Invoice {
  id: number;
  InvoiceNumber: number;
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

      // Get the user's store with proper typing
      const user = ctx.state.user;
      const userWithStore = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
        populate: ['store']
      }) as User;
      
      const storeId = userWithStore.store?.id;
      if (!storeId) {
        throw new Error('User has no associated store');
      }

      // Create sale first with user's store
      const sale = await strapi.entityService.create('api::sale.sale', {
        data: {
          Price: data.Price,
          Time: data.Time,
          store: storeId,  // Use user's store instead of data.store
          product: data.product,
          description: data.Description,
          publishedAt: new Date(),
          orderGroupId: data.orderGroupId,
          paymentMethod: data.paymentMethod
        },
        populate: ['store', 'product']
      }) as Sale;

      console.log('Created sale with ID:', sale.id);

      // Check if an invoice already exists for this order group
      const existingInvoice = await strapi.db.query('api::invoice.invoice').findOne({
        where: {
          orderGroupId: data.orderGroupId
        }
      });

      if (!existingInvoice) {
        const lastInvoice = await strapi.db.query('api::invoice.invoice').findMany({
          select: ['InvoiceNumber'],
          orderBy: { createdAt: 'desc' },
          limit: 1,
        });
        const nextInvoiceNumber = (lastInvoice[0]?.InvoiceNumber || 0) + 1;

        // Check if this is the first sale in the group
        const firstSaleInGroup = await strapi.db.query('api::sale.sale').findOne({
          where: {
            orderGroupId: data.orderGroupId
          },
          orderBy: { id: 'asc' }
        });

        const invoiceData = {
          InvoiceNumber: nextInvoiceNumber,
          Date: new Date(),
          Total: data.Price,
          store: storeId,  // Use user's store here too
          sale: firstSaleInGroup.id === sale.id ? sale.id : Number(sale.id) - 1,
          publishedAt: new Date(),
          orderGroupId: data.orderGroupId
        };

        console.log('Creating invoice with data:', invoiceData);

        const invoice = await strapi.entityService.create('api::invoice.invoice', {
          data: invoiceData,
          populate: ['store', 'sale']
        }) as Invoice;
      }

      return { data: sale };
    } catch (error) {
      console.error('Error in createWithRelation:', error);
      ctx.throw(500, error);
    }
  }
})); 