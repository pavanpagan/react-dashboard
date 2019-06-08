import React, { Component } from "react";
import Header from "../Headers/Header";

import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import Rowone from "../Body/Rowone";
import Rowtwo from "../Body/Rowtwo";

export default class HomeContents extends Component {
  render() {
    return (
      <div className="App">
        <Grid fluid>
          <Row className="headerRow">
            <Header />
          </Row>
          <Row>
            <Tabs />
            <Col xs={11} className="tabContainer">
              <div style={{marginLeft:"10px",marginTop:"10px"}}>
                <Rowone />
              </div>
              <div style={{marginLeft:"10px",marginTop:"10px"}}>
                <Rowtwo />
              </div>
              {/* <div style={{marginLeft:"10px",marginTop:"10px"}}> */}
                {/* <Second />
              </div> */}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
