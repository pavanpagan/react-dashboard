'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJsonFork = require('react-json-fork');

var _reactJsonFork2 = _interopRequireDefault(_reactJsonFork);

var _utilsToEmptyProps = require('../utils/toEmptyProps');

var _utilsToEmptyProps2 = _interopRequireDefault(_utilsToEmptyProps);

var settings = {
    form: true,
    fixedFields: true,
    adder: false,
    editing: true,
    fields: {
        image: { type: 'string' },
        color: { type: 'colorPicker' },
        gradient: { type: 'gradientColorPicker' },
        size: { type: 'select', settings: { options: ['cover', 'contain', 'auto', 'leftHalf', 'rightHalf'] } },
        position: { type: 'number' },
        repeat: { type: 'select', settings: { options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'] } },
        attachment: { type: 'select', settings: { options: ['scroll', 'fixed', 'local'] } },
        filter: {
            fields: {
                blur: { type: 'number' },
                brightness: { type: 'number' },
                contrast: { type: 'number' },
                grayscale: { type: 'number' },
                hueRotate: { type: 'number' },
                invert: { type: 'number' },
                opacity: { type: 'number' },
                saturate: { type: 'number' },
                sepia: { type: 'number' }
            }
        }
    }
};

var BgEditor = (function (_React$Component) {
    _inherits(BgEditor, _React$Component);

    function BgEditor(props) {
        _classCallCheck(this, BgEditor);

        _get(Object.getPrototypeOf(BgEditor.prototype), 'constructor', this).call(this, props);
        this.state = { show: false };
    }

    _createClass(BgEditor, [{
        key: 'toogle',
        value: function toogle() {
            this.setState({ show: !this.state.show });
        }
    }, {
        key: 'render',
        value: function render() {
            var value = _lodash2['default'].merge((0, _utilsToEmptyProps2['default'])(settings), this.props.value);
            var text = ''; //_.reduce(value,function(result,value,key){ return result+= " " + (value!==undefined?value:'--')},"");
            return _react2['default'].createElement(
                'div',
                { className: this.state.show ? 'open' : '' },
                _react2['default'].createElement(
                    'span',
                    { className: 'compoundToggle', onClick: this.toogle.bind(this) },
                    text
                ),
                this.state.show ? _react2['default'].createElement(_reactJsonFork2['default'], { value: value, settings: settings, onChange: this.props.onUpdated }) : null
            );
        }
    }]);

    return BgEditor;
})(_react2['default'].Component);

exports['default'] = BgEditor;
module.exports = exports['default'];