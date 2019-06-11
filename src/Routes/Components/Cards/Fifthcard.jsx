import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import BasicMap from "../../Mapsource/pages/index";
import { Line, Circle } from "rc-progress";
import {Container, Grid, Row, Col } from "react-bootstrap";


class Fifthcard extends Component {
  render() {
    return (
      <li className="cards second">
      <div>
        <BasicMap />
        </div>
      </li>
    );
  }
}
export default Fifthcard;
