const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Create a new user
router.post('/',userController.createUser);
// Get all users
router.get('/', authenticateToken, authorize(['users:view']), userController.getUsers);

// Update a user
router.put('/:id', authenticateToken, authorize(['users:edit']), userController.updateUser);

// Delete a user
router.delete('/:id', authenticateToken, authorize(['users:delete']), userController.deleteUser);

module.exports = router;
