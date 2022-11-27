import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  dateList,
  stopLossData,
  candleTimeData,
  stockDataSymbol,
  instrumentSymbol,
} from "../../constants/stockDate";
import { symbols } from "../../symbol-token";
import { serviceURL } from "../../serviceURL";
import axios from "axios";

const CheckOiVolume = () => {
  const startDate = "Fri Nov 25 2022 09:15:00 GMT+0530 (India Standard Time)";
  const endDate = "Fri Nov 25 2022 15:20:00 GMT+0530 (India Standard Time)";
  const [resultSet, setResultSet] = useState([]);
  const [symbol, setSymbol] = useState({});

  const calculateValue = () => {
    let token = symbol.value;
    axios
      .get(
        serviceURL +
          "/fetchVolumDataByStock/" +
          startDate +
          "/" +
          endDate +
          "/" +
          token
      )
      .then((response) => {
        // console.log('*******************88');
        if (response) {
          let results = response.data;
          let arr = [];
          results.forEach((result) => {
            let tmpJson = {};
            let buyValue = Math.max(...result.depth.buy.map((o) => o.quantity));
            let sellValue = Math.max(
              ...result.depth.sell.map((o) => o.quantity)
            );
            tmpJson["time"] = result.last_trade_time.toString().split(" ")[4];
            tmpJson["buyValue"] = buyValue;
            tmpJson["sellValue"] = sellValue;
            tmpJson["lastPrice"] = result.last_price;
            arr.push(tmpJson);
          });
          const tmpArr = arr.sort((a, b) => a.buyValue - b.buyValue);
          setResultSet(tmpArr);
        } else {
          alert("Problem with stock refreshing");
        }
      });
  };

  return (
    <React.Fragment>
      <Row></Row>
      <Row className="mt-3 pt-3">
        <Col md={1}>Symbols</Col>
        <Col md={3}>
          <Select
            value={symbol}
            defaultValue={symbol}
            onChange={setSymbol}
            placeholder={"select Date"}
            options={instrumentSymbol}
          />
        </Col>
        <Col md={1}></Col>
      </Row>
      <br />
      <br />

      <br />

      <br />

      <Row>
        <Col md={12} className="mt-3 pt-3" align={"center"}>
          <button onClick={calculateValue}>Calculate</button>
        </Col>
      </Row>
      <br />
      <br />

      <Row className="ml-1">
        <Col md={1}>
          <b>Time</b>
        </Col>
        <Col md={1}>
          <b>Buy</b>
        </Col>
        <Col md={1}>
          <b>Sell</b>
        </Col>
        <Col md={1}>
          <b>Price</b>
        </Col>
      </Row>
      {resultSet.map((result, index) => (
        <Row className="ml-1" key={index}>
          <Col md={1}>{result.time}</Col>
          <Col md={1}>{result.buyValue}</Col>
          <Col md={1}>{result.sellValue}</Col>
          <Col md={1}>{result.lastPrice}</Col>
        </Row>
      ))}
    </React.Fragment>
  );
};

export default CheckOiVolume;
