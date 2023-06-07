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
import HistoricOptionShort from "./component/historicOptionShort/HistoricOptionShort";
import oneMinHistoricOptionShort from "./component/historicOptionShort/oneMinHistoricOptionShort";
import OptionWithValueSeconds from "./component/historitcOptionTicksBackTest/OptionWithValueSeconds";
import OptionSpreadShortSingleStopLossTrail from "./component/historitcOptionTicksBackTest/OptionSpreadShortSingleStopLossTrail";

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
          {/* <div className="px-4">
            <NavLink to="/checkOiVolume">Check Oi Volume</NavLink>
          </div> */}
          {/* <div className="px-4">
            <NavLink to="/spreadStockReverse">Spread Stock Reverse</NavLink>
          </div> */}
          {/* <div className="px-4">
            <NavLink to="/optionSpreadLong">Spread Option Long</NavLink>
          </div>*/}
          <div className="px-4">
            <NavLink to="/optionSpreadShort">Spread Option Short</NavLink>
          </div>
          {/* <div className="px-4">
            <NavLink to="/oneMinHistoricOptionShort">
              One Min Historic Option Short
            </NavLink>
          </div> */}
          <div className="px-4">
            <NavLink to="/historicOptionShort">Historic Option Short</NavLink>
          </div>
          {/* </div> */}
          {/* <div className="px-4">
            <NavLink to="/optionWithValueSeconds">S - Opt with values</NavLink>
          </div> */}
          {/* <div className="px-4">
            <NavLink to="/optionOneMinStopLossTrail">
              S - Opt one Min StopLoss
            </NavLink>
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
            path="/oneMinHistoricOptionShort"
            component={oneMinHistoricOptionShort}
          />
          <Route
            exact
            path="/historicOptionShort"
            component={HistoricOptionShort}
          />
          <Route
            exact
            path="/optionSpreadShort"
            component={OptionSpreadShort}
          />
          <Route
            exact
            path="/optionWithValueSeconds"
            component={OptionWithValueSeconds}
          />
          <Route
            exact
            path="/optionOneMinStopLossTrail"
            component={OptionSpreadShortSingleStopLossTrail}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
