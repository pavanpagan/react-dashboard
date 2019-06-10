import React,{Component} from 'react';
import {Container, Grid, Row, Col } from "react-bootstrap";

class Sixthcard extends Component{

    render()
    {
        return(
            <li className="cards">
                <label className="sixthcardlabel">● Europe</label>
                <div className="linethird sixth"></div>
                 <div className="thirddiv" >
                    <Row >
                        <Col xs={4} className="thirdparent"><div class="triangle-right"></div><div className="thirdlast">Qty</div><div className="aws">45%</div></Col>
                        <Col xs={2}><div class="verticalline"></div></Col>
                        <Col xs={4} ><div className="thirdlast">Valorisation</div><div className="aws">$72.80</div></Col>
                    </Row>
                 </div>
                <div className="linethird"></div>
                <Row> <label className="Balanced">Balanced</label></Row>
                <Row><label className="change">Change Your Risk</label></Row>
             
               
               
            </li>
        )
    }
}
export default Sixthcard;