"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = void 0;
// src/components/ui/ThemeToggle.tsx
const react_1 = __importDefault(require("react"));
const useTheme_1 = require("../../hooks/useTheme");
const ThemeToggle = () => {
    const { theme, toggleTheme } = (0, useTheme_1.useTheme)();
    return (<button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === 'dark' ? (<SunIcon className="w-5 h-5"/>) : (<MoonIcon className="w-5 h-5"/>)}
        </button>);
};
exports.ThemeToggle = ThemeToggle;
