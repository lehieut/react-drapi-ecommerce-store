import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import {
  createDRCheckout,
  editDRCheckout,
  getDRCustomer,
} from "../drintegration.js";

const drCheckoutRouter = express.Router();

drCheckoutRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let custInfo = await getDRCustomer(req.body.customerId);
    let checkoutPayload = {
      customerId: req.body.customerId,
      email: req.body.email,
      items: req.body.items,
      currency: "USD",
    };
    if (custInfo && custInfo.shipping) {
      // shipTo: {
      //   address: {
      //     line1: shippingAddress.address,
      //     city: shippingAddress.city,
      //     postalCode: shippingAddress.postalCode,
      //     state: "MN",
      //     country: shippingAddress.country,
      //   },
      //   name: shippingAddress.fullName,
      //   organization: "MidniteHour",
      // },
    }
    let checkoutSession = await createDRCheckout(checkoutPayload);
    res.send({ message: "Checkout Created", checkoutSession: checkoutSession });
  })
);

drCheckoutRouter.post(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const checkoutId = req.params.id;
    const newCheckout = await editDRCheckout(checkoutId, req.body);

    res.send({ message: "Checkout Updated", checkout: newCheckout });
    // } else {
    //   res.status(404).send({ message: "Checkout Not Found" });
    // }
  })
);

export default drCheckoutRouter;
