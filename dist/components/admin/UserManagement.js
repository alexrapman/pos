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
exports.UserManagement = void 0;
// src/components/admin/UserManagement.tsx
const react_1 = __importStar(require("react"));
const User_1 = require("../../models/User");
const UserService_1 = require("../../services/UserService");
const UserManagement = () => {
    const [users, setUsers] = (0, react_1.useState)([]);
    const [newUser, setNewUser] = (0, react_1.useState)({ username: '', role: User_1.UserRole.WAITER });
    const userService = new UserService_1.UserService();
    (0, react_1.useEffect)(() => {
        loadUsers();
    }, []);
    const loadUsers = async () => {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
    };
    const handleAddUser = async (e) => {
        e.preventDefault();
        await userService.createUser(newUser);
        setNewUser({ username: '', role: User_1.UserRole.WAITER });
        await loadUsers();
    };
    return (<div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">User Management</h2>

            <form onSubmit={handleAddUser} className="mb-4">
                <div className="flex gap-4">
                    <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="Username" className="border p-2 rounded"/>
                    <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded">
                        {Object.values(User_1.UserRole).map(role => (<option key={role} value={role}>{role}</option>))}
                    </select>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add User
                    </button>
                </div>
            </form>

            <table className="w-full">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (<tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => userService.deleteUser(user.id)} className="text-red-500">
                                    Delete
                                </button>
                            </td>
                        </tr>))}
                </tbody>
            </table>
        </div>);
};
exports.UserManagement = UserManagement;
