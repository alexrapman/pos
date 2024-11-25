"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = void 0;
// src/components/ui/LoadingSpinner.tsx
const react_1 = __importDefault(require("react"));
const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    const colorClasses = {
        primary: 'text-blue-500',
        white: 'text-white'
    };
    return (<div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}>
            <svg className="w-full h-full" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
        </div>);
};
exports.LoadingSpinner = LoadingSpinner;
