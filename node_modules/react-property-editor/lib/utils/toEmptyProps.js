"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var convertToEmptyProps = function convertToEmptyProps(children) {
	var result = _lodash2["default"].mapValues(children, function (n) {
		return undefined;
	});
	for (var key in children) {
		var fields = children[key]["fields"];
		if (fields === undefined) continue;
		result[key] = convertToEmptyProps(fields);
	}
	return result;
};

exports["default"] = function (metadataSettings) {
	return convertToEmptyProps(metadataSettings.fields);
};

module.exports = exports["default"];