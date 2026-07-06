import React, { useEffect } from "react";
import axios from "../../adapters/axios";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import { Dialog, DialogContent } from "@material-ui/core";

import {
  modalClose,
  modalOpen,
  setIsAuthenticate,
  setPopupLogin,
  setUserInfo,
} from "../../actions/userActions";
import authentication from "../../adapters/authentication";
import toastMessage from "../../utils/toastMessage";
import AuthPage from "../../pages/AuthPage";
import ProfileMenu from "./ProfileMenu";
import { clearCart } from "../../actions/cartActions";

function HeaderMenu() {
  const { popupLogin, isAuthenticate, isModalOpen } = useSelector(
    (state) => state.userReducer
  );
  const { cartItems } = useSelector((state) => state.cartReducer);

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPopupLogin(location.pathname !== "/login"));

    if (!isAuthenticate) {
      authentication().then((res) => {
        dispatch(setIsAuthenticate(res.isAuth));
        dispatch(setUserInfo(res.user));
      });
    }
  }, [location.pathname, isAuthenticate, dispatch]);

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
    <nav className="header__nav">
      {isAuthenticate ? (
        <ProfileMenu logout={logout} />
      ) : popupLogin ? (
        <button
          type="button"
          className="header__utility"
          onClick={() => dispatch(modalOpen())}
          aria-label="Sign in"
        >
          <PersonOutlineIcon />
          <span>Account</span>
        </button>
      ) : (
        <Link to="/login" className="header__utility" aria-label="Sign in">
          <PersonOutlineIcon />
          <span>Account</span>
        </Link>
      )}

      <Link to="/wishlist" className="header__utility" aria-label="Wishlist">
        <FavoriteBorderIcon />
        <span>Wishlist</span>
      </Link>

      <Link to="/cart" className="header__utility header__cart-wrap" aria-label="Cart">
        <LocalMallOutlinedIcon />
        <span>Cart</span>
        {cartItems.length > 0 && (
          <span className="header__cart-badge">{cartItems.length}</span>
        )}
      </Link>

      <Dialog
        className="auth-dialog"
        onClose={() => dispatch(modalClose())}
        open={isModalOpen}
        maxWidth={false}
        fullWidth
      >
        <DialogContent>
          <AuthPage popup={true} />
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default HeaderMenu;
