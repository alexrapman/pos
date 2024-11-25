"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayout = void 0;
// src/components/layout/MainLayout.tsx
const react_1 = __importDefault(require("react"));
const Navbar_1 = require("./Navbar");
const Sidebar_1 = require("./Sidebar");
const ThemeProvider_1 = require("../providers/ThemeProvider");
const MainLayout = ({ children }) => {
    return (<ThemeProvider_1.ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Navbar_1.Navbar />
                <div className="flex">
                    <Sidebar_1.Sidebar />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider_1.ThemeProvider>);
};
exports.MainLayout = MainLayout;
