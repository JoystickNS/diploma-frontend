import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { store } from "./store/store";
import ruRU from "antd/lib/locale/ru_RU";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <ConfigProvider locale={ruRU}>
          <App />
        </ConfigProvider>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
