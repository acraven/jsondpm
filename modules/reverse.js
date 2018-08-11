const reverseOps = {
  "add": reverseAdd,
  "remove": reverseRemove,
  "insert": reverseInsert,
  "delete": reverseDelete,
  "insert-text": reverseInsertText,
  "delete-text": reverseDeleteText
}

function reverseAdd(change) {
  return {
    op: 'remove',
    location: change.location,
    value: change.value
  };
}

function reverseRemove(change) {
  return {
    op: 'add',
    location: change.location,
    value: change.value
  };
}

function reverseInsert(change) {
  return {
    op: 'delete',
    location: change.location,
    index: change.index,
    value: change.value
  };
}

function reverseDelete(change) {
  return {
    op: 'insert',
    location: change.location,
    index: change.index,
    value: change.value
  };
}

function reverseInsertText(change) {
  return {
    op: 'delete-text',
    location: change.location,
    index: change.index,
    value: change.value
  };
}

function reverseDeleteText(change) {
  return {
    op: 'insert-text',
    location: change.location,
    index: change.index,
    value: change.value
  };
}

function reverse(changeset) {
  if (changeset === undefined) {
    return undefined;
  }

  return changeset.map(c => reverseOps[c.op](c)).reverse();
}

module.exports = reverse;
