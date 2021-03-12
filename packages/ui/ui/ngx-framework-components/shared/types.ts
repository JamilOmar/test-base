export interface Group {
    id?: number;
    name: string;
    description?: string;
    authId?: number;
    tenantId?: number;
}

export interface IdentityProvider {
    id: string;
    type: string;
    identityIssuer?: string;
    displayName?: string;
}

export interface StorageFileInfo {
    tenantId: string;
    driver: string;
    container: string;
}

export interface StorageInfo {
    name: string;
    type: string;
    server: string;
    url: string;
    user: string;
    pwd: string;
    tenantId: string;
}

export class StorageTypeInfo {
    id: string;
    label: string;
    url: string;
}

export interface User {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    groups?: Array<Group>;
    displayName?: string;
    jobTitle?: string;
    organization?: string;
    facilityId?: string;
    identityIssuer?: string;
    status?: string;
}

export interface Tenant {
    id: string;
    title?: string;
    description?: string;
    idProviders?: Array<string>;
    authTenantId?: number;
    logo?: string;
}

export interface Client {
    id: number;
    clientId: string;
}

export interface Permission {
    id: number;
    name: string;
    description: string;
    clientId?: number;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    clientId?: number;
}

export interface RolePermission {
    roleId: number;
    permissionIds: number[];
}

export interface ExistsResponse {
    exists: boolean;
}
