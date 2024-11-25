"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
// src/components/navigation/Navbar.tsx
const react_1 = __importDefault(require("react"));
const useAuth_1 = require("../../hooks/useAuth");
const ThemeToggle_1 = require("../ui/ThemeToggle");
const NotificationBell_1 = require("../ui/NotificationBell");
const Navbar = () => {
    const { user, logout } = (0, useAuth_1.useAuth)();
    return (<nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold">
                            Restaurant POS
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell_1.NotificationBell />
                        <ThemeToggle_1.ThemeToggle />
                        <div className="relative">
                            <button className="flex items-center gap-2">
                                <img src={`/avatars/${user?.id}.jpg`} alt="Profile" className="w-8 h-8 rounded-full"/>
                                <span>{user?.username}</span>
                            </button>
                            <button onClick={logout} className="text-red-500 hover:text-red-600">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>);
};
exports.Navbar = Navbar;
