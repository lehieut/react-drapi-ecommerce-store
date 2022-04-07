import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { billingAddress, paymentMethod, checkoutSession },
  } = state;

  // const [paymentMethodName, setPaymentMethod] = useState(
  //   paymentMethod || "PayPal"
  // );

  useEffect(() => {
    if (!billingAddress.billingAddress1) {
      navigate("/billing");
    }
  }, [billingAddress, navigate]);

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("checkoutSession")));
    let scriptLoaded = document.querySelector(
      `script[src="${process.env.REACT_APP_DR_DROP_IN_URL}"]`
    );
    if (!scriptLoaded) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${process.env.REACT_APP_DR_DROP_IN_URL}`;
      script.async = true;
      script.onload = () => {
        const scriptBlock = document.createElement("script");
        scriptBlock.innerHTML = `      
      let digitalriverpayments = new DigitalRiver(
        "${process.env.REACT_APP_DR_PUBLIC_KEY}",
        {
          locale: "en_US",
        }
      );
      
      let configuration = {
        sessionId: "${
          JSON.parse(localStorage.getItem("checkoutSession")).payment.session.id
        }",
        options: {
          flow: "checkout",
          redirect: {
            disableAutomaticRedirects: true,
            returnUrl: "",
            cancelUrl: "",
          },
          showComplianceSection: true,
        },
        onSuccess: function (data) {
          const sourceId = data.source.id;
          window.location = "/placeorder/" + sourceId;
        },
        onError: function (data) {},
        onReady: function (data) {},
        onCancel: function (data) {},
      };

      let dropin = digitalriverpayments.createDropin(configuration);
      dropin.mount("drop-in");
      `;
        document.body.appendChild(scriptBlock);
      };

      const stylesheet = document.createElement("link");
      stylesheet.type = "text/css";
      stylesheet.rel = "stylesheet";
      stylesheet.href = `https://js.digitalriverws.com/v1/css/DigitalRiver.css`;

      document.body.appendChild(stylesheet);
      document.body.appendChild(script);
    }
  }, [checkoutSession]);

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
  //   localStorage.setItem("paymentMethod", paymentMethodName);
  //   navigate("/placeorder");
  // };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <div className="drop-in" id="drop-in"></div>
        {/* <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form> */}
      </div>
    </div>
  );
}
