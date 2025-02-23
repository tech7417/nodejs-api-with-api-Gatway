const productsModal = require('../models/products.model');
const bcrypt = require('bcrypt');

class ProductController {
    constructor() { }


    /**
     * getAllProducts: get all products from the database and return a list of products that        
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getAllProducts(req, res) {
        try {
            const products = await productsModal.find().lean();
            if (products) {
                return res.status(200).json({ products: products });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * getProductById: get single  products from the database and return a single  of products that        
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

    async getProductById(req, res) {
        try {
            const products = await productsModal.findById(req.params.id);
            if (!products) {
                return res.status(404).json({ message: "products not found" });
            }
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * createProducts:  create a new product by admin or admin admin    
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

     async createProducts(req, res) {
        const { name, price , description, stock} = req.body;
        if (!name || !price || !description || !stock) {
            return res.status(404).json({ message: "All fields are required" });
        }

      
        try {
            const isProductExist = await productsModal.findOne({ name });;
            if (isProductExist) {
                return res.status(400).json({ message: "product name already exists" });
            }
            const products = new productsModal(req.body);
            await products.save();
            return res.status(200).json({ data: products });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

/**
 * updateProduct: update product by admin 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

    async updateProduct(req, res) {
        try {
             await productsModal.findByIdAndUpdate(req.params.id, req.body);;
        
            return res.status(200).json({message: "product updated successfully"});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }


    /**
     * deleteProduct: delete a product by admin 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async deleteProduct(req, res) {
          try {
            await productsModal.findByIdAndDelete(req.params.id);;
            return res.status(200).json({message: "product deleted successfully"});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
  


}


module.exports = new ProductController();