import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { VersionComponent } from './version.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';

describe('VersionComponent', () => {
    let component: VersionComponent;
    let fixture: ComponentFixture<VersionComponent>;
    let httpService: HttpClient;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VersionComponent],
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HttpClient,
                    useValue: {
                        get() {
                            return of({ version: '123' });
                        },
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const injector = getTestBed();
        httpService = injector.inject(HttpClient);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('getJSON', () => {
        it('should return version', () => {
            spyOn(httpService, 'get').and.returnValue(of({ version: '123' }));
            let result;
            component.getJSON().subscribe(r => (result = r));
            expect(result).toEqual('123');
        });

        it('should handle error', () => {
            spyOn(httpService, 'get').and.returnValue(throwError(new Error('test')));
            let result;
            component.getJSON().subscribe(r => (result = r));
            expect(result).toEqual('Can not find version.json to display product version');
        });
    });
});
