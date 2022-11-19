import React, { useEffect, useState } from "react";
import { serviceURL } from "../../serviceURL";
import axios from "axios";
import { Row, Col } from "reactstrap";

const CheckHighReversal = () => {
  const [resultState, setResultState] = useState([]);
  const [finalResult, setFinalResult] = useState("");
  const [showDate, setShowDate] = useState("");

  useEffect(() => {
    /////For every stock symbol, time and date need to change here

    const symbol = "TATAMOTORS";
    const fromDate = 202210130900;
    const toDate = 202211131145;

    axios
      .get(
        serviceURL +
          "/testCheckHighReversal/" +
          symbol +
          "/" +
          fromDate +
          "/" +
          toDate
      )
      .then((response) => {
        // console.log('*******************88');
        if (response) {
          setResultState(response.data);
        } else {
          alert("Problem with stock refreshing");
        }
      });
  }, []);

  const fetchValue = (result) => {
    let tDateYear = result.stockDate.toString().substr(0, 4);
    let tDateMon = result.stockDate.toString().substr(4, 2);
    let tDateDay = result.stockDate.toString().substr(6, 2);
    let tDateHou = result.stockDate.toString().substr(8, 2);
    let tDateMin = result.stockDate.toString().substr(10, 2);
    let dateValue =
      tDateDay +
      " - " +
      tDateMon +
      " - " +
      tDateYear +
      "  Time  " +
      tDateHou +
      " : " +
      tDateMin;
    setShowDate(dateValue);
    axios.post(serviceURL + "/checkHighReversal", result).then((response) => {
      setFinalResult("");
      // console.log('*******************88');
      if (response) {
        alert(response.data.result);
        setFinalResult(response.data.result);
      } else {
        alert("Problem with stock refreshing");
      }
    });
  };

  return (
    <React.Fragment>
      <div className="mt-3">
        <Row className="mt-3">
          <Col md={4} className="font-strong">
            Date : <strong>{showDate}</strong>
          </Col>
          <Col md={4}>
            Success : <strong>{finalResult}</strong>
          </Col>
        </Row>
      </div>
      <div className="mt-5 pt-4" style={{ height: "200" }}>
        <table
          style={{
            border: "1px solid black",
            width: "100%",
            height: "100px",
            overflow: "auto",
          }}
          className="ml-4"
        >
          <thead style={{ border: "1px solid black" }}>
            <tr style={{ border: "1px solid black" }}>
              <th>Id</th>
              <th>Symbol</th>
              <th>Open</th>
              <th>Close</th>
              <th>High</th>
              <th>Low</th>
              <th>Volume</th>
              <th>Date</th>
              <th>CheckSuccess</th>
            </tr>
          </thead>
          <tbody style={{ border: "1px solid black" }}>
            {resultState.map((result, index) => (
              <tr
                className="mt-1"
                style={{ border: "1px solid black" }}
                key={index}
              >
                <td>{result["stockId"]}</td>
                <td>{result["stockSymbol"]}</td>
                <td>{result["stockOpen"]}</td>
                <td>{result["stockClose"]}</td>
                <td>{result["stockHigh"]}</td>
                <td>{result["stockLow"]}</td>
                <td>{result["stockVolume"]}</td>
                <td>{result["stockDate"]}</td>
                <td>
                  <button
                    onClick={() => {
                      fetchValue(result);
                    }}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default CheckHighReversal;
