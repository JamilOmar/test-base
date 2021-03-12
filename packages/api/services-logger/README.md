# @labshare/services-logger

A library that helps you to have logging as a feature for your project.

## Overview

To use this extension you can add the `@labshare/services-logger` component to your Application which will provide you a function to log your data.
Possible levels are: `debug` &lt; `verbose` &lt; `info` &lt; `warn` &lt; `usage` &lt; `error`
This library uses [Winston](https://www.npmjs.com/package/winston).

## Tutorial

Install `@labshare/services-logger` by running `npm i @labshare/services-logger`.

Add the ServicesConfigComponent to the `Application class`.

- Use `this.component(ServicesLoggerComponent)` for initialize the component. This will create a singleton.
- Project description: `An example extension project for LoopBack 4`

Inject the provider `@inject(LogBindings.LOG_CONFIG)` to a variable in your code for configuration.

Inject the provider `@inject(LogBindings.LOGGER)` to a variable in your code and start logging.

### Example Usage

```ts
import {ServicesLoggerComponent} from '@labshare/services-logger';
// Other imports ...
export class LbServicesExampleApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // binding
    this.bind(LogBindings.LOG_CONFIG).to({
      fluentD: {
        tag: 'LabShare Demo',
      },
      splunk: {
        host: 'some.host',
        token: 'abcdef',
      },
      console: false,
      level: 'info',
      enableMetadata: true,
    });
    // Binding the services-logger component
    this.component(ServicesLoggerComponent);
    // Method implementation ...
  }
}
```

At the controller:

```ts
import {LogBindings, LabShareLogger} from '@labshare/services-logger';
// Other imports ....

export class FacilityController {
  constructor(@inject(LogBindings.LOGGER) private logger: LabShareLogger) {}

  async create(facility: Facility): Promise<Facility> {
    this.logger.info(`Facility created ${facility.id} ${facility.name}`, {
      url: this.req.url,
      facilityId: 'ABC',
      userId: '2',
      method: 'create',
    });
    // Method implementation ...
  }
}
```

At the config/default.ts class:

```ts
export default {
  services: {
    log: {
      fluentD: {
        tag: 'LabShare Demo',
      },
      console: false,
      level: 'info',
      enableMetadata: true,
    },
    splunk: {
      host: 'some.host',
      token: 'abcdef',
    },
    console: false,
    level: 'info',
    enableMetadata: true,
  },
};
```

As a Library

Create an instance of LabShareLogger by and provide the configuration's object as a parameter.

Example Usage

```ts
import {LabShareLogger} from '@labshare/services-logger';
// Other imports ...
export class Test {
  public async log() {
    const logger = new LabShareLogger({
      fluentD: {
        tag: 'LabShare Demo',
      },
      console: false,
      level: 'info',
      enableMetadata: true,
    });
    logger.log('test', 'hello world');
  }
}
```

## Using the LabShareLogger methods

@services-logger uses the default standards for logging. You can send an element or array of elements and this will be cast to strings.

```ts
this.logger.log('log', 1, 2, 3);
```

Will be logged as:

```sh
'log,1,2,3'
```

If you want to use metadata, you will need to change the configuration property enableMetadata to true. By doing this, it will grab the last value expecting to have an object. This object will have the properties that are going to be grabber as properties for fluentD or it will log the object as a string.

```ts
this.logger.log('log', 1, 2, 3, {method: 'test', project: '1'});
```

Will be logged as:

```sh
'log,1,2,3, {'method':'test' , 'project':'1'}'
```

## Methods

- debug: The logger will use the 'DEBUG' level to write the output

```ts
this.logger.debug(...);
```

- verbose: The logger will use the 'VERBOSE' level to write the output

```ts
this.logger.verbose(...);
```

- log: The logger will use the 'INFO' level to write the output

```ts
this.logger.log(...);
```

- info: The logger will use the 'INFO' level to write the output

```ts
this.logger.info(...);
```

- usage: The logger will use the 'USAGE' level to write the output

```ts
this.logger.usage(...);
```

- warn: The logger will use the 'WARN' level to write the output

```ts
this.logger.warn(...);
```

- error: The logger will use the 'ERROR' level to write the output

```ts
this.logger.error(...);
```

## Configuration

```js
{
  fluentD?: {
    host?: string;
    port?: number;
    timeout?: number;
    tag?: string;
    disable?: boolean;
  };
  splunk?: {
    host: string;
    token: string;
    source?: string;
  }
  format?: {
    timestamp?: boolean;
    json?: boolean;
    colorize?: boolean;
  };
  file?: {
    directory: string;
    filename?: string;
    maxFiles?: number;
    maxsize?: number;
    disable?: boolean;
  };
  console?: boolean;
  level?: string;
  disable?: boolean;
}
```

- fluentD: Enables sending application logs to fluentD.
  - host: FluentD's Hostname, default: `localhost`
  - port: FluentD's port number, default: `24224`
  - timeout: FluentD's default timeout, default: `3.0`
  - tag: FluentD's default tag, default: `labshare`
  - disable: if `true` then this transport will not be used.
- splunk: Enables sending application logs to Splunk
  - host: The Splunk host
  - token: The token used to authorize sending logs to the Splunk host
  - source: The log source (default: 'winston')
  - disable: If `true`, then this transport will not be used.
  - For additional Splunk configuration options see: [configuration](https://www.npmjs.com/package/winston-splunk-httplogger#splunktransport--new-splunkstreameventconfig)
- format: specifies log formatting options
  - timestamp: Adds a timestamp, default: `true`
  - json: Output logs as JSON, default: `false`
  - colorize: Output the level with colors, default: `false`
- file: Enables writing application logs to a local file.
  - directory: Directory name, required.
  - filename: File name, default: `app.log`
  - maxFiles: Limit the number of files created when the size of the logfile is exceeded, default: `5`
  - maxsize:Max size in bytes of the logfile, if the size is exceeded then a new file is created, a counter will become a suffix of the log file, default: `10485760`
  - disable: If `true`, then this transport will not be used.
- console: Enables the log output to console, default: `true` ;
- level: Log level, default: `info`;
- disable: If `true`, then all log output will be disabled

## Testing

Tests should be written to ensure the behaviour implemented is correct and
future modifications don't break this expected behavior _(unless it's
intentional in which case the tests should be updated as well)_.

Take a look at the test folder to see the variety of tests written for this
extension. There are unit tests to test functionality of individual functions as
well as an extension acceptance test which tests the entire extension as a whole
(everything working together).

## Tests

Run `npm test` from the root folder.

## Contributors

See [all contributors](https://github.com/labshare/lb-services/graphs/contributors).

## License

MIT
