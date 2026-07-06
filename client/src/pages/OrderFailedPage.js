import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "../components/footer/Footer";
import "../styles/CartPage.css";

function OrderFailedPage() {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.replace("/");
    }, 30000);
    return () => clearTimeout(timer);
  }, [history]);

  return (
    <>
      <main className="cart-page">
        <div className="cart-page__inner cart-page__inner--empty">
          <div className="bag-empty">
            <div className="bag-empty__icon" aria-hidden="true">!</div>
            <h1 className="bag-empty__title">Payment failed</h1>
            <p className="bag-empty__text">
              Something went wrong while placing your order. Please try again or use a different payment method.
            </p>
            <Link to="/cart" className="bag-btn bag-btn--primary">
              Back to Bag
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderFailedPage;
