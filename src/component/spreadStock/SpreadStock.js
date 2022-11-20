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
  const [stopLoss, setStopLoss] = useState({ label: 0.15, value: 0.15 });
  const [candleTime, setCandleTime] = useState({ label: 5, value: 5 });
  const [referenceCandle, setReferenceCandle] = useState({});
  const [resultSet, setResultSet] = useState([]);
  const [finalResult, setFinalResultSet] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [dayEndValue, setDayEndValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const captialAmount = 25000;
  const brokerage = 0.12;
  const breathingValue = 0.1;

  // useEffect(() => {
  //   if (referenceCandle) {
  //     console.log(referenceCandle);
  //     console.log(resultSet);
  //   }
  // }, [referenceCandle, stopLoss, candleTime]);

  // useEffect(() => {
  //   console.log(selectDate);
  // }, [selectDate]);

  useEffect(() => {
    if (finalResult && finalResult.length > 0) {
      let arr = [];
      finalResult.forEach((result) => {
        arr.push(result["total"]);
      });
      let minValue = Math.min(...arr);
      let maxValue = Math.max(...arr);
      minValue = totValueCaluculation(minValue);
      maxValue = totValueCaluculation(maxValue);
      let t = finalResult[finalResult.length - 1];

      let dayEnd = totValueCaluculation(arr[arr.length - 1]);
      setMinValue(minValue);
      setMaxValue(maxValue);
      setDayEndValue(dayEnd);
      let finalConcatValue = minValue + "," + maxValue + "," + dayEnd + ";\r\n";
      axios
        .get(serviceURL + "/writeInCsv/" + finalConcatValue)
        .then((response) => {
          // console.log('*******************88');
          if (response) {
            let index = dateList.findIndex((x) => x.value === selectDate.value);
            setSelectDate(dateList[index + 1]);
            setLoading(false);
            // console.log(index);
            // alert(response.data.result);
          } else {
            alert("Problem with stock refreshing");
          }
        });
    }
  }, [finalResult]);

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
        qty: Math.round(
          captialAmount / fullData[startDateValue + 1][stock].stockOpen
        ),
      };
      let slValue = 0;
      let tOpen = fullData[startDateValue + 1][stock].stockOpen;
      if (stopLoss.value !== 0) {
        if (reference === "long") {
          slValue = tOpen - (tOpen * stopLoss.value) / 100;
        } else {
          slValue = tOpen + (tOpen * stopLoss.value) / 100;
        }
      } else {
        if (reference === "long") {
          slValue = 0;
        } else {
          slValue = 1000000;
        }
      }
      finalJson[stock]["slValue"] = slValue;
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
        qty: Math.round(
          captialAmount / fullData[startDateValue + 5][stock].stockOpen
        ),
      };
      let slValue = 0;
      let tOpen = fullData[startDateValue + 5][stock].stockOpen;
      if (stopLoss.value !== 0) {
        if (reference === "long") {
          slValue = tOpen - (tOpen * stopLoss.value) / 100;
        } else {
          slValue = tOpen + (tOpen * stopLoss.value) / 100;
        }
      } else {
        if (reference === "long") {
          slValue = 0;
        } else {
          slValue = 1000000;
        }
      }
      finalJson[stock]["slValue"] = slValue;
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
        qty: Math.round(
          captialAmount / fullData[startDateValue + 15][stock].stockOpen
        ),
      };
      let slValue = 0;
      let tOpen = fullData[startDateValue + 15][stock].stockOpen;
      if (stopLoss.value !== 0) {
        if (reference === "long") {
          slValue = tOpen - (tOpen * stopLoss.value) / 100;
        } else {
          slValue = tOpen + (tOpen * stopLoss.value) / 100;
        }
      } else {
        if (reference === "long") {
          slValue = 0;
        } else {
          slValue = 1000000;
        }
      }
      finalJson[stock]["slValue"] = slValue;
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

  const calculateValue = () => {
    // alert("triggered");
    setLoading(true);
    let finalArr = [];

    let tmpReferenceCandle = {};

    for (const property in referenceCandle) {
      referenceCandle[property].hitSl = false;
    }

    tmpReferenceCandle = { ...referenceCandle };

    resultSet.forEach((result) => {
      let tmpJson = {};
      let sum = 0;
      stockDataSymbol.forEach((stock) => {
        let openValue = 0;
        let finalValue = 0;
        if (tmpReferenceCandle[stock].hitSl) {
          if (referenceCandle[stock].reference === "long") {
            finalValue =
              referenceCandle[stock].slValue - referenceCandle[stock].value;
          } else {
            finalValue =
              referenceCandle[stock].value - referenceCandle[stock].slValue;
          }
        } else {
          if (referenceCandle[stock].reference === "long") {
            openValue = result[stock].stockHigh;
            finalValue = openValue - referenceCandle[stock].value;
            if (openValue < referenceCandle[stock].slValue) {
              tmpReferenceCandle[stock].hitSl = true;
            }
          } else {
            openValue = result[stock].stockLow;
            finalValue = referenceCandle[stock].value - openValue;
            if (openValue > referenceCandle[stock].slValue) {
              tmpReferenceCandle[stock].hitSl = true;
            }
          }
        }

        finalValue = Number(parseFloat(finalValue.toString()).toFixed(2));
        finalValue = finalValue * referenceCandle[stock].qty;
        finalValue = Number(parseFloat(finalValue.toString()).toFixed(2));
        sum = sum + finalValue;
        tmpJson[stock] = finalValue;
      });
      tmpJson["stockDate"] = result["TATAMOTORS"].stockDate;
      tmpJson["total"] = sum;
      finalArr.push(tmpJson);
    });
    tmpReferenceCandle = {};
    setFinalResultSet(finalArr);
  };

  const totValueCaluculation = (total) => {
    total =
      total -
      (stockDataSymbol.length *
        (captialAmount * (brokerage + breathingValue))) /
        100;
    total = Number(parseFloat(total.toString()).toFixed(2));
    return total;
  };

  return (
    <React.Fragment>
      <Row></Row>
      <Row className="mt-3 pt-3">
        <Col md={1}></Col>
        <Col md={3}>
          <Select
            value={selectDate}
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
      <br />
      <br />
      <Row className="mt-3 pt-3 pl-1 ml-1">
        <Col md={12} align={"center"}>
          {minValue},{maxValue},{dayEndValue};
        </Col>
      </Row>
      <br />
      <Row className="mt-3 pt-3 pl-1 ml-1">
        <Col md={3}>Minimum Value : {minValue}</Col>
        <Col md={3}>Maximum Value : {maxValue}</Col>
        <Col md={3}>Day End Value : {dayEndValue}</Col>
      </Row>
      <br />

      <Row>
        <Col md={12} className="mt-3 pt-3" align={"center"}>
          {!loading && <button onClick={calculateValue}>Calculate</button>}
        </Col>
      </Row>
      <br />
      <br />

      <Row className="ml-1">
        <Col md={1}>
          <b>Date</b>
        </Col>
        <Col md={1}>
          <b>TATAMOTORS</b>
        </Col>
        <Col md={1}>
          <b>RELIANCE</b>
        </Col>
        <Col md={1}>
          <b>SBIN</b>
        </Col>
        <Col md={1}>
          <b>HDFCBANK</b>
        </Col>

        <Col md={1}>
          <b>M&M</b>
        </Col>
        <Col md={1}>
          <b>TCS</b>
        </Col>
        <Col md={1}>
          <b>ADANIPORTS</b>
        </Col>
        <Col md={1}>
          <b>SUNPHARMA</b>
        </Col>
        <Col md={1}>
          <b>Gross Total</b>
        </Col>
        <Col md={1}>
          <b>Net Total</b>
        </Col>
      </Row>
      {finalResult.map((result, index) => (
        <Row className="ml-1" key={index}>
          <Col md={1}>{result.stockDate}</Col>
          <Col md={1}>{result["TATAMOTORS"]}</Col>
          <Col md={1}>{result["RELIANCE"]}</Col>
          <Col md={1}>{result["SBIN"]}</Col>
          <Col md={1}>{result["HDFCBANK"]}</Col>
          <Col md={1}>{result["M&M"]}</Col>
          <Col md={1}>{result["TCS"]}</Col>
          <Col md={1}>{result["ADANIPORTS"]}</Col>
          <Col md={1}>{result["SUNPHARMA"]}</Col>
          <Col md={1}>
            {Number(parseFloat(result["total"].toString()).toFixed(2))}
          </Col>
          <Col md={1}>{totValueCaluculation(result["total"])}</Col>
        </Row>
      ))}
    </React.Fragment>
  );
};

export default SpreadStock;
