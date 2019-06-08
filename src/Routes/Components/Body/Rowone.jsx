import React, { Component } from "react";
import { Container, Grid, Row, Col } from "react-bootstrap";
import Firstcard from "../Cards/Firstcard";
import Secondcard from "../Cards/Secondcard";
import Thirdcard from "../Cards/Thirdcard";
class Rowone extends Component {
  render() {
    return (
      <Grid bsClass="container">
        <ul className="card-container" >
        
            <Firstcard />
     
            <Secondcard />
        

          
            <Thirdcard />
         
        </ul>
      </Grid>
    );
  }
}
export default Rowone;
