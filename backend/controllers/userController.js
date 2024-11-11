const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password, roleId } = req.body;

    // Log the incoming roleId for debugging
    console.log('Received roleId:', roleId); // <-- Log added here

    try {
        // Check if the roleId is valid
        const role = await Role.findById(roleId);
        if (!role) return res.status(400).json({ message: 'Invalid role ID' });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: roleId, // Store the ObjectId of the role
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users with populated role details
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name'); // Populating role with the role details (name, permissions)
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update an existing user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Validate role ID if it's in updated data
        if (updatedData.role || updatedData.roleId) {
            const roleIdToUpdate = updatedData.role || updatedData.roleId;
            const role = await Role.findById(roleIdToUpdate);
            if (!role) return res.status(400).json({ message: 'Invalid role ID' });
            updatedData.role = roleIdToUpdate; // Make sure `role` is set correctly in `updatedData`
        }

        // Update the user document with new data
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
