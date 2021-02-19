import * as React from "react";
import * as ReactDOM from "react-dom";
import Welcome from "./pages/welcome";

function render() {
  ReactDOM.render(<Welcome />, document.getElementById("react-app-container"));
}

render();
