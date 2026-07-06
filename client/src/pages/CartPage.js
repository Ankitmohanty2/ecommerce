import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { getCartItems } from "../actions/cartActions";
import CartItem from "../components/cart/CartItem";
import TotalView from "../components/cart/TotalView";
import EmptyCart from "../components/cart/EmptyCart";
import Footer from "../components/footer/Footer";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/CartPage.css";

function CartPage() {
  const { cartItems } = useSelector((state) => state.cartReducer);
  const { isAuthenticate } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticate) {
      dispatch(getCartItems());
    }
  }, [isAuthenticate, dispatch]);

  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  if (!cartItems.length) {
    return (
      <>
        <main className="cart-page">
          <div className="cart-page__inner cart-page__inner--empty">
            <EmptyCart />
          </div>
        </main>
        <Footer />
        <ToastMessageContainer />
      </>
    );
  }

  return (
    <>
      <main className="cart-page">
        <div className="cart-page__inner">
          <section className="cart-page__main">
            <header className="cart-page__header">
              <h1 className="cart-page__title">My Bag ({itemCount})</h1>
              <p className="cart-page__subtitle">
                Review items before checkout. Free delivery on orders over ₹999.
              </p>
            </header>

            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <div className="cart-page__footer-bar">
              <div className="cart-page__footer-total">
                Order total
                <TotalView page="cart-footer" />
              </div>
              <Link to="/checkout?init=true" className="bag-btn bag-btn--primary">
                Place Order
              </Link>
            </div>
          </section>

          <aside className="cart-page__sidebar">
            <TotalView page="cart" />
          </aside>
        </div>
      </main>
      <Footer />
      <ToastMessageContainer />
    </>
  );
}

export default CartPage;
