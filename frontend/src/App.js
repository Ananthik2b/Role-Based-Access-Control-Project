// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login'; // Ensure this is correct
import Dashboard from './components/Dashboard/Dashboard'; // Ensure this is correct
import ProductList from './components/products/ProductList'; // Add imports for different content
import CustomerList from './components/customers/CustomerList';
import RolesList from './components/roles/RolesList';
import UserList from './components/users/UserList';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="products" element={<ProductList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="roles" element={<RolesList />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
