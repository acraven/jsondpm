const clone = require('clone');
const deepEqual = require('deep-equal');
const locationUtils = require('./location-utils');

const patchOps = {
  "add": patchAdd,
  "remove": patchRemove,
  "insert": patchInsert,
  "delete": patchDelete,
  "insert-text": patchInsertText,
  "delete-text": patchDeleteText
}

function locateTarget(obj, location) {
  for (let i = 0; i < location.length - 1; i++) {
    // TODO:
    //   if (obj === null || typeof obj !== 'object') {
    //     throw new TypeError(`Value property ${elements.slice(0, i).join('.')} cannot be traversed`);
    //   }
  
       obj = obj[location[i]];
  
    // TODO:
    //   if (obj === undefined) {
    //     break;
    //   }
    }

    const key = location[location.length - 1];

    return {
      parent: obj,
      key,
      property: obj[key]
    };
}

function patchAdd(target, change) {
  if (target.property !== undefined) {
    throw new Error(`Add mismatch, expecting to add '${locationUtils.serialise(change.location)}' with value '${change.value}' but '${target.key}' already exists with value '${target.property}'.`);
  }

  target.parent[target.key] = clone(change.value);
}

function patchRemove(target, change) {
  if (target.property === undefined) {
    throw new Error(`Remove mismatch, expecting '${locationUtils.serialise(change.location)}' with value '${change.value}' but '${target.key}' was not found.`);
  } else if (!deepEqual(target.property, change.value)) {
    throw new Error(`Remove mismatch, expecting '${locationUtils.serialise(change.location)}' with value @change but @actual was found instead.\n@change=${JSON.stringify(change.value)}\n@actual=${JSON.stringify(target.property)}`);
  }

  delete target.parent[target.key];
}

function patchInsert(target, change) {
  // TODO: Should be type array, cannot be undefined or null, object, string etc.

  target.property.splice(change.index, 0, clone(change.value));
}

function patchDelete(target, change) {
  // TODO: Should be type array, cannot be undefined or null, object, string etc.

  if (!deepEqual(target.property[change.index], change.value)) {
    throw new Error(`Delete mismatch, expecting '${locationUtils.serialise(change.location)}[${change.index}]' with value @change but @actual was found instead.\n@change=${JSON.stringify(change.value)}\n@actual=${JSON.stringify(target.property[change.index])}`);
  }

  target.property.splice(change.index, 1);
}

function patchInsertText(target, change) {
  // TODO: Index should be within string

  target.parent[target.key] = target.property.slice(0, change.index) + change.value + target.property.slice(change.index);
}

function patchDeleteText(target, change) {
  // TODO: Index should be within string
  // TODO: value should exist
  // TODO: Need to check value being removed matches change

  target.parent[target.key] = target.property.slice(0, change.index) + target.property.slice(change.index + change.value.length);
}

function patch(source, changeset) {
  if (changeset === undefined) {
    return undefined;
  }

  const result = clone(source);

  changeset.forEach(change => {
    const target = locateTarget(result, change.location);
    patchOps[change.op](target, change);
  });

  return result;
}

module.exports = patch;
