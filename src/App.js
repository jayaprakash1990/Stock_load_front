import React from "react";
import "./App.css";
import Home from "./component/home/Home";
import CheckLowReversal from "./component/checkLowReversal/CheckLowReversal";
import Miscellaneous from "./component/miscellaneous/Miscellaneous";
import CheckOiVolume from "./component/checkOiVolume/CheckOiVolume";

import "bootstrap";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import CheckHighReversal from "./component/checkHighReversal/CheckHighReversal";
import SpreadStock from "./component/spreadStock/SpreadStock";
import SpreadStockReverse from "./component/spreadStock/SpreadStockReverse";
import OptionSpreadLong from "./component/optionSpread/OptionSpreadLong";
import OptionSpreadShort from "./component/optionSpread/OptionSpreadShort";

function App() {
  return (
    <Router>
      <div>
        <div className="d-flex justify-content-end">
          <div className="px-4">
            <NavLink to="/">Home</NavLink>
          </div>
          <div className="px-4">
            <NavLink to="/miscellaneous">Token/Miscellaneous</NavLink>
          </div>
          {/* <div className="px-4">
            <NavLink to="/checkLowReversal">CheckLowReversal</NavLink>
          </div> */}
          {/* <div className="px-4">
            <NavLink to="/checkHighReversal">CheckHighReversal</NavLink>
          </div> */}
          {/* <div className="px-4">
            <NavLink to="/spreadStock">Spread Stock</NavLink>
          </div> */}
          <div className="px-4">
            <NavLink to="/checkOiVolume">Check Oi Volume</NavLink>
          </div>
          {/* <div className="px-4">
            <NavLink to="/spreadStockReverse">Spread Stock Reverse</NavLink>
          </div> */}
          <div className="px-4">
            <NavLink to="/optionSpreadLong">Spread Option Long</NavLink>
          </div>
          {/* <div className="px-4">
            <NavLink to="/optionSpreadShort">Spread Option Short</NavLink>
          </div> */}
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/checkLowReversal" component={CheckLowReversal} />
          <Route
            exact
            path="/checkHighReversal"
            component={CheckHighReversal}
          />
          <Route exact path="/miscellaneous" component={Miscellaneous} />
          <Route exact path="/spreadStock" component={SpreadStock} />
          <Route
            exact
            path="/spreadStockReverse"
            component={SpreadStockReverse}
          />
          <Route exact path="/checkOiVolume" component={CheckOiVolume} />
          <Route exact path="/optionSpreadLong" component={OptionSpreadLong} />
          <Route
            exact
            path="/optionSpreadShort"
            component={OptionSpreadShort}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
