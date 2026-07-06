import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../adapters/axios";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { maleAvatarUrl, femaleAvatarUrl } from "../../constants/data";
import toastMessage from "../../utils/toastMessage";
import { setIsAuthenticate, setUserInfo } from "../../actions/userActions";
import { clearCart } from "../../actions/cartActions";

import "../../styles/AccountPage.css";

function SidebarLink({ to, children, className = "" }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`account-sidebar__link ${className} ${isActive ? "account-sidebar__link--active" : ""}`}
    >
      <span>{children}</span>
      {className.includes("--top") && <ChevronRightIcon style={{ fontSize: 18, color: "#b0b8c0" }} />}
    </Link>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const logout = async () => {
    try {
      await axios.get("/accounts/logout", { withCredentials: true });
      dispatch(setUserInfo({}));
      dispatch(setIsAuthenticate(false));
      dispatch(clearCart());
      window.location.replace("/");
    } catch (error) {
      toastMessage("Something went wrong. Please try again later", "error");
    }
  };

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__profile">
        <img
          className="account-sidebar__avatar"
          src={user.gender === "F" ? femaleAvatarUrl : maleAvatarUrl}
          alt=""
        />
        <div>
          <p className="account-sidebar__hello">Hello,</p>
          <p className="account-sidebar__name">
            {user?.fname} {user?.lname}
          </p>
        </div>
      </div>

      <nav className="account-sidebar__nav">
        <SidebarLink to="/orders" className="account-sidebar__link--top">
          My Orders
        </SidebarLink>

        <div className="account-sidebar__divider" />

        <p className="account-sidebar__section-label">
          <PersonOutlineIcon />
          Account Settings
        </p>
        <SidebarLink to="/account">Profile Information</SidebarLink>
        <SidebarLink to="/account/addresses">Manage Addresses</SidebarLink>

        <div className="account-sidebar__divider" />

        <p className="account-sidebar__section-label">
          <FavoriteBorderIcon />
          My Stuff
        </p>
        <SidebarLink to="/wishlist">My Wishlist</SidebarLink>

        <div className="account-sidebar__divider" />

        <p className="account-sidebar__section-label">
          <AccountBalanceWalletIcon />
          Payments
        </p>
        <SidebarLink to="/account/payments">Saved Payment Methods</SidebarLink>
      </nav>

      <button type="button" className="account-sidebar__logout" onClick={logout}>
        <PowerSettingsNewIcon />
        Logout
      </button>
    </aside>
  );
}
