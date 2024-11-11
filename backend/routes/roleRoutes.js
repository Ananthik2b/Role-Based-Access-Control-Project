// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Role routes
router.post('/', authenticateToken, authorize(['roles:add']), roleController.createRole);
router.get('/', authenticateToken, authorize(['roles:view']), roleController.getRoles);
router.get('/:id', authenticateToken, authorize(['roles:view']), roleController.getRoleById);
router.put('/:id', authenticateToken, authorize(['roles:edit']), roleController.updateRole);
router.delete('/:id', authenticateToken, authorize(['roles:delete']), roleController.deleteRole);

module.exports = router;
