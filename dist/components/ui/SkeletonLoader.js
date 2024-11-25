"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonLoader = void 0;
// src/components/ui/SkeletonLoader.tsx
const react_1 = __importDefault(require("react"));
const SkeletonLoader = ({ count = 1, height = 'h-4' }) => {
    return (<>
            {Array.from({ length: count }).map((_, index) => (<div key={index} className={`
                        ${height} bg-gray-200 rounded
                        animate-pulse mb-2
                    `}/>))}
        </>);
};
exports.SkeletonLoader = SkeletonLoader;
