import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { NavLink } from "react-router-dom";
export default class Tab extends Component {
  render() {
    let className = "sidebarTab";

    return (
      <NavLink to={this.props.path}>
        <div className={className}>
          <Icon size={21} icon={this.props.label} />
        </div>
      </NavLink>
    );
  }
}
