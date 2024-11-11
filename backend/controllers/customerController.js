// controllers/customerController.js
const Customer = require('../models/Customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
  if (!req.user || !req.user.permissions.includes('customers:add')) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  const { name, email, phone } = req.body;

  try {
    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customer', error });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  if (!req.user || !req.user.permissions.includes('customers:edit')) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  const { name, email, phone } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;

    await customer.save();
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    // Use findByIdAndDelete instead of remove
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error); // Log the actual error message here
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};
