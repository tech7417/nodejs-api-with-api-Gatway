const mongoose = require('mongoose');
//  const Product = require('../../product-service/models/products.model')

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
      }
      
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' }
  },
  { timestamps: true } // Corrected placement
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
