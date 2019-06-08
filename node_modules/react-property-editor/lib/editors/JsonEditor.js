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

var _utilsTruncateStringJs = require('../utils/TruncateString.js');

var _utilsTruncateStringJs2 = _interopRequireDefault(_utilsTruncateStringJs);

var _reactOverlays = require('react-overlays');

var _reactJsonFork = require('react-json-fork');

var _reactJsonFork2 = _interopRequireDefault(_reactJsonFork);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsEmptyValueJs = require('../utils/EmptyValue.js');

var _utilsEmptyValueJs2 = _interopRequireDefault(_utilsEmptyValueJs);

var _utilsModalStylesJs = require('../utils/ModalStyles.js');

var _utilsModalStylesJs2 = _interopRequireDefault(_utilsModalStylesJs);

var JsonEditor = (function (_React$Component) {
    _inherits(JsonEditor, _React$Component);

    //static propTypes = {onClose: PropTypes.func}

    function JsonEditor(props) {
        _classCallCheck(this, JsonEditor);

        _get(Object.getPrototypeOf(JsonEditor.prototype), 'constructor', this).call(this, props);
        this.state = { show: false, value: this.props.value };
    }

    _createClass(JsonEditor, [{
        key: 'close',
        value: function close() {
            this.props.onUpdated(this.state.value);
            this.setState({ showModal: false });
        }
    }, {
        key: 'open',
        value: function open() {
            this.setState({ showModal: true, value: this.props.value });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(value) {
            this.setState({ value: value });
        }
    }, {
        key: 'render',
        value: function render() {
            var dialogStyle = _lodash2['default'].extend(_utilsModalStylesJs2['default'].dialogStyle, { minWidth: 800 });
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    _utilsEmptyValueJs2['default'],
                    { value: this.props.value, open: this.open.bind(this) },
                    _react2['default'].createElement(_utilsTruncateStringJs2['default'], { value: this.props.value })
                ),
                _react2['default'].createElement(
                    _reactOverlays.Modal,
                    { show: this.state.showModal, onHide: this.close.bind(this), style: _utilsModalStylesJs2['default'].modalStyle,
                        backdropStyle: _utilsModalStylesJs2['default'].backdropStyle },
                    _react2['default'].createElement(
                        'div',
                        { style: dialogStyle },
                        _react2['default'].createElement(_reactJsonFork2['default'], { value: this.state.value, onChange: this.handleChange.bind(this) })
                    )
                )
            );
        }
    }]);

    return JsonEditor;
})(_react2['default'].Component);

exports['default'] = JsonEditor;
;
module.exports = exports['default'];