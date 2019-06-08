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

var _reactGradientColorPicker = require('react-gradient-color-picker');

var _reactGradientColorPicker2 = _interopRequireDefault(_reactGradientColorPicker);

var _utilsSelectValue = require('../utils/SelectValue');

var _utilsSelectValue2 = _interopRequireDefault(_utilsSelectValue);

var options = [{ label: 'horizontal', value: 'top' }, { label: 'vertical', value: 'left' }, { label: 'diagonal 45%', value: '45deg' }, { label: 'diagonal -45%', value: '-45deg' }, { label: 'radial', value: 'center, ellipse cover' }];

var DEFAULT_STOPS = [{
	offset: 0,
	color: "#f7ff00",
	opacity: 1.0
}, {
	offset: 0.5,
	color: "#db36a4",
	opacity: 1.0
}, {
	offset: 1,
	color: "#f00",
	opacity: 1.0
}];

var GradientColorPickerEditor = (function (_React$Component) {
	_inherits(GradientColorPickerEditor, _React$Component);

	function GradientColorPickerEditor() {
		_classCallCheck(this, GradientColorPickerEditor);

		_get(Object.getPrototypeOf(GradientColorPickerEditor.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(GradientColorPickerEditor, [{
		key: 'unset',
		value: function unset() {
			this.props.onUpdated(undefined);
		}
	}, {
		key: 'handleChangeGrandient',
		value: function handleChangeGrandient(stops) {
			stops = _lodash2['default'].map(stops, function (stop) {
				return _lodash2['default'].omit(stop, ['idx', 'x']);
			});
			this.props.onUpdated(_lodash2['default'].extend(_lodash2['default'].clone(this.props.value) || {}, { stops: stops }));
		}
	}, {
		key: 'orientationChange',
		value: function orientationChange(selectedValue) {
			this.props.onUpdated(_lodash2['default'].extend(_lodash2['default'].clone(this.props.value) || {}, { orientation: selectedValue }));
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var noValueComp = _react2['default'].createElement(
				'a',
				{ onClick: function () {
						_this.props.onUpdated({ stops: DEFAULT_STOPS });
					}, className: 'jsonNovalue' },
				'No value'
			);
			if (this.props.value === undefined) return noValueComp;

			var value = this.props.value || {};
			var selectedValue = value.orientation;
			return _react2['default'].createElement(
				'div',
				null,
				_react2['default'].createElement(_utilsSelectValue2['default'], { options: options, value: selectedValue,
					onChange: this.orientationChange.bind(this) }),
				_react2['default'].createElement(_reactGradientColorPicker2['default'], { onChange: this.handleChangeGrandient.bind(this), stops: value.stops }),
				_react2['default'].createElement('div', { style: { margin: '20', textAlign: 'center' } })
			);
		}
	}]);

	return GradientColorPickerEditor;
})(_react2['default'].Component);

exports['default'] = GradientColorPickerEditor;
module.exports = exports['default'];