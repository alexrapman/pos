"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTimer = void 0;
// src/components/kitchen/OrderTimer.tsx
const react_1 = __importStar(require("react"));
const date_fns_1 = require("date-fns");
const OrderTimer = ({ startTime, targetMinutes = 15, onPriorityChange }) => {
    const [timeElapsed, setTimeElapsed] = (0, react_1.useState)({ minutes: 0, seconds: 0 });
    const [isPriority, setIsPriority] = (0, react_1.useState)(false);
    const [audio] = (0, react_1.useState)(new Audio('/sounds/priority-alert.mp3'));
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const minutes = (0, date_fns_1.differenceInMinutes)(new Date(), startTime);
            const seconds = (0, date_fns_1.differenceInSeconds)(new Date(), startTime) % 60;
            setTimeElapsed({ minutes, seconds });
            const newIsPriority = minutes >= targetMinutes;
            if (newIsPriority !== isPriority) {
                setIsPriority(newIsPriority);
                onPriorityChange?.(newIsPriority);
                if (newIsPriority) {
                    audio.play().catch(console.error);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime, targetMinutes, isPriority, audio, onPriorityChange]);
    return (<div className={`
            font-mono text-lg
            ${isPriority ? 'text-red-600 animate-pulse' : 'text-gray-700'}
        `}>
            {String(timeElapsed.minutes).padStart(2, '0')}:
            {String(timeElapsed.seconds).padStart(2, '0')}
        </div>);
};
exports.OrderTimer = OrderTimer;
