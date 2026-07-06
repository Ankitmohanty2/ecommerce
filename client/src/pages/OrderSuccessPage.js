import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "../components/footer/Footer";
import "../styles/CartPage.css";

function OrderSuccessPage() {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.replace("/orders");
    }, 30000);
    return () => clearTimeout(timer);
  }, [history]);

  return (
    <>
      <main className="cart-page">
        <div className="cart-page__inner cart-page__inner--empty">
          <div className="bag-empty">
            <div className="bag-empty__icon" aria-hidden="true">✓</div>
            <h1 className="bag-empty__title">Order placed successfully</h1>
            <p className="bag-empty__text">
              Thank you for shopping with Vixen Fashion. You can track your order in My Orders.
            </p>
            <Link to="/orders" className="bag-btn bag-btn--primary">
              View My Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderSuccessPage;
