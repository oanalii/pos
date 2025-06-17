'use strict';

/**
 * counter-closure controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::counter-closure.counter-closure', ({ strapi }) => ({
  async customCreate(ctx) {
    const { user } = ctx.state; // Get the authenticated user
    const { body } = ctx.request;

    // --- Validation ---
    if (!user) {
      return ctx.unauthorized('You must be logged in to perform this action.');
    }
    
    if (!body.data || !body.data.store) {
      return ctx.badRequest('Missing required fields in request body.', { details: "Request must include 'data' with a 'store'." });
    }

    const {
      store,
      totalSales,
      cashSales,
      cardSales,
      cardSalesVerified,
      startingFloat,
      expenses,
      totalExpenses,
      totalExpectedInDrawer,
      drawerAmountVerified,
      actualAmountInDrawer,
      notes,
    } = body.data;

    // --- Logic ---
    try {
      const entry = await strapi.entityService.create('api::counter-closure.counter-closure', {
        data: {
          totalSales,
          cashSales,
          cardSales,
          cardSalesVerified,
          startingFloat,
          totalExpenses,
          totalExpectedInDrawer,
          drawerAmountVerified,
          actualAmountInDrawer,
          expenses,
          notes,
          store,
          closed_by: user.id,
          publishedAt: new Date(),
        },
      });

      return { data: entry };
    } catch (error) {
      strapi.log.error('Error creating counter closure', error);
      return ctx.internalServerError('An error occurred while creating the counter closure.', { error });
    }
  },
})); 