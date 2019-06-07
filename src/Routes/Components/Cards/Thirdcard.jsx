import React,{Component} from 'react';
import {PieChart, Pie, Sector, Cell,} from 'recharts';
import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';
import {Container, Grid, Row, Col } from "react-bootstrap";

const data = [
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 100 },
    { name: 'Group C', value: 100 },
    { name: 'Group D', value: 100 },
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 100 },
    { name: 'Group C', value: 100 },
    { name: 'Group D', value: 100 },
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 100 },
   ,
  ];
  const COLORS = ['#C7C7C7', '#C7C7C7', '#FEF9A4', '#FCF575','#FEF9A4', '#C7C7C7', '#C7C7C7', '#C7C7C7','#C7C7C7', '#C7C7C7'];
  
class Thirdcard extends Component{

    render()
    {
        return(
            <div className="card">
                <label className="thirdcardlabel">PROJECT RISK</label>
                <div className="piediv">
                 <PieChart width={700} height={300} onMouseEnter={this.onPieEnter}>
                    <Pie
                    data={data}
                    cx={110}
                    cy={70}
                    innerRadius={55}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={2}
                    startAngle={200}
                    endAngle={-20}
                    dataKey="value"
                    >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                    </Pie>
                </PieChart>
                </div>
                
                <Row> <label className="Balanced">Balanced</label></Row>
                <Row><label className="change">Change Your Risk</label></Row>
                <div className="linethird"></div>
                <div className="thirddiv" >
                
                    <Row >
                        <Col xs={5} className="thirdparent"><div className="thirdlast">Nr</div><div className="aws">AWS 2455</div></Col>
                        <Col xs={5} ><div className="thirdlast">Created</div><div className="aws">22 Dec 2013</div></Col>
                    </Row>
                </div>
                <div className="linethird"></div>
            </div>
        )
    }
}
export default Thirdcard;