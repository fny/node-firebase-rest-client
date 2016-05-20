# Firebase REST Client for Node

Lightweight Node REST Client for Firebase

Requests are made using the [HTTP Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) via [node-fetch](https://www.npmjs.com/package/node-fetch), so expect to receive a compatible Promise for any request

Note you can bring your own Promise library by calling `FirebaseClient.setPromise(Promise)`;

## Usage

### Instantiate a Client

```javascript
var client =
  new FirebaseClient('https://app.firebaseio.com', { auth: 'BLORGBLORGBLORG' });
```

### Reading Data (GET)

```javascript
// Read from Firebase
client.get('path/to/data').
  then(res => res.json()).
  then(json => console.log(json));

// Shorthand for the above
client.getJSON('path/to/data').
  then(json => console.log(json));

// Get unparsed text instead
client.getText('path/to/data').
  then(text => console.log(text));

// You can pass query parameters as the second argument too!
client.getJSON('path/to/data', { orderBy: '$value', limitToFirst: 2 }).
  then(json => console.log(json));
```

### Writing Data (PUT)

```javascript
client.post('path/to/data', { a: 1 }).then(/* ... */);

// You can use the `#set` alias instead for parity with the Firebase Node library.
client.set('path/to/data', { a: 1 }).then(/* ... */);
```

### Deleting Data (DELETE)

```javascript
client.delete('path/to/data').then(/* ... */);

// You can use the `#remove` alias instead for parity with the Firebase Node library.
client.remove('path/to/data').then(/* ... */);
```

### Updating Data (PATCH)

```javascript
client.patch('path/to/data', { a: 1 }).then(/* ... */);

// You can use the `#update` alias instead for parity with the Firebase Node library.
client.update('path/to/data', { a: 1 }).then(/* ... */);
```

### Pushing Data (POST)

```javascript
client.post('path/to/posts', 1).then(/* ... */);

// You can use the `#push` alias instead for parity with the Firebase Node library.
client.push('path/to/posts', 1).then(/* ... */);
```

### More Documentation and Examples

See the source and the specs. There be hidden treasure.

## Install

    npm install node-fetch --save
