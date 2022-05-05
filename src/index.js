import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import LampProvider from "./components/Store/LampProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LampProvider>
    <App />
  </LampProvider>
);
