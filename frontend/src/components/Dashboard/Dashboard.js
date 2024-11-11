import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import ProductList from '../products/ProductList';  
import CustomerList from '../customers/CustomerList'; 
import RolesList from '../roles/RolesList'; 
import UserList from '../users/UserList'; 
import Settings from '../Settings/Settings';
import './Dashboard.css';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [activeMenu, setActiveMenu] = useState('products'); // Default to 'products'

    // Check localStorage for previously active menu on page load (after login or refresh)
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
        } else {
            console.error('No user email found in local storage');
        }

        // Check if an active menu is stored in localStorage
        const storedActiveMenu = localStorage.getItem('activeMenu');
        if (storedActiveMenu) {
            setActiveMenu(storedActiveMenu); // Use stored active menu, if available
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('activeMenu'); // Clear active menu on logout
        window.location.href = '/';
    };

    // This function is called when a menu item is clicked in the Sidebar
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        localStorage.setItem('activeMenu', menu); // Save active menu to localStorage
        setSidebarOpen(false); // Close the sidebar
    };

    // Render the content based on the active menu
    const renderContent = () => {
        switch (activeMenu) {
            case 'products':
                return <ProductList />;
            case 'customers':
                return <CustomerList />;
            case 'roles':
                return <RolesList />;
            case 'users':
                return <UserList />;
            case 'settings':
                return <Settings />;
            default:
                return <ProductList />; // Default view is Product List
        }
    };

    return (
        <div className="dashboard">
            <Topbar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
            <Sidebar
                userEmail={userEmail}
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onMenuClick={handleMenuClick} // Pass the menu click handler to Sidebar
                activeMenu={activeMenu} // Pass active menu to Sidebar
            />

            <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {renderContent()} {/* Render content based on active menu */}
            </div>
        </div>
    );
};

export default Dashboard;
