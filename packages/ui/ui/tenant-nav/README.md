# TenantNav

## Using

Simply add tenant nav to the router config. `TenantNavComponent` is desinged to be used inside `LayoutDefaultComponent`

```typescript
{
    path: '',
    component: LayoutDefaultComponent,
    children: [
      {
        path: '',
        component: TenantNavComponent, // <-------
        outlet: 'tenant',
        data: { // <---- pass data into TenantNav
          links: [
            {
              link: 'pages', // this is a angular router route link
              icon: 'icon-lsi-pages', // css class
              text: 'Pages' // title of the link
            },
            {
              link: 'lists',
              icon: 'icon-lsi-lists',
              text: 'Lists'
            },
            {
              link: 'storage',
              icon: 'icon-lsi-storage',
              text: 'Storage'
            }
          ]
        }
      }
    ]
  }
```

## Communicating with TenantNav

`TenantNav` listens to tenant list events at `TenantNavEventKeys.TenantList` channel. Send tenant list data in this manner:

```typescript
eventService.get(TenantNavEventKeys.TenantList).next([ tenant1, tenant2]);`
```

When user clicks on a tenant, TenantNav will emit event at `CoreEventKeys.SwitchTenant` channel. You can read these events like this:

```typescript
eventService.get(CoreEventKeys.SwitchTenant).subscript(tenant => doWork(tenant));
```

When user clicks on View All Tenants, TenantNav will emit a boolean event at `TenantNavEventKeys.ViewAllTenants` channel. You can read these events like this:

```typescript
eventService.get(CoreEventKeys.TenantNavEventKeys.ViewAllTenants).subscript(bool => doWork(bool));
```
