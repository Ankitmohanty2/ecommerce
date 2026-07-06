import React, { useState } from "react";
import { Link } from "react-router-dom";

import { makeShortText } from "../../utils/makeShortText";
import GroupButton from "./GroupButton";
import AlertDialogBox from "../AlertDialgBox";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const getDiscount = (item) => {
  if (item.price.mrp <= item.price.cost) return 0;
  return Math.round(((item.price.mrp - item.price.cost) / item.price.mrp) * 100);
};

function CartItem({ item }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const discount = getDiscount(item);

  return (
    <>
      <article className="cart-item">
        <div className="cart-item__media">
          <Link to={`/product/${item._id}`} className="cart-item__image-wrap">
            <img src={item.url} alt={item.title?.shortTitle || "Product"} className="cart-item__image" />
          </Link>
          <GroupButton product={item} />
        </div>

        <div className="cart-item__body">
          <Link to={`/product/${item._id}`} className="cart-item__link">
            {item.brand && <p className="cart-item__brand">{item.brand}</p>}
            <h2 className="cart-item__name">
              {item.title?.longTitle ? makeShortText(item.title.longTitle) : item.title?.shortTitle}
            </h2>
            <p className="cart-item__meta">Sold by Vixen Fashion</p>

            <div className="cart-item__prices">
              <span className="cart-item__price">₹{formatPrice(item.price.cost)}</span>
              {item.price.mrp > item.price.cost && (
                <>
                  <span className="cart-item__mrp">₹{formatPrice(item.price.mrp)}</span>
                  <span className="cart-item__discount">{discount}% off</span>
                </>
              )}
            </div>
          </Link>

          <div className="cart-item__actions">
            <button type="button" className="cart-item__remove" onClick={() => setIsOpenDialog(true)}>
              Remove
            </button>
          </div>
        </div>
      </article>

      <AlertDialogBox
        isOpenDialog={isOpenDialog}
        handleClose={() => setIsOpenDialog(false)}
        itemId={item._id}
        type="cart"
      />
    </>
  );
}

export default CartItem;
