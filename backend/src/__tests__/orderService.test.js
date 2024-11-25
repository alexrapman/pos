const orderService = require('../services/orderService');

test('should create a new order', async () => {
  const orderData = { /* datos del pedido */ };
  const newOrder = await orderService.createOrder(orderData);
  expect(newOrder).toHaveProperty('id');
  expect(newOrder).toHaveProperty('status', 'pending');
});