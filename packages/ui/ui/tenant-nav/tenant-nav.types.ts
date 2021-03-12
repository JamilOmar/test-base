export interface Link {
    link: string;
    icon: string;
    text?: string;
}

export interface Logo {
    src: string;
    initialsSize: number;
    textSizeRatio: number;
}

export interface Tenant {
    id: string;
    icon: string;
    text?: string;
}

export interface App {
    name: string;
    link: string;
    logo?: string;
}

export interface TenantPayload {
    logo: Logo;
    tenant: Tenant;
}
