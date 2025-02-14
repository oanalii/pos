/**
 * sale router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'POST',
      path: '/sales/create-with-relation',
      handler: 'sale.createWithRelation',
      config: {
        policies: [],
        auth: {
          scope: ['create']
        }
      }
    },
    {
      method: 'GET',
      path: '/sales',
      handler: 'sale.find',
      config: {
        policies: [],
        auth: {
          scope: ['find']
        }
      }
    }
  ]
};
