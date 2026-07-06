import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmount } from "../../actions/orderActions";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN");

function TotalView({ page = "cart" }) {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const { cartItems, stateChangeNotifyCounter } = useSelector(
    (state) => state.cartReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let mrpTotal = 0;
    let discountTotal = 0;

    cartItems.forEach((item) => {
      const qty = item.qty || 1;
      mrpTotal += item.price.mrp * qty;
      discountTotal += (item.price.mrp - item.price.cost) * qty;
    });

    const payable = mrpTotal - discountTotal;
    const delivery = payable > 999 ? 0 : 40;

    setPrice(mrpTotal);
    setDiscount(discountTotal);
    setDeliveryCharges(delivery);

    if (page === "checkout") {
      dispatch(setTotalAmount(payable + delivery));
    }
  }, [cartItems, stateChangeNotifyCounter, dispatch, page]);

  const total = price - discount + deliveryCharges;
  const itemQty = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  if (page === "cart-footer") {
    return <strong>₹{formatPrice(total)}</strong>;
  }

  return (
    <div className="cart-summary">
      <div className="cart-summary__header">Price Details</div>
      <div className="cart-summary__body">
        <div className="cart-summary__row">
          <span>Price ({itemQty} {itemQty === 1 ? "item" : "items"})</span>
          <span>₹{formatPrice(price)}</span>
        </div>
        {(page === "cart" || page === "checkout") && discount > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <span>Discount</span>
            <span>-₹{formatPrice(discount)}</span>
          </div>
        )}
        <div className="cart-summary__row">
          <span>Delivery</span>
          <span>{deliveryCharges > 0 ? `₹${deliveryCharges}` : "FREE"}</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>{page === "checkout" ? "Total Payable" : "Total Amount"}</span>
          <span>₹{formatPrice(total)}</span>
        </div>
        {page === "cart" && discount > 0 && (
          <p className="cart-summary__savings">
            You will save ₹{formatPrice(Math.max(discount - deliveryCharges, 0))} on this order
          </p>
        )}
        {page === "cart" && (
          <Link to="/checkout?init=true" className="bag-btn bag-btn--primary cart-summary__checkout-btn">
            Place Order
          </Link>
        )}
      </div>
    </div>
  );
}

export default TotalView;
