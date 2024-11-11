// src/components/roles/RoleForm.js

import React, { useState, useEffect } from 'react';
import './roles.css';

const RoleForm = ({ fetchRoles, setFormVisible, editRole }) => {
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState({
        products: { add: false, edit: false, delete: false, view: false, isVisible: false },
        customers: { add: false, edit: false, delete: false, view: false, isVisible: false },
        users: { add: false, edit: false, delete: false, view: false, isVisible: false },
        roles: { add: false, edit: false, delete: false, view: false, isVisible: false },
    });

    useEffect(() => {
        if (editRole) {
            setRoleName(editRole.name);
            // Initialize permissions if `editRole` permissions are provided
            // (if the `editRole` object contains permissions, we can set them here)
        }
    }, [editRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found, unable to authenticate');
            return;
        }
    
        const permissionsArray = Object.keys(permissions).flatMap((menu) => {
            return ['add', 'edit', 'delete', 'view']
                .filter((action) => permissions[menu][action]) // Only include true actions
                .map((action) => `${menu}:${action}`);
        });
    
        const payload = { name: roleName, permissions: permissionsArray };
        console.log("Payload being sent:", JSON.stringify(payload));
    
        try {
            const response = editRole
                ? await fetch(`http://localhost:5000/api/roles/${editRole._id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                })
                : await fetch('http://localhost:5000/api/roles', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

            const result = await response.json();
    
            if (!response.ok) {
                console.error("Failed to save role. Status:", response.status);
                console.error("Error details:", result);
            } else {
                console.log("Role saved successfully:", result);
                fetchRoles();
                setFormVisible(false);  // Close the form
            }
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    const toggleMainCheckbox = (menu) => {
        setPermissions((prevPermissions) => {
            const isMainChecked = !prevPermissions[menu].isVisible;
            return {
                ...prevPermissions,
                [menu]: {
                    add: isMainChecked,
                    edit: isMainChecked,
                    delete: isMainChecked,
                    view: isMainChecked,
                    isVisible: isMainChecked,
                },
            };
        });
    };

    const handlePermissionChange = (menu, action) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [menu]: {
                ...prevPermissions[menu],
                [action]: !prevPermissions[menu][action],
            },
        }));
    };

    return (
        <div className="role-form-container">
            <form onSubmit={handleSubmit} className="role-form">
                {/* Role Name Input */}
                <input
                    type="text"
                    placeholder="Role Name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                    className="role-name-input"
                />
                
                {/* Permissions Section */}
                <h4 className="permissions-heading">Permissions</h4>
                <div className="permissions-section">
                    {Object.keys(permissions).map((menu) => (
                        <div key={menu} className="permission-group">
                            <label className="main-permission">
                                <input
                                    type="checkbox"
                                    checked={permissions[menu].isVisible}
                                    onChange={() => toggleMainCheckbox(menu)}
                                />
                                {menu.charAt(0).toUpperCase() + menu.slice(1)}
                            </label>
                            {permissions[menu].isVisible && (
                                <div className="sub-permissions">
                                    {['add', 'edit', 'delete', 'view'].map((action) => (
                                        <label key={action} className="sub-permission">
                                            <input
                                                type="checkbox"
                                                checked={permissions[menu][action]}
                                                onChange={() => handlePermissionChange(menu, action)}
                                            />
                                            {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button type="submit" className="save-button">Save Role</button>
                    <button type="button" className="cancel-button" onClick={() => setFormVisible(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoleForm;
