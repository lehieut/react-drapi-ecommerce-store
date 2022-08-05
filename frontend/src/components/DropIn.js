import React, { useEffect, useRef } from 'react';
import { useDrjsContext } from './drjs';

const DROPIN_ID = 'dr-dropin';

/**
 * The flow using Drop-in.
 * @typedef Flow
 * @type {Object}
 * @property {Object} Flow
 * @property {string} Flow.Checkout - Use this option if you are using Drop-in within a standard checkout flow.
 * @property {string} Flow.ManagePaymentMethods - Use this option to specify a different Drop-in mode of operation. Enable this flow if you are using Drop-in as part of a My Account page where your customer is managing their stored payment methods.
 * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/drop-in/drop-in-integration-guide#drop-in-options
 */
export const Flow = {
  Checkout: 'checkout',
  ManagePaymentMethods: 'managePaymentMethods',
};

/**
 * Specifying a source's future use.
 * @typedef Usage
 * @type {Object}
 * @property {Object} Usage
 * @property {string} Usage.Subscription
 * @property {string} Usage.Convenience
 * @property {string} Usage.Unscheduled
 * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/drop-in/drop-in-integration-guide#specifying-a-sources-future-use
 */
export const Usage = {
  Default: '',
  Subscription: 'subscription',
  Convenience: 'convenience',
  Unscheduled: 'unscheduled',
};

/**
 * Customizing the Drop-in button text
 * @typedef ButtonType
 * @type {Object}
 * @property {Object} ButtonType
 * @property {string} ButtonType.PayNow
 * @property {string} ButtonType.BuyNow
 * @property {string} ButtonType.CompleteOrder
 * @property {string} ButtonType.SubmitOrder
 * @property {string} ButtonType.Custom
 * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/drop-in/drop-in-integration-guide#customizing-the-drop-in-button-text
 */
export const ButtonType = {
  PayNow: 'payNow',
  BuyNow: 'buyNow',
  CompleteOrder: 'completeOrder',
  SubmitOrder: 'submitOrder',
  Custom: 'custom',
};

/**
 * The billing address of customer.
 * @typedef BillingAddress
 * @type {Object}
 * @property {Object} BillingAddress
 * @property {string} BillingAddress.firstName - The customer's first name.
 * @property {string} BillingAddress.lastName - The customer's last name.
 * @property {string} BillingAddress.email - The customer's email address.
 * @property {string} BillingAddress.phoneNumber - The customer's phone number.
 * @property {string} [BillingAddress.organization]
 * @property {BillingAddress.Address} BillingAddress.address
 * @property {BillingAddress.AdditionalAddress} [BillingAddress.address.additionalAddressInfo]
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/common-payment-objects#owner-object
 */
// eslint-disable-next-line no-unused-vars
const BillingAddress = {};

/**
 * The address data for the payment service.
 * @typedef Address
 * @memberOf BillingAddress
 * @type {Object}
 * @property {Object} address
 * @property {string} address.line1 - The first line of the billing address.
 * @property {string} [address.line2] - The second line of the billing address
 * @property {string} [address.city] - City or town.
 * @property {string} [address.state] - The state, county, province, or region.
 * @property {string} address.postalCode - ZIP or postal code.
 * @property {string} address.country - A two-letter Alpha-2 country code as described in the ISO 3166 international standard.
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/common-payment-objects#address-object
 */
// eslint-disable-next-line no-unused-vars
const Address = {};

/**
 * The additional address data for the payment service.
 * @typedef AdditionalAddress
 * @memberOf BillingAddress
 * @type {Object}
 * @property {Object} additionalAddressInfo
 * @property {string} [additionalAddressInfo.neighborhood] - The neighborhood of the Customer.
 * @property {string} [additionalAddressInfo.division]
 * @property {string} [additionalAddressInfo.phoneticFirstName]
 * @property {string} [additionalAddressInfo.phoneticLastName]
 * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/digitalriver.js/payment-methods/common-payment-objects#additional-address-information-object
 */
// eslint-disable-next-line no-unused-vars
const AdditionalAddress = {};

let dropin;

/**
 * Component for render Drop-in component.
 *
 * @component
 * @example
 * const API_KEY = 'pk_XXXXXXX';
 * const billingAddress = {
 *
 * };
 * return (
 *   <DropIn APIKey={API_KEY} billingAddress={billingAddressObject} onSuccess={} />
 * )
 * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/drop-in/drop-in-integration-guide
 * @param {string} APIKey - DigitalRiver.js public API key
 * @param {BillingAddress} billingAddress - Customer billing address
 * @param {string} [sessionId] - The payment session identifier returned by Digital River.
 * @param {string} [locale] -
 * @param {string} [flow='checkout'] -
 * @param {Boolean} [showSavePaymentAgreement=false] - When enabled, presents the customer with an option to save their payment details for future use within Drop-in. Enabling this feature will show the appropriate check boxes and localized disclosure statements and facilitate any necessary Strong Customer Authentication.
 * @param {Boolean} [showComplianceSection=true] - Will show a localized compliance link section as part of Drop-in. This is an important piece for accessing the Digital River business model.
 * @param {Boolean} [showTermsOfSaleDisclosure=false] - Use this option to show the required terms of sale disclosure. These localized terms automatically update if recurring products are purchased.
 * @param {string} [usage=''] - The flow using Drop-in.
 * @param {string} [buttonType='payNow']
 * @param {string} [buttonText]
 * @param {Function} [onSuccess] - The function called when the shopper has authorized payment and a payment source has been successfully created. Returns a Source object.
 * @param {Function} [onError] - The function called when an error has occurred.
 * @param {Function} [onCancel] - The function called when the shopper cancels the payment process before authorizing payment.
 * @param {Function} [onReady] - The function called when Drop-in is ready for user interaction.
 * @param {Object} [options] -Additional options
 * @param {Object} [paymentMethodConfiguration] - Additional configuration details. @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/drop-in/drop-in-integration-guide#configuring-payment-methods-within-drop-in
 */
export default function DropIn({
  flow = Flow.Checkout,
  showSavePaymentAgreement = false,
  showComplianceSection = true,
  showTermsOfSaleDisclosure = false,
  usage = Usage.Default,
  buttonType = ButtonType.PayNow,
  buttonText,
  onSuccess = () => {},
  onCancel = () => {},
  onError = () => {},
  onReady = () => {},
  options = {},
  paymentMethodConfiguration = {},
}) {
  const app = useDrjsContext();

  const render = () => {
    const placeholder = document.getElementById(DROPIN_ID);
    if (app.digitalRiver && placeholder) {
      try {
        let configuration = {
          options: Object.assign(
            {
              flow: flow,
              showSavePaymentAgreement: showSavePaymentAgreement,
              showComplianceSection: showComplianceSection,
              showTermsOfSaleDisclosure: showTermsOfSaleDisclosure,
              button: {},
            },
            options
          ),
          billingAddress: app.billingAddress,
          paymentMethodConfiguration: paymentMethodConfiguration,
          onSuccess: (_source) => {
            app.setSource(_source);
            onSuccess(_source);
          },
          onCancel: onCancel,
          onError: onError,
          onReady: onReady,
        };
        if (app.sessionId) {
          configuration.sessionId = app.sessionId;
        }
        if (usage && usage.length) {
          configuration.options.usage = usage;
        }
        configuration.options.button.type = buttonType;
        if (buttonType === ButtonType.Custom && buttonType) {
          configuration.options.button.buttonText = buttonText;
        }
        dropin = app.digitalRiver.createDropin(configuration);
        dropin.mount(placeholder);
        app.setElement('dropin', dropin);
      } catch (e) {
        //console.error(e);
      }
    }
  };

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      clear();
      app.clearDigitalRiver();
    } else {
      mounted.current = true;
    }
  }, [
    flow,
    showSavePaymentAgreement,
    showComplianceSection,
    showTermsOfSaleDisclosure,
    usage,
    buttonType,
    buttonText,
  ]);

  const clear = () => {
    const placeholder = document.getElementById(DROPIN_ID);
    if (placeholder) {
      placeholder.innerHTML = '';
    }
  };

  useEffect(() => {
    if (app.digitalRiver) {
      render();
    }
  }, [app.digitalRiver]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return <div id={DROPIN_ID} />;
}
