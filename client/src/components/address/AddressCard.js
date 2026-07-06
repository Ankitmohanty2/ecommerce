import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deleteAddress } from "../../actions/addressActions";
import toastMessage from "../../utils/toastMessage";

function AddressCard({
  address,
  isCheckout = false,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = () => {
    dispatch(deleteAddress(address._id));
    toastMessage("Address deleted successfully", "success");
    setMenuOpen(false);
  };

  const typeLabel = address.addressType === "H" ? "Home" : "Work";

  return (
    <article
      className={`address-card ${selectable ? "address-card--selectable" : ""} ${
        selected ? "address-card--selected" : ""
      }`}
      onClick={selectable ? onSelect : undefined}
      onKeyDown={
        selectable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onSelect?.();
            }
          : undefined
      }
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      {selected && <span className="address-card__selected-mark" aria-hidden="true">✓</span>}

      <div className="address-card__top">
        <div>
          <span className="address-card__badge">{typeLabel}</span>
          <p className="address-card__name">
            {address.name}
            <span className="address-card__phone">{address.number}</span>
          </p>
          <p className="address-card__line">
            {address.houseAddress}, {address.locality}, {address.city}, {address.state}
            {" — "}
            <span className="address-card__pin">{address.pincode}</span>
          </p>
          {address.landmark && (
            <p className="address-card__line">Landmark: {address.landmark}</p>
          )}
        </div>

        {!isCheckout && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              className="address-card__menu-btn"
              aria-label="Address options"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <MoreVertIcon style={{ fontSize: 20 }} />
            </button>
            {menuOpen && (
              <div className="address-card__menu">
                <button type="button" className="address-card__menu-item" onClick={() => setMenuOpen(false)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="address-card__menu-item address-card__menu-item--danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default AddressCard;
