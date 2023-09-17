/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react 18 syntax

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { SoftUIControllerProvider } from "context";
import { ThirdwebProvider } from "@thirdweb-dev/react";

// Use createRoot to mount your app
const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <ThirdwebProvider
    activeChain="optimism-goerli"
    clientId="281febb2299a5709dadff9c9ac870126"
  >
  <BrowserRouter>
    <SoftUIControllerProvider>
      <App />
    </SoftUIControllerProvider>
  </BrowserRouter>
  </ThirdwebProvider>
);
