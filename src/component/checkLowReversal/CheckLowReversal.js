import React, { useEffect, useState } from "react";
import { serviceURL } from "../../serviceURL";
import axios from "axios";
import { Row, Col } from "reactstrap";

const CheckLowReversal = () => {
  const [resultState, setResultState] = useState([]);
  const [finalResult, setFinalResult] = useState("");

  useEffect(() => {
    /////For every stock symbol, time and date need to change here

    const symbol = "TATAMOTORS";
    const fromDate = 202210130900;
    const toDate = 202211131145;

    axios
      .get(serviceURL + "/test/" + symbol + "/" + fromDate + "/" + toDate)
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
    axios.post(serviceURL + "/checkLowReversal", result).then((response) => {
      // console.log('*******************88');
      if (response) {
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
          <Col md={4}>Success : {finalResult}</Col>
        </Row>
      </div>
      <div className="mt-5 pt-4">
        <table
          style={{ border: "1px solid black", width: "100%" }}
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

export default CheckLowReversal;
