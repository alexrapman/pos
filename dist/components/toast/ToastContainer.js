"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastContainer = void 0;
// src/components/toast/ToastContainer.tsx
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const fi_1 = require("react-icons/fi");
const toastTypeConfig = {
    success: {
        icon: fi_1.FiCheck,
        className: 'bg-green-500 text-white'
    },
    error: {
        icon: fi_1.FiX,
        className: 'bg-red-500 text-white'
    },
    warning: {
        icon: fi_1.FiAlertTriangle,
        className: 'bg-yellow-500 text-white'
    },
    info: {
        icon: fi_1.FiInfo,
        className: 'bg-blue-500 text-white'
    }
};
const ToastContainer = ({ toasts, removeToast }) => {
    return (<div className="fixed bottom-4 right-4 z-50" aria-live="polite" aria-atomic="true">
            <framer_motion_1.AnimatePresence>
                {toasts.map(toast => {
            const { icon: Icon, className } = toastTypeConfig[toast.type];
            return (<framer_motion_1.motion.div key={toast.id} initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} className={`
                                flex items-center gap-2 mb-2 px-4 py-2 rounded-lg shadow-lg
                                ${className}
                            `} role="alert">
                            <Icon className="w-5 h-5"/>
                            <span>{toast.message}</span>
                            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-75" aria-label="Close notification">
                                <fi_1.FiX />
                            </button>
                        </framer_motion_1.motion.div>);
        })}
            </framer_motion_1.AnimatePresence>
        </div>);
};
exports.ToastContainer = ToastContainer;
