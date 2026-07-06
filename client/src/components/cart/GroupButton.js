import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { updateQty } from "../../actions/cartActions";
import toastMessage from "../../utils/toastMessage";

function GroupButton({ product }) {
  const [counter, setCounter] = useState(product.qty || 1);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    if (counter + 1 <= 5) {
      setCounter((prev) => prev + 1);
      dispatch(updateQty(product._id, counter + 1));
      toastMessage(`Quantity updated to ${counter + 1}`, "success");
    } else {
      toastMessage("Maximum 5 units allowed per product", "error");
    }
  };

  const handleDecrement = () => {
    if (counter <= 1) return;
    setCounter((prev) => prev - 1);
    dispatch(updateQty(product._id, counter - 1));
    toastMessage(`Quantity updated to ${counter - 1}`, "success");
  };

  return (
    <div className="qty-stepper" aria-label="Quantity">
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={handleDecrement}
        disabled={counter <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="qty-stepper__value">{counter}</span>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default GroupButton;
