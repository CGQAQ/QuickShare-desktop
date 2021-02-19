import React from "react";
import QRCode from "qrcode.react";
import "./style.css";

function Welcome() {
  return (
    <section id="welcome-container">
      <QRCode value="https://baidu.com" size={256} />
      <h4>Please scan the QRCode by using mobile apps.</h4>
    </section>
  );
}

export default Welcome;
