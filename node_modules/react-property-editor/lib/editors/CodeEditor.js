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

var _reactOverlays = require('react-overlays');

var _utilsModalStylesJs = require('../utils/ModalStyles.js');

var _utilsModalStylesJs2 = _interopRequireDefault(_utilsModalStylesJs);

var _utilsEmptyValueJs = require('../utils/EmptyValue.js');

var _utilsEmptyValueJs2 = _interopRequireDefault(_utilsEmptyValueJs);

var _ = require('lodash');
var babel = require('babel-core');
var CodeMirror = require('react-codemirror');
var SyntaxHighLight = require('codemirror/mode/javascript/javascript');

var CodeEditor = (function (_React$Component) {
    _inherits(CodeEditor, _React$Component);

    //static propTypes = {onClose: PropTypes.func}

    function CodeEditor(props) {
        _classCallCheck(this, CodeEditor);

        _get(Object.getPrototypeOf(CodeEditor.prototype), 'constructor', this).call(this, props);
        var code = this.props.value && this.props.value.code || '';
        this.state = { show: false, value: code };
    }

    _createClass(CodeEditor, [{
        key: 'close',
        value: function close() {
            //var editor = React.findDOMNode(this.refs.editor);
            var codeToCompile = '(function() {' + this.state.value + '})();';
            //var code = ReactTools.transform(codeToCompile,{harmony: true});
            //var code = JSXTransformer.transform(codeToCompile,{harmony: true}).code;

            var result = babel.transform(codeToCompile, {});
            var newValue = { code: this.state.value, compiled: result.code };
            this.props.onUpdated(newValue);
            this.setState({ showModal: false });
        }
    }, {
        key: 'open',
        value: function open() {
            this.setState({ showModal: true });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(newCode) {
            this.setState({ value: newCode });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ value: nextProps.value && nextProps.value.code || '' });
        }
    }, {
        key: 'render',
        value: function render() {
            var codeEditor = _react2['default'].createElement(CodeMirror, {
                value: this.state.value,
                onChange: this.handleChange.bind(this),
                options: {
                    // style: {border: '1px solid black'},
                    // textAreaClassName: ['form-control'],
                    // textAreaStyle: {minHeight: '10em'},
                    mode: 'javascript',
                    theme: 'solarized',
                    lineNumbers: true
                }
            });

            //var codeEditor = <textarea rows="10" cols="70" value={this.state.value} onChange={this.handleChange.bind(this)}/>;
            var dialogStyle = _.extend(_utilsModalStylesJs2['default'].dialogStyle, { minWidth: 800 });
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    _utilsEmptyValueJs2['default'],
                    { value: this.props.value, open: this.open.bind(this) },
                    'Show code'
                ),
                _react2['default'].createElement(
                    _reactOverlays.Modal,
                    { show: this.state.showModal, onHide: this.close.bind(this), style: _utilsModalStylesJs2['default'].modalStyle,
                        backdropStyle: _utilsModalStylesJs2['default'].backdropStyle },
                    _react2['default'].createElement(
                        'div',
                        { style: dialogStyle },
                        codeEditor
                    )
                )
            );
        }
    }]);

    return CodeEditor;
})(_react2['default'].Component);

exports['default'] = CodeEditor;
module.exports = exports['default'];