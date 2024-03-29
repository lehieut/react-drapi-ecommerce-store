import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

import DrjsWrapper from '../components/drjs';
import DropIn from '../components/DropIn';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { billingAddress, paymentMethod, checkoutSession },
  } = state;

  const API_KEY = 'pk_test_2c5d83e7268f4b898f6b972c15f2416a';
  const sessionId = JSON.parse(localStorage.getItem('checkoutSession')).payment
    .session.id; //The payment session identifier returned by Digital River.
  const [sourceData, setSourceData] = useState(); //For create source data.

  // const [paymentMethodName, setPaymentMethod] = useState(
  //   paymentMethod || "PayPal"
  // );

  useEffect(() => {
    if (!billingAddress.billingAddress1) {
      navigate('/billing');
    }
  }, [billingAddress, navigate]);

  // useEffect(() => {
  //   console.log(JSON.parse(localStorage.getItem('checkoutSession')));
  //   let scriptLoaded = document.querySelector(
  //     `script[src="https://js.digitalriverws.com/v1/DigitalRiver.js"]`
  //   );
  //   if (!scriptLoaded) {
  //     const script = document.createElement('script');
  //     script.type = 'text/javascript';
  //     script.src = `https://js.digitalriverws.com/v1/DigitalRiver.js`;
  //     script.async = true;
  //     script.onload = () => {
  //       const scriptBlock = document.createElement('script');
  //       scriptBlock.innerHTML = `
  //     let digitalriverpayments = new DigitalRiver(
  //       "pk_test_2c5d83e7268f4b898f6b972c15f2416a",
  //       {
  //         locale: "en_US",
  //       }
  //     );

  //     let configuration = {
  //       sessionId: "${
  //         JSON.parse(localStorage.getItem('checkoutSession')).payment.session.id
  //       }",
  //       options: {
  //         flow: "checkout",
  //         redirect: {
  //           disableAutomaticRedirects: true,
  //           returnUrl: "",
  //           cancelUrl: "",
  //         },
  //         showComplianceSection: true,
  //       },
  //       onSuccess: function (data) {
  //         const sourceId = data.source.id;
  //         window.location = "/placeorder/" + sourceId;
  //       },
  //       onError: function (data) {},
  //       onReady: function (data) {},
  //       onCancel: function (data) {},
  //     };

  //     let dropin = digitalriverpayments.createDropin(configuration);
  //     dropin.mount("drop-in");
  //     `;
  //       document.body.appendChild(scriptBlock);
  //     };

  //     const stylesheet = document.createElement('link');
  //     stylesheet.type = 'text/css';
  //     stylesheet.rel = 'stylesheet';
  //     stylesheet.href = `https://js.digitalriverws.com/v1/css/DigitalRiver.css`;

  //     document.body.appendChild(stylesheet);
  //     document.body.appendChild(script);
  //   }
  // }, [checkoutSession]);

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
        <DrjsWrapper
          APIKey={API_KEY}
          sessionId={sessionId}
          returnSource={(_source) => {}}
          sourceData={sourceData}
        >
          <DropIn
            showSavePaymentAgreement={true}
            showTermsOfSaleDisclosure={true}
            showComplianceSection={true}
            flow={'checkout'}
            usage={''}
            buttonText={'payNow'}
            onSuccess={(source) => {
              // console.log(source);
              // console.log(source.source.id);
              // alert(JSON.stringify(source, null, 4));
              const sourceId = source.source.id;
              window.location = '/placeorder/' + sourceId;
            }}
            onError={(_error) => {
              console.error(_error);
              alert(_error);
            }}
            onReady={() => console.log('Ready')}
          />
        </DrjsWrapper>
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
