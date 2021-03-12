# DualselectComponent

Attributes:

-   `formControlName` - reactive forms binding;
-   `[options]="optionsArray"` - options to select from. Can be primitives or objecst. For example `['a', 'b', 'c']`
-   `display="name"` - (required if options are objects) property of object to display, for example `name` in object `{ name: "Alice, id: 123 }`
-   `key="id"` - (optional) property of object to return, for example `id` in object `{ name: "Alice, id: 123 }`
-   `required` - for forms validations

```typescript
import { DualselectModule } from '@labshare/base-ui/dualselect';

@NgModule({
    imports: [
        DualselectModule, // <- add to imports
    ],
})
export class AppModule {}
```

## Primitive options

Options could be primitive, for example strings or numbers `[1, 2, 3]` or `['a', 'b', 'c']`

```typescript
group = new FormGroup({
    dualselect: new FormControl(''),
});

options = ['a', 'b', 'c']; // primitive options
```

```html
<div [formGroup]="group">
    <ls-dualselect [options]="options" formControlName="dualselect" required></ls-dualselect>
</div>
```

## Object options

Options can be objects. In this case attribute `display` must be specified

```typescript
group = new FormGroup({
    dualselect: new FormControl(''),
});

options = [
    // object options
    { name: 'Alice', id: 1 },
    { name: 'Bob', id: 2 },
    { name: 'Charlie', id: 3 },
];
```

```html
<div [formGroup]="group">
    <ls-dualselect [options]="options" formControlName="dualselect" display="name" key="id" required></ls-dualselect>
</div>
```

if `key` is not specified then component will return array of selected objects, otherwise it will return array of the property of selected objects
