import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamCreatedComponent } from './team-created.component';
import { NgxCoreServicesModule, EventService, EventKeys, AuthService, SessionStorageService, WindowService } from '@labshare/ngx-core-services';
import { UtilService } from '../../../services/util.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('TenantCreatedComponent', () => {
    let utilService: UtilService;
    let eventService: EventService;
    let component: TeamCreatedComponent;
    let fixture: ComponentFixture<TeamCreatedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            declarations: [TeamCreatedComponent],
            providers: [EventService, UtilService, AuthService, SessionStorageService, WindowService],
        });

        fixture = TestBed.createComponent(TeamCreatedComponent);
        component = fixture.componentInstance;

        utilService = TestBed.inject(UtilService);
        eventService = TestBed.inject(EventService);
    });

    describe('done()', () => {
        it('should raise TenantId event', async () => {
            spyOn(utilService, 'getFromLocalStorage').and.returnValue('{"id": "test-tenant-id"}');
            component.done();
            eventService.get(EventKeys.SwitchTenant).subscribe(tenantId => {
                expect(tenantId).toEqual('test-tenant-id');
            });
        });

        it('should not do anything when there is no data', async () => {
            spyOn(utilService, 'getFromLocalStorage').and.returnValue(undefined);
            component.done();
            expect(eventService.get(EventKeys.SwitchTenant).value).not.toBeTruthy();
        });
    });
});
