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

var _reactSpreadsheetComponent = require('react-spreadsheet-component');

var _reactSpreadsheetComponent2 = _interopRequireDefault(_reactSpreadsheetComponent);

var _utilsEmptyValueJs = require('../utils/EmptyValue.js');

var _utilsEmptyValueJs2 = _interopRequireDefault(_utilsEmptyValueJs);

var _utilsModalStylesJs = require('../utils/ModalStyles.js');

var _utilsModalStylesJs2 = _interopRequireDefault(_utilsModalStylesJs);

//var Dispatcher = require('react-spreadsheet-component/lib/Dispatcher');

var DefaultGridConfig = {
				// Initial number of row
				rows: 5,
				// Initial number of columns
				columns: 8,
				// True if the first column in each row is a header (th)
				hasHeadColumn: true,
				// True if the data for the first column is just a string.
				// Set to false if you want to pass custom DOM elements.
				isHeadColumnString: true,
				// True if the first row is a header (th)
				hasHeadRow: true,
				// True if the data for the cells in the first row contains strings.
				// Set to false if you want to pass custom DOM elements.
				isHeadRowString: true,
				// True if the user can add rows (by navigating down from the last row)
				canAddRow: true,
				// True if the user can add columns (by navigating right from the last column)
				canAddColumn: true,
				// Override the display value for an empty cell
				emptyValueSymbol: '-',
				// Fills the first column with index numbers (1...n) and the first row with index letters (A...ZZZ)
				hasLetterNumberHeads: true
};

var SpreadSheet = (function (_React$Component) {
				_inherits(SpreadSheet, _React$Component);

				function SpreadSheet() {
								_classCallCheck(this, SpreadSheet);

								_get(Object.getPrototypeOf(SpreadSheet.prototype), 'constructor', this).apply(this, arguments);
				}

				_createClass(SpreadSheet, [{
								key: 'componentDidMount',
								value: function componentDidMount() {
												var self = this;
												_reactSpreadsheetComponent2['default'].Dispatcher.subscribe('dataChanged', function (data) {
																if (self.props.onChange !== undefined) self.props.onChange(data);
												}, "spreadsheet-1");
								}
				}, {
								key: 'render',
								value: function render() {
												var gridConfig = _lodash2['default'].extend(_lodash2['default'].clone(DefaultGridConfig), this.props.settings && this.props.settings.config);
												return _react2['default'].createElement(_reactSpreadsheetComponent2['default'], { initialData: this.props.value, config: gridConfig, spreadsheetId: 'spreadsheet-1' });
								}
				}]);

				return SpreadSheet;
})(_react2['default'].Component);

var GridEditor = (function (_React$Component2) {
				_inherits(GridEditor, _React$Component2);

				//static propTypes = {onClose: PropTypes.func}

				function GridEditor(props) {
								_classCallCheck(this, GridEditor);

								_get(Object.getPrototypeOf(GridEditor.prototype), 'constructor', this).call(this, props);
								this.state = { show: false };
				}

				_createClass(GridEditor, [{
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
												var _this = this;

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
																								{ style: _utilsModalStylesJs2['default'].dialogStyle },
																								_react2['default'].createElement(
																												'div',
																												{ className: 'excel' },
																												_react2['default'].createElement(SpreadSheet, { value: this.state.value, settings: this.props.settings, onChange: function (data) {
																																				_this.setState({ value: data });
																																} })
																								)
																				)
																)
												);
								}
				}]);

				return GridEditor;
})(_react2['default'].Component);

exports['default'] = GridEditor;
;
module.exports = exports['default'];