import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { Principal } from "@dfinity/principal";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
