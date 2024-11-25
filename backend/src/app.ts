// backend/src/app.ts
import reservationValidationRouter from './routes/reservationValidation';
import { Environment } from './config/environment';

const env = Environment.getInstance();
const config = env.config;

app.use('/api/validation/reservations', reservationValidationRouter);

// Use throughout the application
app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});