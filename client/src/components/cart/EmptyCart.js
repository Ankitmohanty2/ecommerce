import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function EmptyCart() {
  const { isAuthenticate } = useSelector((state) => state.userReducer);

  return (
    <div className="bag-empty">
      <div className="bag-empty__icon" aria-hidden="true">
        🛍
      </div>
      {isAuthenticate ? (
        <>
          <h2 className="bag-empty__title">Your bag is empty</h2>
          <p className="bag-empty__text">
            Looks like you haven&apos;t added anything yet. Explore our latest H&amp;M collection.
          </p>
          <Link to="/" className="bag-btn bag-btn--primary">
            Continue Shopping
          </Link>
        </>
      ) : (
        <>
          <h2 className="bag-empty__title">Missing bag items?</h2>
          <p className="bag-empty__text">
            Login to see items you added earlier and pick up where you left off.
          </p>
          <Link to="/login?ref=cart" className="bag-btn bag-btn--accent">
            Login
          </Link>
        </>
      )}
    </div>
  );
}

export default EmptyCart;
