const path = require('path');

const express = require('express');
const { check } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const productValidation = [
  check('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Please enter a title with at least 3 characters.'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Please enter a valid price greater than 0.'),
  check('description')
    .trim()
    .isLength({ min: 5, max: 400 })
    .withMessage('Please enter a description between 5 and 400 characters.')
];

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', productValidation, isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', productValidation, isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
