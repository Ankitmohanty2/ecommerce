import React from "react";
import "../../styles/AccountPage.css";

function SavedPayments() {
  return (
    <div className="account-panel">
      <header className="account-panel__header">
        <h1 className="account-panel__title">Saved Payment Methods</h1>
        <p className="account-panel__subtitle">
          Manage UPI IDs and cards for faster checkout
        </p>
      </header>

      <section className="payment-saved-section">
        <h2 className="payment-saved-section__title">Saved UPI</h2>
        <div className="payment-saved-empty">
          <div className="payment-saved-empty__icon" aria-hidden="true">📱</div>
          <p className="payment-saved-empty__text">No UPI IDs saved yet</p>
        </div>
      </section>

      <section className="payment-saved-section">
        <h2 className="payment-saved-section__title">Saved Cards</h2>
        <div className="payment-saved-empty">
          <div className="payment-saved-empty__icon" aria-hidden="true">💳</div>
          <p className="payment-saved-empty__text">No cards saved yet</p>
        </div>
      </section>
    </div>
  );
}

export default SavedPayments;
