// src/components/kitchen/KitchenGrid.tsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Order, OrderStatus } from '../../models/Order';
import { OrderCard } from './OrderCard';

interface KitchenGridProps {
    orders: Order[];
    priorities: Record<string, number>;
}

const statusColumns = [
    { id: OrderStatus.PENDING, title: 'New Orders' },
    { id: OrderStatus.PREPARING, title: 'In Progress' },
    { id: OrderStatus.READY, title: 'Ready to Serve' }
];

export const KitchenGrid: React.FC<KitchenGridProps> = ({ orders, priorities }) => {
    const handleDragEnd = (result: any) => {
        // Implementation for drag and drop status update
    };

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders
            .filter(order => order.status === status)
            .sort((a, b) => (priorities[b.id] || 0) - (priorities[a.id] || 0));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-4 h-full">
                {statusColumns.map(column => (
                    <div
                        key={column.id}
                        className="bg-white rounded-lg shadow p-4"
                    >
                        <h2 className="text-xl font-bold mb-4">{column.title}</h2>
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-4"
                                >
                                    {getOrdersByStatus(column.id as OrderStatus)
                                        .map((order, index) => (
                                            <Draggable
                                                key={order.id}
                                                draggableId={order.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <OrderCard
                                                            order={order}
                                                            priority={priorities[order.id]}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};