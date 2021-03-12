# Overview

This repository is an Angular library containing services and reusable components across Labshare framework apps - ng-auth, ngx-storage, ngx-facility.
Currently, it contains services/components related to the Labshare signup process and tenant management. Other components/services related to the Labshare
framework will be added as needed.

The following are _wizard_ components that guide the user through the Labshare Facility onboarding process:

-   Welcome - User has a choice to either access their existing tenant or create a new tenant/lab workspace.
-   Profile - The lab administrator fills out basic information about himself.
-   Identity Provider Selection - The lab administrator selects the identity providers for the new tenant i.e. Login with Google or NIH.
-   Create Tenant - The lab administrator adds the basic properties of a tenant: name, identifier, description, logo.
-   Create Team Members - The lab administrator adds new team members for the tenant and their permissions group.
-   Review Team Workspace - The lab administrator reviews all the information for the new tenant. After confirmation, the new tenant is officially created.
-   Access Workspace - If the lab administrator chose to enter an existing workspace, it can be found by entering the workspace identifier.
-   Find Workspace - If the lab administrator chose to enter an existing workspace, they can find their preferred choice from a complete list of their
    workspaces.

The following are Angular services with reusable functionality for Labshare framework apps:

-   Auth Guard - protects client routes based on user authorization properties.
-   Tenant Manager - Inludes basic funcionality to manage a tenant and its interaction with Auth APIs.
-   Util - Includes reusable utility functions.
-   Wizard - Includes reusable methods for the Labshare onboarding process.

# Angular CLI

This repo is a standard Angular CLI library. For more information go to [https://cli.angular.io/](https://cli.angular.io/)

# Installation/Setup

1. Add as a dependency in your project: `"@labshare/ngx-framework-components": "^x.x.x"`
2. Then `npm install`
3. You can import one main module with all the components into your app that's using ngx-framework-components.

```javascript
@NgModule({
	imports: [
		NgxFrameworkComponentsModule,
	],

	declarations: []

})
```

or you can lazy load the above module into your route config file and the route/component mappings will automatically be added to your base route:

```javascript
export const routerConfig: Routes = [
  {
    path: YOUR_APP_BASE_ROUTE,
    loadChildren: () => import('@labshare/ngx-framework-components').then(m => m.NgxFrameworkComponentsModule),
  },
```

4. The following components/services are available related to tenant management and Labshare signup process:

    - [Components](https://github.com/LabShare/ngx-framework-components/tree/master/projects/ngx-framework-components/src/lib/components)
    - [Services](https://github.com/LabShare/ngx-framework-components/tree/master/projects/ngx-framework-components/src/lib/services)

# Global Styles

This library is dependent on bootstrap 4 css framework. Please add the bootstrap css in your app. You can either import it in your global sass/css file, import
a bootstrap cdn url, or add to your angular.json configuration.
