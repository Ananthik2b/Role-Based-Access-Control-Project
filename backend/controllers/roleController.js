// controllers/roleController.js
const Role = require('../models/Role');

// Create a new role
exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions should be an array' });
  }

  try {
      const newRole = new Role({ name, permissions });
      await newRole.save();
      res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};
// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a role
exports.updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body; // Expect updated name and permissions
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name, permissions },
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
        res.json(updatedRole);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
