import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

import axios from "../adapters/axios";
import { clearCart, getCartItems } from "../actions/cartActions";
import { getAddresses } from "../actions/addressActions";
import { setOrderItems } from "../actions/orderActions";
import { post } from "../utils/paytm";
import useQuery from "../hooks/useQuery";

import TotalView from "../components/cart/TotalView";
import AddressCard from "../components/address/AddressCard";
import Footer from "../components/footer/Footer";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/CartPage.css";
import "../styles/CheckoutPage.css";
import "../styles/AddressPage.css";

function CheckoutPage() {
  const [step, setStep] = useState("address");
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [placing, setPlacing] = useState(false);

  const { cartItems } = useSelector((state) => state.cartReducer);
  const { isAuthenticate, user } = useSelector((state) => state.userReducer);
  const { addresses } = useSelector((state) => state.addressReducer);
  const { orderItems, totalAmount } = useSelector((state) => state.orderReducer);

  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    if (query.get("init") !== "true") {
      history.replace("/cart");
      return;
    }
    if (!isAuthenticate) {
      history.replace("/login?ref=checkout&init=true");
      return;
    }
    dispatch(getCartItems());
    dispatch(getAddresses());
  }, [isAuthenticate, dispatch, history, query]);

  useEffect(() => {
    dispatch(setOrderItems(cartItems));
  }, [cartItems, dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddr) {
      setSelectedAddr(addresses[0]);
    }
  }, [addresses, selectedAddr]);

  useEffect(() => {
    if (isAuthenticate && !cartItems.length) {
      history.replace("/cart");
    }
  }, [cartItems.length, isAuthenticate, history]);

  const continueToPayment = () => {
    if (!selectedAddr) return;
    setStep("payment");
  };

  const confirmOrder = async () => {
    if (!paymentMode || !selectedAddr) return;
    setPlacing(true);

    try {
      if (paymentMode === "cash") {
        await axios.post("/orders/complete-order", {
          items: orderItems,
          userId: user._id,
          addressId: selectedAddr._id,
          totalAmount,
          paymentMode,
          paymentStatus: "Completed",
        });
        await dispatch(clearCart());
        history.replace("/order-success");
        return;
      }

      const res = await axios.post("/orders/complete-order", {
        items: orderItems,
        userId: user._id,
        addressId: selectedAddr._id,
        totalAmount,
        paymentMode: "online",
        paymentStatus: "Initiated",
      });

      const { data } = await axios.post("/payment/paytm", {
        fName: user.fname,
        lName: user.lname,
        phone: user.phone || user.number,
        email: user.email,
        totalAmount,
        orderId: res.data.orderId,
        custId: user._id,
      });

      await dispatch(clearCart());
      post({
        action: "https://securegw-stage.paytm.in/order/process",
        params: data,
      });
    } catch (error) {
      history.replace("/order-failed");
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticate || !cartItems.length) {
    return null;
  }

  const contactLine = user.email || user.phone || "Account verified";

  return (
    <>
      <main className="checkout-page">
        <div className="checkout-page__inner">
          <div className="checkout-main">
            {/* Step 1 — Login */}
            <section className="checkout-step">
              <div className="checkout-step__head checkout-step__head--done">
                <div className="checkout-step__title-wrap">
                  <span className="checkout-step__num">1</span>
                  <h2 className="checkout-step__title">
                    Account
                    <span className="checkout-step__check" aria-hidden="true">✓</span>
                  </h2>
                </div>
              </div>
              <div className="checkout-step__body">
                <p className="checkout-step__summary">
                  Signed in as <strong>{user.fname} {user.lname}</strong>
                  {" · "}{contactLine}
                </p>
              </div>
            </section>

            {/* Step 2 — Address */}
            <section className={`checkout-step ${step === "payment" ? "" : ""}`}>
              <div
                className={`checkout-step__head ${
                  step === "address"
                    ? ""
                    : step === "payment"
                      ? "checkout-step__head--done"
                      : "checkout-step__head--muted"
                }`}
              >
                <div className="checkout-step__title-wrap">
                  <span className="checkout-step__num">2</span>
                  <h2 className="checkout-step__title">
                    Delivery Address
                    {step === "payment" && (
                      <span className="checkout-step__check" aria-hidden="true">✓</span>
                    )}
                  </h2>
                </div>
                {step === "payment" && (
                  <button type="button" className="checkout-step__change" onClick={() => setStep("address")}>
                    Change
                  </button>
                )}
              </div>

              {step === "address" ? (
                <div className="checkout-step__body">
                  {addresses.length > 0 ? (
                    <div className="checkout-address-list">
                      {addresses.map((address) => (
                        <AddressCard
                          key={address._id}
                          address={address}
                          isCheckout
                          selectable
                          selected={selectedAddr?._id === address._id}
                          onSelect={() => setSelectedAddr(address)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="checkout-step__summary">
                      No saved addresses yet. Add one to continue.
                    </p>
                  )}

                  <div className="checkout-address-list__actions">
                    <Link
                      to="/account/addresses?ref=checkout&init=true"
                      className="checkout-add-link"
                    >
                      <AddIcon style={{ fontSize: 18 }} />
                      Add new address
                    </Link>
                    {selectedAddr && (
                      <button type="button" className="bag-btn bag-btn--primary" onClick={continueToPayment}>
                        Deliver to this address
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                selectedAddr && (
                  <div className="checkout-step__body">
                    <p className="checkout-step__summary">
                      <strong>{selectedAddr.name}</strong>
                      {" · "}{selectedAddr.number}
                      <br />
                      {selectedAddr.houseAddress}, {selectedAddr.locality}, {selectedAddr.city},{" "}
                      {selectedAddr.state} — {selectedAddr.pincode}
                    </p>
                  </div>
                )
              )}
            </section>

            {/* Step 3 — Payment */}
            <section className={`checkout-step ${step !== "payment" ? "checkout-step--disabled" : ""}`}>
              <div
                className={`checkout-step__head ${
                  step === "payment" ? "" : "checkout-step__head--muted"
                }`}
              >
                <div className="checkout-step__title-wrap">
                  <span className="checkout-step__num">3</span>
                  <h2 className="checkout-step__title">Payment</h2>
                </div>
              </div>

              {step === "payment" && (
                <div className="checkout-step__body">
                  <div className="payment-options">
                    <button
                      type="button"
                      className={`payment-option ${paymentMode === "online" ? "payment-option--selected" : ""}`}
                      onClick={() => setPaymentMode("online")}
                    >
                      <span className="payment-option__radio" aria-hidden="true" />
                      <span className="payment-option__icon">💳</span>
                      <span className="payment-option__info">
                        <p className="payment-option__name">UPI / Card / Net Banking</p>
                        <p className="payment-option__desc">Pay securely via Paytm</p>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`payment-option ${paymentMode === "cash" ? "payment-option--selected" : ""}`}
                      onClick={() => setPaymentMode("cash")}
                    >
                      <span className="payment-option__radio" aria-hidden="true" />
                      <span className="payment-option__icon">💵</span>
                      <span className="payment-option__info">
                        <p className="payment-option__name">Cash on Delivery</p>
                        <p className="payment-option__desc">Pay when your order arrives</p>
                      </span>
                    </button>
                  </div>

                  {paymentMode && (
                    <div style={{ marginTop: 20 }}>
                      <button
                        type="button"
                        className="bag-btn bag-btn--primary"
                        disabled={placing}
                        onClick={confirmOrder}
                      >
                        {placing
                          ? "Processing..."
                          : paymentMode === "cash"
                            ? "Confirm Order"
                            : "Pay & Place Order"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="checkout-sidebar">
            <TotalView page="checkout" />
            <div className="checkout-trust">
              <span className="checkout-trust__icon" aria-hidden="true">🔒</span>
              <p className="checkout-trust__text">
                Safe and secure payments. Easy returns within 30 days. 100% authentic products.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <ToastMessageContainer />
    </>
  );
}

export default CheckoutPage;
