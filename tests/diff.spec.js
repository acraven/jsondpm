const chai = require('chai');
const { expect } = chai;
const jsondpm = require('../index.js');

describe('diff', () => {
  describe('empty documents', () => {
    it('should return empty changeset', () => {
      const result = jsondpm.diff({}, {});

      expect(result).to.deep.equal([]);
    })
  });

  describe('undefined documents', () => {
    it('should throw exception if source undefined', () => {
      expect(() => { jsondpm.diff(undefined, { }); })
        .to.throw('Argument mismatch, source should be object but found undefined instead.');
    })

    it('should throw exception if target undefined', () => {
      expect(() => { jsondpm.diff({ }, undefined); })
        .to.throw('Argument mismatch, target should be object but found undefined instead.');
    })
  });

  describe('null documents', () => {
    it('should throw exception if source is null', () => {
      expect(() => { jsondpm.diff(null, { }); })
        .to.throw('Argument mismatch, source should be object but found null instead.');
    })

    it('should throw exception if target is null', () => {
      expect(() => { jsondpm.diff({ }, null); })
        .to.throw('Argument mismatch, target should be object but found null instead.');
    })
  });

  describe('document with same string property with same value', () => {
    it('should return no differences', () => {
      const source = { foo: 'bar' };
      const target = { foo: 'bar' };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([]);
    });
  });

  describe('document with same int property with same value', () => {
    it('should return no differences', () => {
      const source = { foo:  23 };
      const target = { foo:  23 };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([]);
    });
  });

  describe('document with property removed', () => {
    it('should return single remove change', () => {
      const source = { foo: 'bar' };
      const target = { };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: [], name: 'foo', value: 'bar' }
      ]);
    });

    it('should clone removed property in change', () => {
      const willBeRemoved = { hello: 'world' };
      const source = { foo: willBeRemoved };
      const target = { };

      const result = jsondpm.diff(source, target);

      expect(result[0].value).not.to.equal(willBeRemoved);
    });
  });

  describe('document with property added', () => {
    it('should return single add change', () => {
      const source = { foo: 'bar' };
      const target = { foo: 'bar', another: 'anotherValue' };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'add', location: [], name: 'another', value: 'anotherValue' }
      ]);
    });

    it('should clone added property in change', () => {
      const willBeAdded = { hello: 'world' };
      const source = { foo: 'bar' };
      const target = { foo: 'bar', another: willBeAdded };

      const result = jsondpm.diff(source, target);

      expect(result[0].value).not.to.equal(willBeAdded);
    });
  });

  describe('document with same string property with different values', () => {
    it('should return two differences', () => {
      const source = { foo: 'hello' };
      const target = { foo: 'world' };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'delete-text', location: ['foo'], index: 0, value: 'hello' },
        { op: 'insert-text', location: ['foo'], index: 0, value: 'world' }
      ]);
    });
  });

  describe('document with same int property with different values', () => {
    it('should return two differences', () => {
      const source = { foo: 5 };
      const target = { foo: 7 };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: [], name: 'foo', value: 5 },
        { op: 'add', location: [], name: 'foo', value: 7 }
      ]);
    });
  });

  describe('document with same property with different types', () => {
    it('should return two differences', () => {
      const source = { foo: 23 };
      const target = { foo: '23' };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: [], name: 'foo', value: 23 },
        { op: 'add', location: [], name: 'foo', value: '23' }
      ]);
    });
  });

  describe('document with renamed property', () => {
    it('should return two differences', () => {
      const source = { foo: 'hello' };
      const target = { bar: 'world' };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: [], name: 'foo', value: 'hello' },
        { op: 'add', location: [], name: 'bar', value: 'world' }
      ]);
    });
  });

  describe('document with added array property', () => {
    it('should return add change', () => {
      const source = {  };
      const target = { array: [ 1 ] };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'add', location: [], name: 'array', value: [ 1 ] }
      ]);
    });
  });

  describe('document with removed array property', () => {
    it('should return remove change', () => {
      const source = { array: [ { foo: 'bar' }] };
      const target = { };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: [], name: 'array', value: [ { foo: 'bar' } ] }
      ]);
    });
  });

  describe('documents with same nested property', () => {
    it('should return no differences', () => {
      const source = { foo: { bar: 'wibble' } };
      const target = { foo: { bar: 'wibble' } };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([]);
    });
  });

  describe('document with nested renamed property', () => {
    it('should return two differences', () => {
      const source = { foo: { bar: 'wibble' } };
      const target = { foo: { one: 'wibble' } };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: ['foo'], name: 'bar', value: 'wibble' },
        { op: 'add', location: ['foo'], name: 'one', value: 'wibble' }
      ]);
    });
  });

  describe('document with nested property with different types', () => {
    it('should return two differences', () => {
      const source = { foo: { bar: 23 } };
      const target = { foo: { bar: '23' } };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: ['foo'], name: 'bar', value: 23 },
        { op: 'add', location: ['foo'], name: 'bar', value: '23' }
      ]);
    });
  });

  describe('document with nested string property with different values', () => {
    it('should return two differences', () => {
      const source = { foo: { bar: 'hello' } };
      const target = { foo: { bar: 'world' } };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'delete-text', location: ['foo','bar'], index: 0, value: 'hello' },
        { op: 'insert-text', location: ['foo','bar'], index: 0, value: 'world' }
      ]);
    });
  });

  describe('document with nested int property with different values', () => {
    it('should return two differences', () => {
      const source = { foo: { bar: 7 } };
      const target = { foo: { bar: 11 } };

      const result = jsondpm.diff(source, target);

      expect(result).to.deep.equal([
        { op: 'remove', location: ['foo'], name: 'bar', value: 7 },
        { op: 'add', location: ['foo'], name: 'bar', value: 11 }
      ]);
    });
  });
  
  describe('arrays', () => {
    describe('unchanged string array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ 'bar' ] };
        const target = { arr: [ 'bar' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([]);
      });
    });

    describe('unchanged object array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ { foo: 'bar' } ] };
        const target = { arr: [ { foo: 'bar' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([]);
      });
    });

    describe('item added to empty string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ ] };
        const target = { arr: [ 'foo' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'insert', location: ['arr'], index: 0, value: 'foo' }
        ]);
      });
    });

    describe('item removed from 1 item string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'foo' ] };
        const target = { arr: [ ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: 'foo' }
        ]);
      });
    });

    describe('first item removed from 2 item string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'foo', 'bar' ] };
        const target = { arr: [ 'bar'] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: 'foo' }
        ]);
      });
    });

    describe('last item removed from 2 item string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'foo', 'bar' ] };
        const target = { arr: [ 'foo'] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 1, value: 'bar' }
        ]);
      });
    });

    describe('item added to empty array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ ] };
        const target = { arr: [ { foo: 'bar' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'insert', location: ['arr'], index: 0, value: { foo: 'bar' } }
        ]);
      });
    });

    describe('item added at start of 1 item array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ { item: 'orig' } ] };
        const target = { arr: [ { foo: 'bar' }, { item: 'orig' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'insert', location: ['arr'], index: 0, value: { foo: 'bar' } }
        ]);
      });
    });

    describe('item added at end of 1 item array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ { item: 'orig' } ] };
        const target = { arr: [ { item: 'orig' }, { foo: 'bar' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'insert', location: ['arr'], index: 1, value: { foo: 'bar' } }
        ]);
      });
    });

    describe('item removed from 1 item array', () =>{
      it('should return no differences', () => {
        const source = { arr: [ { foo: 'bar' } ] };
        const target = { arr: [ ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: { foo: 'bar' } }
        ]);
      });
    });

    describe('first item removed from 2 item string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'foo', 'bar' ] };
        const target = { arr: [ 'bar' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: 'foo' }
        ]);
      });
    });

    describe('first item removed from 2 item array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ { foo: 'bar'}, { bar: 'foo' } ] };
        const target = { arr: [ { bar: 'foo' }] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: { foo: 'bar' } }
        ]);
      });
    });

    describe('items swapped in 2 item string array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'foo', 'bar' ] };
        const target = { arr: [ 'bar', 'foo' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 }
        ]);
      });
    });

    describe('items swapped in 2 item array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ { foo: 'bar' }, { bar: 'foo' } ] };
        const target = { arr: [ { bar: 'foo' }, { foo: 'bar' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 }
        ]);
      });
    });

    describe('items swapped and changed 2 item array', () =>{
      it('should return 4 brute force differences', () => {
        const source = { arr: [ { foo: 'bar' }, { bar: 'foo' } ] };
        const target = { arr: [ { bar: 'foo', change: 'a' }, { foo: 'bar', change: 'b' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'delete', location: ['arr'], index: 0, value: { foo: 'bar' } },
          { op: 'delete', location: ['arr'], index: 0, value: { bar: 'foo' } },
          { op: 'insert', location: ['arr'], index: 0, value: { bar: 'foo', change: 'a' } },
          { op: 'insert', location: ['arr'], index: 1, value: { foo: 'bar', change: 'b' } },
        ]);
      });
    });

    describe('items swapped and changed 2 item array with ids', () =>{
      it('should return three differences', () => {
        const source = { arr: [ { _id: 1, foo: 'bar' }, { _id: 2, bar: 'foo' } ] };
        const target = { arr: [ { _id: 2, bar: 'foo', change: 'a' }, { _id: 1, foo: 'bar', change: 'b' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 },
          { op: 'add', location: ['arr', 0], name: 'change', value: 'a' },
          { op: 'add', location: ['arr', 1], name: 'change', value: 'b' }
        ]);
      });
    });

    describe('moving item backwards', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'a', 'b', 'c', 'd' ] };
        const target = { arr: [ 'c', 'a', 'b', 'd' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 }
        ]);
      });
    });

    // TODO: This result should be normalised out
    describe('moving item forwards', () => {
      it('should return one difference per element', () => {
        const source = { arr: [ 'a', 'b', 'c', 'd' ] };
        const target = { arr: [ 'b', 'c', 'a', 'd' ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 },
          { op: 'move', location: ['arr'], index: 2, offset: -1 }
        ]);
      });
    });

    describe('reversing three item value array', () =>{
      it('should return two differences', () => {
        const source = { arr: [ 'a', 'b', 'c', ] };
        const target = { arr: [ 'c', 'b', 'a', ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 },
          { op: 'move', location: ['arr'], index: 2, offset: -1 }
        ]);
      });
    });

    describe('reversing three item object array with ids', () =>{
      it('should return two differences', () => {
        const source = { arr: [ { _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' } ] };
        const target = { arr: [ { _id: 3, name: 'c' }, { _id: 2, name: 'b' }, { _id: 1, name: 'a' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 },
          { op: 'move', location: ['arr'], index: 2, offset: -1 }
        ]);
      });
    });

    describe('move last item to start of three item value array', () =>{
      it('should return one difference', () => {
        const source = { arr: [ 'a', 'b', 'c', ] };
        const target = { arr: [ 'c', 'a', 'b', ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 }
        ]);
      });
    });

    describe('move last item to start of three item object array with ids', () =>{
      it('should return one difference', () => {
        const source = { arr: [ { _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' } ] };
        const target = { arr: [ { _id: 3, name: 'c' }, { _id: 1, name: 'a' }, { _id: 2, name: 'b' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 }
        ]);
      });
    });

    describe('swapping two pairs in item value array', () =>{
      it('should return two differences', () => {
        const source = { arr: [ 'a', 'b', 'c', 'd'] };
        const target = { arr: [ 'b', 'a', 'd', 'c'] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 },
          { op: 'move', location: ['arr'], index: 3, offset: -1 }
        ]);
      });
    });

    describe('swapping two pairs in item value array with ids', () =>{
      it('should return two differences', () => {
        const source = { arr: [ { _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }, { _id: 4, name: 'd' } ] };
        const target = { arr: [ { _id: 2, name: 'b' }, { _id: 1, name: 'a' }, { _id: 4, name: 'd' }, { _id: 3, name: 'c' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 1, offset: -1 },
          { op: 'move', location: ['arr'], index: 3, offset: -1 }
        ]);
      });
    });

    describe('moving first 2 items to end of value array', () =>{
      it('should return two differences', () => {
        const source = { arr: [ 'a', 'b', 'c', 'd'] };
        const target = { arr: [ 'c', 'd', 'a', 'b'] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 },
          { op: 'move', location: ['arr'], index: 3, offset: -2 }
        ]);
      });
    });

    describe('moving first 2 items to end of value array with ids', () =>{
      it('should return two differences', () => {
        const source = { arr: [ { _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }, { _id: 4, name: 'd' } ] };
        const target = { arr: [ { _id: 3, name: 'c' }, { _id: 4, name: 'd' }, { _id: 1, name: 'a' }, { _id: 2, name: 'b' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 2, offset: -2 },
          { op: 'move', location: ['arr'], index: 3, offset: -2 }
        ]);
      });
    });

    describe('reversing four item value array', () => {
      it('should return three differences', () => {
        const source = { arr: [ 'a', 'b', 'c', 'd' ] };
        const target = { arr: [ 'd', 'c', 'b', 'a', ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 3, offset: -3 },
          { op: 'move', location: ['arr'], index: 3, offset: -2 },
          { op: 'move', location: ['arr'], index: 3, offset: -1 }
        ]);
      });
    });

    describe('reversing four item object array with ids', () => {
      it('should return three differences', () => {
        const source = { arr: [ { _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }, { _id: 4, name: 'd' } ] };
        const target = { arr: [ { _id: 4, name: 'd' }, { _id: 3, name: 'c' }, { _id: 2, name: 'b' }, { _id: 1, name: 'a' } ] };

        const result = jsondpm.diff(source, target);

        expect(result).to.deep.equal([
          { op: 'move', location: ['arr'], index: 3, offset: -3 },
          { op: 'move', location: ['arr'], index: 3, offset: -2 },
          { op: 'move', location: ['arr'], index: 3, offset: -1 }
        ]);
      });
    });
  });
});
