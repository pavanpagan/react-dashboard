import React, { Component } from "react";
import { Row,Col } from "react-bootstrap";
import {text} from 'react-icons-kit/entypo/text';
import { Icon } from "react-icons-kit";
import {ic_notifications} from 'react-icons-kit/md/ic_notifications';
import {ic_apps} from 'react-icons-kit/md/ic_apps';
import ExampleComponent from "react-rounded-image";
import profile from '../assets/images/rideicon.jpg';
import Select from 'react-select'
const options = [
  { value: "Profile", label: "Profile" },
  { value: "Privacy", label: "Privacy" }
];
export default class Header extends Component {
  constructor(props)
  {
    super(props);
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      selectedOption:''
    };
  }
  toggle() {
  this.setState(prevState => ({
    dropdownOpen: !prevState.dropdownOpen
  }));
}
handleChange = async(selectedOption) => {
  await this.setState({ 
      selectedOption,
  });
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
        <Col xs={2} className="newhouse"><button className="newbutton">CA</button>    New House    <Icon className="appsicon" size={40} icon={ic_apps}/></Col>
        <Col xs={1}><div class="verticalline heads"></div></Col>
       <Col xs={1}><div><Icon className="notification" size={25} icon={ic_notifications}/></div></Col>
        <Col xs={1}><div class="verticalline head"></div></Col>
        <Col xs={1} className="profileimage">
            <ExampleComponent 
              image={profile}
              roundedSize="0"
              imageWidth="40"
              imageHeight="40"
            />
        </Col>  
            <Col xs={2} className="navbars"><Select  placeholder="Cameron Svensson" value={this.state.selectedOption} options={options} onChange={this.handleChange.bind(this)}/> </Col>
        </Row>

      </div>
    );
  }
}
