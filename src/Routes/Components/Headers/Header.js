import React, { Component } from "react";
import { Col } from "react-bootstrap";
import LoginIcon from "../assets/images/sign-out-alt-solid.svg";
import {text} from 'react-icons-kit/entypo/text';
import { Icon } from "react-icons-kit";

export default class Header extends Component {
  render() {
    return (
      <div>
        <Col lg={2} xs={3} className="outerHeadingDiv">
          <div className="headingDiv">
            <button className="buttonTop"><Icon icon={text}/></button>
          </div>
        </Col>
        <Col lg={1} lgOffset={9} xs={3} xsOffset={6}>
          <div className="loginButtonDiv">
           
          </div>
        </Col>
      </div>
    );
  }
}
