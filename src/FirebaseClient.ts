/// <reference path="../typings/index.d.ts"/>

import objectToParamString from './helpers/objectToParamString';
const fetch = require('node-fetch');

export default class FirebaseClient {
  /**
   * Create a new Firebase Client instance.
   *
   * @param  {string} firebaseUrl   URL to the Firebase instance
   * @param  {Object} defaultParams default url params to pass
   */
  constructor(public firebaseUrl: string, public defaultParams?: Object) {}

  static setPromise(promiseClass) {
    fetch.Promise = promiseClass;
  }

  /**
   * Returns the full URL for the given string and params merged with any
   * supplied default params.
   *
   * @param  {string} path      Firebase path
   * @param  {Object} params    additional query params (optional)
   * @return {string}           URL to make the request from
   */
  urlFor(path: string, params: Object = {}): string {
    // Strips out multiple `/` as a convenience
    var url = '';
    url += this.firebaseUrl.replace(/\/$/, '')
    url += '/'
    url += path.replace(/^\//, '')

    var mergedParams: Object = Object.assign({}, this.defaultParams);

    Object.assign(mergedParams, params);
    url += '.json'
    url += objectToParamString(mergedParams)
    return url;
  }

  /**
   * Read data from Firebase as an HTTP Response by issuing a GET request.
   *
   * A successful request will be indicated by a 200 OK HTTP status code.
   * The response body will contain the data being retrieved.
   *
   * @param  {string}                  path   Firebase path
   * @param  {Object}                  params additional query params (optional)
   * @return {Promise<Fetch.Response>}        Promise with the HTTP response
   */
  get(path: string, params?: Object): Promise<Fetch.Response> {
    return this.request('GET', path, params);
  }


  /**
   * Convenience method to read data from Firebase directly as JSON.
   *
   * A successful request will be indicated by a 200 OK HTTP status code.
   * The result will contain the JSON being retrieved.
   *
   * @param  {string}                  path   Firebase path
   * @param  {Object}                  params additional query params (optional)
   * @return {Promise<Fetch.Response>}        Promise with the JSON response
   */
  getJSON(path: string, params?: Object): Promise<JSON> {
    return this.get(path, params).then((res) => res.json());
  }

  /**
   * Convenience method to read data from Firebase directly as text.
   *
   * A successful request will be indicated by a 200 OK HTTP status code.
   * The result will contain the text being retrieved.
   *
   * @param  {string}                  path   Firebase path
   * @param  {Object}                  params additional query params (optional)
   * @return {Promise<Fetch.Response>}        Promise with the text response
   */
  getText(path: string, params?: Object): Promise<any> {
    return this.get(path, params).then((res) => res.text());
  }

  /**
   * Write data to Firebase. Note this will overrwite everything at the supplied
   * path.
   *
   * A successful request will be indicated by a 200 OK HTTP status code. The
   * response will contain the data written.
   *
   * @param  {string}                  path    Firebase path
   * @param  {JSON}                    payload Data to write
   * @param  {Object}                  params  additional query params (optional)
   * @return {Promise<Fetch.Response>}         Promise with the HTTP response
   */
  put(path: string, payload: JSON, params?: Object): Promise<Fetch.Response> {
    return this.request('PUT', path, params, payload);
  }

  /**
   * Update data in Firebase. We can update specific children at a location
   * without overwriting existing data using a PATCH request. Named children in
   * the data being written with PATCH will be overwritten, but omitted children
   * will not be deleted. This is equivalent to the JavaScript `update()``
   * function.
   *
   * A successful request will be indicated by a 200 OK HTTP status code. The
   * response will contain the data written.
   *
   * @param  {string}                  path    Firebase path
   * @param  {JSON}                    payload Data to write
   * @param  {Object}                  params  additional query params (optional)
   * @return {Promise<Fetch.Response>}         Promise with the HTTP response
   */
  patch(path: string, payload: JSON, params?: Object): Promise<Fetch.Response> {
    return this.request('PATCH', path, params, payload);
  }

  /**
   * Push data to Firebase. This accomplishes the equivalent of the JavaScript
   * `push()` method wich adds to a list of data. Every time you call `push()``,
   * Firebase generates a unique ID.
   *
   * A successful request will be indicated by a 200 OK HTTP status code. The
   * response will contain the child name of the new data that was added.
   *
   * @param  {string}                  path    Firebase path
   * @param  {JSON}                    payload Data to write
   * @param  {Object}                  params  additional query params (optional)
   * @return {Promise<Fetch.Response>}         Promise with the HTTP response
   */
  post(path: string, payload: JSON, params?: Object): Promise<Fetch.Response> {
    return this.request('POST', path, params, payload);
  }

  /**
   * Delete data from Firebase at the supplied path. A successful DELETE request
   * will be indicated by a 200 OK HTTP status code with a response containing
   * JSON null.
   * @param  {string}                  path    Firebase path
   * @param  {Object}                  params  additional query params (optional)
   * @return {Promise<Fetch.Response>}         Promise with the HTTP response
   */
  delete(path: string, params?: Object): Promise<Fetch.Response> {
    return this.request('DELETE', path, params);
  }

  /**
   * Alias for `#post`.
   * @type {Function}
   */
  public push: Function = this.post;
  
  /**
   * Alias for `#delete`.
   * @type {Function}
   */
  public remove: Function = this.delete;

  /**
   * Alias for `#put`.
   * @type {Function}
   */
  public set: Function = this.put;

  /**
   * Alias for `#patch`.
   * @type {Function}
   */
  public update: Function = this.patch;

  private request(method: string, path: string, params = {}, payload?: JSON): Promise<any> {
    var options: any = { method: method };
    if (payload !== null) {
      options.body = JSON.stringify(payload);
    }
    return fetch(this.urlFor(path, params), options);
  }
}
