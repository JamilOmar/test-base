import { SearchPipe } from './search.pipe';

describe('SearchPipe', () => {
    it('should filter items based on input', () => {
        const arr = [{ title: 'abc' }, { title: 'aab' }, { title: 'bbc' }];
        const pipe = new SearchPipe();
        expect(pipe.transform(arr, 'title', 'a')).toEqual([{ title: 'abc' }, { title: 'aab' }]);
        expect(pipe.transform(arr, 'title', 'bb')).toEqual([{ title: 'bbc' }]);
    });

    it('should not filter items when input is empty', () => {
        const arr = [{ title: 'abc' }, { title: 'aab' }, { title: 'bbc' }];
        const pipe = new SearchPipe();
        expect(pipe.transform(arr, 'title', '')).toEqual([{ title: 'abc' }, { title: 'aab' }, { title: 'bbc' }]);
    });

    it('should filter even when there is no items', () => {
        const arr = undefined;
        const pipe = new SearchPipe();
        expect(pipe.transform(arr, 'title', 'ab')).toEqual([]);
    });
});
