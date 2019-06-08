'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TooltipStyle = {
    position: 'absolute',
    padding: '0 5px'
};

var TooltipInnerStyle = {
    padding: '3px 8px',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 3,
    backgroundColor: '#000',
    opacity: .75
};

var TooltipArrowStyle = {
    position: 'absolute',
    width: 0, height: 0,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderStyle: 'solid',
    opacity: .75
};

var PlacementStyles = {
    left: {
        tooltip: { marginLeft: -3, padding: '0 5px' },
        arrow: {
            right: 0, marginTop: -5, borderWidth: '5px 0 5px 5px', borderLeftColor: '#000'
        }
    },
    right: {
        tooltip: { marginRight: 3, padding: '0 5px' },
        arrow: { left: 0, marginTop: -5, borderWidth: '5px 5px 5px 0', borderRightColor: '#000' }
    },
    top: {
        tooltip: { marginTop: -3, padding: '5px 0' },
        arrow: { bottom: 0, marginLeft: -5, borderWidth: '5px 5px 0', borderTopColor: '#000' }
    },
    bottom: {
        tooltip: { marginBottom: 3, padding: '5px 0' },
        arrow: { top: 0, marginLeft: -5, borderWidth: '0 5px 5px', borderBottomColor: '#000' }
    }
};

var ToolTip = (function () {
    function ToolTip() {
        _classCallCheck(this, ToolTip);
    }

    _createClass(ToolTip, [{
        key: 'render',
        value: function render() {
            var placementStyle = PlacementStyles[this.props.placement];

            //let {
            //    style,
            //    arrowOffsetLeft: left = placementStyle.arrow.left,
            //    arrowOffsetTop: top = placementStyle.arrow.top,
            //    ...props } = this.props;
            var tt;

            return React.createElement(
                'div',
                { style: TooltipStyle },
                React.createElement('div', { style: TooltipArrowStyle }),
                React.createElement(
                    'div',
                    { style: TooltipInnerStyle },
                    props.children
                )
            );
        }
    }]);

    return ToolTip;
})();

exports.ToolTip = ToolTip;