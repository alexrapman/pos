"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenGrid = void 0;
// src/components/kitchen/KitchenGrid.tsx
const react_1 = __importDefault(require("react"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const Order_1 = require("../../models/Order");
const OrderCard_1 = require("./OrderCard");
const statusColumns = [
    { id: Order_1.OrderStatus.PENDING, title: 'New Orders' },
    { id: Order_1.OrderStatus.PREPARING, title: 'In Progress' },
    { id: Order_1.OrderStatus.READY, title: 'Ready to Serve' }
];
const KitchenGrid = ({ orders, priorities }) => {
    const handleDragEnd = (result) => {
        // Implementation for drag and drop status update
    };
    const getOrdersByStatus = (status) => {
        return orders
            .filter(order => order.status === status)
            .sort((a, b) => (priorities[b.id] || 0) - (priorities[a.id] || 0));
    };
    return (<react_beautiful_dnd_1.DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-4 h-full">
                {statusColumns.map(column => (<div key={column.id} className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4">{column.title}</h2>
                        <react_beautiful_dnd_1.Droppable droppableId={column.id}>
                            {(provided) => (<div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                    {getOrdersByStatus(column.id)
                    .map((order, index) => (<react_beautiful_dnd_1.Draggable key={order.id} draggableId={order.id} index={index}>
                                                {(provided) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <OrderCard_1.OrderCard order={order} priority={priorities[order.id]}/>
                                                    </div>)}
                                            </react_beautiful_dnd_1.Draggable>))}
                                    {provided.placeholder}
                                </div>)}
                        </react_beautiful_dnd_1.Droppable>
                    </div>))}
            </div>
        </react_beautiful_dnd_1.DragDropContext>);
};
exports.KitchenGrid = KitchenGrid;
