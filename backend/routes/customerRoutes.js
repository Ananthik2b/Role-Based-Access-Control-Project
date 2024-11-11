// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware'); // Ensure correct imports for auth

// Customer routes with authorization middleware
router.post('/', authenticateToken, authorize(['customers:add']), customerController.createCustomer);
router.get('/', authenticateToken, authorize(['customers:view']), customerController.getCustomers);
router.get('/:id', authenticateToken, authorize(['customers:view']), customerController.getCustomerById);
router.put('/:id', authenticateToken, authorize(['customers:edit']), customerController.updateCustomer);
router.delete('/:id', authenticateToken, authorize(['customers:delete']), customerController.deleteCustomer);

module.exports = router;
