# The Hash Map

A hash map is a collection of unordered *key-value* entries also known as *hash table*, but unlike arrays a hash map stores each entry *value* under the *hash* value of the given *key*. A *hash function* is a function that, given a key, will return an address (index) in the table where the value is. So each time we need to get a value from the hash map we actually know where this value is in the table, we don't need to iterate all the values until we find it.

## Implementation

The first thing to do is to prepare the code to protect the *internal state* of each has map instance, so it is not publicly exposed in other parts of the code. We are gonna use a *WeakMap* container to *cache* the internal state of each map using the instance reference itself as the key.

```javascript
const data = new WeakMap();
```

### The entry helper class

In order to implement a hash map we need a *helper* class known as *Entry* in order to keep track on the *key-value* pair for each element in the map.


```javascript
class Entry {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return `{${this.key}: ${this.value}}`;
  }
}
```

### The hash function

In hash maps the location in which an entry should be stored is actually the outcome of a *hash function* passing the key value of the entry. For each entry we expect to get a unique index from the hash function, that index will be the position of the entry into the container of the data structure.

```javascript
const hash = function hash(key) {
  let code = 5381;

  for (let i = 0; i < key.length; i++) {
    code = code * 33 + key.charCodeAt(i);
  }

  return code % 1013;
}
```

### The hash map class

We are gonna use a class in order to implement the hash map data structure and the first thing to do is to encapsulate the hash map's data within a *WeakMap* container using the map instance itself as the key. The data of each hash map instance is nothing more than a regular *Array* who's indexes will be used in order to hash entries into the map.

```javascript
class HashMap {
  constructor() {
    data.set(this, []);
  }
}
```

### The hash map operations

Now we have the class of a hash map we need to implement the basic operations, which should be the following ones,

* set an entry value under a given key
* get an entry value given the key
* delete an entry value given the key
* check if a given key exists in the map
* ask for the size of the map
* get the keys and values of the map
* clear the map of its entry values
* print the entries of the map

before we start implementing each operation, we shall make sure each entry takes its own unique index into the hash map's container. So we need to take care of a strong hash function to be used within the operations.

#### Set an entry value under a given key

Having a key we should pass it through the hash function in order to get the index into which the entry value will be stored into the hash map container. If a entry value found into the hash map we only need to update its value, otherwise we must create a new entry and save it under the given hash index.

```javascript
set(key, value) {
  let m = data.get(this);

  let hashCode = hash(key);
  let entry = m[hashCode];

  if (entry) {
    entry.value = value;
  } else {
    m[hashCode] = new Entry(key, value);
  }
}
```

#### Get an entry value given the key

Having a key we can ask to get the entry value from the hash map, if that entry exists we return its value, otherwise will return undefined.

```javascript
get(key) {
  let m = data.get(this);

  let hashCode = hash(key);
  let entry = m[hashCode];

  if (entry) {
    return entry.value;
  } else {
    return undefined;
  }
}
```

#### Delete an entry value given the key

Given a key we can check if an entry value exists in the map, in such a case the only thing to do is to assign the undefined value to the index that key value is hashing to.

```javascript
delete(key) {
  let m = data.get(this);

  let hashCode = hash(key);
  let entry = m[hashCode];

  if (entry) {
    m[hashCode] = undefined;
    return true;
  } else {
    return false;
  }
}
```

#### Check if a given key exists in the map

To check if an entry value exists in the hash map we only need to pass the given key through the hash function and check if the value into the corresponding position is not equal to undefined.

```javascript
has(key) {
  let m = data.get(this);
  let hashCode = hash(key);

  return m[hashCode] !== undefined;
}
```

#### Ask for the size of the map

To calculate the total number of entry values stored into the hash map we should filter out all the positions into the container being equal to undefined and count the total length on it.

```javascript
size() {
  let m = data.get(this);
  return m.filter(e => e !== undefined).length;
}

isEmpty() {
  return this.size() === 0;
}
```

#### Get the keys and values of the map

We known so far that filtering out all the positions within the hash map's container, that are equal to undefined, we can map the rest in order to collect the keys or the values of the hash map.

```javascript
keys() {
  let m = data.get(this);
  return m.filter(e => e !== undefined).map(e => e.key);
}

values() {
  let m = data.get(this);
  return m.filter(e => e !== undefined).map(e => e.value);
}
```

#### Clear the map of its entry values

To clear the hash map of its entries we only need to reset the container of the entries into a new empty array.

```javascript
clear() {
  data.set(this, []);
}
```

#### Print the entries of the map

In the same way just filter out the positions equal to undefined and join all the rest entries into a string, where each entry should be separated by a comma.

```javascript
toString() {
  let m = data.get(this);
  return `HashMap: [${m.filter(e => e !== undefined).join(', ')}]`;
}
```

We can now put all together and use the hash map into some real data.

```javascript
let hm = new HashMap();

hm.set('bob', 'bob@mail.com'); // [{bob: bob@mail.com}]
hm.set('alice', 'alice@mail.com'); // [{bob: bob@mail.com}, {alice: alice@mail.com}]

hm.keys(); // ['bob', 'alice']
hm.values(); // ['bob@mail.com', 'alice@mail.com']

hm.delete('bob'); // [{alice: alice@mail.com}]

hm.keys(); // ['alice']
hm.values(); // ['alice: alice@mail.com']

hm.has('bob'); // false
```

[Go to Source](index.js)

## Considerations

### Pros
* A hash map is a perfect choice if you need to create indexes of values.
* With hash maps you don't need to traverse all the values to get an entry.
* Hash maps are really fast data structures because of the hashing on the key.

### Cons
* Due to the use of hash functions, there will be a possibility of key collisions.
* You may use a universal hash function to avoid collisions.
* If you need to use objects as keys you should provide a hash value for each object.