import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { EventService } from '@labshare/ngx-core-services';
import { AuthService } from '@labshare/ngx-core-services';
import { Subscription } from 'rxjs';
import { UserProfileEventKeys } from './user-profile.event-keys';
import { filter } from 'rxjs/operators';
import { UserProfile, Link } from './user-profile.types';
import { captions } from './captions';
import { Router } from '@angular/router';

@Component({
    selector: 'ls-ui-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    public userProfile: UserProfile;
    public disableLink = false;
    public disableViewDashboardLink = false;
    isLoggingEnable = false;
    public captions = captions;

    @Input() links: Link[];

    constructor(private eventService: EventService, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authService.isAuthorized().subscribe(authorized => {
            this.isLoggingEnable = authorized;
            if (this.isLoggingEnable) {
                this.subscription.add(
                    this.eventService
                        .get(UserProfileEventKeys.UserProfile)
                        .pipe(filter(x => x))
                        .subscribe(val => (this.userProfile = val)),
                );
                this.subscription.add(this.eventService.get(UserProfileEventKeys.EnableLink).subscribe(val => (this.disableLink = val ? val : false)));
                this.subscription.add(
                    this.eventService
                        .get(UserProfileEventKeys.UserPictureChanged)
                        .pipe(filter(x => x))
                        .subscribe(val => (this.userProfile.pictureUrl = val)),
                );
            }
        });
        this.disableViewDashboardLink = this.router.url.startsWith('/dashboard');
    }

    signOut() {
        this.eventService.get(UserProfileEventKeys.UserProfileSignout).next(true);
    }

    signIn() {
        this.eventService.get(UserProfileEventKeys.UserProfileSignin).next(true);
    }

    editProfile() {
        this.eventService.get(UserProfileEventKeys.UserProfileEdit).next(true);
    }

    viewAccount() {
        this.eventService.get(UserProfileEventKeys.ViewAccount).next(true);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
