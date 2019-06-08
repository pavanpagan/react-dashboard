import React, { Component } from "react";
import { Container, Grid, Row, Col } from "react-bootstrap";
import Fourthcard from "../Cards/Fourthcard";
import Fifthcard from "../Cards/Fifthcard";
import Sixthcard from "../Cards/Sixthcard";
class Rowtwo extends Component {
  render() {
    return (
      <Grid bsClass="container">
        <ul className="card-container" >
            <Fourthcard />
            <Fifthcard />
            <Sixthcard />
        </ul>
      </Grid>
    );
  }
}
export default Rowtwo;