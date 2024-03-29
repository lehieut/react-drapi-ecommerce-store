import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const params = useParams();

  // console.log(cart.checkoutSession);

  const { id: sourceId } = params;
  useEffect(() => {
    if (sourceId && cart.checkoutSession) {
      const checkoutObject = {
        sourceId: sourceId,
      };
      // dispatch(editDRCheckout(cart.checkoutSession.id, checkoutObject));

      // editDRCheckout function
      async function editDRCheckout() {
        try {
          const drCheckoutSession = await Axios.post(
            `/api/drcheckout/${cart.checkoutSession.id}`,
            checkoutObject,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          // dispatch({
          //   type: DR_CHECKOUT_EDIT_SUCCESS,
          //   payload: drCheckoutSession,
          // });
          localStorage.setItem(
            'checkoutSession',
            JSON.stringify(drCheckoutSession.data.checkout)
          );
        } catch (error) {
          const message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          // dispatch({ type: DR_CHECKOUT_EDIT_FAIL, payload: message });
        }
      }
      editDRCheckout();
      navigate('/placeorder', { replace: true });
    } else {
      //
    }
  });

  // const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  // cart.itemsPrice = round2(
  //   cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  // );
  // cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  // cart.taxPrice = round2(0.15 * cart.itemsPrice);
  // cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  console.log(cart);
  cart.itemsPrice = cart.checkoutSession.subtotal;
  cart.shippingPrice = cart.checkoutSession.totalShipping;
  cart.taxPrice = cart.checkoutSession.totalTax;
  cart.totalPrice = cart.checkoutSession.totalAmount;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          billingAddress: cart.billingAddress,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          checkoutSessionId: cart.checkoutSession.id,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      localStorage.removeItem('checkoutSession');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // useEffect(() => {
  //   if (!cart.paymentMethod) {
  //     navigate("/payment");
  //   }
  // }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Review Order</title>
      </Helmet>
      <h1 className="my-3">Review Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Billing</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.billingAddress.billingFullName}{' '}
                <br />
                <strong>Address: </strong> {cart.billingAddress.billingAddress1}
                , {cart.billingAddress.billingCity},{' '}
                {cart.billingAddress.billingPostalCode},{' '}
                {cart.billingAddress.billingCountry}
              </Card.Text>
              <Link to="/billing">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/billing">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong>{' '}
                {cart.paymentMethod === 'creditCard'
                  ? 'Credit Card'
                  : cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                      <Col md={1}>
                        <Link to="/cart">
                          <i className="far fa-edit"></i>
                        </Link>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
