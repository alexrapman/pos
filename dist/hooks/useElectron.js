"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.useElectron = void 0;
// src/hooks/useElectron.ts
const react_1 = require("react");
const useElectron = () => {
    (0, react_1.useEffect)(() => {
        window.electron?.orderService.onFocusOrder((orderId) => {
            // Handle order focus - could scroll to order or highlight it
            document.getElementById(`order-${orderId}`)?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }, []);
    const notifyPriorityOrder = (0, react_1.useCallback)((order) => {
        window.electron?.orderService.notifyPriority(order);
    }, []);
    const notifyOrderComplete = (0, react_1.useCallback)((orderId) => {
        window.electron?.orderService.notifyComplete(orderId);
    }, []);
    return {
        notifyPriorityOrder,
        notifyOrderComplete
    };
};
exports.useElectron = useElectron;
const KitchenDisplay_1 = require("./kitchen/KitchenDisplay");
const useElectron_1 = require("../hooks/useElectron");
const App = () => {
    const { notifyPriorityOrder, notifyOrderComplete } = (0, exports.useElectron)();
    return className = "min-h-screen bg-gray-100" >
        />
        < KitchenDisplay_1.KitchenDisplay;
    onPriorityOrder = { notifyPriorityOrder };
    onOrderComplete = { notifyOrderComplete }
        /  >
        /div>;
};
exports.App = App;
;
;
