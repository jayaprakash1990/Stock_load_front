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
import CheckHighReversal from "./component/checkHighReversal/CheckHighReversal";
import SpreadStock from "./component/spreadStock/SpreadStock";

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
          <div className="px-4">
            <NavLink to="/checkHighReversal">CheckHighReversal</NavLink>
          </div>
          <div className="px-4">
            <NavLink to="/spreadStock">Spread Stock</NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/checkLowReversal" component={CheckLowReversal} />
          <Route
            exact
            path="/checkHighReversal"
            component={CheckHighReversal}
          />
          <Route exact path="/spreadStock" component={SpreadStock} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
