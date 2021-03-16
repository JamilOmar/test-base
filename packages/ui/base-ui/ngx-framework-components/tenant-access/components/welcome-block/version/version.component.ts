import { Component, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'ls-lib-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss'],
})
export class VersionComponent implements OnDestroy {
    @Input() version = '';
    @Input() label = 'Version:';
    private jsonURL = 'version.json';
    private sub = new Subscription();

    constructor(private http: HttpClient) {
        this.sub.add(
            this.getJSON().subscribe(data => {
                this.version = data;
            }),
        );
    }

    public getJSON(): Observable<string> {
        return this.http.get(this.jsonURL).pipe(
            map((v: { version: string }) => v.version),
            catchError(err => {
                return of('Can not find version.json to display product version');
            }),
        );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
