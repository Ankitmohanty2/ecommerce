import React, { useState } from "react";
import axios from "../../adapters/axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { addNewAddress, updateAddrComState } from "../../actions/addressActions";
import { indianStates } from "../../constants/data";
import toastMessage from "../../utils/toastMessage";
import useQuery from "../../hooks/useQuery";

import "../../styles/AddressPage.css";
import "../../styles/CartPage.css";

function AddAddress() {
  const [values, setValues] = useState({
    name: "",
    number: "",
    pincode: "",
    locality: "",
    houseAddress: "",
    city: "",
    yourState: "Gujarat",
    landmark: "",
    alternateNumber: "",
    addressType: "H",
  });
  const [saving, setSaving] = useState(false);

  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  const handleInputs = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const newAddressInputs = {
      userId: user._id,
      name: values.name,
      number: values.number,
      pincode: values.pincode,
      locality: values.locality,
      houseAddress: values.houseAddress,
      city: values.city,
      state: values.yourState,
      landmark: values.landmark,
      alternateNumber: values.alternateNumber,
      addressType: values.addressType,
    };

    try {
      await axios.post("/address/add-address", newAddressInputs);
      await dispatch(addNewAddress(newAddressInputs));
      toastMessage("Address saved successfully", "success");
      dispatch(updateAddrComState(false));

      if (query.get("ref") === "checkout") {
        history.push("/checkout?init=true");
      }
    } catch (error) {
      toastMessage("Something went wrong", "error");
      dispatch(updateAddrComState(false));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="address-form" onSubmit={handleFormSubmit}>
      <h2 className="address-form__title">Add a new address</h2>

      <div className="address-form__grid">
        <TextField
          variant="outlined"
          label="Full name"
          required
          name="name"
          value={values.name}
          onChange={handleInputs}
          className="address-form__field"
        />
        <TextField
          variant="outlined"
          label="Mobile number"
          required
          name="number"
          value={values.number}
          onChange={handleInputs}
          className="address-form__field"
          inputProps={{ maxLength: 10 }}
        />
        <TextField
          variant="outlined"
          label="Pincode"
          required
          name="pincode"
          value={values.pincode}
          onChange={handleInputs}
          className="address-form__field"
          inputProps={{ maxLength: 6 }}
        />
        <TextField
          variant="outlined"
          label="Locality"
          required
          name="locality"
          value={values.locality}
          onChange={handleInputs}
          className="address-form__field"
        />
        <TextField
          variant="outlined"
          label="Address (area & street)"
          required
          multiline
          rows={3}
          name="houseAddress"
          value={values.houseAddress}
          onChange={handleInputs}
          className="address-form__field address-form__grid--full"
        />
        <TextField
          variant="outlined"
          label="City / District / Town"
          required
          name="city"
          value={values.city}
          onChange={handleInputs}
          className="address-form__field"
        />
        <TextField
          variant="outlined"
          select
          label="State"
          required
          name="yourState"
          value={values.yourState}
          onChange={handleInputs}
          SelectProps={{ native: true }}
          className="address-form__field"
        >
          {indianStates.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          label="Landmark (optional)"
          name="landmark"
          value={values.landmark}
          onChange={handleInputs}
          className="address-form__field"
        />
        <TextField
          variant="outlined"
          label="Alternate phone (optional)"
          name="alternateNumber"
          value={values.alternateNumber}
          onChange={handleInputs}
          className="address-form__field"
        />
      </div>

      <p className="address-page__subtitle" style={{ marginBottom: 8 }}>Address type</p>
      <div className="address-form__types">
        <button
          type="button"
          className={`address-type-btn ${values.addressType === "H" ? "address-type-btn--active" : ""}`}
          onClick={() => setValues({ ...values, addressType: "H" })}
        >
          Home
        </button>
        <button
          type="button"
          className={`address-type-btn ${values.addressType === "W" ? "address-type-btn--active" : ""}`}
          onClick={() => setValues({ ...values, addressType: "W" })}
        >
          Work
        </button>
      </div>

      <div className="address-form__actions">
        <button type="submit" className="bag-btn bag-btn--primary" disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save address"}
        </button>
        <button
          type="button"
          className="address-form__cancel"
          onClick={() => dispatch(updateAddrComState(false))}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddAddress;
