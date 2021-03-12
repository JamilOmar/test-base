import { ObjectUtils } from './object.utils';

describe('ObjectUtils', () => {
    describe('isFunction()', () => {
        it('should recognize a function', () => {
            const foo = () => {};
            expect(ObjectUtils.isFunction(foo)).toEqual(true);
        });

        it('should recognize that object is not a function', () => {
            const foo = {} as () => {};
            expect(ObjectUtils.isFunction(foo)).toEqual(false);
        });
    });

    describe('reorderArray()', () => {
        it('should reorder an array', () => {
            const arr = ['a', 'b', 'c', 'd'];
            ObjectUtils.reorderArray(arr, 0, 2);
            expect(arr).toEqual(['b', 'c', 'a', 'd']);
        });

        it('should reorder an array with index greater than length', () => {
            const arr = ['a', 'b', 'c', 'd'];
            ObjectUtils.reorderArray(arr, 0, 5);
            expect(arr).toEqual(['b', 'a', 'c', 'd']);
        });

        it('should not reorder an array when to equals from', () => {
            const arr = ['a', 'b', 'c', 'd'];
            ObjectUtils.reorderArray(arr, 1, 1);
            expect(arr).toEqual(['a', 'b', 'c', 'd']);
        });
    });

    describe('insertIntoOrderedArray()', () => {
        it('should inject an item as indexed', () => {
            const sourceArr: string[] = ['New York', 'Istanbul', 'Paris', 'Barcelona', 'London'];
            const arr: string[] = [];

            ObjectUtils.insertIntoOrderedArray('Istanbul', 1, arr, sourceArr);
            expect(arr).toEqual(['Istanbul']);

            ObjectUtils.insertIntoOrderedArray('Paris', 2, arr, sourceArr);
            ObjectUtils.insertIntoOrderedArray('New York', 0, arr, sourceArr);
            ObjectUtils.insertIntoOrderedArray('London', 4, arr, sourceArr);
            ObjectUtils.insertIntoOrderedArray('Barcelona', 3, arr, sourceArr);
            expect(arr).toEqual(['New York', 'Istanbul', 'Paris', 'Barcelona', 'London']);
        });
    });

    describe('findIndexInList()', () => {
        it('should find index', () => {
            const sourceArr: string[] = ['New York', 'Istanbul', 'Paris', 'Barcelona', 'London'];

            const index = ObjectUtils.findIndexInList(sourceArr[1], sourceArr);
            expect(index).toEqual(1);
        });

        it('should not find index when source is not defined', () => {
            const sourceArr = undefined as Array<unknown>;
            const index = ObjectUtils.findIndexInList('test', sourceArr);
            expect(index).toEqual(-1);
        });
    });
});
