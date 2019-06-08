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

var _utilsSelectValue = require('../utils/SelectValue');

var _utilsSelectValue2 = _interopRequireDefault(_utilsSelectValue);

var settings = { form: false,
	fixedFields: false,
	adder: false,
	editing: true
};

var WidgetStyleEditor = (function (_React$Component) {
	_inherits(WidgetStyleEditor, _React$Component);

	function WidgetStyleEditor(props) {
		_classCallCheck(this, WidgetStyleEditor);

		_get(Object.getPrototypeOf(WidgetStyleEditor.prototype), 'constructor', this).call(this, props);
		this.state = {};
	}

	_createClass(WidgetStyleEditor, [{
		key: 'selectChange',
		value: function selectChange(selectedValue) {
			this.setState({ selectedKey: selectedValue });
		}
	}, {
		key: 'exist',
		value: function exist() {
			var value = this.props.value || {};
			return value[this.state.selectedKey] !== undefined;
		}
	}, {
		key: 'add',
		value: function add() {

			if (this.exist()) return;

			//update value
			var key = this.state.selectedKey;
			if (key === undefined) return;

			var newValue = _lodash2['default'].cloneDeep(this.props.value) || {};
			newValue[key] = (0, _utilsToEmptyProps2['default'])(this.props.settings.widgets[key].metaData.settings);
			this.props.onUpdated(newValue);
		}
	}, {
		key: 'render',
		value: function render() {

			var widgets = this.props.settings.widgets || {};

			var options = _lodash2['default'].map(widgets, function (value, key, object) {
				var widget = object[key];
				return { label: key, value: key };
			});
			options.unshift({ label: 'none', value: '' });

			var customFields = _lodash2['default'].reduce(this.props.value, function (memo, value, key) {
				memo[key] = { fields: widgets[key].metaData.settings && widgets[key].metaData.settings.fields };
				return memo;
			}, {});
			settings.fields = customFields;

			var notExist = !!this.state.selectedKey && !this.exist();
			var value = _lodash2['default'].reduce(this.props.value, function (memo, value, key) {
				memo[key] = _lodash2['default'].merge((0, _utilsToEmptyProps2['default'])(widgets[key].metaData.settings), value);
				return memo;
			}, {});

			return _react2['default'].createElement(
				'div',
				null,
				_react2['default'].createElement(_reactJsonFork2['default'], { value: value, onChange: this.props.onUpdated, settings: settings }),
				_react2['default'].createElement(_utilsSelectValue2['default'], { options: options, value: this.state.selectedKey,
					onChange: this.selectChange.bind(this) }),
				notExist ? _react2['default'].createElement(
					'a',
					{ onClick: this.add.bind(this) },
					'add'
				) : null
			);
		}
	}]);

	return WidgetStyleEditor;
})(_react2['default'].Component);

exports['default'] = WidgetStyleEditor;
;
module.exports = exports['default'];