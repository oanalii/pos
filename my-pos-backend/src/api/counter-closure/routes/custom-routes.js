module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/counter-closures/custom-create',
      handler: 'counter-closure.customCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 