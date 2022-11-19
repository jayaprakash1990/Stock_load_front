import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  dateList,
  stopLossData,
  candleTimeData,
  stockDataSymbol,
} from "../../constants/stockDate";
import { serviceURL } from "../../serviceURL";
import axios from "axios";

const SpreadStock = () => {
  const [selectDate, setSelectDate] = useState(null);
  const [completeData, setCompleteData] = useState({});
  const [stopLoss, setStopLoss] = useState({ label: 0, value: 0 });
  const [candleTime, setCandleTime] = useState({ label: 1, value: 1 });
  const [referenceCandle, setReferenceCandle] = useState({});
  const [resultSet, setResultSet] = useState([]);

  useEffect(() => {
    if (selectDate) {
      let startDate = selectDate.value;
      let endDate = selectDate.value + 585;
      axios
        .get(serviceURL + "/fetchStocksByDate/" + startDate + "/" + endDate)
        .then((response) => {
          // console.log('*******************88');
          if (response) {
            setCompleteData(response.data);
            resultSetUpdate(response.data);
          } else {
            alert("Problem with stock refreshing");
          }
        });
    }
  }, [selectDate]);

  useEffect(() => {
    if (completeData && selectDate) {
      resultSetUpdate(completeData);
    }
  }, [stopLoss, candleTime]);

  const resultSetUpdate = (fullData) => {
    if (candleTime.value === 1) {
      oneMinCandle(fullData);
    } else if (candleTime.value === 5) {
      fiveMinCandle(fullData);
    } else if (candleTime.value === 15) {
      fifteenMinCandle(fullData);
    }
  };

  const oneMinCandle = (fullData) => {
    let tmpJson = {};
    let finalJson = {};
    let startDateValue = selectDate.value;
    stockDataSymbol.forEach((stock) => {
      tmpJson[stock] = {
        high: fullData[selectDate.value][stock].stockHigh,
        low: fullData[selectDate.value][stock].stockLow,
      };
      let average = (tmpJson[stock].high + tmpJson[stock].low) / 2;
      let reference =
        fullData[startDateValue + 1][stock].stockOpen > average
          ? "long"
          : "short";
      finalJson[stock] = {
        reference,
        value: fullData[startDateValue + 1][stock].stockOpen,
      };
    });
    setReferenceCandle(finalJson);

    let tmpArr = [];

    for (const property in fullData) {
      if (property > startDateValue) {
        let tmpJson = {};
        stockDataSymbol.forEach((stock) => {
          tmpJson[stock] = fullData[property][stock];
        });
        tmpArr.push(tmpJson);
      }
    }
    setResultSet(tmpArr);
  };

  const fiveMinCandle = (fullData) => {
    let tmpJson = {};
    let finalJson = {};
    let startDateValue = selectDate.value;
    stockDataSymbol.forEach((stock) => {
      let highArr = [];
      let h1 = fullData[startDateValue][stock].stockHigh;
      let h2 = fullData[startDateValue + 1][stock].stockHigh;
      let h3 = fullData[startDateValue + 2][stock].stockHigh;
      let h4 = fullData[startDateValue + 3][stock].stockHigh;
      let h5 = fullData[startDateValue + 4][stock].stockHigh;
      highArr = [h1, h2, h3, h4, h5];
      let highValue = Math.max(...highArr);
      let lowArr = [];
      let l1 = fullData[startDateValue][stock].stockLow;
      let l2 = fullData[startDateValue + 1][stock].stockLow;
      let l3 = fullData[startDateValue + 2][stock].stockLow;
      let l4 = fullData[startDateValue + 3][stock].stockLow;
      let l5 = fullData[startDateValue + 4][stock].stockLow;
      lowArr = [l1, l2, l3, l4, l5];
      let lowValue = Math.min(...lowArr);
      tmpJson[stock] = {
        high: highValue,
        low: lowValue,
      };
      let average = (tmpJson[stock].high + tmpJson[stock].low) / 2;
      let reference =
        fullData[startDateValue + 5][stock].stockOpen > average
          ? "long"
          : "short";
      finalJson[stock] = {
        reference,
        value: fullData[startDateValue + 5][stock].stockOpen,
      };
    });

    setReferenceCandle(finalJson);
    let tmpArr = [];

    for (const property in fullData) {
      if (property > startDateValue + 4) {
        let tmpJson = {};
        stockDataSymbol.forEach((stock) => {
          tmpJson[stock] = fullData[property][stock];
        });
        tmpArr.push(tmpJson);
      }
    }
    console.log(tmpArr);
    setResultSet(tmpArr);
  };

  const fifteenMinCandle = (fullData) => {
    let tmpJson = {};
    let finalJson = {};
    let startDateValue = selectDate.value;
    stockDataSymbol.forEach((stock) => {
      let highArr = [];
      let h1 = fullData[startDateValue][stock].stockHigh;
      let h2 = fullData[startDateValue + 1][stock].stockHigh;
      let h3 = fullData[startDateValue + 2][stock].stockHigh;
      let h4 = fullData[startDateValue + 3][stock].stockHigh;
      let h5 = fullData[startDateValue + 4][stock].stockHigh;
      let h6 = fullData[startDateValue + 5][stock].stockHigh;
      let h7 = fullData[startDateValue + 6][stock].stockHigh;
      let h8 = fullData[startDateValue + 7][stock].stockHigh;
      let h9 = fullData[startDateValue + 8][stock].stockHigh;
      let h10 = fullData[startDateValue + 9][stock].stockHigh;
      let h11 = fullData[startDateValue + 10][stock].stockHigh;
      let h12 = fullData[startDateValue + 11][stock].stockHigh;
      let h13 = fullData[startDateValue + 12][stock].stockHigh;
      let h14 = fullData[startDateValue + 13][stock].stockHigh;
      let h15 = fullData[startDateValue + 14][stock].stockHigh;

      highArr = [
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        h7,
        h8,
        h9,
        h10,
        h11,
        h12,
        h13,
        h14,
        h15,
      ];
      let highValue = Math.max(...highArr);
      let lowArr = [];
      let l1 = fullData[startDateValue][stock].stockLow;
      let l2 = fullData[startDateValue + 1][stock].stockLow;
      let l3 = fullData[startDateValue + 2][stock].stockLow;
      let l4 = fullData[startDateValue + 3][stock].stockLow;
      let l5 = fullData[startDateValue + 4][stock].stockLow;
      let l6 = fullData[startDateValue + 5][stock].stockLow;
      let l7 = fullData[startDateValue + 6][stock].stockLow;
      let l8 = fullData[startDateValue + 7][stock].stockLow;
      let l9 = fullData[startDateValue + 8][stock].stockLow;
      let l10 = fullData[startDateValue + 9][stock].stockLow;
      let l11 = fullData[startDateValue + 10][stock].stockLow;
      let l12 = fullData[startDateValue + 11][stock].stockLow;
      let l13 = fullData[startDateValue + 12][stock].stockLow;
      let l14 = fullData[startDateValue + 13][stock].stockLow;
      let l15 = fullData[startDateValue + 14][stock].stockLow;
      lowArr = [
        l1,
        l2,
        l3,
        l4,
        l5,
        l6,
        l7,
        l8,
        l9,
        l10,
        l11,
        l12,
        l13,
        l14,
        l15,
      ];
      let lowValue = Math.min(...lowArr);
      tmpJson[stock] = {
        high: highValue,
        low: lowValue,
      };
      let average = (tmpJson[stock].high + tmpJson[stock].low) / 2;
      let reference =
        fullData[startDateValue + 15][stock].stockOpen > average
          ? "long"
          : "short";
      finalJson[stock] = {
        reference,
        value: fullData[startDateValue + 15][stock].stockOpen,
      };
    });

    setReferenceCandle(finalJson);

    let tmpArr = [];
    for (const property in fullData) {
      if (property > startDateValue + 14) {
        let tmpJson = {};
        stockDataSymbol.forEach((stock) => {
          tmpJson[stock] = fullData[property][stock];
        });
        tmpArr.push(tmpJson);
      }
    }

    setResultSet(tmpArr);
  };

  return (
    <React.Fragment>
      <Row></Row>
      <Row className="mt-3 pt-3">
        <Col md={1}></Col>
        <Col md={3}>
          <Select
            defaultValue={selectDate}
            onChange={setSelectDate}
            placeholder={"select Date"}
            options={dateList}
          />
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          <Select
            defaultValue={stopLoss}
            onChange={setStopLoss}
            placeholder={"select Stoploss"}
            options={stopLossData}
          />
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          <Select
            defaultValue={candleTime}
            onChange={setCandleTime}
            placeholder={"select Candle Time"}
            options={candleTimeData}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SpreadStock;
