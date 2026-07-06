import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import { useSelector } from "react-redux";

import Sidebar from "../components/account/Sidebar";
import PersonalInfo from "../components/account/PersonalInfo";
import ManageAddresses from "../components/address/ManageAddresses";
import SavedPayments from "../components/account/SavedPayments";
import LoaderSpinner from "../components/LoaderSpinner";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/AccountPage.css";

function MyAccountsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticate } = useSelector((state) => state.userReducer);
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticate) {
      history.replace("/login?ref=account");
    }
    setIsLoading(false);
  }, [isAuthenticate, history]);

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="account-page">
      <div className="account-page__inner">
        <Sidebar />
        <main className="account-content">
          <Switch>
            <Route exact path="/account">
              <PersonalInfo />
            </Route>
            <Route exact path="/account/addresses">
              <ManageAddresses />
            </Route>
            <Route exact path="/account/payments">
              <SavedPayments />
            </Route>
            <Route>
              <PersonalInfo />
            </Route>
          </Switch>
        </main>
      </div>
      <ToastMessageContainer />
    </div>
  );
}

export default MyAccountsPage;
