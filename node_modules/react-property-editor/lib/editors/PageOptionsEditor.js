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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsEmptyValueJs = require('../utils/EmptyValue.js');

var _utilsEmptyValueJs2 = _interopRequireDefault(_utilsEmptyValueJs);

var _utilsModalStylesJs = require('../utils/ModalStyles.js');

var _utilsModalStylesJs2 = _interopRequireDefault(_utilsModalStylesJs);

var _utilsStandardPageSizes = require('../utils/standardPageSizes');

var _utilsStandardPageSizes2 = _interopRequireDefault(_utilsStandardPageSizes);

var IMAGE_FACTOR = 10;
var PgeSizesList = _lodash2['default'].map(_utilsStandardPageSizes2['default'], function (value, key, index) {
	return {
		key: key,
		width: Math.round(value[0] / 72 * 96, 0),
		height: Math.round(value[1] / 72 * 96, 0),
		value: value
	};
});

var PageSizeOptions = (function (_React$Component) {
	_inherits(PageSizeOptions, _React$Component);

	function PageSizeOptions(props) {
		_classCallCheck(this, PageSizeOptions);

		_get(Object.getPrototypeOf(PageSizeOptions.prototype), 'constructor', this).call(this, props);
		this.state = {};
	}

	_createClass(PageSizeOptions, [{
		key: 'pageSizeSelect',
		value: function pageSizeSelect(width, height) {
			var value = _lodash2['default'].clone(this.props.value);
			if (this.props.onChange !== undefined) this.props.onChange(_lodash2['default'].extend(value || {}, {
				width: width,
				height: height
			}));
		}
	}, {
		key: 'onChecked',
		value: function onChecked(e, name) {
			var value = _lodash2['default'].clone(this.props.value);
			var newValue = {};
			newValue[name] = e.target.checked;
			if (this.props.onChange !== undefined) this.props.onChange(_lodash2['default'].extend(value || {}, newValue));
		}
	}, {
		key: 'onValueChange',
		value: function onValueChange(e, name) {
			var value = _lodash2['default'].clone(this.props.value);
			var newValue = {};
			newValue[name] = parseInt(e.target.value, 10);
			if (this.props.onChange !== undefined) this.props.onChange(_lodash2['default'].extend(value || {}, newValue));
		}
	}, {
		key: 'onMarginChange',
		value: function onMarginChange(e, name) {
			var value = _lodash2['default'].clone(this.props.value);
			var newValue = {};
			newValue[name] = parseInt(e.target.value, 10);
			if (this.props.onChange !== undefined) this.props.onChange(_lodash2['default'].extend(value || {}, { margin: _lodash2['default'].extend(value && value.margin || {}, newValue) }));
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var currentValue = this.props.value || {};
			var margin = currentValue.margin || {};
			return _react2['default'].createElement(
				'div',
				null,
				_react2['default'].createElement(
					'div',
					{ className: 'form-horizontal' },
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'label',
							{ className: 'col-sm-2 control-label' },
							'Width'
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Width', value: currentValue.width,
								onChange: function (e) {
									return _this.onValueChange(e, 'width');
								} })
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'label',
							{ className: 'col-sm-2 control-label' },
							'Height'
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Height',
								value: currentValue.height, onChange: function (e) {
									return _this.onValueChange(e, 'height');
								} })
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-8' },
							_react2['default'].createElement(
								'a',
								{ onClick: function () {
										_this.pageSizeSelect(currentValue.height, currentValue.width);
									} },
								'switch width x height'
							)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-offset-2 col-sm-10' },
							_react2['default'].createElement(
								'div',
								{ className: 'checkbox' },
								_react2['default'].createElement(
									'label',
									null,
									_react2['default'].createElement('input', { type: 'checkbox', checked: currentValue.landscape,
										onClick: function (e) {
											return _this.onChecked(e, 'landscape');
										} }),
									' Landscape'
								)
							)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'label',
							{ className: 'col-sm-2 control-label' },
							'Margin'
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Top', value: margin.top,
								onChange: function (e) {
									return _this.onMarginChange(e, 'top');
								} })
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Right', value: margin.right,
								onChange: function (e) {
									return _this.onMarginChange(e, 'right');
								} })
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Bottom', value: margin.bottom,
								onChange: function (e) {
									return _this.onMarginChange(e, 'bottom');
								} })
						),
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-2' },
							_react2['default'].createElement('input', { type: 'number', className: 'form-control', placeholder: 'Left', value: margin.left,
								onChange: function (e) {
									return _this.onMarginChange(e, 'left');
								} })
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-offset-2 col-sm-10' },
							_react2['default'].createElement(
								'div',
								{ className: 'checkbox' },
								_react2['default'].createElement(
									'label',
									null,
									_react2['default'].createElement('input', { type: 'checkbox', checked: currentValue.coverPage,
										onClick: function (e) {
											return _this.onChecked(e, 'coverPage');
										} }),
									' Cover page'
								)
							)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-offset-2 col-sm-10' },
							_react2['default'].createElement(
								'div',
								{ className: 'checkbox' },
								_react2['default'].createElement(
									'label',
									null,
									_react2['default'].createElement('input', { type: 'checkbox', checked: currentValue.doublePage,
										onClick: function (e) {
											return _this.onChecked(e, 'doublePage');
										} }),
									' Double page'
								)
							)
						)
					),
					_react2['default'].createElement(
						'div',
						{ className: 'form-group' },
						_react2['default'].createElement(
							'div',
							{ className: 'col-sm-offset-2 col-sm-10' },
							_react2['default'].createElement(
								'button',
								{ onClick: function () {
										_this.setState({ showPages: !_this.state.showPages });
									},
									className: 'btn btn-default' },
								'Show formats'
							)
						)
					)
				),
				this.state.showPages ? _react2['default'].createElement(
					'div',
					{ className: 'flex-container' },
					PgeSizesList.map(function (item, index) {

						var flexItemStyle = {};

						var selected = currentValue !== undefined && currentValue.width === item.width && currentValue.height === item.height;
						var width = Math.round(item.value[0] / IMAGE_FACTOR);
						var height = Math.round(item.value[1] / IMAGE_FACTOR);

						if (selected) flexItemStyle.backgroundColor = '#48D1CC';

						return _react2['default'].createElement(
							'div',
							{ style: flexItemStyle, key: 'format' + index, className: 'flex-item',
								onClick: this.pageSizeSelect.bind(this, item.width, item.height) },
							_react2['default'].createElement(
								'div',
								{
									style: { width: width, height: height, lineHeight: height + 'px' },
									className: 'thumb' },
								_react2['default'].createElement(
									'span',
									null,
									item.key
								)
							),
							_react2['default'].createElement(
								'div',
								{ className: 'footer' },
								item.width,
								' x ',
								item.height
							)
						);
					}, this)
				) : null
			);
		}
	}]);

	return PageSizeOptions;
})(_react2['default'].Component);

var PageOptionsEditor = (function (_React$Component2) {
	_inherits(PageOptionsEditor, _React$Component2);

	//static propTypes = {onClose: PropTypes.func}

	function PageOptionsEditor(props) {
		_classCallCheck(this, PageOptionsEditor);

		_get(Object.getPrototypeOf(PageOptionsEditor.prototype), 'constructor', this).call(this, props);
		this.state = { show: false };
	}

	_createClass(PageOptionsEditor, [{
		key: 'close',
		value: function close() {
			var parse = this.props.settings && this.props.settings.converter && this.props.settings.converter.parse;
			if (this.state.value !== undefined) this.props.onUpdated(parse !== undefined ? parse(this.state.value) : this.state.value);
			this.setState({ showModal: false });
		}
	}, {
		key: 'open',
		value: function open() {
			var format = this.props.settings && this.props.settings.converter && this.props.settings.converter.format;
			var parse = this.props.settings && this.props.settings.converter && this.props.settings.converter.parse;
			var initialData = this.props.settings && this.props.settings.initialData;

			if (parse !== undefined) initialData = parse(initialData);

			var data = this.props.value === undefined ? initialData : this.props.value;
			this.setState({ showModal: true, value: format !== undefined ? format(data) : _lodash2['default'].cloneDeep(data) });
		}
	}, {
		key: 'handleChange',
		value: function handleChange(e) {
			this.setState({ value: e.target.value });
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2['default'].createElement(
				'div',
				null,
				_react2['default'].createElement(
					_utilsEmptyValueJs2['default'],
					{ value: this.props.value, open: this.open.bind(this) },
					_react2['default'].createElement(_utilsTruncateStringJs2['default'], {
						value: this.props.value })
				),
				_react2['default'].createElement(
					_reactOverlays.Modal,
					{ show: this.state.showModal, onHide: this.close.bind(this), style: _utilsModalStylesJs2['default'].modalStyle,
						backdropStyle: _utilsModalStylesJs2['default'].backdropStyle },
					_react2['default'].createElement(
						'div',
						{ style: _utilsModalStylesJs2['default'].dialogStyle },
						_react2['default'].createElement(PageSizeOptions, { value: this.state.value, onChange: function (data) {
								_this2.setState({ value: data });
							} })
					)
				)
			);
		}
	}]);

	return PageOptionsEditor;
})(_react2['default'].Component);

exports['default'] = PageOptionsEditor;
;
module.exports = exports['default'];