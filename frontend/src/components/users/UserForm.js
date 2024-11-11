import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './Users.css';

const UserForm = ({ setShowAddUserForm, onUpdateUser, userToEdit }) => {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    
    useEffect(() => {
        axios.get('http://localhost:5000/api/roles', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            console.log('Fetched Roles:', response.data);  // Log roles to inspect their structure
            setRoles(response.data);
        })
        .catch(error => {
            console.error("Error fetching roles:", error);
        });
    
        if (userToEdit) {
            setName(userToEdit.name || '');
            setEmail(userToEdit.email || '');
            setSelectedRole(userToEdit.role ? userToEdit.role._id : '');  // Ensure the role is being set correctly
        }
    }, [userToEdit]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if name, email, password, and role are valid
        if (!name || !email || !selectedRole) {
            alert('Please fill in all fields');
            return;
        }
    
        const userData = userToEdit ? { name, email, password, roleId: selectedRole } 
        : { name, email, password, roleId: selectedRole };
    
        // Log the user data before sending it to the backend
        console.log('Sending user data:', userData);
    
        const url = userToEdit ? `http://localhost:5000/api/users/${userToEdit._id}` : 'http://localhost:5000/api/users';
        const method = userToEdit ? 'put' : 'post';
        console.log('User data before sending (edit):', userData);

        axios({
            method,
            url,
            data: userData,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        })
            .then((response) => {
                if (userToEdit) {
                    onUpdateUser(response.data);
                }
                setShowAddUserForm(false);
            })
            .catch((error) => {
                console.error('Error saving user:', error);
                console.log('Error Response:', error.response); // This will log the error response from the backend
                alert('Error saving user: ' + (error.response?.data?.message || 'Please check your permissions.'));
            });
    };
    
    
    return (
        <form onSubmit={handleSubmit}>
            <h3>{userToEdit ? 'Edit User' : 'Add User'}</h3>
          
                <div className="form-row">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {!userToEdit && (
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="form-row">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        required
                        className="role-select">
                            
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit">
                        {userToEdit ? 'Update User' : 'Add User'}
                    </button>
                    <button type="button" onClick={() => setShowAddUserForm(false)}>
                        Cancel
                    </button>
                </div>
            </form>
       
    );
};

export default UserForm;
