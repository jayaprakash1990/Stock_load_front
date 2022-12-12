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
  const [stopLoss, setStopLoss] = useState({ label: 0.3, value: 0.3 });
  const [candleTime, setCandleTime] = useState({ label: 1, value: 1 });
  const [referenceCandle, setReferenceCandle] = useState({});
  const [resultSet, setResultSet] = useState([]);
  const [finalResult, setFinalResultSet] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [dayEndValue, setDayEndValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const captialAmount = 50000;
  const brokerage = 0.16;
  const breathingValue = 0.05;

  // useEffect(() => {
  //   if (referenceCandle) {
  //     console.log(referenceCandle);
  //     console.log(resultSet);
  //   }
  // }, [referenceCandle, stopLoss, candleTime]);

  // useEffect(() => {
  //   console.log(finalResult);
  // }, [finalResult]);

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

            ///TODO: Day stop
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
            checkHighLow(response.data);
          } else {
            alert("Problem with stock refreshing");
          }
        });
    }
  }, [selectDate]);

  const checkHighLow = (fullData) => {
    let arrData = Object.values(fullData);

    let tmpArr = [];
    for (let i = 0; i < candleTime.value; i++) {
      tmpArr.push(arrData[i]);
    }
    let highLowJson = {};
    // console.log(tmpArr);

    stockDataSymbol.forEach((stock) => {
      let tmpHigh = Math.max(...tmpArr.map((item) => item[stock].stockHigh));
      let tmpLow = Math.min(...tmpArr.map((item) => item[stock].stockLow));
      let tmpAverage = (tmpHigh + tmpLow) / 2;
      let tmpEntryValue = tmpArr[candleTime.value - 1][stock].stockClose;

      let tmpReference = tmpEntryValue > tmpAverage ? "long" : "short";
      let tEntryValue =
        tmpReference === "long"
          ? roundUpCalcualtion(
              tmpEntryValue + (tmpEntryValue * breathingValue) / 100
            )
          : roundDownCalcualtion(
              tmpEntryValue - (tmpEntryValue * breathingValue) / 100
            );
      let tmpSlValue = calSlValue(tEntryValue, tmpReference);
      let tmpQty = Math.round(captialAmount / tEntryValue);
      highLowJson[stock] = {
        high: tmpHigh,
        low: tmpLow,
        value: twoDigitDecimal(tEntryValue),
        reference: tmpReference,
        qty: tmpQty,
        hitSl: false,
        slValue: tmpSlValue,
        slTriggerValue: 0,
      };
    });
    // console.log(highLowJson);
    setReferenceCandle(highLowJson);
    let farr = [];
    arrData.forEach((arr1, i) => {
      if (i >= candleTime.value) {
        farr.push(arr1);
      }
    });
    // console.log(farr);
    setResultSet(farr);
  };

  const roundDownCalcualtion = (price) => {
    return Math.floor(price * 20) / 20;
  };

  const roundUpCalcualtion = (price) => {
    return Math.ceil(price * 20) / 20;
  };

  const calSlValue = (value, position) => {
    if (position === "long") {
      return roundDownCalcualtion(value - (value * stopLoss.value) / 100);
    } else {
      return roundUpCalcualtion(value + (value * stopLoss.value) / 100);
    }
  };

  const twoDigitDecimal = (value) => {
    return Number(parseFloat(value.toString()).toFixed(2));
  };

  useEffect(() => {
    if (resultSet.length > 0) {
      const timer = setTimeout(() => {
        calculateValue();
        console.log("This will run after 3 second!");
      }, 10);
    }
  }, [resultSet]);

  const calculateValue = () => {
    // alert("triggered");

    setFinalResultSet([]);
    let finalArr = [];
    let tempFinalArr = [];

    resultSet.forEach((result) => {
      let isProceed = true;
      let tmpJson = {};
      stockDataSymbol.forEach((stock) => {
        if (!result[stock]) {
          isProceed = false;
        }
      });
      if (isProceed) {
        stockDataSymbol.forEach((stock) => {
          let closeValue = result[stock].stockClose;
          tmpJson[stock] = closeValue;
        });
        tmpJson["stockDate"] = result["TATAMOTORS"].stockDate;
        tempFinalArr.push(tmpJson);
      }
    });
    // console.log(tempFinalArr);
    let tmpReferenceCandle = { ...referenceCandle };
    tempFinalArr.forEach((res) => {
      let tJson = {};
      tJson["stockDate"] = res.stockDate;
      let totalArr = [];
      stockDataSymbol.forEach((stock) => {
        if (tmpReferenceCandle[stock].reference === "long") {
          if (tmpReferenceCandle[stock].hitSl) {
            tJson[stock] = twoDigitDecimal(
              tmpReferenceCandle[stock].slTriggerValue
            );
          } else {
            if (res[stock] < tmpReferenceCandle[stock].slValue) {
              tmpReferenceCandle[stock].hitSl = true;
              tmpReferenceCandle[stock].slTriggerValue =
                (res[stock] - tmpReferenceCandle[stock].value) *
                tmpReferenceCandle[stock].qty;
            }
            tJson[stock] = twoDigitDecimal(
              (res[stock] - tmpReferenceCandle[stock].value) *
                tmpReferenceCandle[stock].qty
            );
          }
        } else {
          if (tmpReferenceCandle[stock].hitSl) {
            tJson[stock] = twoDigitDecimal(
              tmpReferenceCandle[stock].slTriggerValue
            );
          } else {
            if (res[stock] > tmpReferenceCandle[stock].slValue) {
              tmpReferenceCandle[stock].hitSl = true;
              tmpReferenceCandle[stock].slTriggerValue =
                (tmpReferenceCandle[stock].value - res[stock]) *
                tmpReferenceCandle[stock].qty;
            }
            tJson[stock] = twoDigitDecimal(
              (tmpReferenceCandle[stock].value - res[stock]) *
                tmpReferenceCandle[stock].qty
            );
          }
        }
        totalArr.push(tJson[stock]);
      });
      let total = totalArr.reduce((partialSum, a) => partialSum + a, 0);
      tJson["total"] = twoDigitDecimal(total);
      finalArr.push(tJson);
    });
    console.log("final Arr");
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
      <div>
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
          {/* <Col md={1}>
            <b>HDFCBANK</b>
          </Col> */}

          {/* <Col md={1}>
            <b>M&M</b>
          </Col> */}
          <Col md={1}>
            <b>TCS</b>
          </Col>
          {/* <Col md={1}>
            <b>ADANIPORTS</b>
          </Col> */}
          {/* <Col md={1}>
            <b>SUNPHARMA</b>
          </Col> */}
          {/* <Col md={1}>
            <b>CIPLA</b>
          </Col> */}
          {/* <Col md={1}>
            <b>GRASIM</b>
          </Col> */}
          {/* <Col md={1}>
            <b>ICICIBANK</b>
          </Col> */}
          {/* <Col md={1}>
            <b>TATASTEEL</b>
          </Col> */}
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
            {/* <Col md={1}>{result["HDFCBANK"]}</Col> */}
            {/* <Col md={1}>{result["M&M"]}</Col> */}
            <Col md={1}>{result["TCS"]}</Col>
            {/* <Col md={1}>{result["ADANIPORTS"]}</Col> */}
            {/* <Col md={1}>{result["SUNPHARMA"]}</Col> */}
            {/* <Col md={1}>{result["CIPLA"]}</Col> */}
            {/* <Col md={1}>{result["GRASIM"]}</Col> */}
            {/* <Col md={1}>{result["ICICIBANK"]}</Col> */}
            {/* <Col md={1}>{result["TATASTEEL"]}</Col> */}
            <Col md={1}>{result.total}</Col>
            <Col md={1}>{totValueCaluculation(result["total"])}</Col>
          </Row>
        ))}
      </div>
    </React.Fragment>
  );
};

export default SpreadStock;
