var exports = require('./dist/FirebaseClient.js');
var FirebaseClient =  exports.default;
var nock = require('nock')
var client = new FirebaseClient('https://rest-client-test.firebaseio.com/', { auth: 'yMC9OAJaVifpWkaULtb3tTtV71sDVh0aY9lkC9AG' });

// nock.recorder.rec();

// client.put('/asdf/fff', 'aaaassdffff');
client.read('/').then(res => res.json()).then(json => console.log(json));

console.log(client.post === client.push)

// set
// remove
// update
