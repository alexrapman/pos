// backend/src/models/PaymentStatus.ts
export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

// backend/src/models/Payment.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { PaymentStatus } from './PaymentStatus';

class Payment extends Model {
    public id!: number;
    public orderId!: number;
    public amount!: number;
    public status!: PaymentStatus;
    public stripePaymentIntentId!: string;
    public metadata!: object;
}

Payment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        defaultValue: PaymentStatus.PENDING
    },
    stripePaymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    sequelize,
    timestamps: true
});