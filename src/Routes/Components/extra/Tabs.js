import React, { Component } from "react";
import { Col } from "react-bootstrap";
import Tab from "./Tab";
import { th } from "react-icons-kit/fa/th";
import { listUl } from "react-icons-kit/fa/listUl";
import {table} from 'react-icons-kit/icomoon/table'
import { cutlery } from "react-icons-kit/fa/cutlery";
import {basic_home} from 'react-icons-kit/linea/basic_home'
import {home} from 'react-icons-kit/feather/home'
import {notification} from 'react-icons-kit/entypo/notification';
import {fileDirectory} from 'react-icons-kit/oct/fileDirectory'
export default class Tabs extends Component {
  render() {
    return (
      <div>
        <Col sm={1} className="tabSidebar">
          <div className="tabSegments">
               <Tab  label={home} path="/"/>
           <div className="tabAll">
                   <Tab label={cutlery} path="/" />
           </div>
           <div className="tabAll">
                   <Tab label={notification} path="/" />
           </div>
           <div className="tabAll">
                  <Tab label={fileDirectory} path="/" />
           </div>
          </div>
        </Col>
      </div>
    );
  }
}
