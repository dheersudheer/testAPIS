const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      product_name: {
        type: String,
        required: true,
      },
      product_quantity: {
        type: String,
        required: true,
      },
      product_description: {
        type: String,
        required: true,
      },
      product_price: {
        type: String,
        required: true,
      },
      status: {
        type: Number,
        required: true,
      },
      added_by: {
        type: String,
        required: true,
      },
      updated_by: {
        type: String,
        required: true,
      }

    },
    { timestamps: true }
  )
);
module.exports = Product;
