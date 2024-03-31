const express = require('express');
const adminRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const Product = require('../models/product');

// Add Product
adminRouter.post('/admin/add-product' , adminMiddleware , async (req , res) => {
    try {
        const { name , description , quantity , price , category } = req.body;
        // const { name , description , images , quantity , price , category } = req.body; // these names of the field should match with the name of the fields present in product.dart file.
        let product = new Product({
            name,
            description,
            // images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error:e.message});
    }
});

// get all products added by admin(you) to sell
adminRouter.get('/admin/get-products' , adminMiddleware , async (req , res) => {
    try {
        const products = await Product.find({}); // req.user is id of user according to the valid token.
        res.json(products);
    } catch (e) {
        res.status(500).json({error:e.message});
    }
});

// Delete the product
adminRouter.post('/admin/delete-product' , adminMiddleware , async (req , res) => {
    try {
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        
        res.json(product); // to status code of 200.
    } catch (e) {
        res.status(500).json({error:e.message});
    }
});

module.exports = adminRouter;