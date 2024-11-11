const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes'); 
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Role = require('./models/Role');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'], // React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
  

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/customers',customerRoutes);
// Initial data setup function for hardcoded admin credentials
async function setupInitialData() {
    try {
        // Check if the "Admin" role exists
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            // Create an Admin role with full permissions
            adminRole = new Role({
                name: 'Admin',
                permissions: [
                    'users:add',
                    'users:view',
                    'users:edit',
                    'users:delete',
                    'roles:add',
                    'roles:view',
                    'roles:edit',
                    'roles:delete',
                    'products:add',
                    'products:view',
                    'products:edit',
                    'products:delete',
                    'customers:add',
                    'customers:view',
                    'customers:edit',
                    'customers:delete',

                ],
            });
            await adminRole.save();
            console.log('Admin role created');
        }

        // Check if the admin user exists
        const adminEmail = 'admin@gmail.com';  // Hardcoded admin email
        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            // Create a hardcoded admin user with the Admin role
            const hashedPassword = await bcrypt.hash('admin123', 10);  // Hardcoded password
            adminUser = new User({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: adminRole._id,
            });
            await adminUser.save();
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error setting up initial data:', error);
    }
}

// Call the setup function on server start
setupInitialData()
    .then(() => console.log('Initial data setup completed'))
    .catch((error) => console.error('Error setting up initial data:', error));


    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        // Application specific logging, throwing an error, or other logic here
    });
    
module.exports = app;
