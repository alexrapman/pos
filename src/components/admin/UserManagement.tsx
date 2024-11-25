// src/components/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../models/User';
import { UserService } from '../../services/UserService';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', role: UserRole.WAITER });

    const userService = new UserService();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await userService.createUser(newUser);
        setNewUser({ username: '', role: UserRole.WAITER });
        await loadUsers();
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">User Management</h2>

            <form onSubmit={handleAddUser} className="mb-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Username"
                        className="border p-2 rounded"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                        className="border p-2 rounded"
                    >
                        {Object.values(UserRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
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
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => userService.deleteUser(user.id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};