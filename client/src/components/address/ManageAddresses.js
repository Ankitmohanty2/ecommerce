import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { getAddresses, updateAddrComState } from "../../actions/addressActions";
import AddressCard from "./AddressCard";
import AddAddress from "./AddAddress";
import useQuery from "../../hooks/useQuery";

import "../../styles/AddressPage.css";
import "../../styles/AccountPage.css";

function ManageAddresses() {
  const dispatch = useDispatch();
  const query = useQuery();
  const { openAddAddress, addresses } = useSelector((state) => state.addressReducer);
  const fromCheckout = query.get("ref") === "checkout";

  useEffect(() => {
    dispatch(getAddresses());
    if (fromCheckout) {
      dispatch(updateAddrComState(true));
    } else {
      dispatch(updateAddrComState(false));
    }
  }, [dispatch, fromCheckout]);

  const closeForm = () => dispatch(updateAddrComState(false));

  return (
    <div className="account-panel address-page">
      <header className="account-panel__header address-page__header">
        {openAddAddress && (
          <button type="button" className="address-page__back" onClick={closeForm}>
            <ArrowBackIcon style={{ fontSize: 18 }} />
            Back to addresses
          </button>
        )}
        <h1 className="account-panel__title">Saved Addresses</h1>
        <p className="account-panel__subtitle">
          {fromCheckout
            ? "Add or select a delivery address to continue checkout"
            : "Manage delivery addresses for faster checkout"}
        </p>
      </header>

      {openAddAddress ? (
        <div className="address-form-wrap">
          <AddAddress />
        </div>
      ) : (
        <button
          type="button"
          className="address-add-trigger"
          onClick={() => dispatch(updateAddrComState(true))}
        >
          <AddIcon style={{ fontSize: 18 }} />
          Add a new address
        </button>
      )}

      {addresses.length > 0 && (
        <div className="address-list">
          {addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))}
        </div>
      )}

      {!openAddAddress && addresses.length === 0 && (
        <div className="address-empty">
          <p className="address-empty__text">You haven&apos;t saved any addresses yet.</p>
        </div>
      )}
    </div>
  );
}

export default ManageAddresses;
