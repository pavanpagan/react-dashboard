
import React,{Component} from 'react';
import Icon from 'react-icons-kit';
import { Line, Circle } from 'rc-progress';
import Select from 'react-select';
import {Container, Grid, Row, Col } from "react-bootstrap";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,} from 'recharts';
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
const data = [
    {
      name: '2012', Balance: 10,MarketValue: 10,Deposits:10,
    },
    {
      name: '2013', Balance: 50,MarketValue: 30,Deposits:10,
    },
    {
      name: '2014', Balance: 30,MarketValue: 10,Deposits:10,
    },
    {
      name: '2015', Balance:70,MarketValue: 50,Deposits:10,
    },
    {
      name: '2016', Balance: 50,MarketValue: 40,Deposits:10,
    },
    {
      name: '2017', Balance: 100,MarketValue: 85,Deposits:10,
    }
  ];

class Secondcard extends Component
{
    render()
    {
        return(
            <div className="card second">
            <Row className="cardsecondrow">
                <Col xs={5}>History</Col>
                <Col className="selectcol" xs={3}><Select placeholder="AllTime" options={options}/></Col>
            </Row>
            <Row>
        <AreaChart
            width={500}
            height={200}
            data={data}
            margin={{
            top: 30, right: 30, left: 0, bottom: 0,
            }}
        >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis   tick={{fontSize: '10px'}} style={{ fontFamily: 'sans-serif' }}
         tickLine={false} dataKey="name" />
        <YAxis axisLine={false}  tick={{fontSize: '10px'}} tickLine={false}/>
        <Tooltip />
        <Area type="monotone" dataKey="Balance" stroke="#7500FE" fill="#E3E3F2" />

        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis  tick={{fontSize: '10px'}} tickLine={false} dataKey="name" />
        <YAxis  tick={{fontSize: '10px'}} axisLine={false} tickLine={false}/>
        <Tooltip />
         <Area type="monotone" dataKey="MarketValue" stroke="#A9B9CF" fill="#E3E3F2" />
       
       
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis  tick={{fontSize: '10px'}} tickLine={false} dataKey="name" />
        <YAxis  tick={{fontSize: '10px'}} axisLine={false} tickLine={false}/>
        <Tooltip />
        <Area type="monotone" dataKey="Deposits" stroke="#A5A5A5" strokeDasharray="3 4 5 2"  fill="#E3E3F2" />
        </AreaChart>
        </Row>
        <Row className="selectcol footer">
        <Col xs={4}>
        <Line className="linetwo balance" percent="100" strokeWidth="15" strokeColor="#7500FE" />Your Balance
          </Col>
            <Col xs={4}><Line className="linetwo balance" percent="100" strokeWidth="15" strokeColor="#A9B9CF" />Your Market Value</Col>
            <Col xs={4}>--- Deposits</Col>
        </Row>

        </div>
        )
    }
}
export default Secondcard;