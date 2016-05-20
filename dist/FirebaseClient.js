"use strict";
var objectToParamString_1 = require('./helpers/objectToParamString');
var fetch = require('node-fetch');
var FirebaseClient = (function () {
    function FirebaseClient(firebaseUrl, defaultParams) {
        this.firebaseUrl = firebaseUrl;
        this.defaultParams = defaultParams;
        this.push = this.post;
        this.remove = this.delete;
        this.set = this.put;
        this.update = this.patch;
    }
    FirebaseClient.setPromise = function (promiseClass) {
        fetch.Promise = promiseClass;
    };
    FirebaseClient.prototype.urlFor = function (path, params) {
        if (params === void 0) { params = {}; }
        var url = '';
        url += this.firebaseUrl.replace(/\/$/, '');
        url += '/';
        url += path.replace(/^\//, '');
        var mergedParams = Object.assign({}, this.defaultParams);
        Object.assign(mergedParams, params);
        url += '.json';
        url += objectToParamString_1.default(mergedParams);
        return url;
    };
    FirebaseClient.prototype.get = function (path, params) {
        return this.request('GET', path, params);
    };
    FirebaseClient.prototype.getJSON = function (path, params) {
        return this.get(path, params).then(function (res) { return res.json(); });
    };
    FirebaseClient.prototype.getText = function (path, params) {
        return this.get(path, params).then(function (res) { return res.text(); });
    };
    FirebaseClient.prototype.put = function (path, payload, params) {
        return this.request('PUT', path, params, payload);
    };
    FirebaseClient.prototype.patch = function (path, payload, params) {
        return this.request('PATCH', path, params, payload);
    };
    FirebaseClient.prototype.post = function (path, payload, params) {
        return this.request('POST', path, params, payload);
    };
    FirebaseClient.prototype.delete = function (path, params) {
        return this.request('DELETE', path, params);
    };
    FirebaseClient.prototype.request = function (method, path, params, payload) {
        if (params === void 0) { params = {}; }
        var options = { method: method };
        if (payload !== null) {
            options.body = JSON.stringify(payload);
        }
        return fetch(this.urlFor(path, params), options);
    };
    return FirebaseClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FirebaseClient;
