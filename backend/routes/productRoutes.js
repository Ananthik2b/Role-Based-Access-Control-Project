// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware'); // Ensure correct imports for auth

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // Ensure this folder exists
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Product routes with authorization middleware
router.post('/', authenticateToken, authorize(['products:add']), upload.single('image'), productController.createProduct);
router.get('/', authenticateToken, authorize(['products:view']), productController.getProducts);
router.get('/:id', authenticateToken, authorize(['products:view']), productController.getProductById);
router.put('/:id', authenticateToken, authorize(['products:edit']), upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorize(['products:delete']), productController.deleteProduct);

module.exports = router;
