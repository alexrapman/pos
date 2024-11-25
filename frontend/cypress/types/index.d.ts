// frontend/cypress/types/index.d.ts
declare namespace Cypress {
  interface Chainable<Subject = any> {
    // Auth commands
    login(email: string, password: string): Chainable<void>;
    loginAs(role: 'admin' | 'waiter' | 'kitchen'): Chainable<void>;
    logout(): Chainable<void>;

    // Order commands
    createOrder(tableNumber: number, items: OrderItem[]): Chainable<void>;
    updateOrderStatus(orderId: number, status: OrderStatus): Chainable<void>;
    getOrderById(orderId: number): Chainable<Order>;

    // WebSocket commands
    mockWebSocket(): Chainable<void>;
    emitSocketEvent(event: string, data: any): Chainable<void>;

    // Database commands
    seedDatabase(): Chainable<void>;
    cleanDatabase(): Chainable<void>;
    
    // Custom commands for UI interactions
    selectTable(tableNumber: number): Chainable<void>;
    addItemToOrder(itemName: string, quantity?: number): Chainable<void>;
    completePayment(amount: number, method: PaymentMethod): Chainable<void>;
  }

  interface Order {
    id: number;
    tableNumber: number;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    createdAt: string;
  }

  interface OrderItem {
    name: string;
    quantity: number;
    price: number;
  }

  type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';
  type PaymentMethod = 'cash' | 'card' | 'mobile';
}