"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInput = void 0;
// src/components/ui/SearchInput.tsx
const react_1 = __importDefault(require("react"));
const fi_1 = require("react-icons/fi");
const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
    return (<div className="relative">
            <fi_1.FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="
                    pl-10 pr-4 py-2
                    border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    w-full
                "/>
        </div>);
};
exports.SearchInput = SearchInput;
