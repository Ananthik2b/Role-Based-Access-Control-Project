import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    code: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        code: product.code,
        description: product.description,
        image: product.image, // Keep image as is, no change to this
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Handle image input as before
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Call the onSave callback with the form data
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{product ? 'Edit Product' : 'Add Product'}</h3>

      <div className="form-row">
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="code">Product Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default ProductForm;
