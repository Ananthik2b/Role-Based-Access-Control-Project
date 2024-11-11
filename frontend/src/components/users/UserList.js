import React, { useState, useEffect } from 'react'; 
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import UserForm from './UserForm';
import './Users.css';
import { FaSearch, FaTimes, FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [userToEdit, setUserToEdit] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const { user } = useUser();
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            console.log('Fetched Users:', response.data);
            setUsers(response.data);
        }).catch(error => {
            console.error("Error fetching users:", error);
        });
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, users]);

    const handleDeleteUser = (userId) => {
        axios.delete(`/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(() => {
            setUsers(users.filter(user => user._id !== userId));
        }).catch(error => {
            console.error("Error deleting user:", error);
        });
    };

    const handleEditUser = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        setUserToEdit(userToEdit);  // Set the user data to edit
        setShowAddUserForm(true);   // Show the form
    };

    const handleUpdateUser = (updatedUser) => {
        const updatedUsers = users.map(user =>
            user._id === updatedUser._id ? updatedUser : user
        );
        setUsers(updatedUsers);  // Update the users state with the updated user
    };
    
    // Accessing permissions using safe checks
    const canAddUser = user?.permissions?.users?.add;
    const canEditUser = user?.permissions?.users?.edit;
    const canDeleteUser = user?.permissions?.users?.delete;

    return (
        <div className="user-list-container">
            <h2 className="user-list-title">User List</h2>

            {/* Conditionally show either User List or User Form */}
            {!showAddUserForm ? (
                <>
                    {/* Search and Add Product in same container */}
                    <div className="user-list-top-container">
                        {/* Search Bar */}
                        <div className="user-list-search-bar">
                            {/* Show the search icon if no text is entered, otherwise show the close icon */}
                            {search === '' ? (
                                <FaSearch className="user-list-search-icon" />
                            ) : (
                                <FaTimes className="user-list-close-icon" onClick={() => setSearch('')} />
                            )}
                            <input
                                type="text"
                                placeholder="Search Users"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {canAddUser && (
                            <button className="add-user-button" onClick={() => setShowAddUserForm(true)}>
                                Add User
                            </button>
                        )}
                    </div>

                    {/* Display Users in a Table */}
                    {filteredUsers.length > 0 ? (
                        <table className="user-list-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    {/* Conditionally render Action column header */}
                                    {(canEditUser || canDeleteUser) && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role ? user.role.name : 'No Role'}</td>
                                        {/* Conditionally render Action column cells */}
                                        {(canEditUser || canDeleteUser) && (
                                            <td>
                                                {canEditUser && (
                                                    <FaEdit
                                                        className="user-list-edit-icon"
                                                        onClick={() => handleEditUser(user._id)}
                                                    />
                                                )}
                                                {canDeleteUser && (
                                                    <FaTrashAlt
                                                        className="user-list-delete-icon"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    />
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </>
            ) : (
                <div className="product-list-form-container">
                    <UserForm 
                        setShowAddUserForm={setShowAddUserForm}
                        userToEdit={userToEdit}   
                        onUpdateUser={handleUpdateUser} 
                    />
                </div>
            )}
        </div>
    );
};

export default UserList;
