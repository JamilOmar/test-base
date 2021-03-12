import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
})
export class SearchPipe<T extends object> implements PipeTransform {
    public transform(value: Array<T>, path: string, term: string) {
        if (!term) {
            return value;
        }
        const regex = new RegExp(term.toLowerCase(), 'gi');
        const paths = path.split('.');
        return (value || []).filter(item => {
            let val = item as unknown;
            paths.forEach(p => (val = val[p]));
            return regex.test((val as string).toLowerCase());
        });
    }
}
