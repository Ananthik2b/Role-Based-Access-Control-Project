// controllers/authController.js
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin user check
    if (email === 'admin@gmail.com' && password === 'admin123') {
        const adminUser = await User.findOne({ email: 'admin@gmail.com' }).populate('role');
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        const permissions = adminUser.role.permissions;
        console.log('Admin Permissions:', permissions); // Debug permissions

        const token = jwt.sign(
            { id: adminUser._id, roleId: adminUser.role._id, permissions, email:adminUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ token });
    }

    try {
        const user = await User.findOne({ email }).populate('role');
        console.log('User from DB:', user);

        if (!user) {
            console.log('No user found with this email');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Debug password match

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const permissions = user.role.permissions;
        console.log('User Permissions:', permissions); // Debug permissions

        const token = jwt.sign(
            { id: user._id, roleId: user.role._id, permissions, email: user.email }, // Add email here
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );
        

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
