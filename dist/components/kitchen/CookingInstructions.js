"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTimer = exports.CookingInstructions = void 0;
// src/components/kitchen/CookingInstructions.tsx
const react_1 = __importDefault(require("react"));
const CookingInstructions = ({ items }) => {
    return (<div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {items.map((item, index) => (<div key={index} className="mb-4">
                    <h4 className="font-bold">{item.name}</h4>
                    <div className="space-y-2">
                        {item.cookingInstructions?.map((instruction, i) => (<div key={i} className="flex items-start gap-2">
                                <span className="text-gray-500">{i + 1}.</span>
                                <span>{instruction}</span>
                            </div>))}
                        {item.specialRequirements && (<div className="mt-2 text-red-600">
                                Special: {item.specialRequirements}
                            </div>)}
                    </div>
                </div>))}
        </div>);
};
exports.CookingInstructions = CookingInstructions;
// src/components/kitchen/OrderTimer.tsx
const react_2 = require("react");
const OrderTimer = ({ startTime, targetTime = 15 }) => {
    const [elapsed, setElapsed] = (0, react_2.useState)(0);
    const [isOverdue, setIsOverdue] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        const interval = setInterval(() => {
            const elapsedMinutes = (Date.now() - new Date(startTime).getTime()) / 1000 / 60;
            setElapsed(elapsedMinutes);
            setIsOverdue(elapsedMinutes > targetTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime, targetTime]);
    return (<div className={`
            font-mono text-lg
            ${isOverdue ? 'text-red-600 animate-pulse' : 'text-gray-700'}
        `}>
            {Math.floor(elapsed)}:{((elapsed % 1) * 60).toFixed(0).padStart(2, '0')}
        </div>);
};
exports.OrderTimer = OrderTimer;
