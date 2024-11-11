import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Search and Close icons
import ProductForm from './ProductForm';
import './Product.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);  // This controls visibility of the form
  const [editProduct, setEditProduct] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

  useEffect(() => {
    // Fetch the user's permissions from the JWT token stored in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
      setUserPermissions(decoded.permissions); // Set the user's permissions
    }

    // Fetch the products when the component is mounted
    getProducts();
  }, []);

  // Fetch all products from the API
  const getProducts = () => {
    axios.get('http://localhost:5000/api/products', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:5000/api/products/${productId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        setProducts(products.filter(product => product._id !== productId));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  // Show form to add a new product
  const handleAddProduct = () => {
    setEditProduct(null);
    setShowForm(true);  // Show the form and hide the list
  };

  // Show form to edit an existing product
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowForm(true);  // Show the form and hide the list
  };

  const handleFormSave = (savedProduct) => {
    const formData = new FormData();
    formData.append('name', savedProduct.name);
    formData.append('price', savedProduct.price);
    formData.append('code', savedProduct.code);
    formData.append('description', savedProduct.description);
    
    if (savedProduct.image instanceof File) {
      formData.append('image', savedProduct.image);
    }
  
    if (editProduct) {
      // Handle product update
      axios.put(`http://localhost:5000/api/products/${editProduct._id}`, formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        },
      })
        .then((response) => {
          setProducts(products.map(p => (p._id === response.data._id ? response.data : p)));
          setShowForm(false);
          setEditProduct(null);
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    } else {
      // Handle new product creation
      axios.post('http://localhost:5000/api/products', formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        },
      })
        .then((response) => {
          setProducts([...products, response.data]);
          setShowForm(false);
        })
        .catch((error) => {
          console.error("Error creating product:", error);
        });
    }
  };
  

  // Cancel and close the form
  const handleFormCancel = () => {
    setShowForm(false);  // Close the form and show the list
    setEditProduct(null);
  };

  // Function to check if a user has a particular permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

 // Filter products based on search query
const filteredProducts = products.filter(product => 
  product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Check if user has permission to Edit or Delete
  const canEditOrDelete = hasPermission('products:edit') || hasPermission('products:delete');

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>

      {/* Conditionally render either product list or the form */}
      {!showForm && (
        <>
          {/* Search and Add Product in same container */}
          <div className="product-list-top-container">
            {/* Search Bar */}
            <div className="product-list-search-bar">
              {/* Show the search icon if no text is entered, otherwise show the close icon */}
              {searchQuery === '' ? (
                <FaSearch className="product-list-search-icon" />
              ) : (
                <FaTimes className="product-list-close-icon" onClick={() => setSearchQuery('')} />
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
            {hasPermission('products:add') && (
              <button className="product-list-add-button" onClick={handleAddProduct}>Add Product</button>
            )}
          </div>

          {/* Display product table */}
          <table className="product-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Code</th>
                <th>Description</th>
                <th>Image</th>
                {/* Conditionally render the Actions column */}
                {(canEditOrDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product,index) => (
                <tr key={product._id || product.name+index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.code}</td>
                  <td>{product.description}</td>
                  <td>
                    {/* Image rendering */}
                    {product.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        alt="product"
                        width="50"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  {/* Conditionally render Action column and its contents */}
                  {canEditOrDelete && (
                    <td>
                      {hasPermission('products:edit') && (
                        <FaEdit className="product-list-edit-icon" onClick={() => handleEditProduct(product)} />
                      )}
                      {hasPermission('products:delete') && (
                        <FaTrashAlt className="product-list-delete-icon" onClick={() => handleDeleteProduct(product._id)} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Conditional rendering of the ProductForm component */}
      {showForm && (
        <div className="product-list-form-container">
          <ProductForm
            product={editProduct}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
