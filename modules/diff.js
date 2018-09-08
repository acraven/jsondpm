const clone = require('clone');

function diffProperties(source, target, location, propertyName) {
  // TODO: source/target can be null, undefined, value types. Test source and target vs null and undefined

  if (source instanceof Array && target instanceof Array) {
    return diffArrays(source, target, location.concat(propertyName));
  }

  if (typeof(source) === 'object' && typeof(target) === 'object') {
    return diffObjects(source, target, location.concat(propertyName));
  }

  if (typeof source === 'string' && typeof target === 'string' && target !== source) {
    const affectedLocation = location.concat(propertyName);
    return [
      { op: 'delete-text', location: affectedLocation, index: 0, value: source },
      { op: 'insert-text', location: affectedLocation, index: 0, value: target }
    ];
  }

  // TODO: Missing some test cases here
  // TODO: String diff test cases

  if (typeof source !== typeof target || target !== source) {
    return [
      { op: 'remove', location, name: propertyName, value: source },
      { op: 'add', location, name: propertyName, value: target }
    ];
  }

  return [];
}

// TODO: hash changes if object changes
// using _id 
function computeHash(value) {
  // TODO: crude start
  return JSON.stringify(value);
}

function getId(obj) {
  // TODO: Only works for objects
  return obj._id;
}

function computeMetadata(obj) {
  const metadata = { id: getId(obj), value: obj };

  // TODO: id of value types can be value or hash
  if (metadata.id === undefined) {
    metadata.hash = computeHash(obj);
  }

  return metadata;
}

function diffArrays(source, target, location) {
  let changeset = [];

  // TODO: These should be double-linked-lists
  const sm = source.map(computeMetadata);
  const tm = target.map(computeMetadata);

  let i = 0;

  const matchByHash = function(a, b) {
    return a.hash === b.hash;
  }

  const matchById = function(a, b) {
    return a.id === b.id;
  }

  while (sm.length > 0 && tm.length > 0) {
    let match;

    if (sm[0].id !== undefined && tm[0].id !== undefined) {
      match = matchById;
    } else {
      match = matchByHash;
    }

    if (match(tm[0], sm[0])) {
      // Same object if matching by id, most likely same object unchanged
      // when matching by hash; compare and move on
      const childChangeset = diffObjects(sm[0].value, tm[0].value, location.concat(i));

      if (childChangeset.length !== 0) {
        changeset = changeset.concat(childChangeset);
      }

      tm.splice(0, 1);
      sm.splice(0, 1);
      i++;
    } else {
      const matchedSourceIndex = tm.findIndex(t => match(t, sm[0]));

      if (matchedSourceIndex === -1) {
        // source[si] has been deleted (or changed if matching by hash)
        changeset.push({ op: 'delete', location, index: i, value: clone(sm[0].value) });

        sm.splice(0, 1);
      } else {
        const matchedTargetIndex = sm.findIndex(s => match(s, tm[0]));

        if (matchedTargetIndex === -1) {
          // target[si] has been inserted (or changed if matching by hash)
          changeset.push({ op: 'insert', location, index: i, value: clone(tm[0].value) });

          tm.splice(0, 1);
          i++;
        } else {
          // item has moved nearer the start
          // source[matchedTargetIndex] has been been moved to target[ti]

          changeset.push({ op: 'move', location, index: i + matchedTargetIndex, offset: -matchedTargetIndex });

          const removed = sm.splice(matchedTargetIndex, 1);
          sm.splice(0, 0, removed[0])
        }
      }
    }
  }

  for (let j = 0; j < sm.length; j++) {
    // TODO: test clone
    changeset.push({ op: 'delete', location, index: i + j, value: clone(sm[j].value) });
  }

  for (let j = 0; j < tm.length; j++) {
    // TODO: test clone
    changeset.push({ op: 'insert', location, index: i + j, value: clone(tm[j].value) });
  }

  return changeset;
}

// source and target should both be object
function diffObjects(source, target, location = []) {
  const sourceProperties = Object.keys(source);
  const targetProperties = Object.keys(target);

  let changeset = [];

  for (let i = 0; i < sourceProperties.length; i += 1) {
    const sourceName = sourceProperties[i];
    const sourceValue = source[sourceName];

    const j = targetProperties.indexOf(sourceName);

    if (j === -1) {
      // Property removed from target object
      changeset.push({ op: 'remove', location, name: sourceName, value: clone(sourceValue) });

      // TODO: tests for sourceValue being arrays/objects
    } else {
      // Property retained
      const targetValue = target[sourceName];
      const childChangeset = diffProperties(sourceValue, targetValue, location, sourceName);

      if (childChangeset.length !== 0) {
        changeset = changeset.concat(childChangeset);
      }
    }
  }

  for (let i = 0; i < targetProperties.length; i += 1) {
    const targetName = targetProperties[i];
    const targetValue = target[targetName];

    const j = sourceProperties.indexOf(targetName);

    if (j === -1) {
      // Property added to target object
      changeset.push({ op: 'add', location, name: targetName, value: clone(targetValue) });

      // TODO: tests for targetValue being arrays/objects
    }
  }

  return changeset;
}

function diff(source, target) {
  if (source === null || typeof(source) !== 'object') {
    throw new Error(`Argument mismatch, source should be object but found ${source} instead.`);
  }

  if (target === null || typeof(target) !== 'object') {
    throw new Error(`Argument mismatch, target should be object but found ${target} instead.`);
  }

  return diffObjects(source, target);
}

module.exports = diff;
