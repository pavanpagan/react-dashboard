import React, { Component } from "react";
import Icon from "react-icons-kit";
import { Line, Circle } from "rc-progress";
import { arrowRightLight } from "react-icons-kit/metrize/arrowRightLight";
import { Col } from "react-bootstrap";

class Firstcard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <li className="card">
        <div className="container">
          <div className="firstdiv">
            <label className="firstspan">$ </label>
            <label className="secondspan">23,685 </label>
          </div>
        </div>
        <div>
          <label className="secondPrice">
            <label style={{ color: "gray" }}>Deposits:</label>$10,000
          </label>{" "}
        </div>
        <div className="thirddiv">
          <label className="thirdprice">+5.2%($456)</label>
        </div>
        <button className="addFund">
          <b>ADD FUNDS</b>
          <Icon className="addfundicon" size={25} icon={arrowRightLight} />
        </button>
        <div class="line" />
        <div className="bottomRow">
          <span style={{ display: "inline-block" }}>
            <span>
              
              <div className="lineTextSizeOne">
                <label className="lineGoal">Goal:</label>$55,000
              </div>
              <div>
                
                <Line
                  className="lineone"
                  percent="50"
                  strokeWidth="4"
                  strokeColor="#8171C1"
                />
              </div>
            </span>
          </span>
          <span style={{ display: "inline-block" }}>
            <span>
              
              <div className="lineTextSizeTwo">
                <label className="lineGoal">Duration:</label>4y
              </div>
              <div>
                
                <Line
                  className="linetwo"
                  percent="50"
                  strokeWidth="4"
                  strokeColor="#F0D059"
                />
              </div>
            </span>
          </span>
        </div>
      </li>
    );
  }
}
export default Firstcard;
