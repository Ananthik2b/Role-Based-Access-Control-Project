import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt,FaSearch,FaTimes, FaSortNumericUpAlt } from 'react-icons/fa';
import CustomerForm from './CustomerForm';
import './Customers.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

  // Fetch customers on component mount
  useEffect(() => {
        // Fetch the user's permissions from the JWT token stored in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
          setUserPermissions(decoded.permissions); // Set the user's permissions
        }
    getCustomers();
  }, []);

 
  // Fetch all customers from the API
  const getCustomers = () => {
    axios.get('http://localhost:5000/api/customers', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  };

  // Handle customer deletion
  const handleDeleteCustomer = (customerId) => {
    axios.delete(`http://localhost:5000/api/customers/${customerId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        setCustomers(customers.filter(customer => customer._id !== customerId));
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  // Show form to add a new customer
  const handleAddCustomer = () => {
    setEditCustomer(null);
    setShowForm(true);
  };

  // Show form to edit an existing customer
  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);
    setShowForm(true);
  };

  // Save new or updated customer
  const handleFormSave = (savedCustomer) => {
    if (editCustomer) {
      setCustomers(customers.map(c => (c._id === savedCustomer._id ? savedCustomer : c)));
    } else {
      setCustomers([...customers, savedCustomer]);
    }
    setShowForm(false);
    setEditCustomer(null);
  };

  // Cancel and close the form
  const handleFormCancel = () => {
    setShowForm(false);
    setEditCustomer(null);
  };
  // Function to check if a user has a particular permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // Filter products based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Check if user has permission to Edit or Delete
  const canEditOrDelete = hasPermission('products:edit') || hasPermission('products:delete');




  return (
    <div className="customer-list-container">
      <h2 className="customer-list-title">Customer List</h2>
     {/* Conditionally render either product list or the form */}
    {!showForm && (
      <>
      {/* Search and Add Product in same container */}
      <div className="customer-list-top-container">
         {/* Search Bar */}
        <div className="customer-list-search-bar">
          {/* Show the search icon if no text is entered, otherwise show the close icon */}
          {searchQuery === '' ? (
             <FaSearch className="customer-list-search-icon" />
            ) : (
              <FaTimes className="customer-list-close-icon" onClick={() => setSearchQuery('')} />
            )}
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search products..." 
                className="product-list-search-input"
              />
            </div>
             {/* Add Product button */}
             {hasPermission('customers:add') && (
              <button className="customer-list-add-button" onClick={handleAddCustomer}>Add Customer</button>
            )}
          </div>
  

      {/* Display customer table */}
      <table className="customer-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
             {/* Conditionally render the Actions column */}
             {(canEditOrDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
                 {/* Conditionally render Action column and its contents */}
                 {canEditOrDelete && (
                    <td>
                      {hasPermission('customers:edit') && (
                        <FaEdit className="customer-list-edit-icon" onClick={() =>handleEditCustomer(customer)} />
                      )}
                      {hasPermission('customers:delete') && (
                        <FaTrashAlt className="customer-list-delete-icon" onClick={() => handleDeleteCustomer(customer._id)} />
                      )}
                    </td>
                 )}

            </tr>
          ))}
        </tbody>
      </table>
      </>
      )}

      {/* Conditional rendering of the CustomerForm component */}
      {showForm && (
        <div className="customer-list-form-container">
        <CustomerForm
          customer={editCustomer}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
    </div>
      )}
      </div>
  );
};

export default CustomerList;
