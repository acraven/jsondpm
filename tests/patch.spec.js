const chai = require('chai');
const { expect } = chai;
const jsondp = require('../index.js');

// TODO: Make sure obj is cloned when adding

describe('patch', () => {
  it('returns undefined if delta is missing', () => {
    const result = jsondp.patch({});

    expect(result).to.equal(undefined);
  });

  it('returns original if delta is empty', () => {
    const result = jsondp.patch({ foo: 'bar' }, []);

    expect(result).to.deep.equal({ foo: 'bar' });
  });

  it('returns copy of original if delta is empty', () => {
    const source = { foo: 'bar' };
    const result = jsondp.patch(source, []);

    expect(result).not.to.equal(source);
  });

  describe('add to root', () => {
    it('returns original with added string property', () => {
      const result = jsondp.patch({}, [ { op: 'add', location: ['foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ foo: 'bar' });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondp.patch({ foo: 'bar' }, [ { op: 'add', location: ['foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  describe('add empty array to root', () => {
    it('returns original with empty array', () => {
      const result = jsondp.patch({}, [ { op: 'add', location: ['foo'], value: [] } ]);
  
      expect(result).to.deep.equal({ foo: [] });
    });
  });

  describe('add to property', () => {
    it('returns original with added string property', () => {
      const result = jsondp.patch({ prop: {} }, [ { op: 'add', location: ['prop','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { foo: 'bar' } });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondp.patch({ prop: { foo: 'bar' } }, [ { op: 'add', location: ['prop','foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'prop.foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  describe('add to nested property', () => {
    it('returns original with added string property', () => {
      const result = jsondp.patch({ prop: { child: { } } }, [ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { child: { foo: 'bar' } } });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondp.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'prop.child.foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  // TODO: more invalid scenarios - adding to property that isn't object

  describe('remove', () => {
    it('returns original without string property', () => {
      const result = jsondp.patch({ foo: 'bar' }, [ { op: 'remove', location: ['foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondp.patch({ foo: 'bar' }, [ { op: 'remove', location: ['foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'foo\' with value \'foo\' but \'foo\' has value \'bar\'');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondp.patch({ foo: 'bar' }, [ { op: 'remove', location: ['bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'bar\' with value \'bar\' but \'bar\' was not found');
    });
  });

  describe('remove from property', () => {
    it('returns original without string property', () => {
      const result = jsondp.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { } });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondp.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.foo\' with value \'foo\' but \'foo\' has value \'bar\'');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondp.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.bar\' with value \'bar\' but \'bar\' was not found');
    });
  });

  describe('remove from nested property', () => {
    it('returns original without string property', () => {
      const result = jsondp.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { child: { } } });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondp.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.child.foo\' with value \'foo\' but \'foo\' has value \'bar\'');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondp.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.child.bar\' with value \'bar\' but \'bar\' was not found');
    });
  });

  describe('text insert', () => {
    it('returns original with added text', () => {
      const result = jsondp.patch({ foo: '' }, [ { op: 'text', location: ['foo'], index: 0, insert: 'bar' } ]);
  
      expect(result).to.deep.equal({ foo: 'bar' });
    });
  });

  describe('text delete', () => {
    it('returns original without removed text', () => {
      const result = jsondp.patch({ foo: 'bar' }, [ { op: 'text', location: ['foo'], index: 0, delete: 'bar' } ]);

      expect(result).to.deep.equal({ foo: '' });
    });
  });

  describe('text replace with same length', () => {
    it('returns original with replaced text', () => {
      const result = jsondp.patch({ foo: 'bar' }, [ { op: 'text', location: ['foo'], index: 0, delete: 'bar', insert: 'foo' } ]);

      expect(result).to.deep.equal({ foo: 'foo' });
    });
  });

  describe('text replace in middle of string', () => {
    it('returns original with replaced text', () => {
      const result = jsondp.patch({ foo: 'the quick lazy brown fox' }, [ { op: 'text', location: ['foo'], index: 4, delete: 'quick lazy', insert: 'sly' } ]);

      expect(result).to.deep.equal({ foo: 'the sly brown fox' });
    });
  });

  describe('text replace start of string in child object', () => {
    it('returns original with replaced text', () => {
      const result = jsondp.patch({ prop: { foo: 'hello world' } }, [ { op: 'text', location: ['prop', 'foo'], index: 0, delete: 'hello', insert: 'mad' } ]);

      expect(result).to.deep.equal({ prop: { foo: 'mad world' } });
    });
  });

  describe('text replace end of string in child object', () => {
    it('returns original with replaced text', () => {
      const result = jsondp.patch({ prop: { foo: 'hello world' } }, [ { op: 'text', location: ['prop', 'foo'], index: 6, delete: 'world', insert: 'moto' } ]);

      expect(result).to.deep.equal({ prop: { foo: 'hello moto' } });
    });
  });

  describe('insert into empty array', () => {
    it('returns original with added string', () => {
      const result = jsondp.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [ 'string' ] });
    });

    it('returns original with added object', () => {
      const result = jsondp.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [ { bar: 'foo' } ] });
    });
    
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index > 0
  });

  describe('insert into existing array', () => {
    it('returns original with added string', () => {
      const result = jsondp.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [ 'string' ] });
    });

    it('returns original with added object', () => {
      const result = jsondp.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [ { bar: 'foo' } ] });
    });
    
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index >= length
  });

  describe('delete from array', () => {
    it('returns original without removed string', () => {
      const result = jsondp.patch({ foo: ['string'] }, [ { op: 'delete', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [  ] });
    });

    it('returns original without removed object', () => {
      const result = jsondp.patch({ foo: [{ bar: 'foo' }] }, [ { op: 'delete', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [] });
    });
    
    // TODO: Throw exception if object being removed is different or not object
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index > 0
  });
});
