import React, { useState } from "react";
import { serviceURL } from "../../serviceURL";
import axios from "axios";

const Miscellaneous = () => {
  //const [isBoolean, setBoolean] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(false);
  let tokenStatusValue = "Not Refreshed";

  const tokenButtonClick = () => {
    const reqTokValue = document.getElementById("requestTokenValue").value;
    if (reqTokValue) {
      axios.get(serviceURL + "/token/" + reqTokValue).then((response) => {
        if (response.data.refreshStatus) {
          setTokenStatus(true);
          alert("Token Refreshed Successfully");
        } else {
          alert("Please enter the valid request token");
        }
      });
    } else {
      alert("Enter the request token using that link");
    }
  };

  if (tokenStatus) {
    tokenStatusValue = (
      <React.Fragment>
        <h5 className="font-weight-bold">Token Status : Refreshed </h5>
        Click this button for another, refresh if needed
        <button onClick={() => setTokenStatus(false)}>Another Refresh</button>
      </React.Fragment>
    );
  } else {
    tokenStatusValue = (
      <h5 className="font-weight-bold">
        Token Status :
        <label>
          Not Refreshed... click this{" "}
          <a
            target="#"
            href="https://kite.zerodha.com/connect/login?v=3&api_key=q4jcgtius5r3ekz5"
          >
            link
          </a>{" "}
          to get the Request token
        </label>
        <input type="text" id="requestTokenValue" />
        <button onClick={tokenButtonClick}>setAccessToken</button>
      </h5>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex-row">{tokenStatusValue}</div>
    </React.Fragment>
  );
};

export default Miscellaneous;
