webpackHotUpdate(3,{

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/cjs/react.development.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__ = __webpack_require__("./node_modules/react-simple-maps/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_simple_maps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_simple_maps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_scale__ = __webpack_require__("./node_modules/d3-scale/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios__ = __webpack_require__("./node_modules/axios/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_axios__);
var _jsxFileName = "/home/pavan/works/intelicar/bubbles-map/pages/index.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/index.js").enterModule;

  enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
};

var cityScale = Object(__WEBPACK_IMPORTED_MODULE_2_d3_scale__["a" /* scaleLinear */])().domain([0, 37843000]).range([1, 25]);

var BasicMap = function (_Component) {
  _inherits(BasicMap, _Component);

  function BasicMap() {
    _classCallCheck(this, BasicMap);

    var _this = _possibleConstructorReturn(this, (BasicMap.__proto__ || Object.getPrototypeOf(BasicMap)).call(this));

    _this.state = {
      cities: []
    };
    _this.fetchCities = _this.fetchCities.bind(_this);
    return _this;
  }

  _createClass(BasicMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchCities();
    }
  }, {
    key: "fetchCities",
    value: function fetchCities() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get("/static/world-most-populous-cities.json").then(function (res) {
        _this2.setState({
          cities: res.data
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        { style: wrapperStyles, __source: {
            fileName: _jsxFileName,
            lineNumber: 46
          }
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["ComposableMap"],
          {
            projectionConfig: { scale: 205 },
            width: 980,
            height: 551,
            style: {
              width: "30%",
              height: "auto"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            }
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["ZoomableGroup"],
            { center: [0, 20], disablePanning: true, __source: {
                fileName: _jsxFileName,
                lineNumber: 56
              }
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Geographies"],
              { geography: "/static/world-50m.json", __source: {
                  fileName: _jsxFileName,
                  lineNumber: 57
                }
              },
              function (geographies, projection) {
                return geographies.map(function (geography, i) {
                  return geography.id !== "ATA" && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Geography"], {
                    key: i,
                    geography: geography,
                    projection: projection,
                    style: {
                      default: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      hover: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      pressed: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      }
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 61
                    }
                  });
                });
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Markers"],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 88
                }
              },
              this.state.cities.map(function (city, i) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Marker"],
                  { key: i, marker: city, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 91
                    }
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("circle", {
                    cx: 0,
                    cy: 0,
                    r: cityScale(city.population),
                    fill: "rgba(255,87,34,0.8)",
                    stroke: "#607D8B",
                    strokeWidth: "2",
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 92
                    }
                  })
                );
              })
            )
          )
        )
      );
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return BasicMap;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

var _default = BasicMap;


/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/index.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/index.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(wrapperStyles, "wrapperStyles", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(cityScale, "cityScale", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(BasicMap, "BasicMap", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(_default, "default", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  leaveModule(module);
})();

;
    (function (Component, route) {
      if(!Component) return
      if (false) return
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=3.0bdf367eb8da07c2ff14.hot-update.js.map