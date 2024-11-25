// src/interfaces/IOrder.ts
export interface IOrder {
    id: string;
    tableNumber: number;
    items: IOrderItem[];
    status: OrderStatus;
    total: number;
    createdAt: Date;
}

export interface IOrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERED = 'DELIVERED'
}