import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { optionData, optionsDate } from "../../optionDate";
import { serviceURL } from "../../serviceURL";
import axios from "axios";
import { candleTimeData } from "../../constants/stockDate";

const OptionSpreadShort = () => {
  const [selectDate, setSelectDate] = useState(null);
  const [finalResult, setFinalResult] = useState([]);
  const [jsonResult, setJsonResult] = useState({});
  const [completeData, setCompleteData] = useState([]);
  const [ceValue, setCeValue] = useState(null);
  const [peValue, setPeValue] = useState(null);
  const [stopLoss, setStopLoss] = useState(-1500);
  const [niftyValue, setNiftyValue] = useState({});
  const [candleTime, setCandleTime] = useState({ label: 15, value: 15 });
  const [reference, setReference] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [dayEndValue, setDayEndValue] = useState(0);

  let slTrigger = false;

  const captialAmount = 50000;
  const brokerage = 60;
  const qty = 50;
  const bufferValue = 1;

  const roundNum50 = (value) => {
    return Math.round(value / 50) * 50;
  };

  useEffect(() => {
    if (selectDate) {
      let date = "" + selectDate.value + "0915";
      axios
        .get(serviceURL + "/fetchCurrentNiftyValue/" + parseInt(date))
        .then((response) => {
          // console.log('*******************88');
          if (response) {
            setNiftyValue(response.data);
          } else {
            alert("Problem with fetching Nifty Value");
          }
        });
    }
  }, [selectDate]);

  useEffect(() => {
    if (niftyValue && niftyValue.stockClose) {
      let sDate = parseInt("" + selectDate.value + "0915");
      let eDate = parseInt("" + selectDate.value + "1445");
      let strike = roundNum50(niftyValue.stockClose);
      let tmpCeValue = {
        label: "NIFTYWK" + strike + "CE",
        value: "NIFTYWK" + strike + "CE",
      };
      let tmpPeVale = {
        label: "NIFTYWK" + strike + "PE",
        value: "NIFTYWK" + strike + "PE",
      };
      setCeValue(tmpCeValue);
      setPeValue(tmpPeVale);

      axios
        .get(
          serviceURL +
            "/fetchOptionsByDate/" +
            sDate +
            "/" +
            eDate +
            "/" +
            tmpCeValue.value +
            "/" +
            tmpPeVale.value
        )
        .then((response) => {
          // console.log('*******************88');
          if (response) {
            let tmpJsonResult = response.data;
            setJsonResult(tmpJsonResult);
            let tmpCompleteData = Object.values(tmpJsonResult);
            setCompleteData(tmpCompleteData);
          } else {
            alert("Problem with fetching Nifty Value");
          }
        });
    }
  }, [niftyValue]);

  useEffect(() => {
    if (completeData.length > 0) {
      calculateValue();
    }
  }, [completeData]);

  const calculateValue = () => {
    // e.preventDefault();
    setFinalResult([]);
    let finalArr = [];
    let ceStockClose = completeData[candleTime.value][ceValue.value].stockClose;
    let peStockClose = completeData[candleTime.value][peValue.value].stockClose;
    let tempReferenceValue = ceStockClose * 50 + peStockClose * 50;

    let bufferTempReferenceValue =
      (ceStockClose - (ceStockClose * bufferValue) / 100) * 50 +
      (peStockClose - (peStockClose * bufferValue) / 100) * 50;

    console.log("originalReferenceValue ", tempReferenceValue);
    setReference(bufferTempReferenceValue);

    for (let i = 0; i < completeData.length; i++) {
      if (i >= candleTime.value) {
        let totalCalculateValue =
          bufferTempReferenceValue -
          (completeData[i][ceValue.value].stockClose * 50 +
            completeData[i][peValue.value].stockClose * 50);
        if (totalCalculateValue < stopLoss) {
          slTrigger = true;
        }
        let tmpJson = {
          dateValue: completeData[i][ceValue.value].stockDate,
          ceOptionValue: completeData[i][ceValue.value].stockClose,
          peOptionValue: completeData[i][peValue.value].stockClose,
          totalValue: slTrigger
            ? stopLoss
            : Number(parseFloat(totalCalculateValue.toString()).toFixed(2)),
        };
        finalArr.push(tmpJson);
      }
    }
    let closeArr = [];
    finalArr.forEach((arr) => {
      closeArr.push(arr.totalValue);
    });
    let tmpMinValue = Math.min(...closeArr);
    let tmpMaxValue = Math.max(...closeArr);
    let tmpDayEndValue = closeArr[closeArr.length - 1];
    setMinValue(tmpMinValue);
    setMaxValue(tmpMaxValue);
    setDayEndValue(tmpDayEndValue);
    setFinalResult(finalArr);
    console.log("bufferTempReferenceValue ", bufferTempReferenceValue);
    let finalConcatValue =
      tmpMinValue + "," + tmpMaxValue + "," + tmpDayEndValue + ";\r\n";
    axios
      .get(serviceURL + "/writeInCsv/" + finalConcatValue)
      .then((response) => {
        // console.log('*******************88');
        if (response) {
          let index = optionsDate.findIndex(
            (x) => x.value === selectDate.value
          );
          setSelectDate(optionsDate[index + 1]);

          // console.log(index);
          // alert(response.data.result);
        } else {
          alert("Problem with stock refreshing");
        }
      });
  };

  return (
    <React.Fragment>
      <Row></Row>
      <Row className="mt-3 pt-3">
        <Col md={1}></Col>
        <Col md={3}>
          Date :
          <Select
            value={selectDate}
            defaultValue={selectDate}
            onChange={setSelectDate}
            placeholder={"select Date"}
            options={optionsDate}
          />
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          CE :{" "}
          <Select
            value={ceValue}
            defaultValue={ceValue}
            onChange={setCeValue}
            options={optionData}
          />
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          PE :{" "}
          <Select
            value={peValue}
            defaultValue={peValue}
            onChange={setPeValue}
            options={optionData}
          />
        </Col>
      </Row>
      <br />
      <Row className="mt-3 pt-3">
        <Col md={1}></Col>
        <Col md={3}>
          Entry Candle :{" "}
          <Select
            defaultValue={candleTime}
            onChange={setCandleTime}
            placeholder={"select Candle Time"}
            options={candleTimeData}
          />
        </Col>

        <Col md={3} className="mt-3 pt-3">
          Stop Loss :{" "}
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
          />
        </Col>
        <Col md={2} className="mt-3 pt-3">
          Nifty Value : {niftyValue && niftyValue.stockClose}
        </Col>
        <Col md={2} className="mt-3 pt-3">
          Round off Value : {niftyValue && roundNum50(niftyValue.stockClose)}
        </Col>
      </Row>
      <br />

      <Row className="mt-3 pt-3 pl-1 ml-1">
        <Col md={12} align={"center"}></Col>
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
          {<button onClick={calculateValue}>Calculate</button>}
        </Col>
      </Row>
      <br />
      <br />

      <Row className="ml-1">
        <Col md={1}>
          <b>Date</b>
        </Col>
        <Col md={1}>
          <b>CE Value</b>
        </Col>
        <Col md={1}>
          <b>PE Value</b>
        </Col>
        <Col md={1}>
          <b>Gross Total</b>
        </Col>
      </Row>
      {finalResult.map((result, index) => (
        <Row className="ml-1" key={index}>
          <Col md={1}>{result.dateValue}</Col>
          <Col md={1}>{result.ceOptionValue}</Col>
          <Col md={1}>{result.peOptionValue}</Col>
          <Col md={1}>{result.totalValue}</Col>
        </Row>
      ))}
    </React.Fragment>
  );
};

export default OptionSpreadShort;
