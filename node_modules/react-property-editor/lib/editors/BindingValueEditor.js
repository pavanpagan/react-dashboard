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

var defaultValues = {
    value: undefined,
    binding: {
        mode: 'OneWay',
        path: undefined,
        converter: undefined
    }
};
var settings = {
    form: true,
    fixedFields: true,
    adder: false,
    editing: true,
    fields: {
        binding: { type: 'bindingEditor' }
    }
};

var BindingEditor = (function (_React$Component) {
    _inherits(BindingEditor, _React$Component);

    function BindingEditor(props) {
        _classCallCheck(this, BindingEditor);

        _get(Object.getPrototypeOf(BindingEditor.prototype), 'constructor', this).call(this, props);
        this.state = { checked: props.value === undefined };
    }

    _createClass(BindingEditor, [{
        key: 'checkedChanged',
        value: function checkedChanged(e) {
            this.setState({ checked: e.target.checked });
        }
    }, {
        key: 'valueChanged',
        value: function valueChanged(value) {
            this.props.onUpdated(value);
        }
    }, {
        key: 'render',
        value: function render() {
            var value = _lodash2['default'].extend(_lodash2['default'].clone(defaultValues), this.props.value);
            settings.hiddenFields = [this.state.checked ? 'value' : 'binding'];
            var valueType = this.props.settings && this.props.settings.type;
            if (valueType !== undefined) settings.fields.value = { type: valueType };
            return _react2['default'].createElement(
                'div',
                { className: 'bindingEditor' },
                _react2['default'].createElement('input', { type: 'checkbox', checked: this.state.checked, onChange: this.checkedChanged.bind(this), style: { display: 'inline' } }),
                _react2['default'].createElement(_reactJsonFork2['default'], { value: value, settings: settings, onChange: this.valueChanged.bind(this) })
            );
        }
    }]);

    return BindingEditor;
})(_react2['default'].Component);

exports['default'] = BindingEditor;
module.exports = exports['default'];