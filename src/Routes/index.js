import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./Components/assets/css/index.css";
import Dashboard from "./Components/Containers/HomeContents";

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Dashboard}/>
    </Switch>
  </BrowserRouter>
);
