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
  product?: {
    id: number;
    Product: string;
    [key: string]: any;
  };
  store?: {
    id: number;
    Name: string;
    [key: string]: any;
  };
}

export default factories.createCoreController('api::sale.sale', ({ strapi }) => ({
  async createWithRelation(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // First, find the actual product by ID
      const product = await strapi.db.query('api::product.product').findOne({
        where: { id: data.product }
      });

      strapi.log.info('Found product:', {
        requestedId: data.product,
        foundProduct: product ? {
          id: product.id,
          name: product.Product
        } : null
      });

      if (!product) {
        return ctx.badRequest('Product not found');
      }

      // Create sale with the verified product ID
      const result = await strapi.entityService.create('api::sale.sale', {
        data: {
          Price: data.Price,
          Time: data.Time,
          store: data.store,
          product: product.id,  // Use the verified product ID
          publishedAt: new Date()
        },
        populate: {
          product: true,
          store: true
        }
      }) as SaleResult;

      strapi.log.info('Created sale result:', {
        saleId: result.id,
        price: result.Price,
        productId: result.product?.id,
        productName: result.product?.Product,
        storeId: result.store?.id
      });

      return { data: result };

    } catch (error) {
      strapi.log.error('Failed to create sale:', error);
      ctx.throw(500, error);
    }
  }
}));
