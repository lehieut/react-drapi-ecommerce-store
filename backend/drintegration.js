import Axios from "axios";

// function opt(options, name, defaultvalue) {
//   return options && options[name] !== undefined ? options[name] : defaultvalue;
// }

// function optionalArguments(options) {
//   var a = opt(options, "a", "nothing");
//   var b = opt(options, "b", "nothing");
// }

// ************ CUSTOMER API CALLS ************

export const getDRCustomer = async (id) => {
  // accepts id retrieves a customer via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/retrieveCustomers
  var options = {
    method: "GET",
    url: `https://api.digitalriver.com/customers/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
  };
  const customer = await Axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return customer;
};

export const createDRCustomer = async (id, options) => {
  // accepts id and additional optional parameters and creates a customer via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/createCustomers
  const postOptions = {
    method: "POST",
    url: "https://api.digitalriver.com/customers/",
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: {
      id: `${id}`,
      email: options.email,
    },
  };
  //   console.log(postOptions);
  const newCustomer = await Axios(postOptions)
    .then((response) => response.data)
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      //   console.log(err.response.status + " - " + message);
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return newCustomer;
};

export const editDRCustomer = async (id, options) => {
  // accepts id and additional optional parameters and creates a customer via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/createCustomers
  const postOptions = {
    method: "POST",
    url: `https://api.digitalriver.com/customers/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: {
      email: options.email,
    },
  };
  //   console.log(postOptions);
  const customer = await Axios(postOptions)
    .then((response) => response.data)
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      //   console.log(err.response.status + " - " + message);
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return customer;
};

// ************ SKU API CALLS ************

export const getDRProductList = () => {
  var options = {
    method: "GET",
    url: "https://api.digitalriver.com/skus/",
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
  };
  const data = Axios(options).then((response) => response.data);
  return data;
  // res.send(result);
};

export const createDRProduct = async (id, options) => {
  // accepts id and additional optional parameters and creates a sku via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/createSkus
  const postOptions = {
    method: "POST",
    url: "https://api.digitalriver.com/skus/",
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: {
      id: id,
      name: options.name,
      description: options.description,
      eccn: options.eccn,
      hsCode: options.hsCode,
      taxCode: options.taxCode,
      countryOfOrigin: options.countryOfOrigin,
    },
  };
  const product = await Axios(postOptions)
    // .then((response) => res.json(response.data))
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return product;
};

export const editDRProduct = async (id, options) => {
  // accepts id and additional optional parameters and edits an existing sku via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/updateSkus
  const postOptions = {
    method: "POST",
    url: `https://api.digitalriver.com/skus/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: {
      name: options.name,
      description: options.description,
      eccn: options.eccn,
      hsCode: options.hsCode,
      taxCode: options.taxCode,
      countryOfOrigin: options.countryOfOrigin,
    },
  };
  const product = await Axios(postOptions)
    // .then((response) => res.json(response.data))
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return product;
};

export const deleteDRProduct = (id) => {
  // accepts id deletes a sku via DR API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/deleteSkus
  const postOptions = {
    method: "DELETE",
    url: `https://api.digitalriver.com/skus/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
  };
  try {
    Axios(postOptions);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (error.response.status === 404) {
      throw new Error(`${error.config.url} not found`);
    }
    if (error.response.status === 400) {
      throw new Error(`${message} !!!!`);
    }
    console.log(error.message);
    throw error;
  }
};

// ************ CHECKOUT API CALLS ************

export const getDRCheckout = (id) => {
  var options = {
    method: "GET",
    url: `https://api.digitalriver.com/checkouts/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
  };

  Axios(options)
    // .then((response) => res.json(response.data))
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
};

export const createDRCheckout = async (options) => {
  // creating a checkout session via Digital River API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#tag/Orders
  const postOptions = {
    method: "POST",
    url: "https://api.digitalriver.com/checkouts",
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: {
      customerId: options.customerId,
      currency: options.currency,
      email: options.email,
      items: options.items,
    },
  };
  const checkout = await Axios(postOptions)
    .then((response) => {
      // console.log(response.data);
      // console.log(response.status);
      return response.data;
    })
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return checkout;
};

export const editDRCheckout = async (id, options) => {
  // creating a checkout session via Digital River API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#tag/Orders
  const postOptions = {
    method: "POST",
    url: `https://api.digitalriver.com/checkouts/${id}`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: options,
  };
  const checkout = await Axios(postOptions)
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !!!!`);
      }
      throw err;
    });
  return checkout;
};

// PLACE ORDER
export const placeDROrder = async (options) => {
  // submits an order via Digital River API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/createOrders
  const postOptions = {
    method: "POST",
    url: `https://api.digitalriver.com/orders`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: options,
  };
  console.log("placeDROrder");
  console.log(options);
  const checkout = await Axios(postOptions)
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !`);
      }
      throw err;
    });
  return checkout;
};

// FULFILLMENT
export const fulfillDROrder = async (options) => {
  // fulfills order via Digital River API
  // https://www.digitalriver.com/docs/digital-river-api-reference/#operation/createFulfillments
  const postOptions = {
    method: "POST",
    url: `https://api.digitalriver.com/fulfillments`,
    headers: {
      Authorization: `Bearer ${process.env.DR_CONFIDENTIAL_KEY}`,
    },
    data: options,
  };
  console.log("fulfillDROrder");
  console.log(options);
  const checkout = await Axios(postOptions)
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      if (err.response.status === 404) {
        throw new Error(`${err.config.url} not found`);
      }
      if (err.response.status === 400) {
        throw new Error(`${message} !`);
      }
      throw err;
    });
  return checkout;
};
