import React, { Component } from "react";
import { Row,Col } from "react-bootstrap";
import {text} from 'react-icons-kit/entypo/text';
import { Icon } from "react-icons-kit";
import ExampleComponent from "react-rounded-image";
import profile from '../assets/images/rideicon.jpg';
import Select from 'react-select'
const options = [
  { value: "Time1", label: "Time1" },
  { value: "Time2", label: "Time2" },
  { value: "Time3", label: "Time3" }
];
export default class Header extends Component {
  constructor(props)
  {
    super(props);
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }
  toggle() {
  this.setState(prevState => ({
    dropdownOpen: !prevState.dropdownOpen
  }));
}
  render() {
    return (
      <div>
        <Row>
        <Col  xs={2} className="outerHeadingDiv">
          <div className="headingDiv">
            <button className="buttonTop"><Icon icon={text}/></button>
          </div>
        </Col>
        <Col xs={1}><div class="verticalline"></div></Col>
         sdfg
        <Col xs={1}><div class="verticalline"></div></Col>
        <Col xs={2} >
          <div className="loginButtonDiv">
          <ExampleComponent
          image={profile}
          roundedSize="0"
          imageWidth="40"
          imageHeight="40"
        />
          </div>
        </Col>
        <Col xd={3}>
        <Select placeholder="Cameron Svensson" options={options} />
        </Col>
        </Row>

      </div>
    );
  }
}
