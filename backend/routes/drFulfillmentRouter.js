import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import {
  createDRCheckout,
  editDRCheckout,
  getDRCustomer,
} from "../drintegration.js";

const drFulfillmentRouter = express.Router();

drFulfillmentRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newFulfillment = await fulfillDROrder(req.body);

    res.send({ message: "Order Fulfilled", fulfillment: newFulfillment });
    // } else {
    //   res.status(404).send({ message: "Checkout Not Found" });
    // }
  })
);

export default drFulfillmentRouter;
