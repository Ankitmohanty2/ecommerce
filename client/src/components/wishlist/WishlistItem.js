import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { makeShortText } from "../../utils/makeShortText";
import { addToCart } from "../../actions/cartActions";
import AlertDialogBox from "../AlertDialgBox";
import toastMessage from "../../utils/toastMessage";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const getDiscount = (item) => {
  if (item.price.mrp <= item.price.cost) return 0;
  return Math.round(((item.price.mrp - item.price.cost) / item.price.mrp) * 100);
};

function WishlistItem({ item }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const discount = getDiscount(item);

  const moveToBag = () => {
    dispatch(addToCart(item));
    toastMessage("Added to bag", "success");
  };

  return (
    <>
      <article className="wishlist-card">
        <Link to={`/product/${item._id}`} className="wishlist-card__link">
          <div className="wishlist-card__image-wrap">
            <img
              src={item.url}
              alt={item.title?.shortTitle || "Product"}
              className="wishlist-card__image"
            />
          </div>
          {item.brand && <p className="wishlist-card__brand">{item.brand}</p>}
          <h2 className="wishlist-card__name">
            {item.title?.longTitle
              ? makeShortText(item.title.longTitle)
              : item.title?.shortTitle}
          </h2>
          <div className="wishlist-card__prices">
            <span className="wishlist-card__price">₹{formatPrice(item.price.cost)}</span>
            {item.price.mrp > item.price.cost && (
              <>
                <span className="wishlist-card__mrp">₹{formatPrice(item.price.mrp)}</span>
                <span className="wishlist-card__discount">{discount}% off</span>
              </>
            )}
          </div>
        </Link>

        <div className="wishlist-card__actions">
          <button type="button" className="bag-btn bag-btn--primary bag-btn--sm wishlist-card__bag-btn" onClick={moveToBag}>
            Add to Bag
          </button>
          <button
            type="button"
            className="wishlist-card__remove"
            onClick={() => setIsOpenDialog(true)}
            aria-label="Remove from wishlist"
          >
            <DeleteOutlineIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </article>

      <AlertDialogBox
        isOpenDialog={isOpenDialog}
        handleClose={() => setIsOpenDialog(false)}
        itemId={item._id}
        type="wishlist"
      />
    </>
  );
}

export default WishlistItem;
