import React from "react";
import "./App.css";
import Home from "./component/home/Home";
import CheckLowReversal from "./component/checkLowReversal/CheckLowReversal";

import "bootstrap";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <div className="d-flex justify-content-end">
          <div className="px-4">
            <NavLink to="/">Home</NavLink>
          </div>
          <div className="px-4">
            <NavLink to="/checkLowReversal">CheckLowReversal</NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/checkLowReversal" component={CheckLowReversal} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
