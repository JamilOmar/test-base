export enum LocalStorageKeys {
    IdentityProvider = 'identityProviderInfo',
    ProfileInfo = 'profileInfo',
    TenantInfo = 'tenantInfo',
    NewMembers = 'newMembersInfo',
    Logo = 'logo',
    LogoFilename = 'logoFileName',
    SelectedDriver = 'selectedDriver',
    LoginAttempts = 'loginAttempts',
    FirstLoginTry = '0',
    FinalLoginTry = '1',
    RouteAfterLogin = 'routeAfterLogin',
    SwitchingTenants = 'switchingTenants',
}

export enum UrlPath {
    AuthBase = '/auth',
    Provider = '/idproviders',
    Tenant = '/facilities',
    EnsureTenant = '/facilities/exists',
    Users = '/users',
    Logo = '/logo',
    Groups = '/groups',
    Rel = '/rel',
    AuthAdmin = '/auth/admin/tenants',
    Clients = 'clients',
    Auth = 'services.auth.url',
    Roles = 'roles',
    Permissions = 'permissions',
    Facilities = 'facilities',
    Api = 'facility.url',
    TenantIdPattern = '{tenantId}',
    TenantIdRouteParam = ':tenantId',
    Dashboard = '/dashboard/welcome',
}

export enum RouteName {
    CreateTenant = 'create',
    TeamCreated = 'review',
    IdentityProvider = 'identityProvider',
    Profile = 'profile',
    Welcome = 'welcome',
    AccessWorkspace = 'access-workspace',
    FindWorkspace = 'find-workspace',
    Dashboard = 'dashboard',
}

export enum FileExtensions {
    Png = 'png',
}

export enum FieldName {
    Group = 'name',
    Role = 'name',
}

export const AuthKeys = {
    DefaultClientPattern: '_client',
    IdentityProviderIssuers: [
        { id: 'nih', issuer: 'https://auth.nih.gov/affwebservices/public/wsfeddispatcher' },
        { id: 'google', issuer: 'https://accounts.google.com' },
        { id: 'incommon', issuer: 'https://auth.nih.gov/affwebservices/public/wsfeddispatcher' },
        { id: 'Azure social login', issuer: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' },
        { id: 'linkedin', issuer: 'https://www.linkedin.com/oauth/v2/authorization' },
        { id: 'github', issuer: 'https://github.com/login/oauth/authorize' },
    ],
    AuthorizedState: 'authorized',
    AuthConfig: 'authConfig',
};

export const ConfigKeys = {
    DefaultAuthConfig: 'services.auth',
};

export const EventKeysFacility = {
    RemotePath: 'RemotePath',
};

export const FieldLengthLimits = {
    Email: 254,
    TeamName: 255,
    ShortName: 30,
    FirstName: 50,
    LastName: 50,
    DisplayName: 100,
    JobTitle: 100,
    Organization: 100,
};

export const ValidationRegexPatterns = {
    Email: /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Zñáéíóúü0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9ñáéíóúü!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, // tslint:disable-line
    // prettier-ignore
    TeamName: '[a-zA-Z0-9\\s-_\']+',
    ShortName: '[a-zA-Z0-9-_]+',
    ShortNameSlugifyRemove: /[']/g,
    FirstName: '[a-zA-Zñáéíóúü\\s-]+',
    LastName: '[a-zA-Zñáéíóúü\\s-]+',
    DisplayName: '[a-zA-Zñáéíóúü0-9\\s-_]+',
    JobTitle: '[a-zA-Z0-9\\s-]+',
    Organization: '[a-zA-Z0-9\\s-]+',
};

export const FieldValidationMessages = {
    CharacterLimit: 'Field should not be longer than {characterLength} characters',
    NoSpecialCharacters: 'Invalid characters',
};

export const KeyStatusCode = 'error.error.statusCode';
export const KeyErrorCode = 'error.error.errorCode';

export const MessagesErrorStatus = {
    422: 'Error creating new team. Invalid data submitted.',
    error: 'Error. Technical failure.',
};

export const MessageErrorCode = {
    TEAM_ALREADY_EXISTS: 'TEAM_ALREADY_EXISTS',
};
