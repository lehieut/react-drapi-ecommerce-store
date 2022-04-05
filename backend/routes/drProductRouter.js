import express from "express";
import expressAsyncHandler from "express-async-handler";
import Axios from "axios";
import { isAdmin, isAuth } from "../utils.js";
// import Product from "../models/productModel.js";

const drProductRouter = express.Router();

drProductRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    var options = {
      method: "GET",
      url: "https://api.digitalriver.com/skus/",
      headers: {
        Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
      },
    };
    await Axios(options).then((response) => res.json(response.data));
    // res.send(result);
  })
);

drProductRouter.post(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    // console.log(req.data);
    var options = {
      method: "POST",
      url: "https://api.digitalriver.com/skus/",
      headers: {
        Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
      },
      data: {
        id: productId,
        name: "Sample Name" + Date.now(),
        description: "sample description",
        eccn: "EAR99",
        hsCode: "6404.20",
        taxCode: "4512.100",
        countryOfOrigin: "US",
      },
    };
    await Axios(options)
      .then((response) => res.json(response.data))
      .catch((err) => {
        const message =
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        if (err.response.status === 404) {
          throw new Error(`${err.config.url} not found`);
        }
        if (err.response.status === 400) {
          throw new Error(`${message}`);
        }
        throw err;
      });
    // res.send({ message: "Product Created", product: result });
  })
);

// drProductRouter.put(
//   "/:id",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       product.name = req.body.name;
//       product.price = req.body.price;
//       product.image = req.body.image;
//       product.category = req.body.category;
//       product.brand = req.body.brand;
//       product.countInStock = req.body.countInStock;
//       product.description = req.body.description;
//       const updatedProduct = await product.save();
//       res.send({ message: "Product Updated", product: updatedProduct });
//     } else {
//       res.status(404).send({ message: "Product Not Found" });
//     }
//   })
// );

// drProductRouter.delete(
//   "/:id",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       const deleteProduct = await product.remove();
//       res.send({ message: "Product Deleted", product: deleteProduct });
//     } else {
//       res.status(404).send({ message: "Product Not Found" });
//     }
//   })
// );

// drProductRouter.get(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const products = await Product.find({});
//     res.send(products);
//   })
// );

export default drProductRouter;
