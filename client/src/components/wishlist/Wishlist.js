import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import WishlistItem from "./WishlistItem";

function Wishlist() {
  const { wishlistItems } = useSelector((state) => state.wishlistReducer);

  if (!wishlistItems.length) {
    return (
      <section className="wishlist-page__main">
        <div className="bag-empty">
          <div className="bag-empty__icon" aria-hidden="true">
            ♡
          </div>
          <h2 className="bag-empty__title">Your wishlist is empty</h2>
          <p className="bag-empty__text">
            Save items you love and shop them anytime from here.
          </p>
          <Link to="/" className="bag-btn bag-btn--primary">
            Explore Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page__main">
      <header className="wishlist-page__header">
        <h1 className="wishlist-page__title">My Wishlist ({wishlistItems.length})</h1>
        <p className="wishlist-page__subtitle">
          Items you&apos;ve saved for later
        </p>
      </header>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <WishlistItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
