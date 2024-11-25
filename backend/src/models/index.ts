// src/models/index.ts
import { User } from './User';
import { Product } from './Product';
import { Order } from './Order';

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: 'OrderProducts' });
Product.belongsToMany(Order, { through: 'OrderProducts' });

export { User, Product, Order };