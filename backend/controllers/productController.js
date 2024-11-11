// controllers/productController.js
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// controllers/productController.js

exports.createProduct = async (req, res) => {
  const { name, price, code, description } = req.body;

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(403).json({ message: 'Forbidden: User not authenticated' });
  }

  // Ensure user has permissions to add products
  if (!req.user.permissions || !req.user.permissions.includes('products:add')) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions to add product' });
  }

  // Handle file (image) upload from FormData
  const image = req.file ? req.file.filename : null; // Get the image file name if present

  try {
    const newProduct = new Product({ name, price, code, description, image });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};



exports.getProducts = async (req, res) => {
  try {
      const products = await Product.find();
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, code, description } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update image if a new image is provided
    if (req.file) {
      // Check if the old image exists before attempting to delete it
      const oldImagePath = path.join(__dirname, '../uploads', product.image);
      if (product.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image
      }
      product.image = req.file.filename; // Assign new image
    }

    // Update other product details
    product.name = name || product.name;
    product.price = price || product.price;
    product.code = code || product.code;
    product.description = description || product.description;

    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};
// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product has an image and if it exists on disk
    if (product.image) {
      const imagePath = path.join(__dirname, '../uploads', product.image);
      
      // Check if the file exists before trying to delete it
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    // Delete the product using findByIdAndDelete instead of product.remove
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};