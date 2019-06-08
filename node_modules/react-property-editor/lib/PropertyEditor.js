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

var _reactJsonFork = require('react-json-fork');

var _reactJsonFork2 = _interopRequireDefault(_reactJsonFork);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _editorsColorPickerEditorJs = require('./editors/ColorPickerEditor.js');

var _editorsColorPickerEditorJs2 = _interopRequireDefault(_editorsColorPickerEditorJs);

var _editorsHtmlEditorJs = require('./editors/HtmlEditor.js');

var _editorsHtmlEditorJs2 = _interopRequireDefault(_editorsHtmlEditorJs);

var _editorsCodeEditorJs = require('./editors/CodeEditor.js');

var _editorsCodeEditorJs2 = _interopRequireDefault(_editorsCodeEditorJs);

var _editorsPlainTextEditorJs = require('./editors/PlainTextEditor.js');

var _editorsPlainTextEditorJs2 = _interopRequireDefault(_editorsPlainTextEditorJs);

var _editorsPlainJsonEditorJs = require('./editors/PlainJsonEditor.js');

var _editorsPlainJsonEditorJs2 = _interopRequireDefault(_editorsPlainJsonEditorJs);

var _editorsJsonEditorJs = require('./editors/JsonEditor.js');

var _editorsJsonEditorJs2 = _interopRequireDefault(_editorsJsonEditorJs);

var _editorsFontEditorJs = require('./editors/FontEditor.js');

var _editorsFontEditorJs2 = _interopRequireDefault(_editorsFontEditorJs);

var _editorsBoxEditorJs = require('./editors/BoxEditor.js');

var _editorsBoxEditorJs2 = _interopRequireDefault(_editorsBoxEditorJs);

var _editorsBoxSizeEditorJs = require('./editors/BoxSizeEditor.js');

var _editorsBoxSizeEditorJs2 = _interopRequireDefault(_editorsBoxSizeEditorJs);

var _editorsBorderEditorJs = require('./editors/BorderEditor.js');

var _editorsBorderEditorJs2 = _interopRequireDefault(_editorsBorderEditorJs);

var _editorsPositionEditorJs = require('./editors/PositionEditor.js');

var _editorsPositionEditorJs2 = _interopRequireDefault(_editorsPositionEditorJs);

var _editorsBindingEditorJs = require('./editors/BindingEditor.js');

var _editorsBindingEditorJs2 = _interopRequireDefault(_editorsBindingEditorJs);

var _editorsBindingValueEditorJs = require('./editors/BindingValueEditor.js');

var _editorsBindingValueEditorJs2 = _interopRequireDefault(_editorsBindingValueEditorJs);

var _editorsBgEditor = require('./editors/BgEditor');

var _editorsBgEditor2 = _interopRequireDefault(_editorsBgEditor);

var _editorsGradientColorPickerEditor = require('./editors/GradientColorPickerEditor');

var _editorsGradientColorPickerEditor2 = _interopRequireDefault(_editorsGradientColorPickerEditor);

var _editorsWidgetStyleEditor = require('./editors/WidgetStyleEditor');

var _editorsWidgetStyleEditor2 = _interopRequireDefault(_editorsWidgetStyleEditor);

var _editorsPlainJsonEditor = require('./editors/PlainJsonEditor');

var _editorsPlainJsonEditor2 = _interopRequireDefault(_editorsPlainJsonEditor);

var _editorsPageOptionsEditor = require('./editors/PageOptionsEditor');

var _editorsPageOptionsEditor2 = _interopRequireDefault(_editorsPageOptionsEditor);

var _utilsModalStylesJs = require('./utils/ModalStyles.js');

var _utilsModalStylesJs2 = _interopRequireDefault(_utilsModalStylesJs);

// Register the type in react-json
_reactJsonFork2['default'].registerType('colorPicker', _editorsColorPickerEditorJs2['default']);
_reactJsonFork2['default'].registerType('gradientColorPicker', _editorsGradientColorPickerEditor2['default']);
_reactJsonFork2['default'].registerType('htmlEditor', _editorsHtmlEditorJs2['default']);
_reactJsonFork2['default'].registerType('codeEditor', _editorsCodeEditorJs2['default']);
_reactJsonFork2['default'].registerType('textEditor', _editorsPlainTextEditorJs2['default']);
_reactJsonFork2['default'].registerType('plainJsonEditor', _editorsPlainJsonEditorJs2['default']);
_reactJsonFork2['default'].registerType('jsonEditor', _editorsJsonEditorJs2['default']);
_reactJsonFork2['default'].registerType('fontEditor', _editorsFontEditorJs2['default']);
_reactJsonFork2['default'].registerType('boxEditor', _editorsBoxEditorJs2['default']);
_reactJsonFork2['default'].registerType('boxSizeEditor', _editorsBoxSizeEditorJs2['default']);
_reactJsonFork2['default'].registerType('positionEditor', _editorsPositionEditorJs2['default']);
_reactJsonFork2['default'].registerType('borderEditor', _editorsBorderEditorJs2['default']);
_reactJsonFork2['default'].registerType('bindingEditor', _editorsBindingEditorJs2['default']);
_reactJsonFork2['default'].registerType('bindingValueEditor', _editorsBindingValueEditorJs2['default']);
_reactJsonFork2['default'].registerType('dataEditor', _editorsJsonEditorJs2['default']);
_reactJsonFork2['default'].registerType('bgEditor', _editorsBgEditor2['default']);
_reactJsonFork2['default'].registerType('widgetStyleEditor', _editorsWidgetStyleEditor2['default']);
_reactJsonFork2['default'].registerType('gridEditor', _editorsPlainJsonEditor2['default']);
_reactJsonFork2['default'].registerType('pageOptionsEditor', _editorsPageOptionsEditor2['default']);

var defaultSettings = {
    form: true,
    fixedFields: true,
    adder: false,
    editing: true,
    fields: {
        color: { type: 'colorPicker' },
        gradient: { type: 'gradientColorPicker' },
        fill: { type: 'colorPicker' },
        stroke: { type: 'colorPicker' },
        strokeWidth: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' },
        html: { type: 'htmlEditor' },
        content: { type: 'htmlEditor' },
        data: { type: 'bindingEditor' },
        description: { type: 'textEditor' },
        font: { type: 'fontEditor' },
        border: { type: 'borderEditor' },
        style: { type: 'positionEditor' },
        margin: { type: 'boxSizeEditor' },
        padding: { type: 'boxSizeEditor' },
        box: { type: 'boxEditor' },
        binding: { type: 'bindingEditor' },
        value: { type: 'bindingEditor' },
        background: { type: 'bgEditor' }
    }
};

var PropertyEditor = (function (_React$Component) {
    _inherits(PropertyEditor, _React$Component);

    function PropertyEditor() {
        _classCallCheck(this, PropertyEditor);

        _get(Object.getPrototypeOf(PropertyEditor.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(PropertyEditor, [{
        key: 'propsChange',
        value: function propsChange(value) {
            this.props.onChange({ props: value, binding: this.props.value.binding });
        }
    }, {
        key: 'bindingChange',
        value: function bindingChange(value) {
            this.props.onChange({ props: this.props.value.props, binding: value });
        }
    }, {
        key: 'render',
        value: function render() {
            var value = this.props.value;
            var props = value.props;
            var binding = value.binding;

            var settings = _lodash2['default'].merge(_lodash2['default'].cloneDeep(defaultSettings), this.props.settings);
            return _react2['default'].createElement(_reactJsonFork2['default'], { value: props, binding: binding, settings: settings, onChange: this.propsChange.bind(this), onBindingChange: this.bindingChange.bind(this) });
        }
    }]);

    return PropertyEditor;
})(_react2['default'].Component);

exports['default'] = PropertyEditor;

PropertyEditor.registerType = function (type, editor) {
    _reactJsonFork2['default'].registerType(type, editor);
};
PropertyEditor.ModalStyles = function () {
    return _utilsModalStylesJs2['default'];
};
module.exports = exports['default'];