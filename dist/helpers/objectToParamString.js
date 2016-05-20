"use strict";
function objectToParamString(object) {
    var joinedParams = Object.keys(object).map(function (key) {
        if (key == 'orderBy') {
            return key + "=\"" + object[key] + "\"";
        }
        else {
            return key + "=" + object[key];
        }
    }).join('&');
    return joinedParams === '' ? '' : "?" + joinedParams;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = objectToParamString;
