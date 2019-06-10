
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import request from "axios"
import customData from '../static/world-50m.json';
import cities from '../static/world-most-populous-cities.json';

const wrapperStyles = {
  width: "100%",
  maxWidth: 900,
  height:"100%"
  // margin: "0 auto",
}

const cityScale = scaleLinear()
  .domain([0,37843000])
  .range([1,25])
let data=cities;


class BasicMap extends Component {
  constructor() {
    super()
    this.state = {
      cities: [],
    }
    this.fetchCities = this.fetchCities.bind(this)
  }
  componentDidMount() {
    this.fetchCities()
  }
  fetchCities() {
    // request
    //   .get("/static/world-most-populous-cities.json")
    //   .then(res => {
    //     console.log("resp",res)
    //     this.setState({
    //       cities: data,
    //     })
    //   })
    this.setState({
      cities: data,
    })
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{ scale: 205 }}
          width={980}
          height={800}
          style={{
            width: "60%",
            height: "100%",
          }}
          >
          <ZoomableGroup center={[-10,5]} disablePanning>
            <Geographies geography={customData}>
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  geography.id !== "ATA" && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                      }}
                    />
              ))}
            </Geographies>
            <Markers>
              {
                this.state.cities.map((city, i) => (
                  <Marker key={i} marker={city}>
                    <circle
                      cx={0}
                      cy={0}
                      r={cityScale(city.population)}
                      fill="rgba(255,87,34,0.8)"
                      stroke="#607D8B"
                      strokeWidth="2"
                    />
                  </Marker>
                ))
              }
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default BasicMap;
