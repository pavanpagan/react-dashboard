import React,{Component} from 'react';
import {PieChart, Pie, Sector, Cell,} from 'recharts';
import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';
import {Container, Grid, Row, Col } from "react-bootstrap";

const data = [
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 100 },
    { name: 'Group C', value: 100 },
    { name: 'Group D', value: 100 },
  ];
  const COLORS = ['#00D08A', '#E9D500', '#5A5174', '#6147FD'];
  
class Fourthcard extends Component{

    render()
    {
        return(
            <li className="cards">
                <Row>
                    <Col xs={4} ><button className="fouthfirst">Allocation</button></Col>
                    <Col xs={4} ><button className="fouthfirst second">Geo</button></Col>
                </Row>
                <div className="piediv">
                 <PieChart width={750} height={300} onMouseEnter={this.onPieEnter}>
                    <Pie
                    data={data}
                    cx={110}
                    cy={60}
                    innerRadius={40}
                    outerRadius={55}
                    fill="#8884d8"
                    paddingAngle={2}
                    startAngle={360}
                    endAngle={0}
                    dataKey="value"
                    >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                    </Pie>
                </PieChart>
                </div>
                <div className="thirddiv" >
                    <Row className="thirdrow" >
                        <Col xs={5} className="thirdparentfirst">● Europe</Col>
                        <Col xs={3} className="thirdparent">45%</Col>
                    </Row>
                </div>
            </li>
        )
    }
}
export default Fourthcard;