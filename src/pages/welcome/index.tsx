import React, { useState } from "react";
import QRCode from "qrcode.react";
import "./style.css";
import { httpServerCreatedObserverable } from "../../ipcRenderer";
import { HTTPCreatedPayload } from "../../types";

function Welcome() {
  const [url, setUrl] = useState("");
  httpServerCreatedObserverable.subscribe((value: HTTPCreatedPayload) => {
    setUrl(value.addr);
    console.log(url);
  });
  return (
    <section id="welcome-container">
      <QRCode value={url} size={256} />
      <h4>Please scan the QRCode by using mobile apps.{url}</h4>
    </section>
  );
}

export default Welcome;
