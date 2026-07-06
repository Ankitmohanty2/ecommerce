import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getWishlistItems } from "../actions/wishlistActions";
import Wishlist from "../components/wishlist/Wishlist";
import Footer from "../components/footer/Footer";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/CartPage.css";

function WishlistPage() {
  const { isAuthenticate } = useSelector((state) => state.userReducer);
  const { wishlistItems } = useSelector((state) => state.wishlistReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticate) {
      history.replace("/login?ref=wishlist");
      return;
    }
    dispatch(getWishlistItems());
  }, [isAuthenticate, dispatch, history]);

  if (!isAuthenticate) {
    return null;
  }

  return (
    <>
      <main className="wishlist-page">
        <div
          className={`wishlist-page__inner ${
            wishlistItems.length ? "" : "wishlist-page__inner--empty"
          }`}
        >
          <Wishlist />
        </div>
      </main>
      <Footer />
      <ToastMessageContainer />
    </>
  );
}

export default WishlistPage;
