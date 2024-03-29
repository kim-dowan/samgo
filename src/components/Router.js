import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import CreateTimeTable from "routes/CreateTimeTable";
import Home from "routes/Home";
import NotFound from "routes/NotFound";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn ? <Navigation userObj={userObj} /> : ""}
      <Switch>
        {isLoggedIn ? (
          <Route exact path="/">
            <Home userObj={userObj} />
          </Route>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
        <Route exact path="/profile">
          <Profile userObj={userObj} />
        </Route>
        <Route exact path="/createTimeTable">
          <CreateTimeTable userObj={userObj} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default AppRouter;
