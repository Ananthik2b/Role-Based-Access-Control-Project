// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { FaBox, FaUsers, FaCog, FaUserShield } from 'react-icons/fa'; // Import icons
import './Sidebar.css';
import userLogo from '../../assets/user-logo.png';

const Sidebar = ({ userEmail, isOpen, toggleSidebar, onMenuClick, activeMenu }) => {
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const toggleAdminMenu = () => {
        setIsAdminOpen(!isAdminOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <img src={userLogo} alt="User Logo" className="user-logo" />
                <p>{userEmail}</p>
            </div>
            <nav>
                <ul>
                    <li>
                        <button
                            className={`sidebar-btn ${activeMenu === 'products' ? 'active' : ''}`}
                            onClick={() => onMenuClick('products')}
                        >
                            <FaBox /> Products
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-btn ${activeMenu === 'customers' ? 'active' : ''}`}
                            onClick={() => onMenuClick('customers')}
                        >
                            <FaUsers /> Customers
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-btn ${activeMenu === 'settings' ? 'active' : ''}`}
                            onClick={() => onMenuClick('settings')}
                        >
                            <FaCog /> Settings
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-btn admin-menu-btn ${activeMenu === 'users' || activeMenu === 'roles' ? 'active' : ''}`}
                            onClick={toggleAdminMenu}
                        >
                            <FaUserShield /> Admin Users
                            <span className="arrow">{isAdminOpen ? '▼' : '►'}</span>
                        </button>
                        {isAdminOpen && (
                            <ul className="submenu">
                                <li>
                                    <button
                                        className={`sidebar-btn ${activeMenu === 'users' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('users')}
                                    >
                                        Users
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`sidebar-btn ${activeMenu === 'roles' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('roles')}
                                    >
                                        Roles
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
