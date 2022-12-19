import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { optionData, optionsDate } from "../../optionDate";
import { serviceURL } from "../../serviceURL";
import axios from "axios";
import { candleTimeData } from "../../constants/stockDate";

const OptionSpreadShort = () => {
  ///////////////////////////////////////
  //////////////////////////////////////////
  ///////////////////////////////////////////////

  const [candleTime, setCandleTime] = useState({ label: 1, value: 1 });

  const [stopLoss, setStopLoss] = useState(38);

  const skipMinutes = 1;

  //////////////////////////////////////////
  /////////////////////////////////////////////
  ////////////////////////////////////////
  const [selectDate, setSelectDate] = useState(null);
  const [finalResult, setFinalResult] = useState([]);
  const [jsonResult, setJsonResult] = useState({});
  const [completeData, setCompleteData] = useState([]);
  const [ceValue, setCeValue] = useState(null);
  const [peValue, setPeValue] = useState(null);

  const [niftyValue, setNiftyValue] = useState({});

  const [reference, setReference] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [dayEndValue, setDayEndValue] = useState(0);
  const [dayEndMaxValue, setDayEndMaxValue] = useState(0);
  const [ref, setRef] = useState({
    ceValue: 0,
    ceStopLoss: 0,
    peStopLoss: 0,
    peValue: 0,
  });

  let ceSlTrigger = { isTrigger: false, value: stopLoss };
  let peSlTrigger = { isTrigger: false, value: stopLoss };

  const captialAmount = 50000;
  const brokerage = 60;
  const qty = 50;
  const bufferValue = 1;
  const secondStopLoss = 1;

  const roundNum50 = (value) => {
    return Math.round(value / 50) * 50;
  };

  useEffect(() => {
    if (selectDate) {
      let tmpDate = "0915";
      if (candleTime.value === 2) {
        tmpDate = "0916";
      } else if (candleTime.value === 3) {
        tmpDate = "0917";
      } else if (candleTime.value === 5) {
        tmpDate = "0919";
      } else if (candleTime.value === 8) {
        tmpDate = "0922";
      } else if (candleTime.value === 10) {
        tmpDate = "0924";
      } else if (candleTime.value === 15) {
        tmpDate = "0929";
      } else if (candleTime.value === 30) {
        tmpDate = "0944";
      } else if (candleTime.value === 45) {
        tmpDate = "0959";
      }
      let date = "" + selectDate.value + tmpDate;
      axios
        .get(serviceURL + "/fetchCurrentNiftyValue/" + parseInt(date))
        .then((response) => {
          console.log(date);
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
      let eDate = parseInt("" + selectDate.value + "1510");
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

            let finalTData = [];

            //TODO: Skip minutes
            let i = 0;
            tmpCompleteData.forEach((e) => {
              if (i >= candleTime.value) {
                if (
                  e[tmpCeValue.value] &&
                  e[tmpCeValue.value].stockDate &&
                  e[tmpCeValue.value].stockDate % skipMinutes === 0
                ) {
                  finalTData.push(e);
                }
              } else {
                finalTData.push(e);
              }
              i++;
            });
            // console.log(finalTData);
            //////////

            setCompleteData(finalTData);
          } else {
            alert("Problem with fetching Nifty Value");
          }
        });
    }
  }, [niftyValue]);

  const checkAndSetStopLoss = () => {
    let ceStockClose =
      completeData[candleTime.value - 1][ceValue.value].stockClose;
    let peStockClose =
      completeData[candleTime.value - 1][peValue.value].stockClose;

    let tmpBufferCeStockClose =
      ceStockClose - (ceStockClose * bufferValue) / 100;

    let tmpBufferPeStockClose =
      peStockClose - (peStockClose * bufferValue) / 100;

    // let bufferCeStockClose = tmpBufferCeStockClose * 50;
    // let bufferPeStockClose = tmpBufferPeStockClose * 50;

    // let slCeStockTriggerPrice =
    //   (tmpBufferCeStockClose + (stopLoss * tmpBufferCeStockClose) / 100) * 50;

    // let slPeStockTriggerPrice =
    //   (tmpBufferPeStockClose + (stopLoss * tmpBufferPeStockClose) / 100) * 50;
    let slCeStockTriggerPrice = ((stopLoss * tmpBufferCeStockClose) / 100) * 50;

    let slPeStockTriggerPrice = ((stopLoss * tmpBufferPeStockClose) / 100) * 50;
    setRef({
      ceValue: ceStockClose,
      peValue: peStockClose,
      ceEntryBufferValue: ceStockClose - (ceStockClose * bufferValue) / 100,
      peEntryBufferValue: peStockClose - (peStockClose * bufferValue) / 100,
      ceStopLoss: twoDigitDecimal(-slCeStockTriggerPrice),
      peStopLoss: twoDigitDecimal(-slPeStockTriggerPrice),
    });

    ceSlTrigger.value = twoDigitDecimal(-slCeStockTriggerPrice);
    peSlTrigger.value = twoDigitDecimal(-slPeStockTriggerPrice);
    let tmpDayEndMaxValue =
      slCeStockTriggerPrice < slPeStockTriggerPrice
        ? twoDigitDecimal(slPeStockTriggerPrice)
        : twoDigitDecimal(slCeStockTriggerPrice);
    tmpDayEndMaxValue = tmpDayEndMaxValue > 1500 ? tmpDayEndMaxValue : 1500;
    setDayEndMaxValue(tmpDayEndMaxValue);
    return tmpDayEndMaxValue;
  };

  const twoDigitDecimal = (value) => {
    return Number(parseFloat(value.toString()).toFixed(2));
  };

  useEffect(() => {
    if (completeData.length > 0) {
      let tDayEndMax = checkAndSetStopLoss();
      const timer = setTimeout(() => {
        calculateValue(tDayEndMax);
        console.log("This will run after 3 second!");
      }, 10);
    }
  }, [completeData]);

  const calculateValue = (tDayEndMax) => {
    // e.preventDefault();
    setFinalResult([]);
    let finalArr = [];
    let ceStockClose =
      completeData[candleTime.value - 1][ceValue.value].stockClose;
    let peStockClose =
      completeData[candleTime.value - 1][peValue.value].stockClose;
    let tempReferenceValue = ceStockClose * 50 + peStockClose * 50;

    let bufferCeStockClose =
      (ceStockClose - (ceStockClose * bufferValue) / 100) * 50;
    let bufferPeStockClose =
      (peStockClose - (peStockClose * bufferValue) / 100) * 50;

    let bufferTempReferenceValue =
      (ceStockClose - (ceStockClose * bufferValue) / 100) * 50 +
      (peStockClose - (peStockClose * bufferValue) / 100) * 50;

    // console.log("originalReferenceValue ", tempReferenceValue);
    // console.log("bufferCeStockClose ", bufferCeStockClose);
    // console.log("bufferPeStockClose ", bufferPeStockClose);
    setReference(bufferTempReferenceValue);

    for (let i = 0; i < completeData.length; i++) {
      if (
        i >= candleTime.value &&
        completeData[i][ceValue.value] &&
        completeData[i][peValue.value]
      ) {
        // let totalCalculateValue =
        //   bufferTempReferenceValue -
        //   (completeData[i][ceValue.value].stockClose * 50 +
        //     completeData[i][peValue.value].stockClose * 50);
        // console.log(completeData[i][ceValue.value].stockDate);
        let highStockCeValueCheck = completeData[i][ceValue.value].stockClose;
        let highStockPeValueCheck = completeData[i][peValue.value].stockClose;

        let tmpCeValueChange = bufferCeStockClose - highStockCeValueCheck * 50;
        let tmpPeValueChange = bufferPeStockClose - highStockPeValueCheck * 50;
        if (!ceSlTrigger.isTrigger && tmpCeValueChange < ceSlTrigger.value) {
          ceSlTrigger.isTrigger = true;
          ceSlTrigger.value = twoDigitDecimal(tmpCeValueChange);
          if (!peSlTrigger.isTrigger) {
            // peSlTrigger.value = twoDigitDecimal(-ceSlTrigger.value / 2);
            peSlTrigger.value = 0;
          }
        }
        if (!peSlTrigger.isTrigger && tmpPeValueChange < peSlTrigger.value) {
          peSlTrigger.isTrigger = true;
          peSlTrigger.value = twoDigitDecimal(tmpPeValueChange);
          if (!ceSlTrigger.isTrigger) {
            // ceSlTrigger.value = twoDigitDecimal(-peSlTrigger.value / 2);
            ceSlTrigger.value = 0;
          }
        }
        tmpCeValueChange = ceSlTrigger.isTrigger
          ? ceSlTrigger.value
          : Number(parseFloat(tmpCeValueChange.toString()).toFixed(2));
        tmpPeValueChange = peSlTrigger.isTrigger
          ? peSlTrigger.value
          : Number(parseFloat(tmpPeValueChange.toString()).toFixed(2));
        let tmpJson = {
          dateValue: completeData[i][ceValue.value].stockDate,
          ceOptionValue: highStockCeValueCheck,
          peOptionValue: highStockPeValueCheck,
          ceValueChange: tmpCeValueChange,
          peValueChange: tmpPeValueChange,
          totalValue: Number(
            parseFloat(
              (tmpCeValueChange + tmpPeValueChange).toString()
            ).toFixed(2)
          ),
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
    // console.log("bufferTempReferenceValue ", bufferTempReferenceValue);
    let finalConcatValue =
      tDayEndMax +
      "," +
      tmpMinValue +
      "," +
      tmpMaxValue +
      "," +
      tmpDayEndValue +
      ";\r\n";
    axios
      .get(serviceURL + "/writeInCsv/" + finalConcatValue)
      .then((response) => {
        // console.log('*******************88');
        if (response) {
          let index = optionsDate.findIndex(
            (x) => x.value === selectDate.value
          );

          //TODO: Date needs to comment to check

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
        <Col md={3}>Stop Loss Max: {dayEndMaxValue}</Col>
        <Col md={3}>Minimum Value : {minValue}</Col>
        <Col md={3}>Maximum Value : {maxValue}</Col>
        <Col md={3}>Day End Value : {dayEndValue}</Col>
      </Row>
      <br />
      {/* <Row className="mt-3 pt-3 pl-1 ml-1">
        <Col md={2}>CE Entry Value : {ref.ceValue}</Col>
        <Col md={2}>PE Entry Value : {ref.peValue}</Col>
        <Col md={2}>CE Buffer Value : {ref.ceEntryBufferValue}</Col>
        <Col md={2}>PE Buffer Value : {ref.peEntryBufferValue}</Col>
        <Col md={2}>CE Stop Loss Value : {ref.ceStopLoss}</Col>
        <Col md={2}>PE Stop Loss Value : {ref.peStopLoss}</Col>
      </Row> */}
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
        <Col md={1}></Col>
        <Col md={2}>
          <b>CE Value Change</b>
        </Col>
        <Col md={2}>
          <b>PE Value Change</b>
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
          <Col md={1}></Col>
          <Col md={2}>{result.ceValueChange}</Col>
          <Col md={2}>{result.peValueChange}</Col>
          <Col md={1}>{result.totalValue}</Col>
        </Row>
      ))}
    </React.Fragment>
  );
};

export default OptionSpreadShort;
