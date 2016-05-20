'use strict';

/* jshint ignore:start */
/* global jasmine, expect, describe, it, before, beforeEach, after, afterEach */
/* jshint ignore:end */

jasmine.getEnv().defaultTimeoutInterval = 10000;

var FirebaseClient = require('../dist/FirebaseClient.js').default;
const FIREBASE_URL = 'https://rest-client-test.firebaseio.com';
const FIREBASE_AUTH = 'yMC9OAJaVifpWkaULtb3tTtV71sDVh0aY9lkC9AG';
const LETTERS = {a: 1, b: 2, c: 3, d: 4, e: 5};


function resetFirebase(client) {
  return client.delete('/');
}

function loadLetters(client) {
  return client.put('/', null)
    .then(() => client.put('/letters', LETTERS))
    .then(() => client.getJSON('/letters'))
    .then(json => {
      expect(json).toEqual(LETTERS);
    });
}

describe('FirebaseClient', () => {
  var client = new FirebaseClient(FIREBASE_URL, { auth: FIREBASE_AUTH });

  describe('#get', () => {
    it('returns a Fetch.Reponse', (done) => {
      resetFirebase(client)
        .then(() => client.put('/hello', 'world'))
        .then(() => client.get('/hello'))
        .then(res => {
          expect(res.headers.get('content-type')).toEqual('application/json; charset=utf-8');
          expect(res.status).toEqual(200);
          return res.json();
        })
        .then(json => {
          expect(json).toEqual('world');
          done();
        });
    });

    it('works with additional query paramters', (done) => {
      loadLetters(client)
        .then(() => client.get('/letters', { orderBy: '$value', limitToFirst: 2 }))
        .then((res) => res.json())
        .then((json) => {
          expect(json).toEqual({a: 1, b: 2 });
          done();
        });
    });
  });

  describe('#getJSON', () => {
    it('returns the json response', (done) => {
      resetFirebase(client)
        .then(() => client.put('/hello', 2))
        .then(() => client.getJSON('/hello'))
        .then(json => {
          expect(json).toEqual(2);
          done();
        });
    });
  });

  describe('#getText', () => {
    it('returns a text response', (done) => {
      resetFirebase(client)
        .then(() => client.put('/hello', 2))
        .then(() => client.getText('/hello'))
        .then(text => {
          expect(text).toEqual('2');
          done();
        });
    });
  });

  describe('#put', () => {
    it('writes over any existing data', (done) => {
        loadLetters(client)
          .then(() => client.put('/letters', {f: 6}))
          .then(() => client.getJSON('/letters'))
          .then(json => {
            expect(json).toEqual({f: 6});
            done();
          });
    });
  });

  describe('#patch', () => {
    it('updates any existing data', (done) => {
        loadLetters(client)
          .then(() => client.patch('/letters', {f: 6}))
          .then(() => client.getJSON('/letters'))
          .then(json => {
            expect(json).toEqual({a: 1, b: 2, c: 3, d: 4, e: 5, f: 6});
            done();
          });
    });
  });

  describe('#post', () => {
    it('works', (done) => {
      resetFirebase(client)
        .then(() => client.post('/posts', 1))
        .then(() => client.post('/posts', 2))
        .then(() => client.getJSON('/posts'))
        .then(json => {
          var keys = Object.keys(json);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            expect(json[key]).toEqual(i + 1);
            expect(key).toMatch(/^[a-zA-Z0-9_-]+$/);
          }
          done();
        });
    });
  });

  function describeAlias(alias, original) {
    describe(`#${alias}`, () => {
      it(`aliases #${original}`, () => {
        expect(client[alias]).toEqual(client[original]);
      });
    });
  }

  describeAlias('set', 'put');
  describeAlias('update', 'patch');
  describeAlias('push', 'post');
  describeAlias('remove', 'delete');

  describe('#urlFor', () => {
    it('joins paths to the base URL with only one /', () => {

      var client = new FirebaseClient('https://app.firebaseio.com');

      expect(client.urlFor('path')).toEqual('https://app.firebaseio.com/path.json');
      expect(client.urlFor('/path')).toEqual('https://app.firebaseio.com/path.json');

      var clientSlashed = new FirebaseClient('https://app.firebaseio.com/');
      expect(clientSlashed.urlFor('path')).toEqual('https://app.firebaseio.com/path.json');
      expect(clientSlashed.urlFor('/path')).toEqual('https://app.firebaseio.com/path.json');
    });

    it('merges default params', () => {
      var client = new FirebaseClient('https://app.firebaseio.com', { auth: 'secret' });
      expect(client.urlFor('path')).toEqual('https://app.firebaseio.com/path.json?auth=secret');
    });

    it('merges default params with added params', () => {
      var client = new FirebaseClient('https://app.firebaseio.com', { auth: 'secret' });
      expect(client.urlFor('path', { another: 'one' }))
        .toEqual('https://app.firebaseio.com/path.json?auth=secret&another=one');
    });
  });
});
