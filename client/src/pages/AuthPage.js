import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";

import { setIsAuthenticate, setIsLogin, setUserInfo } from "../actions/userActions";
import authentication from "../adapters/authentication";

import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import VixenLogo from "../components/common/VixenLogo";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/AuthPage.css";

function AuthPage({ popup = false }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isLogin, isAuthenticate } = useSelector((state) => state.userReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticate) {
      setCheckingAuth(true);
      authentication()
        .then((res) => {
          dispatch(setIsAuthenticate(res.isAuth));
          dispatch(setUserInfo(res.user));
          if (res.isAuth) {
            history.push("/");
          }
        })
        .catch(() => {})
        .finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticate, dispatch, history]);

  const perks = [
    "Track orders & delivery updates",
    "Save items to your wishlist",
    "Faster checkout with saved details",
  ];

  return (
    <div className={`auth-page ${popup ? "auth-page--popup" : ""}`}>
      <div className="auth-card">
        <aside className="auth-card__aside">
          <div className="auth-card__brand">
            <VixenLogo light />
          </div>

          <div className="auth-card__heading">
            <span className="auth-card__title">
              {isLogin ? "Welcome back" : "Join Vixen Fashion"}
            </span>
            <p className="auth-card__subtitle">
              {isLogin
                ? "Sign in with your email and password."
                : "Create an account with your email, name and password."}
            </p>
          </div>

          <ul className="auth-card__perks">
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </aside>

        <main className="auth-card__main">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`auth-tabs__btn ${isLogin ? "auth-tabs__btn--active" : ""}`}
              onClick={() => dispatch(setIsLogin(true))}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`auth-tabs__btn ${!isLogin ? "auth-tabs__btn--active" : ""}`}
              onClick={() => dispatch(setIsLogin(false))}
            >
              Create Account
            </button>
          </div>

          {isLogin ? <Login /> : <Signup />}
        </main>
      </div>

      {checkingAuth && (
        <div className="auth-loading" aria-busy="true" aria-label="Checking session">
          <CircularProgress size={36} className="auth-loading__spinner" />
        </div>
      )}

      <ToastMessageContainer />
    </div>
  );
}

export default AuthPage;
