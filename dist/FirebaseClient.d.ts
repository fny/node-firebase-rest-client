/// <reference path="../typings/index.d.ts" />
export default class FirebaseClient {
    firebaseUrl: string;
    defaultParams: Object;
    constructor(firebaseUrl: string, defaultParams?: Object);
    static setPromise(promiseClass: any): void;
    urlFor(path: string, params?: Object): string;
    get(path: string, params?: Object): Promise<Fetch.Response>;
    getJSON(path: string, params?: Object): Promise<JSON>;
    getText(path: string, params?: Object): Promise<any>;
    put(path: string, payload: JSON, params?: Object): Promise<Fetch.Response>;
    patch(path: string, payload: JSON, params?: Object): Promise<Fetch.Response>;
    post(path: string, payload: JSON, params?: Object): Promise<Fetch.Response>;
    delete(path: string, params?: Object): Promise<Fetch.Response>;
    push: Function;
    remove: Function;
    set: Function;
    update: Function;
    private request(method, path, params?, payload?);
}
