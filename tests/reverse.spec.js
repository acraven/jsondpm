const chai = require('chai');
const { expect } = chai;
const jsondpm = require('../index.js');

describe('reverse', () => {
  it('returns undefined if changeset is missing', () => {
    const result = jsondpm.reverse();

    expect(result).to.equal(undefined);
  });

  it('returns empty if changeset is empty', () => {
    const result = jsondpm.reverse([]);

    expect(result).to.deep.equal([]);
  });

  it('returns different instance if changeset is empty', () => {
    const changeset = [];
    const result = jsondpm.reverse(changeset);

    expect(result).not.to.equal(changeset);
  });

  it('returns remove when given add', () => {
    const result = jsondpm.reverse([ { op: 'add', location: ['foo'], value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'remove', location: ['foo'], value: 'bar' } ]);
  });

  it('returns remove when given add nested property', () => {
    const result = jsondpm.reverse([ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'remove', location: ['prop','child', 'foo'], value: 'bar' } ]);
  });

  it('returns add when given remove', () => {
    const result = jsondpm.reverse([ { op: 'remove', location: ['foo'], value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'add', location: ['foo'], value: 'bar' } ]);
  });

  it('returns add when given remove nested property', () => {
    const result = jsondpm.reverse([ { op: 'remove', location: ['prop','child','foo'], value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]);
  });

  it('returns text swapping insert for delete', () => {
    const result = jsondpm.reverse([ { op: 'insert-text', location: ['foo'], index: 0, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'delete-text', location: ['foo'], index: 0, value: 'bar' } ]);
  });

  it('returns text swapping insert for delete nested property', () => {
    const result = jsondpm.reverse([ { op: 'insert-text', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'delete-text', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);
  });

  it('returns text swapping delete for insert', () => {
    const result = jsondpm.reverse([ { op: 'delete-text', location: ['foo'], index: 0, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'insert-text', location: ['foo'], index: 0, value: 'bar' } ]);
  });

  it('returns text swapping delete for insert nested property', () => {
    const result = jsondpm.reverse([ { op: 'delete-text', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'insert-text', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);
  });

  it('returns text swapping insert and delete', () => {
    const result = jsondpm.reverse([
      { op: 'delete-text', location: ['foo'], index: 0, value: 'foo' },
      { op: 'insert-text', location: ['foo'], index: 0, value: 'bar' }
    ]);

    expect(result).to.deep.equal([
      { op: 'delete-text', location: ['foo'], index: 0, value: 'bar' },
      { op: 'insert-text', location: ['foo'], index: 0, value: 'foo' }
    ]);
  });

  it('returns text swapping insert and delete nested property', () => {
    const result = jsondpm.reverse([
      { op: 'delete-text', location: ['prop','child','foo'], index: 2, value: 'foo' },
      { op: 'insert-text', location: ['prop','child','foo'], index: 2, value: 'bar' }
    ]);

    expect(result).to.deep.equal([
      { op: 'delete-text', location: ['prop','child','foo'], index: 2, value: 'bar' },
      { op: 'insert-text', location: ['prop','child','foo'], index: 2, value: 'foo' }
    ]);
  });

  it('returns delete when given insert', () => {
    const result = jsondpm.reverse([ { op: 'insert', location: ['foo'], index: 0, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'delete', location: ['foo'], index: 0, value: 'bar' } ]);
  });

  it('returns delete when given insert nested property', () => {
    const result = jsondpm.reverse([ { op: 'insert', location: ['prop','child','foo'], index: 3, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'delete', location: ['prop','child','foo'], index: 3, value: 'bar' } ]);
  });

  it('returns insert when given delete', () => {
    const result = jsondpm.reverse([ { op: 'delete', location: ['foo'], index: 1, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'insert', location: ['foo'], index: 1, value: 'bar' } ]);
  });

  it('returns insert when given delete nested property', () => {
    const result = jsondpm.reverse([ { op: 'delete', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);

    expect(result).to.deep.equal([ { op: 'insert', location: ['prop','child','foo'], index: 2, value: 'bar' } ]);
  });
});
