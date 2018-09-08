const chai = require('chai');
const { expect } = chai;
const jsondpm = require('../index.js');

describe('patch', () => {
  it('returns undefined if changeset is missing', () => {
    const result = jsondpm.patch({});

    expect(result).to.equal(undefined);
  });

  it('returns original if changeset is empty', () => {
    const result = jsondpm.patch({ foo: 'bar' }, []);

    expect(result).to.deep.equal({ foo: 'bar' });
  });

  it('returns copy of original if changeset is empty', () => {
    const source = { foo: 'bar' };
    const result = jsondpm.patch(source, []);

    expect(result).not.to.equal(source);
  });

  describe('add to root', () => {
    it('returns original with added string property', () => {
      const result = jsondpm.patch({}, [ { op: 'add', location: ['foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ foo: 'bar' });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondpm.patch({ foo: 'bar' }, [ { op: 'add', location: ['foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  describe('add empty array to root', () => {
    it('returns original with empty array', () => {
      const result = jsondpm.patch({}, [ { op: 'add', location: ['foo'], value: [] } ]);
  
      expect(result).to.deep.equal({ foo: [] });
    });
  });

  describe('add to property', () => {
    it('returns original with added string property', () => {
      const result = jsondpm.patch({ prop: {} }, [ { op: 'add', location: ['prop','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { foo: 'bar' } });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondpm.patch({ prop: { foo: 'bar' } }, [ { op: 'add', location: ['prop','foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'prop.foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  describe('add to nested property', () => {
    it('returns original with added string property', () => {
      const result = jsondpm.patch({ prop: { child: { } } }, [ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { child: { foo: 'bar' } } });
    });

    it('throws exception if trying to add existing key', () => {
      expect(() => { jsondpm.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'add', location: ['prop','child','foo'], value: 'bar' } ]); })
        .to.throw('Add mismatch, expecting to add \'prop.child.foo\' with value \'bar\' but \'foo\' already exists with value \'bar\'');
    });
  });

  describe('adding object', () => {
    it('adds object to location', () => {
      const result = jsondpm.patch({}, [ { op: 'add', location: ['foo'], value: { bar: 'myBar' } } ]);
  
      expect(result.foo).to.deep.equal({ bar: 'myBar' });
    });

    it('clones change value before patching', () => {
      const newObj = { bar: 'myBar' };
      const result = jsondpm.patch({}, [ { op: 'add', location: ['foo'], value: newObj } ]);
  
      expect(result.foo).not.to.equal(newObj);
    });
  });

  // TODO: more invalid scenarios - adding to property that isn't object

  describe('remove', () => {
    it('returns original without string property', () => {
      const result = jsondpm.patch({ foo: 'bar' }, [ { op: 'remove', location: ['foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondpm.patch({ foo: 'bar' }, [ { op: 'remove', location: ['foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'foo\' with value @change but @actual was found instead.\n@change="foo"\n@actual="bar"');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondpm.patch({ foo: 'bar' }, [ { op: 'remove', location: ['bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'bar\' with value \'bar\' but \'bar\' was not found');
    });

    it('throws exception if trying to remove non-matching object', () => {
      expect(() => { jsondpm.patch({ foo: { bar: 'foo' } }, [ { op: 'remove', location: ['foo'], value: { bar: 'myBar' } } ]); })
        .to.throw('Remove mismatch, expecting \'foo\' with value @change but @actual was found instead.\n@change={"bar":"myBar"}\n@actual={"bar":"foo"}');
    });
  });

  describe('remove from property', () => {
    it('returns original without string property', () => {
      const result = jsondpm.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { } });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondpm.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.foo\' with value @change but @actual was found instead.\n@change="foo"\n@actual="bar"');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondpm.patch({ prop: { foo: 'bar' } }, [ { op: 'remove', location: ['prop', 'bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.bar\' with value \'bar\' but \'bar\' was not found');
    });
  });

  describe('remove from nested property', () => {
    it('returns original without string property', () => {
      const result = jsondpm.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','foo'], value: 'bar' } ]);
  
      expect(result).to.deep.equal({ prop: { child: { } } });
    });

    it('throws exception if trying to remove key with different value', () => {
      expect(() => { jsondpm.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','foo'], value: 'foo' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.child.foo\' with value @change but @actual was found instead.\n@change="foo"\n@actual="bar"');
    });

    it('throws exception if trying to remove key that doesn\'t exist', () => {
      expect(() => { jsondpm.patch({ prop: { child: { foo: 'bar' } } }, [ { op: 'remove', location: ['prop','child','bar'], value: 'bar' } ]); })
        .to.throw('Remove mismatch, expecting \'prop.child.bar\' with value \'bar\' but \'bar\' was not found');
    });
  });

  describe('text insert', () => {
    it('returns original with added text', () => {
      const result = jsondpm.patch({ foo: '' }, [ { op: 'insert-text', location: ['foo'], index: 0, value: 'bar' } ]);
  
      expect(result).to.deep.equal({ foo: 'bar' });
    });
  });

  describe('text delete', () => {
    it('returns original without removed text', () => {
      const result = jsondpm.patch({ foo: 'bar' }, [ { op: 'delete-text', location: ['foo'], index: 0, value: 'bar' } ]);

      expect(result).to.deep.equal({ foo: '' });
    });
  });

  describe('text replace with same length', () => {
    it('returns original with replaced text', () => {
      const result = jsondpm.patch({ foo: 'bar' }, [
        { op: 'delete-text', location: ['foo'], index: 0, value: 'bar' },
        { op: 'insert-text', location: ['foo'], index: 0, value: 'foo' }
      ]);

      expect(result).to.deep.equal({ foo: 'foo' });
    });
  });

  describe('text replace in middle of string', () => {
    it('returns original with replaced text', () => {
      const result = jsondpm.patch({ foo: 'the quick lazy brown fox' }, [
        { op: 'delete-text', location: ['foo'], index: 4, value: 'quick lazy' },
        { op: 'insert-text', location: ['foo'], index: 4, value: 'sly' }
      ]);

      expect(result).to.deep.equal({ foo: 'the sly brown fox' });
    });
  });

  describe('text replace start of string in child object', () => {
    it('returns original with replaced text', () => {
      const result = jsondpm.patch({ prop: { foo: 'hello world' } }, [
        { op: 'delete-text', location: ['prop', 'foo'], index: 0, value: 'hello' },
        { op: 'insert-text', location: ['prop', 'foo'], index: 0, value: 'mad' }
      ]);

      expect(result).to.deep.equal({ prop: { foo: 'mad world' } });
    });
  });

  describe('text replace end of string in child object', () => {
    it('returns original with replaced text', () => {
      const result = jsondpm.patch({ prop: { foo: 'hello world' } }, [
        { op: 'delete-text', location: ['prop', 'foo'], index: 6, value: 'world' },
        { op: 'insert-text', location: ['prop', 'foo'], index: 6, value: 'moto' }
      ]);

      expect(result).to.deep.equal({ prop: { foo: 'hello moto' } });
    });
  });

  describe('insert into empty array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [ 'string' ] });
    });

    it('returns original with added object', () => {
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [ { bar: 'foo' } ] });
    });
    
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index > 0
  });

  describe('insert into existing array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [ 'string' ] });
    });

    it('returns original with added object', () => {
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [ { bar: 'foo' } ] });
    });
    
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index >= length
  });

  describe('inserting object', () => {
    it('inserts object to location', () => {
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: { bar: 'myBar' } } ]);
  
      expect(result.foo[0]).to.deep.equal({ bar: 'myBar' });
    });

    it('clones change value before patching', () => {
      const newObj = { bar: 'myBar' };
      const result = jsondpm.patch({ foo: [] }, [ { op: 'insert', location: ['foo'], index: 0, value: newObj } ]);
  
      expect(result.foo[0]).not.to.equal(newObj);
    });
  });

  describe('delete from array', () => {
    it('returns original without removed string', () => {
      const result = jsondpm.patch({ foo: ['string'] }, [ { op: 'delete', location: ['foo'], index: 0, value: 'string' } ]);
  
      expect(result).to.deep.equal({ foo: [  ] });
    });

    it('returns original without removed object', () => {
      const result = jsondpm.patch({ foo: [{ bar: 'foo' }] }, [ { op: 'delete', location: ['foo'], index: 0, value: { bar: 'foo' } } ]);
  
      expect(result).to.deep.equal({ foo: [] });
    });

    it('throws exception if trying to delete non-matching string', () => {
      expect(() => { jsondpm.patch({ foo: ['string'] }, [ { op: 'delete', location: ['foo'], index: 0, value: 'wrongString' } ]); })
        .to.throw('Delete mismatch, expecting \'foo[0]\' with value @change but @actual was found instead.\n@change="wrongString"\n@actual="string"');
    });

    it('throws exception if trying to delete non-matching object', () => {
      expect(() => { jsondpm.patch({ foo: [{ bar: 'foo' }] }, [ { op: 'delete', location: ['foo'], index: 0, value: { bar: 'myBar' } } ]); })
        .to.throw('Delete mismatch, expecting \'foo[0]\' with value @change but @actual was found instead.\n@change={"bar":"myBar"}\n@actual={"bar":"foo"}');
    });

    // TODO: Throw exception if object being removed is different or not object
    // TODO: Throw exception if not array
    // TODO: Throw exception if index < 0
    // TODO: Throw exception if index > 0
  });

  describe('move item forwards in value array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: ['a','b'] }, [ { op: 'move', location: ['foo'], index: 0, offset: 1 } ]);
  
      expect(result).to.deep.equal({ foo: ['b', 'a'] });
    });
  });

  describe('move item backwards in value array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: ['a','b'] }, [ { op: 'move', location: ['foo'], index: 1, offset: -1 } ]);
  
      expect(result).to.deep.equal({ foo: [ 'b', 'a' ] });
    });
  });

  describe('move multiple items forwards in value array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: ['a','b','c'] }, [
        { op: 'move', location: ['foo'], index: 0, offset: 2 },
        { op: 'move', location: ['foo'], index: 0, offset: 1 }
      ]);
  
      expect(result).to.deep.equal({ foo: ['c','b','a'] });
    });
  });

  describe('move multiple items backwards in value array', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: ['a','b','c'] }, [
        { op: 'move', location: ['foo'], index: 2, offset: -2 },
        { op: 'move', location: ['foo'], index: 2, offset: -1 }
      ]);
  
      expect(result).to.deep.equal({ foo: ['c','b','a'] });
    });
  });

  describe('move multiple items forwards in object array with ids', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: [{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }] }, [
        { op: 'move', location: ['foo'], index: 0, offset: 2 },
        { op: 'move', location: ['foo'], index: 0, offset: 1 }
      ]);
  
      expect(result).to.deep.equal({ foo: [{ _id: 3, name: 'c' }, { _id: 2, name: 'b' }, { _id: 1, name: 'a' }] });
    });
  });

  describe('move multiple items backwards in object array with ids', () => {
    it('returns original with added string', () => {
      const result = jsondpm.patch({ foo: [{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }] }, [
        { op: 'move', location: ['foo'], index: 2, offset: -2 },
        { op: 'move', location: ['foo'], index: 2, offset: -1 }
      ]);
  
      expect(result).to.deep.equal({ foo: [{ _id: 3, name: 'c' }, { _id: 2, name: 'b' }, { _id: 1, name: 'a' }] });
    });
  });

  // TODO: object moving
  // TODO: object references
});
