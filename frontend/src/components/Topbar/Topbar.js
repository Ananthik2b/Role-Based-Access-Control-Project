// src/components/Topbar/Topbar.js

import React from 'react';
import './Topbar.css';

const Topbar = ({ toggleSidebar, onLogout }) => {
    return (
        <div className="topbar">
            <div className="hamburger" onClick={toggleSidebar}>
                ☰
            </div>
            <button className="logout-button" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
};

export default Topbar;
