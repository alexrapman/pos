// src/api/server.ts
import express from 'express';
import cors from 'cors';
import { orderRouter } from './routes/orderRoutes';
import { productRouter } from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);

app.use(errorHandler);

export default app;