import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import BasicMap from "../../Mapsource/pages/index";
class Fifthcard extends Component {
  render() {
    return (
      <li className="cards second">
      <div className="basicmap">
          <BasicMap />
      </div>
      </li>
    );
  }
}
export default Fifthcard;
