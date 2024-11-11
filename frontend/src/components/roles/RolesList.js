// src/components/roles/RolesList.js

import React, { useEffect, useState, useCallback } from 'react';
import RoleForm from './RoleForm';
import { FaSearch, FaTimes, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './roles.css';
import { useUser } from '../../context/UserContext';

const RolesList = () => {
    const { user } = useUser();
    const [roles, setRoles] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editRole, setEditRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, [user.permissions]);

    const fetchRoles = useCallback(async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/roles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleAddRole = () => {
        setEditRole(null);
        setFormVisible(true);
    };

    const handleEditRole = (role) => {
        setEditRole(role);
        setFormVisible(true);
    };

    const handleDeleteRole = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log("Role deleted successfully.");
                fetchRoles();
            } else {
                console.error("Failed to delete role. Status:", response.status);
                const errorData = await response.json();
                console.error("Error details:", errorData);
            }
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const canEdit = user.permissions['roles']?.edit;
    const canDelete = user.permissions['roles']?.delete;
    const canViewActions = canEdit || canDelete;

    return (
        <div className="role-list-container">
            <h2 className="role-list-title">Roles List</h2>

            {/* Conditionally render either the list or the form */}
            {isFormVisible ? (
                <RoleForm
                    fetchRoles={fetchRoles} // Pass fetchRoles to RoleForm
                    setFormVisible={setFormVisible} // Pass setFormVisible to RoleForm
                    editRole={editRole} // Pass editRole if available
                />
            ) : (
                <>
                    <div className="role-list-top-container">
                        <div className="role-list-search-bar">
                            {searchTerm === '' ? (
                                <FaSearch className="role-list-search-icon" />
                            ) : (
                                <FaTimes className="role-list-close-icon" onClick={clearSearch} />
                            )}
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {user.permissions['roles']?.add && (
                            <button className="add-role-button" onClick={handleAddRole}>
                                AddRole
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="role-list-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {canViewActions && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {roles.length > 0 ? (
                                    roles
                                        .filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((role) => (
                                            <tr key={role._id}>
                                                <td>{role.name}</td>
                                                {canViewActions && (
                                                    <td>
                                                        {canEdit && (
                                                            <button onClick={() => handleEditRole(role)} >
                                                                <FaEdit className="role-list-edit-icon" />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button onClick={() => handleDeleteRole(role._id)} >
                                                                <FaTrashAlt className="role-list-delete-icon" />
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan={canViewActions ? 2 : 1}>No roles found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default React.memo(RolesList);
