# BreadcrumbsComponent

Attributes:

-   `paths` - paths to select from. Can be primitives or objecst. For example `['a', 'b', 'c']`
-   `display` - (required if paths are objects) property of object to display, for example `name` in object `{ name: "Alice, id: 123 }`
-   `key` - (optional) property of object to return, for example `id` in object `{ name: "Alice, id: 123 }`
-   `separator` - text separator between crumbs
-   `selected` - event emmiter of selected crumb

```typescript
import { BreadcrumbsModule } from '@labshare/base-ui/breadcrumbs';

@NgModule({
    imports: [
        BreadcrumbsModule, // <- add to imports
    ],
})
export class AppModule {}
```

## Primitive paths

paths could be primitive, for example strings or numbers `[1, 2, 3]` or `['a', 'b', 'c']`

```typescript
paths = ['a', 'b', 'c']; // primitive paths
selected.subscribe(s => console.log(s));
```

```html
<ls-breadcrumbs [paths]="paths" (selected)="selected"></ls-breadcrumbs>
```

## Object paths

paths can be objects. In this case attribute `display` must be specified

```typescript
paths = [
    // object paths
    { name: 'Alice', id: 1 },
    { name: 'Bob', id: 2 },
    { name: 'Charlie', id: 3 },
];
```

```html
  <ls-breadcrumbs
    [paths]="paths"
    display="name"
    key="id"
  ></ls-dualselect>
```

if `key` is not specified then component will return array of selected objects, otherwise it will return array of the property of selected objects
