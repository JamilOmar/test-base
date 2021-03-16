import { Type } from '@angular/core';
import { Link } from '@labshare/base-ui/drop-down-menu';

export const HeaderEventKeys = {
    Title: 'Base.Header.Title',
};

export interface HeaderConfig {
    text: string;
    logoComponent: Type<unknown>;
    leftNavList: NavItem[];
    centerNavList: NavItem[];
    rightNavList: NavItem[];
}

export interface NavItem {
    text: string;
    type: NavType;
    component: Type<unknown>;
    accountLink?: boolean;
    links?: Link[];
    icon?: string;
    element?: string;
    menu?: Link[];
}

export enum NavType {
    text = 'text',
    menu = 'menu',
    userProfile = 'userProfile',
    i = 'i',
}
