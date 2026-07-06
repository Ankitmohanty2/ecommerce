import React from "react";
import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductPage from "./pages/ProductPage";
import MyAccountsPage from "./pages/MyAccountsPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderFailedPage from "./pages/OrderFailedPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const activeCategory = location.pathname === "/" ? params.get("cat") || "all" : "all";

  const handleCategoryChange = (catId) => {
    if (catId === "all") {
      history.push("/");
    } else {
      history.push(`/?cat=${catId}`);
    }
  };

  return (
    <div className="app">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/login">
          <AuthPage />
        </Route>
        <Route exact path="/cart">
          <CartPage />
        </Route>
        <Route exact path="/account">
          <MyAccountsPage />
        </Route>
        <Route exact path="/wishlist">
          <WishlistPage />
        </Route>
        <Route exact path="/account/payments">
          <MyAccountsPage />
        </Route>
        <Route exact path="/account/addresses">
          <MyAccountsPage />
        </Route>
        <Route exact path="/orders">
          <OrdersPage />
        </Route>
        <Route exact path="/checkout">
          <CheckoutPage />
        </Route>
        <Route exact path="/product/:id">
          <ProductPage />
        </Route>
        <Route exact path="/order-failed">
          <OrderFailedPage />
        </Route>
        <Route exact path="/order-success">
          <OrderSuccessPage />
        </Route>
        <Route component={ErrorPage} />
      </Switch>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
