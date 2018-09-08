const chai = require('chai');
const clone= require('clone');
const { expect } = chai;
const jsondpm = require('../../index.js');

const permutate = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}

// TODO: More perms with inserted and deleted items

describe('integration array reordering', () => {
  let source;

  describe('value array', () => {
    // TODO: Add more elements
    before(() => {
      source = { array: [
        'a',
        'b',
        'c',
        'd',
        'e'
      ]};
    });
  
    permutate([0, 1, 2, 3, 4]).forEach(args => {
      let target, changeset, result;
  
      before(() => {
        target = { array: args.map(index => clone(source.array[index])) };
  
        changeset = jsondpm.diff(source, target);
        result = jsondpm.patch(source, changeset);
      });
  
      it(`should identity differences and reconstruct (${args.join(',')})`, () => {
        expect(result).to.deep.equal(target);
      });
  
      it('should not use *-text operations', () => {
        const textOps = changeset.filter(c => c.op.endsWith('-text'));
  
        expect(textOps.length).to.equal(0);
      })
    });
  });

  describe('object array', () => {
    // TODO: Add more elements
    before(() => {
      source = { array: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' }
      ]};
    });

    permutate([0, 1, 2, 3, 4]).forEach(args => {
      let target, changeset, result;

      before(() => {
        target = { array: args.map(index => clone(source.array[index])) };

        changeset = jsondpm.diff(source, target);
        result = jsondpm.patch(source, changeset);
      });

      it(`should identity differences and reconstruct (${args.join(',')})`, () => {
        expect(result).to.deep.equal(target);
      });

      it('should not use *-text operations', () => {
        const textOps = changeset.filter(c => c.op.endsWith('-text'));

        expect(textOps.length).to.equal(0);
      })
    });
  });

  describe('object array with ids', () => {
    // TODO: Add more elements
    before(() => {
      source = { array: [
        { _id: 'a', name: 'A' },
        { _id: 'b', name: 'B' },
        { _id: 'c', name: 'C' },
        { _id: 'd', name: 'D' },
        { _id: 'e', name: 'E' }
      ]};
    });

    permutate([0, 1, 2, 3, 4]).forEach(args => {
      let target, changeset, result;

      before(() => {
        target = { array: args.map(index => clone(source.array[index])) };

        changeset = jsondpm.diff(source, target);

        result = jsondpm.patch(source, changeset);
      });

      it(`should identity differences and reconstruct (${args.join(',')})`, () => {
        expect(result).to.deep.equal(target);
      });

      it('should not use *-text operations', () => {
        const textOps = changeset.filter(c => c.op.endsWith('-text'));

        expect(textOps.length).to.equal(0);
      })
    });
  });
});
